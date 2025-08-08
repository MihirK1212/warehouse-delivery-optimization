from .schemas import DeliveryLocation, Coordinate

WAREHOUSE_LOCATION = DeliveryLocation(
    address="Warehouse",
    coordinate=Coordinate(
        latitude=22.5,
        longitude=32.6
    )   
)