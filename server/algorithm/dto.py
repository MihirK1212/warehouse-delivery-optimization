from typing import List
from pydantic import BaseModel
from beanie import PydanticObjectId

class DispatchedDeliveryTask(BaseModel):
    delivery_id: PydanticObjectId
    rider_id: PydanticObjectId 