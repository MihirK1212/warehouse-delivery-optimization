from pydantic import BaseModel
from typing import Literal
import datetime

from .models.item import Item
from .models.delivery import DeliveryTask
from .schemas import DeliveryInformation

class ItemAndDeliveryTask(BaseModel):
    item: Item
    delivery_task: DeliveryTask


class ScanData(BaseModel):
    weight: float
    volume: float


class AddItemAndDeliveryTask(BaseModel):
    item: Item
    delivery_information: DeliveryInformation