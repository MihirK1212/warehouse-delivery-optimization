from typing import TYPE_CHECKING, Optional  

from pydantic import Field
from beanie import Document, Link, PydanticObjectId
from typing import List

if TYPE_CHECKING:
    from .delivery import DeliveryTask


class Rider(Document):
    """
    This is the rider model.
    """
    # id: Optional[PydanticObjectId] = Field(default_factory=PydanticObjectId, alias="_id")

    # class Config:
    #     validate_by_name = True
    #     validate_by_alias = True

    name: str = Field(..., description="The name of the rider")
    age: int = Field(..., description="The age of the rider")
    bag_volume: float = Field(..., description="The bag volume of the rider")
    phone_number: str = Field(..., description="The phone number of the rider")

    delivery_tasks: List[Link["DeliveryTask"]] = Field(
        [], description="The delivery tasks of the rider"
    )