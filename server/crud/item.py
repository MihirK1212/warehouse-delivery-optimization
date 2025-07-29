from fastapi import HTTPException
from beanie import PydanticObjectId

from ..models.item import Item


async def get_item(item_id: PydanticObjectId) -> Item | None:
    """
    This function is used to get an item by its id.
    """
    item = await Item.get(item_id)
    if item:
        return item
    return None


async def get_items() -> list[Item] | None:
    """
    This function is used to get all items.
    """
    items = await Item.find_all().to_list()
    if items:
        return items
    return None


async def create_item(item: Item) -> Item:
    """
    This function is used to create an item.
    """
    new_item = await item.create()
    return new_item


async def delete_item(item_id: PydanticObjectId) -> None:
    """
    This function is used to delete an item by its id.
    """
    try:
        item = await Item.get(item_id)
        if item:
            await item.delete()
        else:
            raise HTTPException(status_code=404, detail="Item not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def scan_item(item_id: PydanticObjectId, weight: float, volume: float) -> Item:
    item = await Item.get(item_id)
    if item:
        item.weight = weight
        item.volume = volume
        await item.save()
    return item
