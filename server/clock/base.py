from datetime import datetime

class WarehouseMockClock():
    def get_day_start_timestamp(self) -> datetime:
        # TODO: remove this later
        return datetime.strptime("2025-08-03T10:56:15.696809", "%Y-%m-%dT%H:%M:%S.%f")
