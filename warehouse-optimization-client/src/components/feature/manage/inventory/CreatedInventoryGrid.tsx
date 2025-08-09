import { Item } from "@/types/item/type";
import moment from "moment";
import DataTable from "@/components/common/DataTable";
import { ToolScanInformation } from "@/types/common/type";

export default function CreatedInventoryGrid({
	items,
	isLoadingItems,
}: {
	items: Item[];
	isLoadingItems: boolean;
}) {
    
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

	return (
		<>
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
		</>
	);
}
