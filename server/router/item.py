from fastapi import APIRouter
from typing import List
from beanie import PydanticObjectId

from ..services.item import ItemService
from ..models.item import Item
from ..dtos import ScanData

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


@router.put("/{item_id}/scan")
async def scan_item(item_id: PydanticObjectId, scan_data: ScanData):
    return await ItemService.scan_item(item_id, scan_data) 