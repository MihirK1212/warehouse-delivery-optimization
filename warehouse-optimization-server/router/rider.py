from fastapi import APIRouter 
from typing import List
from beanie import PydanticObjectId

from ..services.rider import RiderService
from ..models.rider import Rider
from ..dtos import RiderDTO

router = APIRouter(prefix="/rider", tags=["rider"])

@router.get("/{rider_id}", response_model=RiderDTO)
async def get_rider(rider_id: PydanticObjectId):
    return await RiderService.get_rider(rider_id)

@router.get("/", response_model=List[RiderDTO])
async def get_riders():
    return await RiderService.get_riders()

@router.post("/")
async def create_riders(riders: List[Rider]):
    return await RiderService.create_riders(riders)

@router.delete("/{rider_id}")
async def delete_rider(rider_id: PydanticObjectId):
    return await RiderService.delete_rider(rider_id) 