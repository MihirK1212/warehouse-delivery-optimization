from typing import Optional
import datetime
from pydantic import Field
from beanie import Document, PydanticObjectId

from ..schemas import ToolScanInformation, DeliveryLocation


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
        datetime.datetime.now(datetime.timezone.utc), description="The timestamp of the item creation"
    )