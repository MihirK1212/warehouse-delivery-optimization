from fastapi import HTTPException
from typing import List
from beanie import PydanticObjectId

from ..crud import rider as rider_crud
from ..models.rider import Rider
from ..dtos import RiderDTO
from ..crud import delivery as delivery_crud
from .delivery_batch import DeliveryBatchService


class RiderService:
    @classmethod
    async def get_rider(cls, rider_id: PydanticObjectId) -> RiderDTO:
        """
        This method is used to get a rider by its id.
        """
        try:
            rider = await rider_crud.get_rider(rider_id)
            if rider:
                return await cls._populate_rider(rider)
            raise HTTPException(status_code=404, detail="Rider not found")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @classmethod
    async def get_riders(cls) -> list[RiderDTO]:
        """
        This method is used to get all riders.
        """
        try:
            riders = await rider_crud.get_riders()
            if riders:
                return [await cls._populate_rider(rider) for rider in riders]
            raise HTTPException(status_code=404, detail="Riders not found")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @classmethod
    async def create_riders(cls, riders: List[Rider]) -> List[Rider]:
        """
        This method is used to create multiple riders.
        """
        try:
            response = []
            for rider in riders:
                response.append(await rider_crud.create_rider(rider))
            return response
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @classmethod
    async def delete_rider(cls, rider_id: PydanticObjectId) -> None:
        """
        This method is used to delete a rider by its id.
        """
        try:
            return await rider_crud.delete_rider(rider_id)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @classmethod
    async def _populate_rider(cls, rider: Rider) -> RiderDTO:
        """
        This method is used to populate a rider.
        """
        assert rider.id is not None, "Rider id must be provided"
        try:
            delivery_tasks_batch = (
                await DeliveryBatchService.get_delivery_tasks_batch_for_rider(rider.id)
            )
        except HTTPException:
            delivery_tasks_batch = None
        return RiderDTO(
            **rider.model_dump(),
            assigned_delivery_tasks_batch_id=(
                delivery_tasks_batch.id if delivery_tasks_batch else None
            )
        )
