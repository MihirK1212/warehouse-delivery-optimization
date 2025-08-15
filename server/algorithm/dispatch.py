from typing import List
from subprocess import Popen, PIPE
import datetime

from ..dtos import DeliveryTaskDTO
from ..models.rider import Rider
from .dto import DispatchedDeliveryTask
from .map import distance as map_distance_service
from ..schemas import Coordinate
from ..constants import WAREHOUSE_LOCATION
from ..models.item import Item
from ..clock import WarehouseClock


class DispatchAlgorithm:
    @classmethod
    def dispatch(
        cls, delivery_tasks: List[DeliveryTaskDTO], riders: List[Rider]
    ) -> List[DispatchedDeliveryTask]:
        num_deliveries = len(delivery_tasks)
        num_riders = len(riders)

        cls._validate_delivery_tasks(delivery_tasks)
        cls._validate_riders(riders)

        delivery_tasks_pairwise_distance_matrix = (
            cls._get_delivery_tasks_and_warehouse_pairwise_distance_matrix(
                delivery_tasks
            )
        )

        program_path = "./algorithm/runnable/bin/dispatch.exe"

        p = Popen(program_path, stdout=PIPE, stdin=PIPE, encoding="utf8")
        f = open("./algorithm/runnable/dispatch_input.in", "w", encoding="utf8")

        p.stdin.write(str(num_deliveries) + "\n")
        f.write(str(int(num_deliveries)) + "\n")

        for i in range(num_deliveries + 1):
            for j in range(num_deliveries + 1):
                if i == j:
                    p.stdin.write(str(0) + "\n")
                    f.write(str(int(0)) + "\n")
                    continue
                p.stdin.write(str(delivery_tasks_pairwise_distance_matrix[i][j]) + "\n")
                f.write(str(int(delivery_tasks_pairwise_distance_matrix[i][j])) + "\n")

        for delivery_task in delivery_tasks:
            item = Item(**delivery_task.items[0].model_dump())
            p.stdin.write(str(int(item.tool_scan_information.volume)) + "\n")
            f.write(str(int(item.tool_scan_information.volume)) + "\n")

        day_start_timestamp = WarehouseClock().get_day_start_timestamp()

        for delivery_task in delivery_tasks:
            expected_delivery_time = (
                delivery_task.delivery_information.expected_delivery_time
            )
            # Ensure both datetimes are timezone-aware for calculation
            if expected_delivery_time.tzinfo is None:
                expected_delivery_time = expected_delivery_time.replace(tzinfo=datetime.timezone.utc)
            
            edd_delta = expected_delivery_time - day_start_timestamp
            p.stdin.write(str(int(edd_delta.total_seconds())) + "\n")
            f.write(str(int(edd_delta.total_seconds())) + "\n")

        warehouse_coordinate = WAREHOUSE_LOCATION.coordinate
        p.stdin.write(str(warehouse_coordinate.latitude) + "\n")
        p.stdin.write(str(warehouse_coordinate.longitude) + "\n")
        f.write(str(warehouse_coordinate.latitude) + "\n")
        f.write(str(warehouse_coordinate.longitude) + "\n")

        for delivery_task in delivery_tasks:
            delivery_location_coordinate = (
                delivery_task.delivery_information.delivery_location.coordinate
            )
            p.stdin.write(str(delivery_location_coordinate.latitude) + "\n")
            p.stdin.write(str(delivery_location_coordinate.longitude) + "\n")
            f.write(str(delivery_location_coordinate.latitude) + "\n")
            f.write(str(delivery_location_coordinate.longitude) + "\n")

        p.stdin.write(str(1) + "\n")
        f.write(str(1) + "\n")

        for _ in range(num_deliveries):
            p.stdin.write(str(1) + "\n")
            f.write(str(1) + "\n")

        p.stdin.write(str(num_riders) + "\n")
        f.write(str(int(num_riders)) + "\n")

        for rider in riders:
            p.stdin.write(str(int(rider.bag_volume)) + "\n")
            f.write(str(int(rider.bag_volume)) + "\n")

        p.stdin.flush()

        dispatched_delivery_tasks = []

        for rider_ind in range(num_riders):

            order: List[int] = []

            while True:

                result = int(p.stdout.readline().strip())

                if result == -1:
                    break

                order.append(int(result) - 1)

            for delivery_ind in order:
                dispatched_delivery_tasks.append(
                    DispatchedDeliveryTask(
                        delivery_id=delivery_tasks[delivery_ind].id,
                        rider_id=riders[rider_ind].id,
                    )
                )

        return dispatched_delivery_tasks

    @classmethod
    def _get_delivery_tasks_and_warehouse_pairwise_distance_matrix(
        cls, delivery_tasks: List[DeliveryTaskDTO]
    ) -> List[List[float]]:
        """
        This function returns a pairwise distance matrix for a list of coordinates.
        """
        coordinates = [WAREHOUSE_LOCATION.coordinate]
        for delivery_task in delivery_tasks:
            coordinates.append(
                delivery_task.delivery_information.delivery_location.coordinate
            )
        pairwise_distance_matrix = map_distance_service.get_pairwise_distance_matrix(
            coordinates
        )
        return pairwise_distance_matrix

    @classmethod
    def _validate_delivery_tasks(cls, delivery_tasks: List[DeliveryTaskDTO]):
        for delivery_task in delivery_tasks:
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
            assert (
                delivery_task.delivery_information.expected_delivery_time is not None
            ), "Delivery task's expected delivery time must be provided"
            expected_delivery_time = delivery_task.delivery_information.expected_delivery_time
            warehouse_day_start = WarehouseClock().get_day_start_timestamp()
            
            # Ensure both datetimes are timezone-aware for comparison
            if expected_delivery_time.tzinfo is None:
                expected_delivery_time = expected_delivery_time.replace(tzinfo=datetime.timezone.utc)
            
            assert (
                expected_delivery_time > warehouse_day_start
            ), "Delivery task's expected delivery time must be in the future"

            item = Item(**delivery_task.items[0].model_dump())
            assert (
                item.tool_scan_information is not None
            ), "Item's tool scan information must be provided"
            assert (
                item.tool_scan_information.volume > 0
            ), "Item's volume must be greater than 0"

    @classmethod
    def _validate_riders(cls, riders: List[Rider]):
        for rider in riders:
            assert rider.bag_volume > 0, "Rider's bag volume must be greater than 0"
