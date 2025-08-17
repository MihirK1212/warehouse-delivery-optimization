import { DeliveryTasksBatch } from "@/types/deliveryBatch/type";
import { DeliveryStatus } from "@/types/deliveryStatus";
import _ from "lodash";
import { useState } from "react";
import DeliveriesStatInfo from "@/components/feature/delivery/DeliveriesStatInfo";
import DeliveryCard from "@/components/feature/delivery/DeliveryCard";
import { getDeliveryLocation } from "@/utils/delivery";
import { WAREHOUSE_LOCATION } from "@/consants";

interface ManageDeliveryBatchDisplayProps {
	deliveryTasksBatch: DeliveryTasksBatch;
}

export default function ManageDeliveryBatchDisplay({
	deliveryTasksBatch,
}: ManageDeliveryBatchDisplayProps) {
	const [selectedDeliveryTaskId, setSelectedDeliveryTaskId] = useState<
		string | null
	>(null);

	const rankDeliveryTasks = _.map(
		_.orderBy(deliveryTasksBatch?.tasks, "orderKey"),
		"deliveryTask"
	);
	const currentTaskIndex = deliveryTasksBatch?.currentTaskIndex || 0;

	const selectedDeliveryTask = selectedDeliveryTaskId
		? _.find(
				rankDeliveryTasks,
				(task) => task.id === selectedDeliveryTaskId
		  )
		: null;

	// Calculate navigation metadata for selected task
	const selectedTaskIndex = selectedDeliveryTask
		? _.findIndex(
				rankDeliveryTasks,
				(task) => task.id === selectedDeliveryTaskId
		  )
		: -1;

	const previousDeliveryTaskLocation =
		selectedTaskIndex > 0
			? getDeliveryLocation(
					_.get(rankDeliveryTasks, selectedTaskIndex - 1)
			  )
			: WAREHOUSE_LOCATION;

	const selectedDeliveryTaskRoute = _.get(
		_.find(
			deliveryTasksBatch?.deliveryTasksBatchRoute,
			(routeSegment) =>
				routeSegment.taskDeliveryId === selectedDeliveryTask?.id
		),
		"route"
	);

	const handleCloseDetail = () => {
		setSelectedDeliveryTaskId(null);
	};

	if (selectedDeliveryTask) {
		return (
			<div className="min-h-screen bg-gray-50 flex">
				<div className="flex-1 flex flex-col">
					<ManageDeliveryDetail
						delivery={selectedDeliveryTask}
						onClose={handleCloseDetail}
						navigationMetadata={{
							deliveryStartLocation: previousDeliveryTaskLocation,
							taskRoute: selectedDeliveryTaskRoute || [],
						}}
					/>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="space-y-8">
					<DeliveriesStatInfo tasks={rankDeliveryTasks} />

					{/* Interactive Deliveries Grid */}
					<div>
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-lg font-medium text-gray-900">
								Delivery Tasks - {deliveryTasksBatch.rider.name}
							</h3>
							<p className="text-sm text-gray-500">
								Click on any delivery to view detailed
								information
							</p>
						</div>

						{_.filter(
							rankDeliveryTasks,
							(delivery) =>
								delivery.status != DeliveryStatus.COMPLETED
						).length === 0 ? (
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
										d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2m0 0v1"
									/>
								</svg>
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									No Deliveries
								</h3>
								<p className="text-gray-500">
									No deliveries found for this rider
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{_.map(
									_.filter(
										rankDeliveryTasks,
										(delivery) =>
											delivery.status !=
											DeliveryStatus.COMPLETED
									),
									(delivery) => (
										<DeliveryCard
											key={delivery.id}
											delivery={delivery}
											onSelectDeliveryId={() =>
												setSelectedDeliveryTaskId(
													delivery.id
												)
											}
											isSelected={
												selectedDeliveryTaskId ===
												delivery.id
											}
											isDisabled={false} // All cards are clickable for manager
										/>
									)
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

// Manager-specific delivery detail component that disables actions
function ManageDeliveryDetail({
	delivery,
	onClose,
	navigationMetadata,
}: {
	delivery: any;
	onClose: () => void;
	navigationMetadata: any;
}) {
	// This is a read-only version of DeliveryDetail without status update functionality
	if (!delivery) {
		onClose();
		return <div>Delivery not found</div>;
	}

	const deliveryLocation = getDeliveryLocation(delivery);

	const totalVolume = delivery.items.reduce(
		(sum: number, item: any) =>
			sum + (item.toolScanInformation?.volume || 0),
		0
	);

	const totalWeight = delivery.items.reduce(
		(sum: number, item: any) =>
			sum + (item.toolScanInformation?.weight || 0),
		0
	);

	return (
		<div className="h-full flex flex-col bg-white">
			{/* Header */}
			<div className="flex-shrink-0 px-6 py-4 border-b border-gray-200">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">
							AWB: {delivery.deliveryInformation.awbId}
						</h2>
						<div className="flex items-center mt-2 space-x-4">
							<span
								className={`px-3 py-1 rounded-full text-sm font-medium border ${delivery.status.getStatusColor()}`}
							>
								{delivery.status.name
									.replace("_", " ")
									.toUpperCase()}
							</span>
							<span
								className={`px-3 py-1 rounded-full text-sm font-medium ${
									delivery.deliveryInformation
										.deliveryType === "pickup"
										? "bg-orange-100 text-orange-800"
										: "bg-blue-100 text-blue-800"
								}`}
							>
								{delivery.deliveryInformation.deliveryType ===
								"pickup"
									? "Pickup"
									: "Delivery"}
							</span>
							<span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
								Manager View (Read Only)
							</span>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			</div>

			{/* Content - Same as DeliveryDetail but without action buttons */}
			<div className="flex-1 overflow-y-auto p-6">
				<div className="space-y-6">
					{/* Location Information */}
					<div className="bg-gray-50 rounded-lg p-4">
						<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
							<svg
								className="w-5 h-5 text-gray-500 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							{delivery.deliveryInformation.deliveryType ===
							"pickup"
								? "Pickup Point"
								: "Drop Point"}
						</h3>
						<p className="text-gray-700 mb-2">
							{deliveryLocation?.address}
						</p>
						<p className="text-sm text-gray-500">
							Coordinates:{" "}
							{deliveryLocation?.coordinate.latitude.toFixed(6)},{" "}
							{deliveryLocation?.coordinate.longitude.toFixed(6)}
						</p>
					</div>

					{/* Package Details */}
					<div className="bg-gray-50 rounded-lg p-4">
						<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
							<svg
								className="w-5 h-5 text-gray-500 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
								/>
							</svg>
							Package Details
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
							<div>
								<p className="text-sm text-gray-500">
									Total Items
								</p>
								<p className="text-xl font-bold text-gray-900">
									{delivery.items.length}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">
									Total Volume
								</p>
								<p className="text-xl font-bold text-gray-900">
									{totalVolume.toFixed(2)} cm³
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">
									Total Weight
								</p>
								<p className="text-xl font-bold text-gray-900">
									{totalWeight.toFixed(2)} kg
								</p>
							</div>
						</div>

						{/* Individual Items */}
						<div className="space-y-3">
							<h4 className="font-medium text-gray-900">
								Items List
							</h4>
							{delivery.items.map((item: any) => (
								<div
									key={item.id}
									className="bg-white rounded-md p-3 border border-gray-200"
								>
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<h5 className="font-medium text-gray-900">
												{item.name}
											</h5>
											<p className="text-sm text-gray-600 mt-1">
												{item.description}
											</p>
											{item.itemLocation && (
												<p className="text-xs text-gray-500 mt-1">
													Location:{" "}
													{item.itemLocation.address}
												</p>
											)}
										</div>
										<div className="text-right ml-4">
											{item.toolScanInformation && (
												<>
													<p className="text-sm text-gray-600">
														{item.toolScanInformation.volume.toFixed(
															2
														)}{" "}
														cm³
													</p>
													<p className="text-sm text-gray-600">
														{item.toolScanInformation.weight.toFixed(
															2
														)}{" "}
														kg
													</p>
												</>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Note: No action footer for manager view */}
		</div>
	);
}
