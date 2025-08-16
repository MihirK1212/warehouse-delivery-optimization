import { DeliveryLocation, GoogleMapDynamicDirectionsRoute } from "@/types/common/type";
import {
	DirectionsRenderer,
	DirectionsService,
	GoogleMap,
	useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";

const containerStyle = {
	width: "100%",
	height: "500px",
	borderRadius: "0.5rem",
};

interface GoogleMapDynamicDirectionsProps {
	routes: GoogleMapDynamicDirectionsRoute[];
}

export default function GoogleMapDynamicDirections({
	routes,
}: GoogleMapDynamicDirectionsProps) {
	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
	});

	const [directionsResponses, setDirectionsResponses] = useState<
		google.maps.DirectionsResult[]
	>([]);
	const [routeColors, setRouteColors] = useState<string[]>([]);

	useEffect(() => {
		const getRandomColor = () => {
			const letters = "0123456789ABCDEF";
			let color = "#";
			for (let i = 0; i < 6; i++) {
				color += letters[Math.floor(Math.random() * 16)];
			}
			return color;
		};
		setRouteColors(routes.map(() => getRandomColor()));
	}, [routes]);

	const center = useMemo(() => {
		const allCoordinates = routes.flatMap((route) => [
			route.startLocation.coordinate,
			...(route.stops?.map((s) => s.coordinate) || []),
			route.endLocation.coordinate,
		]);

		if (allCoordinates.length === 0) {
			return { lat: 0, lng: 0 }; // Default center
		}

		const totalLat = allCoordinates.reduce(
			(sum, coord) => sum + coord.latitude,
			0
		);
		const totalLng = allCoordinates.reduce(
			(sum, coord) => sum + coord.longitude,
			0
		);

		return {
			lat: totalLat / allCoordinates.length,
			lng: totalLng / allCoordinates.length,
		};
	}, [routes]);

	return isLoaded ? (
		<div className="p-4 bg-white rounded-lg shadow-md">
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={center}
				zoom={10}
				options={{
					zoomControl: false,
					streetViewControl: false,
					mapTypeControl: false,
					fullscreenControl: false,
				}}
			>
				{routes.map((route, index) =>
					!directionsResponses[index] ? (
						<DirectionsService
							key={index}
							options={{
								destination: {
									lat: route.endLocation.coordinate.latitude,
									lng: route.endLocation.coordinate.longitude,
								},
								origin: {
									lat: route.startLocation.coordinate.latitude,
									lng: route.startLocation.coordinate.longitude,
								},
								waypoints:
									route.stops?.map((stop) => ({
										location: {
											lat: stop.coordinate.latitude,
											lng: stop.coordinate.longitude,
										},
										stopover: true,
									})) || [],
								travelMode: google.maps.TravelMode.DRIVING,
							}}
							callback={(result, status) => {
								if (status === google.maps.DirectionsStatus.OK && result) {
									setDirectionsResponses((prev) => {
										const newResponses = [...prev];
										newResponses[index] = result;
										return newResponses;
									});
								} else {
									console.error(`Directions request failed due to ${status}`);
								}
							}}
						/>
					) : null
				)}

				{directionsResponses.map((response, index) => (
					<DirectionsRenderer
						key={index}
						options={{
							directions: response,
							polylineOptions: {
								strokeColor: routeColors[index],
								strokeOpacity: 0.8,
								strokeWeight: 6,
							},
						}}
					/>
				))}
			</GoogleMap>
		</div>
	) : (
		<div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-lg">
			<p className="text-gray-500">Loading map...</p>
		</div>
	);
}
