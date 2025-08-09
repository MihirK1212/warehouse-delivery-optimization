from fastapi import APIRouter, HTTPException    
from typing import List, Any, Literal
from beanie import PydanticObjectId

from ..services.delivery import DeliveryService
from ..models.delivery import DeliveryTask
from ..dtos import CreateItemAndDeliveryTaskDTO, DeliveryTaskDTO, UpdateDeliveryTaskStatusDTO
from ..enums import DeliveryStatus


router = APIRouter(prefix="/delivery", tags=["delivery"])


@router.get("/task/{delivery_task_id}", response_model=DeliveryTaskDTO)
async def get_delivery_task(delivery_task_id: PydanticObjectId):
    return await DeliveryService.get_delivery_task(delivery_task_id)


@router.get("/", response_model=List[DeliveryTaskDTO])
async def get_delivery_tasks():
    return await DeliveryService.get_delivery_tasks()

@router.get("/rider/{rider_id}", response_model=List[DeliveryTaskDTO])
async def get_delivery_tasks_by_rider(rider_id: PydanticObjectId):
    return await DeliveryService.get_delivery_tasks_by_rider(rider_id)


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
    status_name_payload: UpdateDeliveryTaskStatusDTO,
):
    try:
        status = next(
            s for s in DeliveryStatus if s.name == status_name_payload.status_name
        )
    except StopIteration:
        raise HTTPException(status_code=400, detail="Invalid status name")

    return await DeliveryService.update_delivery_task_status(
        delivery_task_id, status
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
