import ExcelDataUploadWidget from "@/components/common/ExcelDataUploadWidget";
import { PickupItemFormData } from "@/types/forms";
import { useCreateItemWithDeliveryTaskMutation } from "@/store/api/delivery";
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

export default function UploadPickupWidget({
	onSubmit,
}: {
	onSubmit: () => void;
}) {
	const [createItemWithDeliveryTask] =
		useCreateItemWithDeliveryTaskMutation();

	const EXPECTED_COLUMNS = [
		"name",
		"description",
		"volume",
		"weight",
		"expected_delivery_time",
		"awb_id",
		"pickup_address",
		"pickup_latitude",
		"pickup_longitude",
		"delivery_address",
		"delivery_latitude",
		"delivery_longitude",
	];

	const uploadColumns = [
		{ key: "name" as keyof PickupItemFormData, header: "Item Name" },
		{
			key: "description" as keyof PickupItemFormData,
			header: "Description",
		},
		{ key: "awb_id" as keyof PickupItemFormData, header: "AWB ID" },
		{
			key: "pickup_address" as keyof PickupItemFormData,
			header: "Pickup Address",
		},
		{
			key: "volume" as keyof PickupItemFormData,
			header: "Volume",
		},
		{
			key: "delivery_address" as keyof PickupItemFormData,
			header: "Delivery Address",
		},
		{
			key: "expected_delivery_time" as keyof PickupItemFormData,
			header: "Expected Time",
			render: (value: unknown) =>
				adjustEDDToTodayDate(moment.utc(value as string))
					.local()
					.format("MMM DD, YYYY - HH:mm"),
		},
	];

	const handleSubmitPickupItems = async (
		parsedData: PickupItemFormData[]
	) => {
		try {
			const promises = parsedData.map((pickupTaskData) =>
				createItemWithDeliveryTask({
					item: {
						name: pickupTaskData.name,
						description: pickupTaskData.description,
						tool_scan_information: {
							weight: pickupTaskData.weight,
							volume: pickupTaskData.volume,
							timestamp: moment.utc().toISOString(),
						},
						item_location: {
							address: pickupTaskData.pickup_address,
							coordinate: {
								latitude: pickupTaskData.pickup_latitude,
								longitude: pickupTaskData.pickup_longitude,
							},
						},
					},
					delivery_information: {
						expected_delivery_time: adjustEDDToTodayDate(
							moment.utc(pickupTaskData.expected_delivery_time)
						).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
						delivery_type: "pickup",
						awb_id: pickupTaskData.awb_id,
						delivery_location: {
							address: pickupTaskData.delivery_address,
							coordinate: {
								latitude: pickupTaskData.delivery_latitude,
								longitude: pickupTaskData.delivery_longitude,
							},
						},
					},
				})
			);

			await Promise.all(promises);

			onSubmit();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<ExcelDataUploadWidget
			templateNameKey="pickup_items"
			expectedUploadColumnNames={EXPECTED_COLUMNS}
			dataDisplayColumns={uploadColumns}
			onSubmit={handleSubmitPickupItems}
		/>
	);
}
