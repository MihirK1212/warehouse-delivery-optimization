from typing import List
from fastapi import HTTPException
from beanie import PydanticObjectId, WriteRules
from ..models.delivery import DeliveryTask, Item
from ..schemas import DeliveryInformation


async def get_delivery_task(
    delivery_task_id: PydanticObjectId,
) -> DeliveryTask:
    """
    This is the function to get a delivery by its id.
    """
    return await _populate_delivery_task_links(
        await DeliveryTask.get(delivery_task_id)
    )


async def get_delivery_tasks() -> List[DeliveryTask]:
    """
    This is the function to get all deliveries.
    """
    return [
        await _populate_delivery_task_links(task)
        for task in await DeliveryTask.find_all().to_list()
    ]


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


async def create_item_and_delivery_task(
    item: Item, delivery_information: DeliveryInformation
) -> DeliveryTask:
    """
    This is the function to create an item and a delivery task.
    """
    delivery_task = DeliveryTask(
        items=[item], delivery_information=delivery_information, status="undispatched"
    )
    return await delivery_task.save(link_rule=WriteRules.WRITE)


async def _populate_delivery_task_links(delivery_task: DeliveryTask) -> DeliveryTask:
    """
    This is the function to populate the delivery task links.
    """
    delivery_task.rider = (
        await delivery_task.rider.fetch() if delivery_task.rider else None
    )
    delivery_task.items = [await item.fetch() for item in delivery_task.items]
    return delivery_task
