"use client";

import _ from "lodash";
import { DeliveryTask } from "@/types/delivery/type";
import { useState } from "react";
import moment from "moment";
import { DeliveryStatus } from "@/types/deliveryStatus";

interface DeliverySidebarProps {
	deliveries: DeliveryTask[];
	selectedDeliveryId: string;
	onSelectDeliveryId: (deliveryId: string) => void;
	isCollapsed: boolean;
	onToggleCollapse: () => void;
}

export default function DeliverySidebar({
	deliveries,
	selectedDeliveryId,
	onSelectDeliveryId,
	isCollapsed,
	onToggleCollapse,
}: DeliverySidebarProps) {
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const filteredDeliveries = deliveries.filter((delivery) => {
		if (statusFilter === "all") return true;
		return delivery.status.name === statusFilter;
	});

	const otherDeliveries = filteredDeliveries.filter(
		(delivery) => delivery.id !== selectedDeliveryId
	);

	const statusCounts = deliveries.reduce((acc, delivery) => {
		acc[delivery.status.name] = (acc[delivery.status.name] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	return (
		<div
			className={`transition-all duration-300 bg-white border-r border-gray-200 flex flex-col ${
				isCollapsed ? "w-16" : "w-80"
			}`}
		>
			{/* Header */}
			<div className="flex-shrink-0 p-4 border-b border-gray-200">
				<div className="flex items-center justify-between">
					{!isCollapsed && (
						<h3 className="text-lg font-semibold text-gray-900">
							Other Deliveries ({otherDeliveries.length})
						</h3>
					)}
					<button
						onClick={onToggleCollapse}
						className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<svg
							className={`w-5 h-5 transition-transform ${
								isCollapsed ? "rotate-180" : ""
							}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
				</div>
			</div>

			{!isCollapsed && (
				<>
					{/* Status Filter */}
					<div className="flex-shrink-0 p-4 border-b border-gray-200">
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">
								Filter by Status
							</label>
							<select
								value={statusFilter}
								onChange={(e) =>
									setStatusFilter(e.target.value)
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
							>
								<option value="all">
									All ({deliveries.length})
								</option>
								{_.map(DeliveryStatus.values(), (status) => (
									<option value={status.name}>
										{status.name.replace("_", " ")} (
										{statusCounts[status.name] || 0})
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Deliveries List */}
					<div className="flex-1 overflow-y-auto">
						{otherDeliveries.length === 0 ? (
							<div className="p-4 text-center text-gray-500">
								<svg
									className="w-12 h-12 mx-auto mb-2 text-gray-300"
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
								<p className="text-sm">No other deliveries</p>
							</div>
						) : (
							<div className="p-2 space-y-2">
								{otherDeliveries.map((delivery) => (
									<div
										key={delivery.id}
										className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
										onClick={() =>
											onSelectDeliveryId(delivery.id)
										}
									>
										<div className="flex justify-between items-start mb-2">
											<p className="text-sm font-medium text-gray-900 truncate">
												{
													delivery.deliveryInformation
														.awbId
												}
											</p>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${delivery.status.getStatusColor()}`}
											>
												{delivery.status.name.replace(
													"_",
													" "
												)}
											</span>
										</div>

										<div className="space-y-1">
											<div className="flex items-center">
												<svg
													className="w-3 h-3 text-gray-400 mr-1"
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
												<p className="text-xs text-gray-600 truncate">
													{
														delivery
															.deliveryInformation
															.deliveryLocation
															.address
													}
												</p>
											</div>

											<div className="flex items-center">
												<svg
													className="w-3 h-3 text-gray-400 mr-1"
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
												<p className="text-xs text-gray-600">
													{moment(
														delivery
															.deliveryInformation
															.expectedDeliveryTime
													).format("MMM DD, HH:mm")}
												</p>
											</div>

											<div className="flex items-center">
												<svg
													className="w-3 h-3 text-gray-400 mr-1"
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
												<p className="text-xs text-gray-600">
													{delivery.items.length}{" "}
													item(s)
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}
