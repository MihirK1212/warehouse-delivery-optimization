from fastapi import APIRouter 
from typing import List
from beanie import PydanticObjectId

from ..services.item import ItemService
from ..models.item import Item

router = APIRouter(prefix="/item", tags=["item"])

@router.get("/{item_id}")
async def get_item(item_id: PydanticObjectId):
    return await ItemService.get_item(item_id)

@router.get("/")
async def get_items():
    return await ItemService.get_items()

@router.post("/")
async def create_items(items: List[Item]):
    return await ItemService.create_items(items)

@router.delete("/{item_id}")
async def delete_item(item_id: PydanticObjectId):
    return await ItemService.delete_item(item_id) 



