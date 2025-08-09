import { ItemUploadFormData } from "@/types/forms";
import { useCreateItemWithDeliveryTaskMutation } from "@/store/api/delivery";
import ExcelDataUploadWidget from "@/components/common/ExcelDataUploadWidget";

export default function UploadInventoryWidget({
	onSubmit,
}: {
	onSubmit: () => void;
}) {
	const [createItemWithDeliveryTask] =
		useCreateItemWithDeliveryTaskMutation();

	const handleSubmitItems = async (parsedData: ItemUploadFormData[]) => {
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

			onSubmit();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error(error);
		}
	};

	const EXPECTED_COLUMNS = [
		"name",
		"description",
		"delivery_type",
		"awb_id",
		"delivery_address",
		"expected_delivery_time",
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
		<div className="space-y-6">
			<ExcelDataUploadWidget
				templateNameKey="inventory_items"
				expectedUploadColumnNames={EXPECTED_COLUMNS}
				dataDisplayColumns={uploadColumns}
				onSubmit={handleSubmitItems}
			/>
		</div>
	);
}
