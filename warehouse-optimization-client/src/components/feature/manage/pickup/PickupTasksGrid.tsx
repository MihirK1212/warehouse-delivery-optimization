import DataTable from "@/components/common/DataTable";
import ItemsTooltip from "@/components/common/ItemsTooltip";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { DeliveryTask } from "@/types/delivery/type";
import { DeliveryInformation } from "@/types/common/type";
import { Item } from "@/types/item/type";
import { Rider } from "@/types/rider/type";
import { useDispatchPickupDeliveryTaskMutation } from "@/store/api/deliveryBatch";
import moment from "moment";
import { useState } from "react";
import _ from "lodash";

export default function PickupTasksGrid({
	tasks,
	isLoading,
}: {
	tasks: DeliveryTask[];
	isLoading: boolean;
}) {
	const [dispatchPickupDeliveryTask] =
		useDispatchPickupDeliveryTaskMutation();
	const [dispatchingTaskIds, setDispatchingTaskIds] = useState<Set<string>>(
		new Set()
	);

	const handleDispatch = async (deliveryTaskId: string) => {
		try {
			setDispatchingTaskIds((prev) => new Set(prev).add(deliveryTaskId));
			await dispatchPickupDeliveryTask({
				delivery_task_ids: [deliveryTaskId],
			}).unwrap();
		} catch (error) {
			console.error("Failed to dispatch pickup task:", error);
			// You could add a toast notification here for better UX
		} finally {
			setDispatchingTaskIds((prev) => {
				const newSet = new Set(prev);
				newSet.delete(deliveryTaskId);
				return newSet;
			});
		}
	};
	const pickupTaskColumns = [
		{
			key: "deliveryInformation" as keyof DeliveryTask,
			header: "AWB ID",
			render: (value: DeliveryTask[keyof DeliveryTask]) =>
				(value as DeliveryInformation)?.awbId || "N/A",
			sortable: true,
		},
		{
			key: "items" as keyof DeliveryTask,
			header: "Items",
			render: (value: DeliveryTask[keyof DeliveryTask]) => (
				<ItemsTooltip items={(value as Item[]) || []}>
					<span>{`${(value as Item[])?.length || 0} item(s)`}</span>
				</ItemsTooltip>
			),
		},
		{
			key: "deliveryInformation" as keyof DeliveryTask,
			header: "Delivery Address",
			render: (value: DeliveryTask[keyof DeliveryTask]) =>
				(value as DeliveryInformation)?.deliveryLocation?.address ||
				"N/A",
			width: "w-1/3",
		},
		{
			key: "deliveryInformation" as keyof DeliveryTask,
			header: "Expected Time",
			render: (value: DeliveryTask[keyof DeliveryTask]) =>
				(value as DeliveryInformation)?.expectedDeliveryTime
					? moment
							.utc(
								(value as DeliveryInformation)
									.expectedDeliveryTime
							)
							.local()
							.format("MMM DD, YYYY - HH:mm")
					: "N/A",
			sortable: true,
		},
		{
			key: "rider" as keyof DeliveryTask,
			header: "Assigned Rider",
			render: (value: DeliveryTask[keyof DeliveryTask]) =>
				(value as Rider)?.name || "Unassigned",
		},
		{
			key: "id" as keyof DeliveryTask,
			header: "Actions",
			render: (_value: unknown, row: DeliveryTask) => {
				const isDispatching = dispatchingTaskIds.has(row.id);
				const isDisabled =
					!_.isEmpty(dispatchingTaskIds) && !dispatchingTaskIds.has(row.id);
				return (
					<button
						onClick={() => handleDispatch(row.id)}
						disabled={isDisabled || isDispatching}
						className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isDispatching && (
							<LoadingSpinner size="sm" className="mr-2" />
						)}
						{isDispatching ? "Dispatching..." : "Dispatch"}
					</button>
				);
			},
		},
	];

	return (
		<div>
			<h3 className="text-lg font-medium text-gray-900 mb-4">
				Current Undispatched Pickup Tasks
			</h3>
			<DataTable
				data={tasks}
				columns={pickupTaskColumns}
				loading={isLoading}
				emptyMessage="No pickup tasks found. Add pickup items to get started."
			/>
		</div>
	);
}
