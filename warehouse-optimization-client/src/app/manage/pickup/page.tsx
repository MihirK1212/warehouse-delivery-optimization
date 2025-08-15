"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/common/Modal";
import { useGetUndispatchedDeliveryTasksQuery } from "@/store/api/delivery";
import PickupHeader from "@/components/feature/manage/pickup/PickupHeader";
import PickupInfo from "@/components/feature/manage/pickup/PickupInfo";
import PickupTasksGrid from "@/components/feature/manage/pickup/PickupTasksGrid";
import UploadPickupWidget from "@/components/feature/manage/pickup/UploadPickupWidget";
import PickupStats from "@/components/feature/manage/pickup/PickupStats";
import { DeliveryStatus } from "@/types/deliveryStatus";
import _ from "lodash";

export default function AddPickupItemsPage() {
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const {
		data: allUndispatchedTasks = [],
		isLoading: isLoadingTasks,
		refetch: refetchTasks,
	} = useGetUndispatchedDeliveryTasksQuery();

	const undispatchedPickupTasks = useMemo(() => {
		return _.filter(
			allUndispatchedTasks,
			(task) => task.deliveryInformation.deliveryType === "pickup"
		);
	}, [allUndispatchedTasks]);

	return (
		<div className="space-y-8">
			<PickupHeader onModalOpen={() => setIsUploadModalOpen(true)} />

			<PickupStats pickupTasks={undispatchedPickupTasks} />

			<PickupInfo />

			<PickupTasksGrid
				tasks={undispatchedPickupTasks}
				isLoading={isLoadingTasks}
			/>

			<Modal
				isOpen={isUploadModalOpen}
				onClose={() => setIsUploadModalOpen(false)}
				title="Upload Pickup Items"
				size="xl"
			>
				<UploadPickupWidget
					onSubmit={() => {
						refetchTasks();
						setIsUploadModalOpen(false);
					}}
				/>
			</Modal>
		</div>
	);
}
