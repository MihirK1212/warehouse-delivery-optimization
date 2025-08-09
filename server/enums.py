from enum import Enum

class DeliveryStatus(Enum):
    """
    This is the delivery status enum.
    """
    UNDISPATCHED = {"name": "undispatched", "description": "The delivery is not dispatched yet", "rank": 0}
    DISPATCHING = {"name": "dispatching", "description": "The delivery is being dispatched", "rank": 1}
    DISPATCHED = {"name": "dispatched", "description": "The delivery is dispatched", "rank": 2}
    IN_PROGRESS = {"name": "in_progress", "description": "The delivery is in progress", "rank": 3}
    COMPLETED = {"name": "completed", "description": "The delivery is completed", "rank": 4}
    CANCELLED = {"name": "cancelled", "description": "The delivery is cancelled", "rank": 5}

    @property
    def name(self):
        return self.value["name"]

    @property
    def rank(self):
        return self.value["rank"]