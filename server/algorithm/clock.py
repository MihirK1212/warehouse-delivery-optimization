import datetime


def get_day_start_timestamp() -> datetime.datetime:
    # TODO: remove this later
    return datetime.datetime.strptime(
        "2025-08-03T10:56:15.696809", "%Y-%m-%dT%H:%M:%S.%f"
    )
