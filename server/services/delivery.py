from typing import List
from beanie import PydanticObjectId

from ..dtos import DeliveryTaskDTO
from ..models.delivery import DeliveryTask
from ..models.item import Item
from ..crud import delivery as delivery_crud
from ..schemas import DeliveryInformation
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
        delivery_task = await delivery_crud.get_delivery_task(delivery_task_id)
        current_status = DeliveryStatus.get_status_by_name(delivery_task.status)
        assert status.rank > current_status.rank, "Invalid status"
        return await delivery_crud.update_delivery_task_status(delivery_task_id, status)

    @staticmethod
    async def get_delivery_tasks_by_rider(
        rider_id: PydanticObjectId,
    ) -> List[DeliveryTaskDTO]:
        delivery_tasks = await delivery_crud.get_delivery_tasks()
        return [
            delivery_task
            for delivery_task in delivery_tasks
            if delivery_task.rider is not None
            and delivery_task.rider.id == rider_id
            and delivery_task.status != DeliveryStatus.COMPLETED.name
        ]