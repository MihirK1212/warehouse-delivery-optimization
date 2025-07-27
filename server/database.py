from .settings import settings
from .models.item import Item
from .models.rider import Rider
from .models.delivery import DeliveryTask
from beanie import init_beanie
import motor.motor_asyncio


async def init_db():
    client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_URL)
    database = client[settings.MONGO_NAME]

    await init_beanie(
        database=database, document_models=[Item, Rider, DeliveryTask]
    )
