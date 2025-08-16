from typing import List
from ...schemas import Coordinate
from .utils import toRadians
import math
import random


def get_simulated_temporal_distance(
    coordinate1: Coordinate,
    coordinate2: Coordinate,
    detour_factor: float = 1.25,  # Typical city detour multiplier
    elevation_diff_m: float = 0.0,  # Optional, meters of elevation gain
    variability: float = 0.1,  # +/- 10% random variation
) -> int:
    """
    Estimates travel time in seconds between two coordinates using an improved Haversine-based model.

    - detour_factor: accounts for road curves and non-straight routes (1.25 typical)
    - elevation_diff_m: positive elevation gain slows travel
    - variability: random percentage variation to simulate real-world unpredictability
    """
    # Convert coordinates to radians
    lat1, lng1 = toRadians(coordinate1.latitude), toRadians(coordinate1.longitude)
    lat2, lng2 = toRadians(coordinate2.latitude), toRadians(coordinate2.longitude)

    # Calculate deltas
    delta_lat = lat2 - lat1
    delta_lng = lng2 - lng1

    # Haversine formula for great-circle distance
    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin(delta_lng / 2) ** 2
    )
    c = 2 * math.asin(math.sqrt(a))
    R = 6371.0  # Earth radius in km
    distance_km = c * R

    # Apply road network detour factor
    road_distance_km = distance_km * detour_factor

    # Adjust speed based on distance scale (short trips are slower due to stops)
    if road_distance_km < 2:
        avg_speed_kmh = 15.0
    elif road_distance_km < 10:
        avg_speed_kmh = 25.0
    elif road_distance_km < 30:
        avg_speed_kmh = 35.0
    else:
        avg_speed_kmh = 50.0

    # Terrain penalty: reduce speed if elevation gain > 0
    if elevation_diff_m > 0:
        terrain_penalty_factor = 1 - min(elevation_diff_m / 1000 * 0.05, 0.15)
        avg_speed_kmh = avg_speed_kmh * terrain_penalty_factor

    # Calculate time in hours, then convert to seconds
    estimated_time_hours = road_distance_km / avg_speed_kmh
    estimated_time_seconds = estimated_time_hours * 3600

    # Apply random variation for realism
    variation_factor = 1 + random.uniform(-variability, variability)
    estimated_time_seconds *= variation_factor

    distance = int(round(estimated_time_seconds))

    # TODO keep for now, remove later once we have actual coordinates instead of dummy coordinates
    distance = distance // 30
    return distance


def get_pairwise_distance_matrix(coordinates: List[Coordinate]) -> List[List[int]]:
    """
    This function returns a pairwise distance matrix for a list of coordinates.
    """
    num_coordinates = len(coordinates)
    distance_matrix = [[0] * num_coordinates for _ in range(num_coordinates)]

    for i in range(num_coordinates):
        for j in range(num_coordinates):
            if i == j:
                distance_matrix[i][j] = 0
            else:
                distance_matrix[i][j] = get_simulated_temporal_distance(
                    coordinates[i], coordinates[j]
                )

    return distance_matrix
