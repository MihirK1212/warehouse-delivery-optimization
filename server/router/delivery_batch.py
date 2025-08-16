from fastapi import APIRouter, HTTPException
from typing import List, Any
from beanie import PydanticObjectId

from ..services.delivery_batch import DeliveryBatchService
from ..dtos import (
    CreateItemAndDeliveryTaskDTO,
    DeliveryTasksBatchDTO,
    UpdateDeliveryTaskStatusDTO,
    PickupDeliveryBatchAssignmentDTO,
)
from ..models.delivery import DeliveryStatus


router = APIRouter(prefix="/delivery_batch", tags=["delivery_batch"])


@router.post("/dispatch")
async def dispatch_delivery_tasks(
    delivery_task_ids: List[PydanticObjectId], rider_ids: List[PydanticObjectId]
) -> dict[str, Any]:
    return await DeliveryBatchService.dispatch_delivery_tasks(
        delivery_task_ids, rider_ids
    )


@router.post("/pickup", response_model=List[PickupDeliveryBatchAssignmentDTO])
async def dispatch_dynamic_pickup_delivery_tasks(
    delivery_task_ids: List[PydanticObjectId],
):
    print("delivery_task_ids", delivery_task_ids)
    return await DeliveryBatchService.dispatch_dynamic_pickup_delivery_tasks(
        delivery_task_ids
    )


@router.get("/today", response_model=List[DeliveryTasksBatchDTO])
async def get_delivery_tasks_for_today():
    return await DeliveryBatchService.get_delivery_tasks_for_today()


@router.get("/rider/{rider_id}", response_model=DeliveryTasksBatchDTO)
async def get_delivery_tasks_batch_for_rider(rider_id: PydanticObjectId):
    return await DeliveryBatchService.get_delivery_tasks_batch_for_rider(rider_id)


@router.patch("/task/{delivery_task_id}/status")
async def update_delivery_task_status(
    delivery_task_id: PydanticObjectId,
    status_name_payload: UpdateDeliveryTaskStatusDTO,
):
    try:
        status = DeliveryStatus.get_status_by_name(status_name_payload.status_name)
    except StopIteration:
        raise HTTPException(status_code=400, detail="Invalid status name")

    return await DeliveryBatchService.update_delivery_task_status_with_batch_validation(
        delivery_task_id, status
    )
