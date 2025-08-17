"use client";

import { useState } from "react";
import { useGetDeliveryTasksBatchForRiderQuery } from "@/store/api/deliveryBatch";
import RiderSelector from "@/components/feature/manage/monitor/RiderSelector";
import ManageDeliveryBatchDisplay from "@/components/feature/manage/monitor/ManageDeliveryBatchDisplay";
import DeliveryBatchRouteMap from "@/components/feature/manage/monitor/DeliveryBatchRouteMap";

export default function ManageMonitorPage() {
	const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);

	const {
		data: deliveryTasksBatch,
		isLoading: isLoadingDeliveryTasksBatch,
		error: deliveryTasksBatchError,
	} = useGetDeliveryTasksBatchForRiderQuery(selectedRiderId!, {
		skip: !selectedRiderId,
	});

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<div className="bg-white shadow rounded-lg p-6">
				<div className="flex justify-between items-center mb-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Monitor Deliveries
						</h1>
						<p className="text-gray-600">
							Track and monitor delivery progress for all riders
						</p>
					</div>
				</div>

				{/* Rider Selection */}
				<RiderSelector
					selectedRiderId={selectedRiderId}
					onRiderSelect={setSelectedRiderId}
				/>
			</div>

			{/* Content Based on Selection */}
			{!selectedRiderId ? (
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
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						/>
					</svg>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						Select a Rider
					</h3>
					<p className="text-gray-500">
						Choose a rider from the dropdown above to view their delivery
						tasks and route
					</p>
				</div>
			) : isLoadingDeliveryTasksBatch ? (
				<div className="bg-white rounded-lg shadow p-12 text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						Loading Delivery Data
					</h3>
					<p className="text-gray-500">
						Fetching delivery tasks and route information...
					</p>
				</div>
			) : deliveryTasksBatchError ? (
				<div className="bg-white rounded-lg shadow p-12 text-center">
					<svg
						className="w-16 h-16 text-red-300 mx-auto mb-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						Error Loading Data
					</h3>
					<p className="text-gray-500">
						Unable to load delivery tasks for the selected rider
					</p>
				</div>
			) : !deliveryTasksBatch ? (
				<div className="bg-white rounded-lg shadow p-12 text-center">
					<svg
						className="w-16 h-16 text-yellow-300 mx-auto mb-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No Delivery Tasks
					</h3>
					<p className="text-gray-500">
						This rider has no assigned delivery tasks for today
					</p>
				</div>
			) : (
				<div className="space-y-6">
					{/* Delivery Tasks Display */}
					<ManageDeliveryBatchDisplay
						deliveryTasksBatch={deliveryTasksBatch}
					/>

					{/* Delivery Route Map */}
					<DeliveryBatchRouteMap deliveryTasksBatch={deliveryTasksBatch} />
				</div>
			)}
		</div>
	);
}