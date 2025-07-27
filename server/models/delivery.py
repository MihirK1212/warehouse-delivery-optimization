from pydantic import Field
from typing import Literal, List, Optional
from beanie import Document, Link
import datetime
from pydantic import BaseModel
from ..schemas import DeliveryLocation, RouteSegment

from .rider import Rider
from .item import Item

class Delivery(BaseModel):
    """
    This is the delivery model.
    """

    items: List[Link[Item]] = Field(..., description="The items to be delivered")
    expected_delivery_time: datetime.datetime = Field(
        ..., description="The expected delivery time of the item"
    )
    delivery_type: Literal["pickup", "delivery"] = Field(
        ..., description="The type of delivery"
    )
    awb_id: str = Field(..., description="The awb id of the delivery")
    delivery_location: DeliveryLocation = Field(
        ..., description="The location of the delivery"
    )


class DeliveryTask(Document):
    """
    This is the delivery task model.
    """

    delivery: Delivery = Field(..., description="The details of the delivery to be completed")
    rider: Optional[Link[Rider]] = Field(None, description="The rider assigned to the delivery")
    status: Literal["undispatched", "dispatched", "in_progress", "completed", "cancelled"] = Field(
        "undispatched", description="The status of the delivery task"
    )

    delivery_route: Optional[List[RouteSegment]] = Field(
        [], description="The route of the delivery"
    )