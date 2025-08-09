import ExcelDataUploadWidget from "@/components/common/ExcelDataUploadWidget";
import { RiderUploadFormData } from "@/types/forms";
import { useCreateRidersMutation } from "@/store/api/rider";

export default function UploadRidersWidget({ onSubmit }: { onSubmit: () => void }) {
  const [createRiders] = useCreateRidersMutation();

  const EXPECTED_COLUMNS = ["name", "age", "bag_volume", "phone_number"];

  const uploadColumns = [
    { key: "name" as keyof RiderUploadFormData, header: "Name" },
    { key: "age" as keyof RiderUploadFormData, header: "Age" },
    {
      key: "bag_volume" as keyof RiderUploadFormData,
      header: "Bag Volume",
      render: (value: RiderUploadFormData[keyof RiderUploadFormData]) => `${value} L`,
    },
    { key: "phone_number" as keyof RiderUploadFormData, header: "Phone Number" },
  ];

  const handleSubmitRiders = async (parsedData: RiderUploadFormData[]) => {
    await createRiders(parsedData).unwrap();
    onSubmit();
  };

  return (
    <ExcelDataUploadWidget
      templateNameKey="delivery_riders"
      expectedUploadColumnNames={EXPECTED_COLUMNS}
      dataDisplayColumns={uploadColumns}
      onSubmit={handleSubmitRiders}
    />
  );
}


