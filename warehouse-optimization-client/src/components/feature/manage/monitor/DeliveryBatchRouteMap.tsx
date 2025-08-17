import { DeliveryTasksBatch } from "@/types/deliveryBatch/type";
import { DeliveryStatus } from "@/types/deliveryStatus";
import { getDeliveryLocation } from "@/utils/delivery";
import { WAREHOUSE_LOCATION } from "@/consants";
import GoogleMapDynamicDirections from "@/components/common/GoogleMapDynamicDirections";
import { DeliveryLocation } from "@/types/common/type";
import _ from "lodash";

interface DeliveryRouteMapProps {
	deliveryTasksBatch: DeliveryTasksBatch | null;
}

export default function DeliveryBatchRouteMap({
	deliveryTasksBatch,
}: DeliveryRouteMapProps) {
	if (!deliveryTasksBatch) {
		return (
			<div className="bg-white rounded-lg shadow p-12 text-center">
				<svg
					className="w-16 h-16 text-gray-300 mx-auto mb-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
					/>
				</svg>
				<h3 className="text-lg font-medium text-gray-900 mb-2">
					No Route Available
				</h3>
				<p className="text-gray-500">
					Please select a rider to view their delivery route
				</p>
			</div>
		);
	}

	const rankDeliveryTasks = _.map(
		_.orderBy(deliveryTasksBatch?.tasks, "orderKey"),
		"deliveryTask"
	);

	// Filter to only non-completed deliveries for the route
	const activeDeliveryTasks = _.filter(
		rankDeliveryTasks,
		(delivery) => delivery.status !== DeliveryStatus.COMPLETED
	);

	if (activeDeliveryTasks.length === 0) {
		return (
			<div className="bg-white rounded-lg shadow p-12 text-center">
				<svg
					className="w-16 h-16 text-green-300 mx-auto mb-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<h3 className="text-lg font-medium text-gray-900 mb-2">
					All Deliveries Completed
				</h3>
				<p className="text-gray-500">
					{deliveryTasksBatch.rider.name} has completed all assigned deliveries
				</p>
			</div>
		);
	}

	// Create the complete route with warehouse as start and all delivery locations as stops
	const deliveryLocations: DeliveryLocation[] = activeDeliveryTasks.map(
		(task) => getDeliveryLocation(task)
	).filter((location): location is DeliveryLocation => location !== undefined);

	if (deliveryLocations.length === 0) {
		return (
			<div className="bg-white rounded-lg shadow p-12 text-center">
				<svg
					className="w-16 h-16 text-gray-300 mx-auto mb-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<h3 className="text-lg font-medium text-gray-900 mb-2">
					Invalid Route Data
				</h3>
				<p className="text-gray-500">
					Unable to determine delivery locations for mapping
				</p>
			</div>
		);
	}

	// Create the route: warehouse -> first delivery -> ... -> last delivery
	const mapRoute = {
		startLocation: WAREHOUSE_LOCATION,
		endLocation: deliveryLocations[deliveryLocations.length - 1],
		stops: deliveryLocations.slice(0, -1), // All locations except the last one as stops
	};

	return (
		<div className="space-y-4">
			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-4">
					<div>
						<h3 className="text-lg font-semibold text-gray-900">
							Delivery Route for {deliveryTasksBatch.rider.name}
						</h3>
						<p className="text-sm text-gray-600">
							Route showing warehouse to all active delivery locations
						</p>
					</div>
					<div className="text-right">
						<p className="text-sm text-gray-500">Active Deliveries</p>
						<p className="text-2xl font-bold text-blue-600">
							{activeDeliveryTasks.length}
						</p>
					</div>
				</div>

				{/* Route Summary */}
				<div className="mb-4 p-4 bg-gray-50 rounded-lg">
					<h4 className="font-medium text-gray-900 mb-2">Route Summary</h4>
					<div className="space-y-2 text-sm">
						<div className="flex items-center">
							<div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
							<span className="font-medium">Start:</span>
							<span className="ml-2 text-gray-600">
								{WAREHOUSE_LOCATION.address}
							</span>
						</div>
						{deliveryLocations.slice(0, -1).map((location, index) => (
							<div key={index} className="flex items-center">
								<div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
								<span className="font-medium">Stop {index + 1}:</span>
								<span className="ml-2 text-gray-600">
									{location.address}
								</span>
							</div>
						))}
						<div className="flex items-center">
							<div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
							<span className="font-medium">End:</span>
							<span className="ml-2 text-gray-600">
								{deliveryLocations[deliveryLocations.length - 1].address}
							</span>
						</div>
					</div>
				</div>

				{/* Map */}
				<GoogleMapDynamicDirections routes={[mapRoute]} />
			</div>
		</div>
	);
}

