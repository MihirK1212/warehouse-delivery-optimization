from typing import Any
from fastapi import HTTPException
from beanie import PydanticObjectId

from ..models.rider import Rider

async def get_rider(rider_id: PydanticObjectId) -> Rider:
    """
    This function is used to get a rider by its id.
    """
    rider = await Rider.get(rider_id)
    if rider:
        return rider
    raise HTTPException(status_code=404, detail="Rider not found")


async def get_riders() -> list[Rider]:
    """
    This function is used to get all riders.
    """
    riders = await Rider.find_all().to_list()
    if riders:
        return riders
    return []


async def create_rider(rider: Rider) -> Rider:
    """
    This function is used to create a rider.
    """
    new_rider = await rider.create()  
    return new_rider

async def update_rider(rider_id: PydanticObjectId, update_dict: dict[str, Any]) -> Rider:
    """
    This function is used to update a rider.
    """
    rider = await Rider.get(rider_id)
    if rider:
        await rider.set(update_dict)
        return rider
    else:
        raise HTTPException(status_code=404, detail="Rider not found")

async def delete_rider(rider_id: PydanticObjectId) -> None:
    """
    This function is used to delete a rider by its id.
    """
    try:
        rider = await Rider.get(rider_id)
        if rider:
            await rider.delete()
        else:
            raise HTTPException(status_code=404, detail="Rider not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 