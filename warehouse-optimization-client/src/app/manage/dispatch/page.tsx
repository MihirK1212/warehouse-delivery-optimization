"use client";

import { useMemo, useState } from "react";
import { useGetUndispatchedDeliveryTasksQuery } from "@/store/api/delivery";
import { DeliveryTask } from "@/types/delivery/type";
import { useGetRidersQuery } from "@/store/api/rider";
import {
	DispatchHeader,
	DispatchStats,
	DeliveriesGrid,
} from "@/components/feature/manage/dispatch";
import Modal from "@/components/common/Modal";
import DispatchWidget from "@/components/feature/manage/dispatch/DispatchWidget";
import _ from "lodash";

export default function DispatchDeliveriesPage() {
	const [selectedDeliveries, setSelectedDeliveries] = useState<
		DeliveryTask[]
	>([]);
	const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
	const {
		data: undispatchedTasks = [],
		isLoading: isLoadingTasks,
		refetch: refetchTasks,
	} = useGetUndispatchedDeliveryTasksQuery();
	const { data: riders = [] } = useGetRidersQuery();

	const totalVolume = useMemo(
		() =>
			selectedDeliveries.reduce((total, task) => {
				return (
					total +
					(task.items?.reduce((itemTotal, item) => {
						return (
							itemTotal + (item.toolScanInformation?.volume || 0)
						);
					}, 0) || 0)
				);
			}, 0),
		[selectedDeliveries]
	);

	return (
		<div className="space-y-8">
			<DispatchHeader onOpen={() => setIsDispatchModalOpen(true)} />

			<DispatchStats
				pendingCount={undispatchedTasks.length}
				selectedTasksCount={selectedDeliveries.length}
				availableRidersCount={riders.length}
				totalVolume={totalVolume}
			/>

			<DeliveriesGrid
				tasks={undispatchedTasks}
				isLoading={isLoadingTasks}
				selectedDeliveries={selectedDeliveries}
				onSelect={setSelectedDeliveries}
			/>

			<Modal
				isOpen={isDispatchModalOpen}
				onClose={() => setIsDispatchModalOpen(false)}
				title="Dispatch Deliveries"
				size="xl"
			>
				<DispatchWidget
					deliveries={selectedDeliveries}
					availableRiders={_.filter(riders, (rider) => _.isEmpty(rider.assignedDeliveryTaskIds))}
					onDispatched={() => {
						setSelectedDeliveries([]);
						refetchTasks();
						setIsDispatchModalOpen(false);
					}}
					onCancel={() => setIsDispatchModalOpen(false)}
				/>
			</Modal>
		</div>
	);
}
