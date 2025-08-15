from typing import List, Tuple
import datetime
from beanie import PydanticObjectId
from ..models.delivery import DeliveryStatus
from ..dtos import (
    DeliveryTaskDTO,
    DeliveryTasksBatchDTO,
    PickupDeliveryBatchAssignmentDTO,
)
from ..models.rider import Rider
from .dto import DispatchedDeliveryTask
from ..clock import WarehouseClock
from ..models.item import Item
from subprocess import Popen, PIPE
import copy
from .map import distance as map_distance_service
from ..constants import WAREHOUSE_LOCATION


class DynamicPickupAlgorithm:
    @classmethod
    def add_pickup(
        cls,
        delivery_task: DeliveryTaskDTO,
        delivery_tasks_batches: List[DeliveryTasksBatchDTO] | None,
    ) -> PickupDeliveryBatchAssignmentDTO:

        delivery_tasks_batches = copy.deepcopy(delivery_tasks_batches)

        delivery_tasks_batches = (
            cls._filter_delivery_tasks_batches_with_only_pending_tasks(
                delivery_tasks_batches
            )
        )

        cls._validate_delivery_tasks_batches(delivery_tasks_batches)

        if len(delivery_tasks_batches) == 0:
            return PickupDeliveryBatchAssignmentDTO(
                assigned_delivery_tasks_batch_id=None,
                after_task_index=None,
            )

        current_time = datetime.datetime.now(datetime.timezone.utc)

        pickup_addition_time_delta_seconds = (
            current_time - WarehouseClock().get_day_start_timestamp()
        ).total_seconds()

        pickup_item = delivery_task.items[0]

        num_riders = len(delivery_tasks_batches)

        delivery_task_to_pickup_distance_map = (
            cls._get_delivery_task_to_pickup_distance_map(
                pickup_item, delivery_tasks_batches
            )
        )

        program_path = "./algorithm/runnable/bin/pickup.exe"

        p = Popen(program_path, stdout=PIPE, stdin=PIPE, encoding="utf8")
        f = open("./algorithm/runnable/pickup_input.in", "w", encoding="utf8")

        p.stdin.write(str(int(pickup_addition_time_delta_seconds)) + "\n")
        f.write(str(int(pickup_addition_time_delta_seconds)) + "\n")

        p.stdin.write(str(int(pickup_item.tool_scan_information.volume)) + "\n")
        f.write(str(int(pickup_item.tool_scan_information.volume)) + "\n")

        p.stdin.write(str(int(pickup_addition_time_delta_seconds)) + "\n")
        f.write(str(int(pickup_addition_time_delta_seconds)) + "\n")

        p.stdin.write(str(num_riders) + "\n")
        f.write(str(num_riders) + "\n")

        for delivery_tasks_batch in delivery_tasks_batches:
            p.stdin.write(str(int(delivery_tasks_batch.rider.bag_volume)) + "\n")
            f.write(str(int(delivery_tasks_batch.rider.bag_volume)) + "\n")

        for delivery_tasks_batch in delivery_tasks_batches:
            num_tasks = len(delivery_tasks_batch.tasks)
            p.stdin.write(str(num_tasks) + "\n")
            f.write(str(num_tasks) + "\n")

            # first task time is basically the time that the current task will take to complete
            first_task_time = cls._get_time_for_delivery_task_segment(
                delivery_tasks_batch.tasks[0].delivery_task, delivery_tasks_batch
            )
            p.stdin.write(str(int(first_task_time)) + "\n")
            f.write(str(int(first_task_time)) + "\n")

            for task in delivery_tasks_batch.tasks:
                task_item = task.delivery_task.items[0]
                task_type = (
                    0
                    if task.delivery_task.delivery_information.delivery_type
                    == "delivery"
                    else 1
                )

                expected_delivery_time_delta = (
                    task.delivery_task.delivery_information.expected_delivery_time.replace(
                        tzinfo=datetime.timezone.utc
                    )
                    - current_time.replace(tzinfo=datetime.timezone.utc)
                ).total_seconds()

                # this is the time that will be taken to go from given task to next task
                time_next = cls._get_time_next(task.delivery_task, delivery_tasks_batch)

                time_from_pickup = delivery_task_to_pickup_distance_map[
                    task.delivery_task.id
                ]

                p.stdin.write(str(int(task_item.tool_scan_information.volume)) + "\n")
                p.stdin.write(str(task_type) + "\n")
                p.stdin.write(str(int(expected_delivery_time_delta)) + "\n")
                p.stdin.write(str(int(time_next)) + "\n")
                p.stdin.write(str(int(time_from_pickup)) + "\n")

                f.write(
                    str(int(task_item.tool_scan_information.volume))
                    + " "
                    + str(task_type)
                    + " "
                    + str(int(expected_delivery_time_delta))
                    + " "
                    + str(int(time_next))
                    + " "
                    + str(int(time_from_pickup))
                )
                f.write("\n")

        f.write("\n")

        p.stdin.flush()

        batch_index = int(p.stdout.readline().strip())
        after_task_index = int(p.stdout.readline().strip())

        print(batch_index, after_task_index)

        assigned_delivery_tasks_batch_id = delivery_tasks_batches[batch_index].id
        return PickupDeliveryBatchAssignmentDTO(
            assigned_delivery_tasks_batch_id=assigned_delivery_tasks_batch_id,
            after_task_index=after_task_index,
        )

    @classmethod
    def _get_time_next(
        cls, delivery_task: DeliveryTaskDTO, delivery_tasks_batch: DeliveryTasksBatchDTO
    ) -> float:
        """
        This function returns the time that will be taken to go from given task to next task in the batch
        """
        return delivery_tasks_batch.get_time_to_next_task(delivery_task)

    @classmethod
    def _get_time_for_delivery_task_segment(
        cls, delivery_task: DeliveryTaskDTO, delivery_tasks_batch: DeliveryTasksBatchDTO
    ) -> float:
        return delivery_tasks_batch.get_time_for_task(delivery_task)

    @classmethod
    def _filter_delivery_tasks_batches_with_only_pending_tasks(
        cls, delivery_tasks_batches: List[DeliveryTasksBatchDTO]
    ):
        res: List[DeliveryTasksBatchDTO] = []
        for delivery_tasks_batch in delivery_tasks_batches:
            filtered_tasks = [
                task
                for task in delivery_tasks_batch.tasks[
                    delivery_tasks_batch.current_task_index :
                ]
                if task.delivery_task.status != DeliveryStatus.COMPLETED.name
            ]

            modified_tasks_batch = delivery_tasks_batch.model_copy(
                update={
                    "tasks": filtered_tasks,
                    "current_task_index": 0,
                }
            )
            if len(modified_tasks_batch.tasks) > 0:
                res.append(modified_tasks_batch)
        return res

    @classmethod
    def _get_delivery_task_to_pickup_distance_map(
        cls,
        pickup_item: Item,
        delivery_tasks_batches: List[DeliveryTasksBatchDTO],
    ) -> dict[PydanticObjectId, float]:
        res: dict[PydanticObjectId, float] = {}
        for delivery_tasks_batch in delivery_tasks_batches:
            for task in delivery_tasks_batch.tasks:
                distance = map_distance_service.get_simulated_temporal_distance(
                    pickup_item.item_location.coordinate,
                    task.delivery_task.delivery_information.delivery_location.coordinate,
                )
                res[task.delivery_task.id] = distance

        return res

    @classmethod
    def _validate_delivery_tasks_batches(
        cls, delivery_tasks_batches: List[DeliveryTasksBatchDTO]
    ):
        # only one batch per rider
        # all tasks should be pending or in progress

        # other delivery task validations similar to dispatch algorithm

        # only one batch per rider
        rider_ids = set()
        for batch in delivery_tasks_batches:
            assert isinstance(batch, DeliveryTasksBatchDTO), "Delivery tasks batches must be of type DeliveryTasksBatchDTO"

            rider_id = getattr(batch.rider, "id", None)
            if rider_id is None:
                raise ValueError(
                    "Each delivery tasks batch must have a rider assigned."
                )
            if rider_id in rider_ids:
                raise ValueError(
                    f"Multiple batches found for rider {rider_id}. Only one batch per rider is allowed."
                )
            rider_ids.add(rider_id)

            # all tasks should be pending or in progress
            for task in batch.tasks:
                delivery_task = task.delivery_task

                if delivery_task.status not in [
                    DeliveryStatus.DISPATCHED.name,
                    DeliveryStatus.IN_PROGRESS.name,
                ]:
                    raise ValueError(
                        f"Task {delivery_task.id} in batch for rider {rider_id} has invalid status: {delivery_task.status}. "
                        "All tasks should be pending or in progress."
                    )

                assert (
                    len(delivery_task.items) == 1
                ), "Each delivery task must have exactly one item, currently only one item is supported"

                assert (
                    delivery_task.delivery_information is not None
                ), "Delivery task's delivery information must be provided"
                assert (
                    delivery_task.delivery_information.delivery_location is not None
                ), "Delivery task's delivery location must be provided"
                assert (
                    delivery_task.delivery_information.delivery_location.coordinate
                    is not None
                ), "Delivery task's delivery location coordinate must be provided"
