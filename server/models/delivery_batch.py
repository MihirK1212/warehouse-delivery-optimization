from typing import List, Optional
from pydantic import Field
from beanie import Document, Link
from .rider import Rider
from .delivery import DeliveryTask
from pydantic import BaseModel
import datetime

class DeliveryTaskRef(BaseModel):
    delivery_task: Link[DeliveryTask]
    order_key: float 

class DeliveryTasksBatch(Document):
    """
    A batch/route assigned to a rider for the day (immutable after daily dispatch,
    except for explicit insertions of pickup tasks).
    """
    rider: Link[Rider]
    date: datetime.date  # day this route belongs to
    tasks: List[DeliveryTaskRef] = []  # ordered by order_key
    current_task_index: int = 0  # index into tasks for "currently executing" task
    version: int = 0  # optimistic locking
    created_at: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc)
    )
