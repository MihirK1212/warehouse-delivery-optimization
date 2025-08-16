"use client";

import { useGetRiderQuery } from "@/store/api/rider";
import { use, useState } from "react";
import { redirect } from "next/navigation";
import RiderProfileHeader from "@/components/feature/rider/RiderProfileHeader";
import { useGetDeliveryTasksBatchForRiderQuery } from "@/store/api/deliveryBatch";
import DeliveryTasksBatchDisplay from "@/components/feature/delivery/DeliveryTasksBatchDisplay";

export default function RiderPage({
	params,
}: {
	params: Promise<{ riderId: string }>;
}) {
	const { riderId } = use(params);

	const { data: deliveryTasksBatch, isLoading: isLoadingDeliveryTasksBatch } =
		useGetDeliveryTasksBatchForRiderQuery(riderId);
	const { data: rider, isLoading: isLoadingRider } =
		useGetRiderQuery(riderId);

	const handleLogout = () => {
		localStorage.removeItem("loggedInRider");
		redirect("/rider");
	};

	if (isLoadingDeliveryTasksBatch) {
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

	if (!rider) {
		if (!isLoadingRider) {
			handleLogout();
		}
		return <div>Rider not found</div>;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<RiderProfileHeader rider={rider} onLogout={handleLogout} />

			{deliveryTasksBatch && (
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<DeliveryTasksBatchDisplay
						deliveryTasksBatch={deliveryTasksBatch}
						allowSelectOnlyFirstTask={true}
					/>
				</div>
			)}
		</div>
	);
}
