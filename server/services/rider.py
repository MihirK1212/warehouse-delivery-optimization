from fastapi import HTTPException
from typing import List
from beanie import PydanticObjectId

from ..crud import rider as rider_crud
from ..models.rider import Rider
from ..dtos import RiderDTO


class RiderService:
    @classmethod
    async def get_rider(cls, rider_id: PydanticObjectId) -> RiderDTO | None:
        """
        This method is used to get a rider by its id.
        """
        try:
            rider = await rider_crud.get_rider(rider_id)
            if rider:
                return RiderDTO(
                    **rider.model_dump(),
                    assigned_delivery_task_ids=[delivery_task.ref.id for delivery_task in rider.delivery_tasks]
                )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @classmethod
    async def get_riders(cls) -> list[RiderDTO] | None:
        """
        This method is used to get all riders.
        """
        try:
            riders = await rider_crud.get_riders()
            if riders:
                return [
                    RiderDTO(
                        **rider.model_dump(),
                        assigned_delivery_task_ids=[delivery_task.ref.id for delivery_task in rider.delivery_tasks]
                    )
                    for rider in riders
                ]
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
