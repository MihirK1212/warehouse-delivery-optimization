"use client";

import { DeliveryTask } from "@/types/delivery/type";
import { useUpdateDeliveryTaskStatusMutation } from "@/store/api/delivery";
import moment from "moment";
import { DeliveryStatus } from "@/types/deliveryStatus";

interface DeliveryDetailProps {
	delivery: DeliveryTask | undefined;
	onClose: () => void;
}

export default function DeliveryDetail({
	delivery,
	onClose,
}: DeliveryDetailProps) {
	const [updateStatus, { isLoading: isUpdating }] =
		useUpdateDeliveryTaskStatusMutation();

	const handleStatusUpdate = async () => {
		if (!delivery) {
			return;
		}

		const nextStatus = delivery.status.getNextRankStatus();
		if (nextStatus) {
			try {
				await updateStatus({
					id: delivery.id,
					status: nextStatus,
				}).unwrap();
			} catch (error) {
				console.error("Failed to update status:", error);
			}
		}
	};

	if (!delivery) {
		return <div>Delivery not found</div>;
	}

	const totalVolume = delivery.items.reduce(
		(sum, item) => sum + (item.toolScanInformation?.volume || 0),
		0
	);

	const totalWeight = delivery.items.reduce(
		(sum, item) => sum + (item.toolScanInformation?.weight || 0),
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

			{/* Content */}
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
							{
								delivery.deliveryInformation.deliveryLocation
									.address
							}
						</p>
						<p className="text-sm text-gray-500">
							Coordinates:{" "}
							{delivery.deliveryInformation.deliveryLocation.coordinate.latitude.toFixed(
								6
							)}
							,{" "}
							{delivery.deliveryInformation.deliveryLocation.coordinate.longitude.toFixed(
								6
							)}
						</p>
					</div>

					{/* Delivery Information */}
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
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Delivery Schedule
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-gray-500">
									Expected Delivery Time
								</p>
								<p className="text-gray-900 font-medium">
									{moment(
										delivery.deliveryInformation
											.expectedDeliveryTime
									).format("MMMM DD, YYYY")}
								</p>
								<p className="text-gray-900 font-medium">
									{moment(
										delivery.deliveryInformation
											.expectedDeliveryTime
									).format("hh:mm A")}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">
									Time Remaining
								</p>
								<p className="text-gray-900 font-medium">
									{moment(
										delivery.deliveryInformation
											.expectedDeliveryTime
									).fromNow()}
								</p>
							</div>
						</div>
					</div>

					{/* Items Information */}
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
							<div>
								<p className="text-sm text-gray-500">Rider</p>
								<p className="text-xl font-bold text-gray-900">
									{delivery.rider?.name || "Unassigned"}
								</p>
							</div>
						</div>

						{/* Individual Items */}
						<div className="space-y-3">
							<h4 className="font-medium text-gray-900">
								Items List
							</h4>
							{delivery.items.map((item) => (
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

					{/* Route Information */}
					{delivery.deliveryRoute &&
						delivery.deliveryRoute.length > 0 && (
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
											d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
										/>
									</svg>
									Route Instructions
								</h3>
								<div className="space-y-2">
									{delivery.deliveryRoute.map(
										(segment, index) => (
											<div
												key={index}
												className="flex items-start space-x-3 p-2 bg-white rounded border"
											>
												<span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
													{index + 1}
												</span>
												<div className="flex-1">
													<p className="text-sm text-gray-900">
														{segment.instruction}
													</p>
													<p className="text-xs text-gray-500">
														{segment.distance}m •{" "}
														{Math.round(
															segment.timeTaken /
																60
														)}{" "}
														min
													</p>
												</div>
											</div>
										)
									)}
								</div>
							</div>
						)}
				</div>
			</div>

			{/* Action Footer */}
			{delivery.status.getNextRankStatus() && (
				<div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
					<button
						onClick={handleStatusUpdate}
						disabled={isUpdating}
						className={`w-full py-3 px-6 rounded-lg text-lg font-medium transition-colors ${
							delivery.status === DeliveryStatus.DISPATCHED
								? "bg-purple-600 hover:bg-purple-700 text-white"
								: "bg-green-600 hover:bg-green-700 text-white"
						} disabled:opacity-50 disabled:cursor-not-allowed`}
					>
						{isUpdating
							? "Updating..."
							: delivery.status.getNextStatusLabel()}
					</button>
				</div>
			)}
		</div>
	);
}
