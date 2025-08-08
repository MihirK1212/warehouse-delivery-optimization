from typing import List
from pydantic import BaseModel
from beanie import PydanticObjectId
from ..schemas import RouteSegment

class DispatchedDeliveryTask(BaseModel):
    delivery_id: PydanticObjectId
    rider_id: PydanticObjectId 