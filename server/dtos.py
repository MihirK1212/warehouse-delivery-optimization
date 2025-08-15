from pydantic import BaseModel
from typing import Literal, List, Optional
import datetime
from beanie import PydanticObjectId

from .models.item import Item
from .models.delivery import DeliveryTask
from .models.rider import Rider
from .schemas import DeliveryInformation, Coordinate
from .enums import DeliveryStatus
from .models.delivery_batch import DeliveryTaskRef, DeliveryTasksBatch
from .algorithm.map import distance as map_distance_service
from .constants import WAREHOUSE_LOCATION


class ItemAndDeliveryTaskDTO(BaseModel):
    item: Item
    delivery_task: DeliveryTask


class ScanDataDTO(BaseModel):
    weight: float
    volume: float


class CreateItemAndDeliveryTaskDTO(BaseModel):
    item: Item
    delivery_information: DeliveryInformation


class DeliveryTaskDTO(DeliveryTask):
    items: List[Item]
    rider: Optional[Rider]

    def get_task_coordinate(self) -> Coordinate:
        if self.delivery_information.delivery_type == "delivery":
            return self.delivery_information.delivery_location.coordinate
        elif self.delivery_information.delivery_type == "pickup":
            return self.items[0].item_location.coordinate


class UpdateDeliveryTaskStatusDTO(BaseModel):
    status_name: str


class RiderDTO(Rider):
    assigned_delivery_task_ids: List[PydanticObjectId]


class DeliveryTaskRefDTO(DeliveryTaskRef):
    delivery_task: DeliveryTaskDTO
    order_key: float


class DeliveryTasksBatchDTO(DeliveryTasksBatch):
    rider: Rider
    tasks: List[DeliveryTaskRefDTO]

    def get_time_for_task(self, delivery_task: DeliveryTaskDTO) -> float:
        """
        Get time it will take to go from previous task to given task
        """
        delivery_task_route_segment = next(
            (
                segment
                for segment in self.batch_route
                if segment.task_delivery_id == delivery_task.id
            ),
            None,
        )

        if not delivery_task_route_segment:
            return map_distance_service.get_simulated_temporal_distance(
                delivery_task.get_task_coordinate(),
                WAREHOUSE_LOCATION.coordinate,
            )

        return delivery_task_route_segment.total_time_taken()

    def get_time_to_next_task(self, delivery_task: DeliveryTaskDTO) -> float:
        """
        Get time it will take to go from given task to next task
        """
        all_tasks = sorted(self.tasks, key=lambda x: x.order_key)

        search_task_index = [
            i
            for i, task in enumerate(all_tasks)
            if task.delivery_task.id == delivery_task.id
        ][0]

        next_task_index = search_task_index + 1
        if next_task_index >= len(all_tasks):
            return (
                map_distance_service.get_simulated_temporal_distance(
                    delivery_task.get_task_coordinate(),
                    WAREHOUSE_LOCATION.coordinate,
                )
            )

        next_task = all_tasks[next_task_index]

        # Check if route segment exists, otherwise calculate distance directly
        next_task_route = next(
            (
                segment
                for segment in self.batch_route
                if segment.task_delivery_id == next_task.delivery_task.id
            ),
            None,
        )

        if next_task_route:
            return next_task_route.total_time_taken()
        else:
            # Fallback to direct distance calculation when route does not exist
            return map_distance_service.get_simulated_temporal_distance(
                delivery_task.get_task_coordinate(),
                next_task.delivery_task.get_task_coordinate(),
            )


class PickupDeliveryBatchAssignmentDTO(BaseModel):
    assigned_delivery_tasks_batch_id: Optional[PydanticObjectId] = None
    after_task_index: Optional[int] = None