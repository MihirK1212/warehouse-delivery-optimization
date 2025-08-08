from fastapi import APIRouter
from typing import List, Any, Literal
from beanie import PydanticObjectId
from fastapi import Path

from ..services.delivery import DeliveryService
from ..models.delivery import DeliveryTask
from ..dtos import CreateItemAndDeliveryTaskDTO, DeliveryTaskDTO, UpdateDeliveryTaskStatusDTO


router = APIRouter(prefix="/delivery", tags=["delivery"])


@router.get("/task/{delivery_task_id}", response_model=DeliveryTaskDTO)
async def get_delivery_task(delivery_task_id: PydanticObjectId):
    return await DeliveryService.get_delivery_task(delivery_task_id)


@router.get("/", response_model=List[DeliveryTaskDTO])
async def get_delivery_tasks():
    return await DeliveryService.get_delivery_tasks()


@router.get("/undispatched", response_model=List[DeliveryTaskDTO])
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


@router.patch("/{delivery_task_id}/status")
async def update_delivery_task_status(
    delivery_task_id: PydanticObjectId,
    update_delivery_task_status: UpdateDeliveryTaskStatusDTO,
):
    return await DeliveryService.update_delivery_task_status(
        delivery_task_id, update_delivery_task_status.status
    )


@router.post("/dispatch")
async def dispatch_delivery_tasks(
    delivery_task_ids: List[PydanticObjectId], rider_ids: List[PydanticObjectId]
) -> dict[str, Any]:
    return await DeliveryService.dispatch_delivery_tasks(delivery_task_ids, rider_ids)


@router.post("/pickup")
async def add_dynamic_pickup_delivery_tasks(
    payload: List[CreateItemAndDeliveryTaskDTO],
):
    return await DeliveryService.add_dynamic_pickup_delivery_tasks(payload)


@router.post("/item_and_task")
async def add_item_with_delivery_task(payload: CreateItemAndDeliveryTaskDTO):
    return await DeliveryService.create_item_and_delivery_task(
        payload.item, payload.delivery_information
    )
