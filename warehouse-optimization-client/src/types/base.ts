/*
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

class Item(Document):
    """
    This is the item model.
    """

    name: str = Field(..., description="The name of the item")
    description: str = Field(..., description="The description of the item")

    tool_scan_information: Optional[ToolScanInformation] = Field(
        None, description="The tool scan information of the item"
    )

    item_location: Optional[DeliveryLocation] = Field(
        None, description="The item location of the item"
    )

    timestamp_created: datetime.datetime = Field(
        datetime.datetime.now(), description="The timestamp of the item creation"
    )

class Rider(Document):
    """
    This is the rider model.
    """

    name: str = Field(..., description="The name of the rider")
    age: int = Field(..., description="The age of the rider")
    bag_volume: float = Field(..., description="The bag volume of the rider")
    phone_number: str = Field(..., description="The phone number of the rider")


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
        "undispatched", "dispatched", "in_progress", "completed", "cancelled"
    ] = Field("undispatched", description="The status of the delivery task")

    delivery_route: Optional[List[RouteSegment]] = Field(
        [], description="The route of the delivery"
    )
*/