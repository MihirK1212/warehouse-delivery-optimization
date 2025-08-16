import datetime
from pydantic import BaseModel, Field, model_validator
from typing import List, Literal, Optional


class ToolScanInformation(BaseModel):
    """
    This is the tool scan information of the item.
    """

    volume: float = Field(..., description="The volume of the item")
    weight: float = Field(..., description="The weight of the item")

    timestamp: datetime.datetime = Field(
        datetime.datetime.now(datetime.timezone.utc),
        description="The timestamp of the item",
    )


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

    start_location: DeliveryLocation = Field(
        ..., description="The start location of the route segment"
    )
    end_location: DeliveryLocation = Field(
        ..., description="The end location of the route segment"
    )
    distance: Optional[float] = Field(
        0, description="The distance of the route segment"
    )
    time_taken: Optional[float] = Field(
        0, description="The time taken to travel the route segment"
    )
    instruction: Optional[str] = Field(
        "", description="The instruction of the route segment"
    )
    polyline: Optional[List[Coordinate]] = Field(
        None, description="The polyline of the route segment"
    )

    # validation that in the polyline, the start_location and end_location are the first and last coordinates
    @model_validator(mode="after")
    def validate_polyline(self):
        if (self.polyline is not None) and (
            self.polyline[0] != self.start_location.coordinate
            or self.polyline[-1] != self.end_location.coordinate
        ):
            raise ValueError(
                "The polyline must start with the start_location and end with the end_location"
            )
        return self


class DeliveryInformation(BaseModel):
    """
    This is the delivery information model.
    """

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
