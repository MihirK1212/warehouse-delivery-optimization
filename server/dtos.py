from pydantic import BaseModel
from typing import Literal, List, Optional
import datetime
from beanie import PydanticObjectId

from .models.item import Item
from .models.delivery import DeliveryTask
from .models.rider import Rider
from .schemas import DeliveryInformation
from .enums import DeliveryStatus

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
    status_name: str

class RiderDTO(Rider):
    assigned_delivery_task_ids: List[PydanticObjectId]