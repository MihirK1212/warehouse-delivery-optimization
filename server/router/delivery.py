from fastapi import APIRouter
from typing import List
from beanie import PydanticObjectId

from ..services.delivery import DeliveryService
from ..models.delivery import Rider, DeliveryTask

router = APIRouter(prefix="/delivery", tags=["delivery"])


@router.get("/{delivery_task_id}")
async def get_delivery_task(delivery_task_id: PydanticObjectId):
    return await DeliveryService.get_delivery_task(delivery_task_id)


@router.get("/")
async def get_delivery_tasks():
    return await DeliveryService.get_delivery_tasks()


@router.get("/undispatched")
async def get_undispatched_delivery_tasks():
    return await DeliveryService.get_undispatched_delivery_tasks()


@router.delete("/{delivery_task_id}")
async def delete_delivery_task(delivery_task_id: PydanticObjectId):
    return await DeliveryService.delete_delivery_task(delivery_task_id)


@router.put("/{delivery_task_id}")
async def update_delivery_task(
    delivery_task_id: PydanticObjectId, delivery_task: DeliveryTask
):
    return await DeliveryService.update_delivery_task(delivery_task_id, delivery_task)


@router.post("/dispatch")
async def dispatch_delivery_tasks(
    delivery_task_ids: List[PydanticObjectId], rider_ids: List[PydanticObjectId]
) -> List[DeliveryTask]:
    return await DeliveryService.dispatch_delivery_tasks(delivery_task_ids, rider_ids)


@router.post("/pickup")
async def add_dynamic_pickup_delivery_tasks(delivery_tasks: List[DeliveryTask]):
    return await DeliveryService.add_dynamic_pickup_delivery_tasks(delivery_tasks)


@router.post("/item_delivery")
async def add_items_with_delivery_tasks(delivery_tasks: List[DeliveryTask]):
    return await DeliveryService.add_items_with_delivery_tasks(delivery_tasks)
