from pydantic import Field
from beanie import Document


class Rider(Document):
    """
    This is the rider model.
    """

    name: str = Field(..., description="The name of the rider")
    age: int = Field(..., description="The age of the rider")
    bag_volume: float = Field(..., description="The bag volume of the rider")
    phone_number: str = Field(..., description="The phone number of the rider")
