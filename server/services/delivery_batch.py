from typing import List, Any
from collections import defaultdict
from fastapi import HTTPException
from beanie import PydanticObjectId
import asyncio
import datetime

from ..dtos import CreateItemAndDeliveryTaskDTO, DeliveryTaskDTO, DeliveryTasksBatchDTO
from ..models.delivery import DeliveryTask, Rider
from ..models.delivery_batch import DeliveryTaskRef, DeliveryTasksBatch
from ..crud import delivery as delivery_crud
from ..crud import delivery_batch as delivery_batch_crud
from ..crud import rider as rider_crud
from ..algorithm.dispatch import DispatchAlgorithm
from ..crud import rider as rider_crud
from ..enums import DeliveryStatus
from .delivery import DeliveryService


class DeliveryBatchService:
    @classmethod
    async def dispatch_delivery_tasks(
        cls,
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
            [
                delivery_task.status == DeliveryStatus.UNDISPATCHED.name
                and delivery_task.rider is None
                and delivery_task.delivery_information.delivery_type == "delivery"
                for delivery_task in delivery_tasks
            ]
        ), "All delivery tasks must be undispatched and not assigned to a rider and must be delivery"

        for delivery_task in delivery_tasks:
            await delivery_crud.update_delivery_task(
                delivery_task.id, {DeliveryTask.status: DeliveryStatus.DISPATCHING.name}
            )

        try:
            dispatched_delivery_tasks = await asyncio.wait_for(
                asyncio.to_thread(DispatchAlgorithm.dispatch, delivery_tasks, riders),
                timeout=10,
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

            for rider_id, delivery_task_ids in rider_to_delivery_task_ids.items():
                delivery_tasks_batch = DeliveryTasksBatch(
                    rider=rider_id,
                    date=datetime.datetime.now(datetime.timezone.utc).date(),
                    tasks=[
                        DeliveryTaskRef(
                            delivery_task=delivery_task_id,
                            order_key=i,
                        )
                        for i, delivery_task_id in enumerate(delivery_task_ids)
                    ],
                )
                await delivery_batch_crud.create_delivery_tasks_batch(
                    delivery_tasks_batch
                )

            return {
                "success": True,
                "dispatched_delivery_tasks": dispatched_delivery_tasks,
            }

        except Exception as e:
            for delivery_task in delivery_tasks:
                await delivery_crud.update_delivery_task(
                    delivery_task.id,
                    {
                        DeliveryTask.status: DeliveryStatus.UNDISPATCHED.name,
                        DeliveryTask.rider: None,
                    },
                )
            raise e

    @classmethod
    async def add_dynamic_pickup_delivery_tasks(
        cls, payload: List[CreateItemAndDeliveryTaskDTO]
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
                await DeliveryService.create_item_and_delivery_task(
                    pickup_item_and_delivery_task.item,
                    pickup_item_and_delivery_task.delivery_information,
                )
            )

        return delivery_tasks

    @classmethod
    async def get_delivery_tasks_batch_for_rider(
        cls, rider_id: PydanticObjectId
    ) -> DeliveryTasksBatchDTO:
        """
        This method is used to get the delivery tasks batch for a rider.
        """
        delivery_tasks_batches = await delivery_batch_crud.get_delivery_tasks_batches()
        for delivery_tasks_batch in delivery_tasks_batches:
            if getattr(delivery_tasks_batch.rider, "id", None) == rider_id:
                return delivery_tasks_batch
        raise HTTPException(status_code=404, detail="Delivery tasks batch not found")

    @classmethod
    async def get_delivery_tasks_batch_having_delivery_task(
        cls, delivery_task_id: PydanticObjectId
    ) -> DeliveryTasksBatchDTO:
        """
        This method is used to get the delivery tasks batches having a delivery task.
        """
        delivery_tasks_batches = await delivery_batch_crud.get_delivery_tasks_batches()
        delivery_tasks_batches_having_delivery_task = [
            delivery_tasks_batch
            for delivery_tasks_batch in delivery_tasks_batches
            if any(
                task.delivery_task.id == delivery_task_id
                for task in delivery_tasks_batch.tasks
            )
        ]

        assert (
            len(delivery_tasks_batches_having_delivery_task) == 1
        ), "Delivery task must be in one and only one delivery tasks batch"

        return delivery_tasks_batches_having_delivery_task[0]

    @classmethod
    async def update_delivery_task_status_with_batch_validation(
        cls, delivery_task_id: PydanticObjectId, status: DeliveryStatus
    ) -> DeliveryTaskDTO:
        """
        This method is used to update the status of a delivery task.
        """
        delivery_tasks_batch = await cls.get_delivery_tasks_batch_having_delivery_task(
            delivery_task_id
        )

        want_to_update_task_index = next(
            i
            for i, task in enumerate(delivery_tasks_batch.tasks)
            if task.delivery_task.id == delivery_task_id
        )

        assert (
            want_to_update_task_index == delivery_tasks_batch.current_task_index
        ), "Can't update the delivery task that is not the current task"

        await DeliveryService.update_delivery_task_status(delivery_task_id, status)

        delivery_task = await delivery_crud.get_delivery_task(delivery_task_id)
        if delivery_task.status == DeliveryStatus.COMPLETED.name:
            await delivery_batch_crud.update_delivery_tasks_batch(
                delivery_tasks_batch.id,
                {
                    DeliveryTasksBatch.current_task_index: delivery_tasks_batch.current_task_index
                    + 1
                },
            )

        return delivery_task
