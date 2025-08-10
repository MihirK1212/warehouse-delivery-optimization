import { useState } from "react";
import Alert from "@/components/common/Alert";
import DataTable from "@/components/common/DataTable";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { DeliveryTask } from "@/types/delivery/type";
import { Rider } from "@/types/rider/type";
import { useDispatchDeliveryTasksMutation } from "@/store/api/deliveryBatch";
import type { Item } from "@/types/item/type";

export default function DispatchModal({
	deliveries,
	availableRiders,
	onDispatched,
	onCancel,
}: {
	deliveries: DeliveryTask[];
	availableRiders: Rider[];
	onDispatched: () => void;
	onCancel: () => void;
}) {
	const [dispatchDeliveryTasks, { isLoading: isDispatching }] =
		useDispatchDeliveryTasksMutation();

	const [dispatchStatus, setDispatchStatus] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);
	const [selectedRiders, setSelectedRiders] = useState<Rider[]>([]);

	const riderColumns = [
		{ key: "name" as keyof Rider, header: "Name", sortable: true },
		{
			key: "bagVolume" as keyof Rider,
			header: "Bag Volume",
			render: (value: Rider[keyof Rider]) => `${value} L`,
			sortable: true,
		},
		{ key: "phoneNumber" as keyof Rider, header: "Phone", sortable: true },
	];

	const totalVolume = deliveries.reduce<number>((total, task) => {
		return (
			total +
			(task.items?.reduce<number>((itemTotal, item: Item) => {
				return itemTotal + (item.toolScanInformation?.volume || 0);
			}, 0) || 0)
		);
	}, 0);

	const totalRiderCapacity = selectedRiders.reduce<number>(
		(total, rider: Rider) => total + rider.bagVolume,
		0
	);

	const handleDispatch = async () => {
		if (deliveries.length === 0 || selectedRiders.length === 0) {
			setDispatchStatus({
				type: "error",
				message:
					"Please select both deliveries and riders to dispatch.",
			});
			return;
		}

		setDispatchStatus(null);
		try {
			await dispatchDeliveryTasks({
				delivery_task_ids: deliveries.map((task) => task.id),
				rider_ids: selectedRiders.map((rider) => rider.id),
			}).unwrap();

			setDispatchStatus({
				type: "success",
				message: `Successfully dispatched ${deliveries.length} deliveries to ${selectedRiders.length} riders!`,
			});
			setTimeout(() => {
				onDispatched();
				setDispatchStatus(null);
			}, 1500);
		} catch (error: unknown) {
			const detail = (error as { data?: { detail?: string } })?.data
				?.detail;
			setDispatchStatus({
				type: "error",
				message:
					detail ||
					"Failed to dispatch deliveries. Please try again.",
			});
		}
	};

	return (
		<div>
			<div className="space-y-6">
				{dispatchStatus && (
					<Alert type={dispatchStatus.type}>
						{dispatchStatus.message}
					</Alert>
				)}

				<div className="bg-blue-50 rounded-lg p-4">
					<h4 className="font-medium text-blue-900 mb-2">
						Selected Deliveries ({deliveries.length})
					</h4>
					<div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
						<div>
							<span className="font-medium">Total Items:</span>{" "}
							{deliveries.reduce(
								(total, task) =>
									total + (task.items?.length || 0),
								0
							)}
						</div>
						<div>
							<span className="font-medium">Total Volume:</span>{" "}
							{totalVolume.toFixed(1)}L
						</div>
						<div>
							<span className="font-medium">Delivery Types:</span>{" "}
							{[
								...new Set(
									deliveries.map(
										(task) =>
											task.deliveryInformation
												?.deliveryType
									)
								),
							].join(", ")}
						</div>
					</div>
				</div>

				<div>
					<h4 className="text-lg font-medium text-gray-900 mb-4">
						Select Riders
					</h4>
					<DataTable
						data={availableRiders}
						columns={riderColumns}
						loading={false}
						selectable={true}
						onRowSelect={setSelectedRiders}
						selectedItems={selectedRiders}
						emptyMessage="No riders available."
					/>
				</div>

				{selectedRiders.length > 0 && (
					<div
						className={`rounded-lg p-4 ${
							totalRiderCapacity >= totalVolume
								? "bg-green-50"
								: "bg-red-50"
						}`}
					>
						<h5
							className={`font-medium mb-2 ${
								totalRiderCapacity >= totalVolume
									? "text-green-900"
									: "text-red-900"
							}`}
						>
							Capacity Check
						</h5>
						<div
							className={`text-sm ${
								totalRiderCapacity >= totalVolume
									? "text-green-800"
									: "text-red-800"
							}`}
						>
							<div>
								Selected Riders Capacity: {totalRiderCapacity}L
							</div>
							<div>
								Required Volume: {totalVolume.toFixed(1)}L
							</div>
							<div className="font-medium mt-1">
								{totalRiderCapacity >= totalVolume
									? "✅ Sufficient capacity"
									: "⚠️ Insufficient capacity - consider selecting more riders"}
							</div>
						</div>
					</div>
				)}

				<div className="flex justify-end space-x-3">
					<button
						onClick={onCancel}
						className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
						disabled={isDispatching}
					>
						Cancel
					</button>
					<button
						onClick={handleDispatch}
						disabled={
							isDispatching ||
							deliveries.length === 0 ||
							selectedRiders.length === 0
						}
						className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isDispatching && (
							<LoadingSpinner size="sm" className="mr-2" />
						)}
						{isDispatching
							? "Dispatching..."
							: "Dispatch Deliveries"}
					</button>
				</div>
			</div>
		</div>
	);
}
