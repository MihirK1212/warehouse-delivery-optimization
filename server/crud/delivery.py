from typing import List
from fastapi import HTTPException
from beanie import PydanticObjectId
from ..models.delivery import DeliveryTask


async def get_delivery_task(
    delivery_task_id: PydanticObjectId,
) -> DeliveryTask:
    """
    This is the function to get a delivery by its id.
    """
    return await DeliveryTask.get(delivery_task_id)


async def get_delivery_tasks() -> List[DeliveryTask]:
    """
    This is the function to get all deliveries.
    """
    return await DeliveryTask.find_all().to_list()


async def delete_delivery_task(delivery_task_id: PydanticObjectId) -> None:
    """
    This is the function to delete a dispatched delivery.
    """
    delivery_task = await DeliveryTask.get(delivery_task_id)
    if delivery_task:
        await delivery_task.delete()
    else:
        raise HTTPException(status_code=404, detail="Dispatched delivery not found")


async def update_delivery_task(
    delivery_task_id: PydanticObjectId, delivery_task: DeliveryTask
) -> DeliveryTask:
    """
    This is the function to update a dispatched delivery.
    """
    delivery_task = await DeliveryTask.get(delivery_task_id)
    if delivery_task:
        await delivery_task.update(delivery_task)
    else:
        raise HTTPException(status_code=404, detail="Dispatched delivery not found")


async def create_delivery_tasks(
    delivery_tasks: List[DeliveryTask],
) -> List[DeliveryTask]:
    """
    This is the function to create delivery tasks.
    """
    return await DeliveryTask.insert_many(delivery_tasks)
