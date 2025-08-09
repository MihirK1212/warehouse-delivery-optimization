"use client";

import { useGetDeliverTasksForRiderQuery } from "@/store/api/delivery";
import { useGetRiderQuery } from "@/store/api/rider";
import { use, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import DeliverySidebar from "../../../components/feature/delivery/DeliverySidebar";
import DeliveryDetail from "../../../components/feature/delivery/DeliveryDetail";
import DeliveryCard from "../../../components/feature/delivery/DeliveryCard";
import RiderDeliveriesStatInfo from "@/components/feature/rider/RiderDeliveriesStatInfo";
import RiderProfileHeader from "@/components/feature/rider/RiderProfileHeader";
import _ from "lodash";

export default function RiderPage({
	params,
}: {
	params: Promise<{ riderId: string }>;
}) {
	const { riderId } = use(params);

	const { data: rider, isLoading: isLoadingRider } =
		useGetRiderQuery(riderId);
	const { data: allTasks = [], isLoading: isLoadingTasks } =
		useGetDeliverTasksForRiderQuery(riderId);

	const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(
		null
	);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	useEffect(() => {
		setSelectedDeliveryId((current) =>
			current ? _.first(allTasks)?.id || null : null
		);
	}, [allTasks.length]);

	// Filter tasks that are assigned to the logged-in rider only
	const assignedTasks = allTasks.filter(
		(task) => task.rider && task.rider.id === riderId
	);

	const handleSelectDeliveryId = (deliveryId: string) => {
		setSelectedDeliveryId(deliveryId);
	};

	const handleCloseDetail = () => {
		setSelectedDeliveryId(null);
	};

	const toggleSidebar = () => {
		setIsSidebarCollapsed(!isSidebarCollapsed);
	};

	const handleLogout = () => {
		localStorage.removeItem("loggedInRider");
		redirect("/rider");
	};

	if (isLoadingTasks || isLoadingRider) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">
						Loading your deliveries...
					</p>
				</div>
			</div>
		);
	}

	if (selectedDeliveryId) {
		return (
			<div className="min-h-screen bg-gray-50 flex">
				<DeliverySidebar
					deliveries={assignedTasks}
					selectedDeliveryId={selectedDeliveryId}
					onSelectDeliveryId={handleSelectDeliveryId}
					isCollapsed={isSidebarCollapsed}
					onToggleCollapse={toggleSidebar}
				/>
				<div className="flex-1 flex flex-col">
					<DeliveryDetail
						delivery={
							_.find(assignedTasks, { id: selectedDeliveryId }) ||
							_.first(assignedTasks)
						}
						onClose={handleCloseDetail}
					/>
				</div>
			</div>
		);
	}

	if (!rider) {
		return <div>Rider not found</div>;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<RiderProfileHeader rider={rider} onLogout={handleLogout} />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="space-y-8">
					<RiderDeliveriesStatInfo tasks={assignedTasks} />

					{/* Interactive Deliveries Grid */}
					<div>
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-lg font-medium text-gray-900">
								Your Assigned Deliveries
							</h3>
							<p className="text-sm text-gray-500">
								Click on any delivery to view detailed
								information and update its status
							</p>
						</div>

						{assignedTasks.length === 0 ? (
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
									No Deliveries Assigned
								</h3>
								<p className="text-gray-500">
									Hi {riderId}! You don&apos;t have any
									deliveries assigned to {riderId}&apos;s
									profile yet.
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{assignedTasks.map((delivery) => (
									<DeliveryCard
										key={delivery.id}
										delivery={delivery}
										onSelectDeliveryId={
											handleSelectDeliveryId
										}
										isSelected={
											selectedDeliveryId === delivery.id
										}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
