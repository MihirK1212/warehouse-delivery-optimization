from beanie import PydanticObjectId


class DeliverBatchRouteService:
    @classmethod
    def compute_batch_route(cls, delivery_tasks_batch_id: PydanticObjectId) -> None:
        pass