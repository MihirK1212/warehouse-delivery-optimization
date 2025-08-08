from pydantic import Field
from typing import Literal, List, Optional
from beanie import Document, Link, PydanticObjectId
from ..schemas import RouteSegment, DeliveryInformation
from .rider import Rider
from .item import Item


class DeliveryTask(Document):
    """
    This is the delivery task model.
    """

    # id: Optional[PydanticObjectId] = Field(default_factory=PydanticObjectId, alias="_id")

    # class Config:
    #     validate_by_name = True
    #     validate_by_alias = True

    items: List[Link[Item]] = Field(..., description="The items to be delivered")

    delivery_information: DeliveryInformation = Field(
        ..., description="The delivery information"
    )

    rider: Optional[Link[Rider]] = Field(
        None, description="The rider assigned to the delivery"
    )

    status: Literal[
        "undispatched",
        "dispatching",
        "dispatched",
        "in_progress",
        "completed",
        "cancelled",
    ] = Field("undispatched", description="The status of the delivery task")

    delivery_route: Optional[List[RouteSegment]] = Field(
        [], description="The route of the delivery"
    )