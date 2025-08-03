"use client";

import { useState } from "react";
import ExcelUpload from "@/components/ui/ExcelUpload";
import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import Alert from "@/components/ui/Alert";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useGetItemsQuery } from "@/store/api/item";
import { ItemUploadFormData } from "@/types/forms";
import { Item } from "@/types/item/type";
import { useCreateItemWithDeliveryTaskMutation } from "@/store/api/delivery";
import { ToolScanInformation } from "@/types/common/type";
import moment from "moment";

const EXPECTED_COLUMNS = [
	"name",
	"description",
	"expected_delivery_time",
	"delivery_type",
	"awb_id",
	"delivery_address",
	"delivery_latitude",
	"delivery_longitude",
];

export default function ManageInventoryPage() {
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [parsedData, setParsedData] = useState<ItemUploadFormData[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	const {
		data: items = [],
		isLoading: isLoadingItems,
		refetch: refetchItems,
	} = useGetItemsQuery();
	const [createItemWithDeliveryTask] =
		useCreateItemWithDeliveryTaskMutation();

	const handleDataParsed = (data: ItemUploadFormData[]) => {
		setParsedData(data);
		setSubmitStatus(null);
	};

	const handleSubmitItems = async () => {
		if (parsedData.length === 0) return;

		setIsSubmitting(true);
		setSubmitStatus(null);

		try {
			const promises = parsedData.map((item) =>
				createItemWithDeliveryTask({
					item: {
						name: item.name,
						description: item.description,
					},
					delivery_information: {
						expected_delivery_time: item.expected_delivery_time,
						delivery_type: item.delivery_type,
						awb_id: item.awb_id,
						delivery_location: {
							address: item.delivery_address,
							coordinate: {
								latitude: item.delivery_latitude,
								longitude: item.delivery_longitude,
							},
						},
					},
				}).unwrap()
			);

			await Promise.all(promises);

			setSubmitStatus({
				type: "success",
				message: `Successfully added ${parsedData.length} items with delivery tasks!`,
			});

			setParsedData([]);
			refetchItems();

			// Close modal after a short delay
			setTimeout(() => {
				setIsUploadModalOpen(false);
				setSubmitStatus(null);
			}, 2000);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			setSubmitStatus({
				type: "error",
				message:
					error?.data?.detail ||
					"Failed to create items. Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const itemColumns = [
		{
			key: "name" as keyof Item,
			header: "Name",
			sortable: true,
		},
		{
			key: "description" as keyof Item,
			header: "Description",
			sortable: true,
		},
		{
			key: "toolScanInformation" as keyof Item,
			header: "Scan Status",
			render: (value: Item[keyof Item]) => (
				<span
					className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
						value
							? "bg-green-100 text-green-800"
							: "bg-yellow-100 text-yellow-800"
					}`}
				>
					{value ? "Scanned" : "Unscanned"}
				</span>
			),
		},
		{
			key: "toolScanInformation" as keyof Item,
			header: "Weight",
			render: (value: Item[keyof Item]) => {
				const scanInfo = value as ToolScanInformation | undefined;
				return scanInfo ? `${scanInfo.weight} kg` : "Not scanned";
			},
		},
		{
			key: "toolScanInformation" as keyof Item,
			header: "Volume",
			render: (value: Item[keyof Item]) => {
				const scanInfo = value as ToolScanInformation | undefined;
				return scanInfo ? `${scanInfo.volume} L` : "Not scanned";
			},
		},
		{
			key: "timestampCreated" as keyof Item,
			header: "Created",
			render: (value: Item[keyof Item]) => {
				const timestamp = value as moment.Moment;
				return moment(timestamp).format("DD/MM/YYYY HH:mm") || "N/A";
			},
			sortable: true,
		},
	];

	const uploadColumns = [
		{ key: "name" as keyof ItemUploadFormData, header: "Item Name" },
		{
			key: "description" as keyof ItemUploadFormData,
			header: "Description",
		},
		{ key: "delivery_type" as keyof ItemUploadFormData, header: "Type" },
		{ key: "awb_id" as keyof ItemUploadFormData, header: "AWB ID" },
		{
			key: "delivery_address" as keyof ItemUploadFormData,
			header: "Delivery Address",
		},
		{
			key: "expected_delivery_time" as keyof ItemUploadFormData,
			header: "Expected Delivery",
			render: (value: unknown) =>
				new Date(value as string).toLocaleDateString(),
		},
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-2xl font-bold text-gray-900">
						Manage Inventory
					</h2>
					<p className="text-gray-600 mt-1">
						Upload items with delivery details. Each item will be
						automatically wrapped in a delivery task.
					</p>
				</div>
				<button
					onClick={() => setIsUploadModalOpen(true)}
					className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
				>
					<svg
						className="w-5 h-5 mr-2"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						/>
					</svg>
					Add Items
				</button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center">
						<div className="p-2 bg-blue-100 rounded-lg">
							<svg
								className="w-8 h-8 text-blue-600"
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
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600">
								Total Items
							</p>
							<p className="text-2xl font-semibold text-gray-900">
								{items.length}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center">
						<div className="p-2 bg-green-100 rounded-lg">
							<svg
								className="w-8 h-8 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600">
								Scanned Items
							</p>
							<p className="text-2xl font-semibold text-gray-900">
								{
									items.filter(
										(item) => item.toolScanInformation
									).length
								}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center">
						<div className="p-2 bg-yellow-100 rounded-lg">
							<svg
								className="w-8 h-8 text-yellow-600"
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
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600">
								Pending Scan
							</p>
							<p className="text-2xl font-semibold text-gray-900">
								{
									items.filter(
										(item) => !item.toolScanInformation
									).length
								}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Items Table */}
			<div>
				<h3 className="text-lg font-medium text-gray-900 mb-4">
					Current Inventory
				</h3>
				<DataTable
					data={items}
					columns={itemColumns}
					loading={isLoadingItems}
					emptyMessage="No items in inventory. Upload items to get started."
				/>
			</div>

			{/* Upload Modal */}
			<Modal
				isOpen={isUploadModalOpen}
				onClose={() => {
					setIsUploadModalOpen(false);
					setParsedData([]);
					setSubmitStatus(null);
				}}
				title="Upload Items with Delivery Details"
				size="xl"
			>
				<div className="space-y-6">
					<ExcelUpload
						onDataParsed={handleDataParsed}
						expectedColumns={EXPECTED_COLUMNS}
						templateName="inventory_items"
					/>

					{submitStatus && (
						<Alert type={submitStatus.type}>
							{submitStatus.message}
						</Alert>
					)}

					{parsedData.length > 0 && (
						<div className="space-y-4">
							<h4 className="text-lg font-medium text-gray-900">
								Preview ({parsedData.length} items)
							</h4>

							<DataTable
								data={parsedData}
								columns={uploadColumns}
								className="max-h-64 overflow-y-auto"
							/>

							<div className="flex justify-end space-x-3">
								<button
									onClick={() => setParsedData([])}
									className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
									disabled={isSubmitting}
								>
									Clear
								</button>
								<button
									onClick={handleSubmitItems}
									disabled={isSubmitting}
									className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isSubmitting && (
										<LoadingSpinner
											size="sm"
											className="mr-2"
										/>
									)}
									{isSubmitting
										? "Creating Items..."
										: "Create Items & Delivery Tasks"}
								</button>
							</div>
						</div>
					)}
				</div>
			</Modal>
		</div>
	);
}
