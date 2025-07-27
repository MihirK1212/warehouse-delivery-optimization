import datetime
from pydantic import BaseModel, Field
from typing import List

class ToolScanInformation(BaseModel):
    """
    This is the tool scan information of the item.
    """

    volume: float = Field(..., description="The volume of the item")
    weight: float = Field(..., description="The weight of the item")

    timestamp: datetime.datetime = Field(..., description="The timestamp of the item")


class Coordinate(BaseModel):
    """
    This is the coordinate model.
    """

    latitude: float = Field(..., description="The latitude of the coordinate")
    longitude: float = Field(..., description="The longitude of the coordinate")


class DeliveryLocation(BaseModel):
    """
    This is the delivery location model.
    """

    address: str = Field(..., description="The address of the location")
    coordinate: Coordinate = Field(..., description="The coordinate of the location")


class RouteSegment(BaseModel):
    """
    This is the route segment model.
    """

    distance: float = Field(..., description="The distance of the route segment")
    time_taken: float = Field(
        ..., description="The time taken to travel the route segment"
    )
    instruction: str = Field(..., description="The instruction of the route segment")
    polyline: List[Coordinate] = Field(
        ..., description="The polyline of the route segment"
    )


