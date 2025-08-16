import GoogleMapDynamicDirections from "@/components/common/GoogleMapDynamicDirections";
import { DeliveryLocation, RouteSegment } from "@/types/common/type";

export default function DeliveryNavigation({
	deliveryStartLocation,
	deliveryEndLocation,
	taskRoute,
}: {
	deliveryStartLocation?: DeliveryLocation;
	deliveryEndLocation?: DeliveryLocation;
	taskRoute: RouteSegment[];
}) {
	if (!deliveryStartLocation || !deliveryEndLocation) {
		return (
			<div className="flex items-center justify-center h-full p-4 bg-gray-100 rounded-lg">
				<p className="text-gray-500">
					No route found - please check the route
				</p>
			</div>
		);
	}

	return (
		<div className="p-4 bg-white rounded-lg shadow-md">
			<div className="mb-4">
				<h3 className="text-lg font-semibold text-gray-800">Delivery Route</h3>
				<div className="flex justify-between mt-2 text-sm text-gray-600">
					<div>
						<p className="font-medium">Start</p>
						<p>
							{deliveryStartLocation.address} - 
							{deliveryStartLocation.coordinate.latitude.toFixed(4)},{" "}
							{deliveryStartLocation.coordinate.longitude.toFixed(4)}
						</p>
					</div>
					<div>
						<p className="font-medium text-right">End</p>
						<p>
							{deliveryEndLocation.address} - 
							{deliveryEndLocation.coordinate.latitude.toFixed(4)},{" "}
							{deliveryEndLocation.coordinate.longitude.toFixed(4)}
						</p>
					</div>
				</div>
			</div>
			<GoogleMapDynamicDirections
				routes={[
					{
						startLocation: deliveryStartLocation, 
						endLocation: deliveryEndLocation,
					}
				]}
			/>
		</div>
	);
}