from pydantic import Field
from typing import Literal, List, Optional
from beanie import Document, Link, PydanticObjectId
from ..schemas import RouteSegment, DeliveryInformation
from .rider import Rider
from .item import Item
from ..enums import DeliveryStatus


class DeliveryTask(Document):
    """
    This is the delivery task model.
    """
    items: List[Link[Item]] = Field(..., description="The items to be delivered")

    delivery_information: DeliveryInformation = Field(
        ..., description="The delivery information"
    )

    rider: Optional[Link[Rider]] = Field(
        None, description="The rider assigned to the delivery"
    )

    status: Literal[
        DeliveryStatus.UNDISPATCHED.name,
        DeliveryStatus.DISPATCHING.name,
        DeliveryStatus.DISPATCHED.name,
        DeliveryStatus.IN_PROGRESS.name,
        DeliveryStatus.COMPLETED.name,
        DeliveryStatus.CANCELLED.name,
    ] = Field(DeliveryStatus.UNDISPATCHED.name, description="The status of the delivery task")

    delivery_route: Optional[List[RouteSegment]] = Field(
        [], description="The route of the delivery"
    )