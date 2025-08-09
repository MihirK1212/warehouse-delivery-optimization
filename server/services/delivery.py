from typing import List, Any, Literal
from collections import defaultdict
from fastapi import HTTPException
from beanie import PydanticObjectId
import asyncio

from ..dtos import CreateItemAndDeliveryTaskDTO, DeliveryTaskDTO
from ..models.delivery import DeliveryTask, Rider
from ..models.item import Item
from ..crud import delivery as delivery_crud
from ..crud import item as item_crud
from ..schemas import DeliveryInformation
from ..crud import rider as rider_crud
from ..algorithm.dispatch import DispatchAlgorithm
from ..crud import rider as rider_crud
from ..enums import DeliveryStatus


class DeliveryService:
    @classmethod
    async def get_delivery_task(
        self, delivery_task_id: PydanticObjectId
    ) -> DeliveryTask:
        """
        This method is used to get a dispatched delivery by its id.
        """
        return await delivery_crud.get_delivery_task(delivery_task_id)

    @classmethod
    async def get_delivery_tasks(self) -> List[DeliveryTaskDTO]:
        """
        This method is used to get all dispatched deliveries.
        """
        return await delivery_crud.get_delivery_tasks()

    @classmethod
    async def delete_delivery_task(self, delivery_task_id: PydanticObjectId) -> None:
        """
        This method is used to delete a dispatched delivery.
        """
        return await delivery_crud.delete_delivery_task(delivery_task_id)

    @classmethod
    async def update_delivery_task(
        self, delivery_task_id: PydanticObjectId, delivery_task: DeliveryTask
    ) -> DeliveryTask:
        """
        This method is used to update a dispatched delivery.
        """
        return await delivery_crud.update_delivery_task(delivery_task_id, delivery_task)

    @classmethod
    async def dispatch_delivery_tasks(
        self,
        delivery_task_ids: List[PydanticObjectId],
        rider_ids: List[PydanticObjectId],
    ) -> dict[str, Any]:
        """
        This method is used to dispatch deliveries to riders.
        """
        delivery_tasks = await delivery_crud.get_delivery_tasks()
        delivery_tasks = [
            delivery_task
            for delivery_task in delivery_tasks
            if delivery_task.id in delivery_task_ids
        ]

        riders = await rider_crud.get_riders()
        riders = [rider for rider in riders if rider.id in rider_ids]

        assert all(
            [delivery_task.status == DeliveryStatus.UNDISPATCHED.name for delivery_task in delivery_tasks]
        ), "All delivery tasks must be undispatched"
        assert all(
            [
                delivery_task.delivery_information.delivery_type == "delivery"
                for delivery_task in delivery_tasks
            ]
        ), "All delivery tasks must be delivery"

        for delivery_task in delivery_tasks:
            await delivery_crud.update_delivery_task(
                delivery_task.id, {DeliveryTask.status: DeliveryStatus.DISPATCHING.name}
            )

        try:
            dispatched_delivery_tasks = await asyncio.wait_for(
                asyncio.to_thread(DispatchAlgorithm.dispatch, delivery_tasks, riders),
                timeout=10
            )

            rider_to_delivery_task_ids = defaultdict(list)
            for dispatched_delivery_task in dispatched_delivery_tasks:
                rider_to_delivery_task_ids[dispatched_delivery_task.rider_id].append(
                    dispatched_delivery_task.delivery_id
                )

            for dispatched_delivery_task in dispatched_delivery_tasks:
                await delivery_crud.update_delivery_task(
                    dispatched_delivery_task.delivery_id,
                    {
                        DeliveryTask.rider: dispatched_delivery_task.rider_id,
                        DeliveryTask.status: DeliveryStatus.DISPATCHED.name,
                    },
                )
                await rider_crud.update_rider(
                    dispatched_delivery_task.rider_id,
                    {
                        Rider.delivery_tasks: rider_to_delivery_task_ids[
                            dispatched_delivery_task.rider_id
                        ]
                    },
                )
            return {
                "success": True,
                "dispatched_delivery_tasks": dispatched_delivery_tasks,
            }

        except Exception as e:
            for delivery_task in delivery_tasks:
                await delivery_crud.update_delivery_task(
                    delivery_task.id, {DeliveryTask.status: DeliveryStatus.UNDISPATCHED.name}
                )
            raise e

    @classmethod
    async def add_dynamic_pickup_delivery_tasks(
        self, payload: List[CreateItemAndDeliveryTaskDTO]
    ) -> List[DeliveryTask]:
        """
        This method is used to add a dynamic pickup delivery.
        """
        assert all(
            item_and_delivery_task.delivery_information.delivery_type == "pickup"
            for item_and_delivery_task in payload
        )

        delivery_tasks = []
        for pickup_item_and_delivery_task in payload:
            delivery_tasks.append(
                await self.create_item_and_delivery_task(
                    pickup_item_and_delivery_task.item,
                    pickup_item_and_delivery_task.delivery_information,
                )
            )

        return delivery_tasks

    @classmethod
    async def get_undispatched_delivery_tasks(self) -> List[DeliveryTaskDTO]:
        """
        This method is used to get all undelivered delivery tasks.
        """
        delivery_tasks = await delivery_crud.get_delivery_tasks()
        return [
            delivery_task
            for delivery_task in delivery_tasks
            if delivery_task.status == DeliveryStatus.UNDISPATCHED.name
        ]

    @staticmethod
    async def create_item_and_delivery_task(
        item: Item, delivery_information: DeliveryInformation
    ) -> DeliveryTask:
        return await delivery_crud.create_item_and_delivery_task(
            item, delivery_information
        )

    @staticmethod
    async def update_delivery_task_status(
        delivery_task_id: PydanticObjectId,
        status: DeliveryStatus,
    ) -> DeliveryTask:
        return await delivery_crud.update_delivery_task_status(delivery_task_id, status)

    @staticmethod
    async def get_delivery_tasks_by_rider(rider_id: PydanticObjectId) -> List[DeliveryTaskDTO]:
        delivery_tasks = await delivery_crud.get_delivery_tasks()
        return [
            delivery_task
            for delivery_task in delivery_tasks
            if delivery_task.rider is not None and delivery_task.rider.id == rider_id
            and delivery_task.status != DeliveryStatus.COMPLETED.name
        ]