from fastapi import HTTPException
from typing import List
from beanie import PydanticObjectId

from ..crud import item as item_crud
from ..models.item import Item
from ..dtos import ScanDataDTO


class ItemService:
    @classmethod
    async def get_item(cls, item_id: PydanticObjectId) -> Item | None:
        """
        This method is used to get an item by its id.
        """
        try:
            return await item_crud.get_item(item_id)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @classmethod
    async def get_items(cls) -> list[Item] | None:
        """
        This method is used to get all items.
        """
        try:
            return await item_crud.get_items()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @classmethod
    async def create_items(cls, items: List[Item]) -> List[Item]:
        """
        This method is used to create multiple items.
        """
        try:
            response = []
            for item in items:
                response.append(await item_crud.create_item(item))
            return response
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @classmethod
    async def delete_item(cls, item_id: PydanticObjectId) -> None:
        """
        This method is used to delete an item by its id.
        """
        try:
            return await item_crud.delete_item(item_id)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def scan_item(item_id: PydanticObjectId, scan_data: ScanDataDTO) -> Item:
        return await item_crud.scan_item(item_id, scan_data.weight, scan_data.volume)
