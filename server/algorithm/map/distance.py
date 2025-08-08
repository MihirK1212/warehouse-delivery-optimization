from typing import List
from ...schemas import Coordinate
from .utils import toRadians
import math


def get_distance(coordinate1: Coordinate, coordinate2: Coordinate) -> float:
    """
    Estimates travel time in seconds between two geographic coordinates using the Haversine formula.
    
    Parameters:
    - coordinate1 (Coordinate): The starting point with latitude and longitude.
    - coordinate2 (Coordinate): The ending point with latitude and longitude.

    Returns:
    - int: Estimated travel time in seconds assuming an average rider speed of 40 km/h,
           with adjustment for real-world non-Euclidean travel paths.
    """
    # Convert latitude and longitude from degrees to radians
    lat1, lng1 = toRadians(coordinate1.latitude), toRadians(coordinate1.longitude)
    lat2, lng2 = toRadians(coordinate2.latitude), toRadians(coordinate2.longitude)

    # Calculate deltas
    delta_lat = lat2 - lat1
    delta_lng = lng2 - lng1

    # Apply Haversine formula to get great-circle distance in radians
    a = math.sin(delta_lat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(delta_lng / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))

    # Radius of Earth in kilometers
    R = 6371
    distance_km = c * R

    # Estimate time: adjust distance by a factor (assumed based on empirical or practical adjustments)
    estimated_time_hours = distance_km / 22  # assuming real-world effective speed
    estimated_time_seconds = estimated_time_hours * 3600

    return int(estimated_time_seconds)


def get_pairwise_distance_matrix(coordinates: List[Coordinate]) -> List[List[float]]:
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
                distance_matrix[i][j] = get_distance(coordinates[i], coordinates[j])

    return distance_matrix
