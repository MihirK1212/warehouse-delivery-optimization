from pydantic import BaseModel
from typing import Literal, List, Optional
import datetime

from .models.item import Item
from .models.delivery import DeliveryTask
from .models.rider import Rider
from .schemas import DeliveryInformation

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

class UpdateDeliveryTaskStatusDTO(BaseModel):
    status: Literal["undispatched", "dispatching", "dispatched", "in_progress", "completed", "cancelled"]