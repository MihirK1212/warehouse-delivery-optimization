from typing import List, Any
from fastapi import HTTPException
from beanie import PydanticObjectId
from ..models.delivery import DeliveryStatus
from ..models.delivery_batch import DeliveryTasksBatch
from ..dtos import DeliveryTaskDTO, DeliveryTaskRefDTO, DeliveryTasksBatchDTO
from ..crud import rider as rider_crud
from ..crud import delivery as delivery_crud


async def create_delivery_tasks_batch(
    delivery_tasks_batch: DeliveryTasksBatch,
) -> DeliveryTasksBatch | None:
    """
    This is the function to create a delivery tasks batch.
    """
    return await DeliveryTasksBatch.insert_one(delivery_tasks_batch) or None


async def get_delivery_tasks_batch(
    delivery_tasks_batch_id: PydanticObjectId,
) -> DeliveryTasksBatchDTO:
    """
    This is the function to get a delivery tasks batch.
    """
    delivery_tasks_batch = await DeliveryTasksBatch.get(delivery_tasks_batch_id)
    if delivery_tasks_batch is None:
        raise HTTPException(status_code=404, detail="Delivery tasks batch not found")
    delivery_tasks_batch_dto = await _populate_delivery_tasks_batch(
        delivery_tasks_batch
    )
    _validate_deliery_tasks_batch(delivery_tasks_batch_dto)
    return delivery_tasks_batch_dto


async def get_delivery_tasks_batches() -> List[DeliveryTasksBatchDTO]:
    """
    This is the function to get the delivery tasks batch for a rider.
    """
    delivery_tasks_batches = await DeliveryTasksBatch.find_all().to_list()
    delivery_tasks_batches_dto = [
        await _populate_delivery_tasks_batch(delivery_tasks_batch)
        for delivery_tasks_batch in delivery_tasks_batches
        if delivery_tasks_batch.is_current_day_tasks_batch()
    ]
    for delivery_tasks_batch_dto in delivery_tasks_batches_dto:
        _validate_deliery_tasks_batch(delivery_tasks_batch_dto)
    return delivery_tasks_batches_dto


async def update_delivery_tasks_batch(
    delivery_tasks_batch_id: PydanticObjectId,
    update_dict: dict[str, Any],
) -> DeliveryTasksBatch:
    """
    This is the function to update a delivery tasks batch.
    """
    delivery_tasks_batch = await DeliveryTasksBatch.get(delivery_tasks_batch_id)
    if delivery_tasks_batch:
        await delivery_tasks_batch.set(update_dict)
        return delivery_tasks_batch
    else:
        raise HTTPException(status_code=404, detail="Delivery tasks batch not found")

async def _populate_delivery_tasks_batch(
    delivery_tasks_batch: DeliveryTasksBatch,
) -> DeliveryTasksBatchDTO:
    """
    This is the function to perform actions after dispatching delivery tasks.
    """
    if delivery_tasks_batch.rider is not None:
        rider = await rider_crud.get_rider(delivery_tasks_batch.rider.ref.id)
        if rider is None:
            raise HTTPException(status_code=404, detail="Rider not found")
        delivery_tasks_batch.rider = rider

    delivery_tasks_batch.tasks = sorted(
        [
            DeliveryTaskRefDTO(
                delivery_task=await delivery_crud.get_delivery_task(
                    task.delivery_task.ref.id
                ),
                order_key=task.order_key,
            )
            for task in delivery_tasks_batch.tasks
        ],
        key=lambda x: x.order_key,
    )
    return DeliveryTasksBatchDTO(**delivery_tasks_batch.model_dump())


def _validate_deliery_tasks_batch(delivery_tasks_batch: DeliveryTasksBatchDTO) -> None:
    """
    This is the function to validate a delivery tasks batch.
    """
    assert delivery_tasks_batch.current_task_index <= len(
        delivery_tasks_batch.tasks
    ), "Current task index is out of range"

    pivot_index = delivery_tasks_batch.current_task_index

    for i, task in enumerate(delivery_tasks_batch.tasks):
        if i < pivot_index:
            assert (
                DeliveryStatus.get_status_by_name(task.delivery_task.status)
                == DeliveryStatus.COMPLETED
            ), "Previous task is not completed"
        elif i == pivot_index:
            assert DeliveryStatus.get_status_by_name(task.delivery_task.status) in [
                DeliveryStatus.IN_PROGRESS,
                DeliveryStatus.DISPATCHED,
            ], "Current task is not in progress"
        else:
            assert DeliveryStatus.get_status_by_name(task.delivery_task.status) in [
                DeliveryStatus.DISPATCHED
            ], "Next task is not dispatched"

    # each task should have unique order key
    assert len(set([task.order_key for task in delivery_tasks_batch.tasks])) == len(
        delivery_tasks_batch.tasks
    ), "Tasks should have unique order key"
