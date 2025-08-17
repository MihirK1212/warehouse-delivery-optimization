from pydantic import Field
from typing import Literal, List
from beanie import Document, Link
from ..schemas import DeliveryInformation 
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

    status: Literal[ # type: ignore
        DeliveryStatus.UNDISPATCHED.name,
        DeliveryStatus.DISPATCHING.name,
        DeliveryStatus.DISPATCHED.name,
        DeliveryStatus.IN_PROGRESS.name,
        DeliveryStatus.COMPLETED.name,
        DeliveryStatus.CANCELLED.name,
    ] = Field(DeliveryStatus.UNDISPATCHED.name, description="The status of the delivery task")