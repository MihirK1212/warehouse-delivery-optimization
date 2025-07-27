from typing import List
from fastapi import HTTPException
from beanie import PydanticObjectId
from ..models.delivery import DeliveryTask, Rider
from ..crud import delivery as delivery_crud
from ..crud import item as item_crud


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
    async def get_delivery_tasks(self) -> List[DeliveryTask]:
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
    ) -> List[DeliveryTask]:
        """
        This method is used to dispatch deliveries to riders.
        """
        pass

    @classmethod
    async def add_dynamic_pickup_delivery_tasks(
        self, delivery_tasks: List[DeliveryTask]
    ) -> List[DeliveryTask]:
        """
        This method is used to add a dynamic pickup delivery.
        """
        assert all(
            delivery_task.delivery.delivery_type == "pickup"
            for delivery_task in delivery_tasks
        )
        pass

    @classmethod
    async def add_items_with_delivery_tasks(
        self, delivery_tasks: List[DeliveryTask]
    ) -> List[DeliveryTask]:
        """
        This method is used to add items with delivery tasks.
        """
        delivery_tasks_with_created_items = []
        for delivery_task in delivery_tasks:
            created_items = []
            for item in delivery_task.delivery.items:
                created_item = await item_crud.create_item(item)
                created_items.append(created_item)
            delivery_task.delivery.items = created_items
            delivery_tasks_with_created_items.append(delivery_task)

        return await delivery_crud.create_delivery_tasks(
            delivery_tasks_with_created_items
        )

    @classmethod
    async def get_undispatched_delivery_tasks(self) -> List[DeliveryTask]:
        """
        This method is used to get all undelivered delivery tasks.
        """
        delivery_tasks = await delivery_crud.get_delivery_tasks()
        return [
            delivery_task
            for delivery_task in delivery_tasks
            if delivery_task.status == "undispatched"
        ]
