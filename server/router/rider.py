from fastapi import APIRouter 
from typing import List
from beanie import PydanticObjectId

from ..services.rider import RiderService
from ..models.rider import Rider

router = APIRouter(prefix="/rider", tags=["rider"])

@router.get("/{rider_id}")
async def get_rider(rider_id: PydanticObjectId):
    return await RiderService.get_rider(rider_id)

@router.get("/")
async def get_riders():
    return await RiderService.get_riders()

@router.post("/")
async def create_riders(riders: List[Rider]):
    return await RiderService.create_riders(riders)

@router.delete("/{rider_id}")
async def delete_rider(rider_id: PydanticObjectId):
    return await RiderService.delete_rider(rider_id) 