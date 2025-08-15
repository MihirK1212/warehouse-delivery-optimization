import { ItemUploadFormData } from "@/types/forms";
import { useCreateItemWithDeliveryTaskMutation } from "@/store/api/delivery";
import ExcelDataUploadWidget from "@/components/common/ExcelDataUploadWidget";
import moment from "moment";

// TODO: This is a temporary fix to adjust the expected delivery date to today's date.
// ideally this should be corrected while uploading the excel file
const adjustEDDToTodayDate = (edd: moment.Moment): moment.Moment => {
	const today = moment().utc();
	const adjustedEDD = moment.utc({
		year: today.year(),
		month: today.month(),
		date: today.date(),
		hour: edd.hour(),
		minute: edd.minute(),
		second: edd.second(),
		millisecond: edd.millisecond(),
	});
	return adjustedEDD;
};

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
						expected_delivery_time: adjustEDDToTodayDate(
							moment.utc(item.expected_delivery_time)
						).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
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
		"delivery_latitude",
		"delivery_longitude",
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
				adjustEDDToTodayDate(moment.utc(value as string))
					.local()
					.format("MMM DD, YYYY - HH:mm"),
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
