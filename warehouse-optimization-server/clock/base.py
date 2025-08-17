import datetime


class WarehouseClock:
    def get_day_start_timestamp(self) -> datetime.datetime:
        """
        Returns the start of the day in UTC.
        """
        # IST 10.00 am, UTC 4.30 am
        now = datetime.datetime.now(datetime.timezone.utc)
        return now.replace(hour=4, minute=30, second=0, microsecond=0, tzinfo=datetime.timezone.utc)
