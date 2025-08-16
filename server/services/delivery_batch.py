from typing import List, Any
from collections import defaultdict
from fastapi import HTTPException
from beanie import PydanticObjectId
import asyncio

from ..dtos import (
    DeliveryTaskDTO,
    DeliveryTasksBatchDTO,
    PickupDeliveryBatchAssignmentDTO,
)
from ..models.delivery import DeliveryTask
from ..models.delivery_batch import DeliveryTaskRef, DeliveryTasksBatch
from ..crud import delivery as delivery_crud
from ..crud import delivery_batch as delivery_batch_crud
from ..crud import rider as rider_crud
from ..algorithm.dispatch import DispatchAlgorithm
from ..enums import DeliveryStatus
from .delivery import DeliveryService
from ..algorithm.dynamic_pickup import DynamicPickupAlgorithm


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
                and delivery_task.delivery_information.delivery_type == "delivery"
                for delivery_task in delivery_tasks
            ]
        ), "All delivery tasks must be undispatched and not assigned to a rider and must be delivery"

        assert len(rider_ids) == len(set(rider_ids)), "Rider ids must be unique"

        for delivery_task in delivery_tasks:
            assert delivery_task.id is not None, "Delivery task id must be provided"
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
                        DeliveryTask.status: DeliveryStatus.DISPATCHED.name,
                    },
                )

            for rider_id, delivery_task_ids in rider_to_delivery_task_ids.items():
                delivery_tasks_batch = DeliveryTasksBatch(
                    rider=rider_id,
                    tasks=[
                        DeliveryTaskRef(
                            delivery_task=delivery_task_id,  # type: ignore
                            order_key=i,
                        )
                        for i, delivery_task_id in enumerate(delivery_task_ids)
                        if delivery_task_id is not None
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
                assert delivery_task.id is not None, "Delivery task id must be provided"
                await delivery_crud.update_delivery_task(
                    delivery_task.id,
                    {
                        DeliveryTask.status: DeliveryStatus.UNDISPATCHED.name,
                    },
                )
            raise e

    @classmethod
    async def dispatch_dynamic_pickup_delivery_tasks(
        cls, delivery_task_ids: List[PydanticObjectId]
    ) -> List[PickupDeliveryBatchAssignmentDTO]:
        """
        This method is used to dispatch dynamic pickup delivery tasks.
        """

        async def _dispatch_dynamic_pickup_delivery_task(
            delivery_task_id: PydanticObjectId,
        ):
            pickup_delivery_task = await delivery_crud.get_delivery_task(
                delivery_task_id
            )
            assert pickup_delivery_task.status == DeliveryStatus.UNDISPATCHED.name
            assert pickup_delivery_task.delivery_information.delivery_type == "pickup"

            assert (
                pickup_delivery_task.id is not None
            ), "Pickup delivery task id must be provided"

            await delivery_crud.update_delivery_task(
                pickup_delivery_task.id,
                {DeliveryTask.status: DeliveryStatus.DISPATCHING.name},
            )

            try:
                delivery_tasks_batches = (
                    await delivery_batch_crud.get_delivery_tasks_batches()
                )

                pickup_delivery_batch_assignment = await asyncio.wait_for(
                    asyncio.to_thread(
                        DynamicPickupAlgorithm.add_pickup,
                        pickup_delivery_task,
                        delivery_tasks_batches,
                    ),
                    timeout=10,
                )

                assert (
                    pickup_delivery_batch_assignment.assigned_delivery_tasks_batch_id
                    is not None
                ), "Assigned delivery tasks batch id must be provided"
                assert (
                    pickup_delivery_batch_assignment.after_task_index is not None
                ), "After task index must be provided"

                await cls.add_delivery_task_to_delivery_tasks_batch(
                    pickup_delivery_batch_assignment.assigned_delivery_tasks_batch_id,
                    pickup_delivery_task.id,
                    pickup_delivery_batch_assignment.after_task_index,
                )

                await delivery_crud.update_delivery_task(
                    pickup_delivery_task.id,
                    {
                        DeliveryTask.status: DeliveryStatus.DISPATCHED.name,
                    },
                )

            except Exception as e:
                await delivery_crud.update_delivery_task(
                    pickup_delivery_task.id,
                    {
                        DeliveryTask.status: DeliveryStatus.UNDISPATCHED.name,
                    },
                )
                raise e

            return pickup_delivery_batch_assignment

        # pickup tasks must be assigned in the same order as they are dispatched
        # To ensure the delivery tasks are dispatched sequentially (one after another),
        # we process them in a for loop and await each one before moving to the next.
        pickup_delivery_batch_assignments = []
        for delivery_task_id in delivery_task_ids:
            pickup_delivery_batch_assignment = (
                await _dispatch_dynamic_pickup_delivery_task(delivery_task_id)
            )
            pickup_delivery_batch_assignments.append(pickup_delivery_batch_assignment)

        return pickup_delivery_batch_assignments

    @classmethod
    async def add_delivery_task_to_delivery_tasks_batch(
        cls,
        delivery_tasks_batch_id: PydanticObjectId,
        delivery_task_id: PydanticObjectId,
        after_task_index: int,
    ) -> None:
        delivery_tasks_batch = await delivery_batch_crud.get_delivery_tasks_batch(
            delivery_tasks_batch_id
        )
        tasks = sorted(delivery_tasks_batch.tasks, key=lambda x: x.order_key)

        assert (
            after_task_index >= 0
        ), "After task index must be greater than or equal to 0"
        assert after_task_index < len(
            tasks
        ), "After task index must be less than the number of tasks"

        updated_tasks = tasks

        if len(tasks) == 0:
            updated_tasks = [
                DeliveryTaskRef(delivery_task=delivery_task_id, order_key=0)  # type: ignore
            ]
        else:
            prev_task_order_key = tasks[after_task_index].order_key
            next_task_order_key = (
                (prev_task_order_key + 1)
                if (after_task_index + 1) >= len(tasks)
                else tasks[after_task_index + 1].order_key
            )
            updated_tasks = (
                [
                    DeliveryTaskRef(
                        delivery_task=task.delivery_task.id,  # type: ignore
                        order_key=task.order_key,
                    )
                    for task in tasks[: after_task_index + 1]
                ]
                + [
                    DeliveryTaskRef(
                        delivery_task=delivery_task_id,  # type: ignore
                        order_key=((prev_task_order_key + next_task_order_key) / 2),
                    )
                ]
                + [
                    DeliveryTaskRef(
                        delivery_task=task.delivery_task.id,  # type: ignore
                        order_key=task.order_key,
                    )
                    for task in tasks[after_task_index + 1 :]
                ]
            )

        assert (
            len(updated_tasks) == len(tasks) + 1
        ), "Updated tasks must be of the same length as the original tasks"
        assert set([task.delivery_task.ref.id for task in updated_tasks]) == set(
            [task.delivery_task.id for task in tasks]
        ) | {
            delivery_task_id
        }, "Updated tasks must contain the original tasks and the new task"

        await delivery_batch_crud.update_delivery_tasks_batch(
            delivery_tasks_batch_id,
            {
                DeliveryTasksBatch.tasks: updated_tasks,
            },
        )

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
            assert (
                delivery_tasks_batch.id is not None
            ), "Delivery tasks batch id must be provided"
            await delivery_batch_crud.update_delivery_tasks_batch(
                delivery_tasks_batch.id,
                {
                    DeliveryTasksBatch.current_task_index: delivery_tasks_batch.current_task_index
                    + 1
                },
            )

        return delivery_task
