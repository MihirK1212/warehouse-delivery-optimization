import { DeliveryTasksBatch } from "@/types/deliveryBatch/type";
import { DeliveryStatus } from "@/types/deliveryStatus";
import _ from "lodash";
import { useState } from "react";
import DeliveryDetail from "./DeliveryDetail";
import DeliveriesStatInfo from "./DeliveriesStatInfo";
import DeliveryCard from "./DeliveryCard";
import { getDeliveryLocation } from "@/utils/delivery";
import { WAREHOUSE_LOCATION } from "@/consants";

export default function DeliveryBatchDisplay({
	deliveryTasksBatch,
	allowSelectOnlyFirstTask,
}: {
	deliveryTasksBatch: DeliveryTasksBatch;
	allowSelectOnlyFirstTask: boolean;
}) {
	const rankDeliveryTasks = _.map(
		_.orderBy(deliveryTasksBatch?.tasks, "orderKey"),
		"deliveryTask"
	);
	const currentTaskIndex = deliveryTasksBatch?.currentTaskIndex || 0;

	// some validation checks for the delivery tasks batch
	for (let i = 0; i < rankDeliveryTasks.length; i++) {
		if (
			i < currentTaskIndex &&
			rankDeliveryTasks[i].status != DeliveryStatus.COMPLETED
		) {
			window.alert("You have not completed the previous delivery tasks");
			return;
		}
		if (
			i == currentTaskIndex &&
			!_.includes(
				[DeliveryStatus.DISPATCHED, DeliveryStatus.IN_PROGRESS],
				rankDeliveryTasks[i].status
			)
		) {
			window.alert("You have not completed the current delivery task");
			return;
		}
		if (
			i > currentTaskIndex &&
			rankDeliveryTasks[i].status != DeliveryStatus.DISPATCHED
		) {
			window.alert("You have not completed the upcoming delivery tasks");
			return;
		}
	}

	const currentDeliveryTask = _.get(rankDeliveryTasks, currentTaskIndex);

	// for navigation
	const previousDeliveryTaskLocation =
		currentTaskIndex > 0
			? getDeliveryLocation(
					_.get(rankDeliveryTasks, currentTaskIndex - 1)
			  )
			: WAREHOUSE_LOCATION;
	const currentDeliveryTaskRoute = _.get(
		_.find(
			deliveryTasksBatch?.deliveryTasksBatchRoute,
			(routeSegment) =>
				routeSegment.taskDeliveryId === currentDeliveryTask?.id
		),
		"route"
	);

	const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

	const handleCloseDetail = () => {
		setIsDetailViewOpen(false);
	};

	if (isDetailViewOpen) {
		return (
			<div className="min-h-screen bg-gray-50 flex">
				<div className="flex-1 flex flex-col">
					<DeliveryDetail
						delivery={currentDeliveryTask}
						onClose={handleCloseDetail}
						navigationMetadata={{
							deliveryStartLocation: previousDeliveryTaskLocation,
							taskRoute: currentDeliveryTaskRoute || [],
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
								Deliveriy Tasks
							</h3>
							<p className="text-sm text-gray-500">
								Click on any delivery to view detailed
								information and update its status
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
									No deliveries found
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
												setIsDetailViewOpen(true)
											}
											isSelected={isDetailViewOpen}
											isDisabled={
												allowSelectOnlyFirstTask &&
												delivery.id !==
													currentDeliveryTask?.id
											}
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
