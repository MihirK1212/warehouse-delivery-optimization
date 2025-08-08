from .rider import Rider
from .delivery import DeliveryTask
from .item import Item

# Rebuild models to resolve forward references
Rider.model_rebuild()
DeliveryTask.model_rebuild()