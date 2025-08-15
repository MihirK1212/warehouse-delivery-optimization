from typing import List, Optional
from pydantic import Field
from beanie import Document, Link, PydanticObjectId
from .rider import Rider
from .delivery import DeliveryTask
from pydantic import BaseModel
import datetime
from ..schemas import RouteSegment
from zoneinfo import ZoneInfo


class DeliveryTaskRef(BaseModel):
    delivery_task: Link[DeliveryTask]
    order_key: float


# route to get to current_task_index
class DeliveryTaskBatchRouteSegment(BaseModel):
    prev_task_delivery_id: Optional[PydanticObjectId] = (
        None  # for first task, this is None
    )
    task_delivery_id: PydanticObjectId
    route: List[RouteSegment]

    def total_distance(self) -> float:
        return sum(segment.distance for segment in self.route)

    def total_time_taken(self) -> float:
        return sum(segment.time_taken for segment in self.route)


class DeliveryTasksBatch(Document):
    """
    A batch/route assigned to a rider for the day (immutable after daily dispatch,
    except for explicit insertions of pickup tasks).
    """

    rider: Link[Rider]
    route_identifier_timestamp: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc)
    )  # this is the date of the route, in UTC timezone
    tasks: List[DeliveryTaskRef] = []  # ordered by order_key
    current_task_index: int = (
        0  # index into tasks for "currently executing" task, basically rider is going from current_task_index-1 to current_task_index
    )
    version: int = 0  # optimistic locking
    created_at: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc)
    )
    batch_route: Optional[List[DeliveryTaskBatchRouteSegment]] = []

    def is_current_day_tasks_batch(self) -> bool:
        # the batch route date should be today in IST timezone
        batch_route_day = (
            self.route_identifier_timestamp.replace(tzinfo=datetime.timezone.utc)
            .astimezone(ZoneInfo("Asia/Kolkata"))
            .date()
        )
        return batch_route_day == datetime.datetime.now(ZoneInfo("Asia/Kolkata")).date()
