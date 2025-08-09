import ExcelDataUploadWidget from "@/components/common/ExcelDataUploadWidget";
import { PickupItemFormData } from "@/types/forms";
import { useAddDynamicPickupDeliveryTasksMutation } from "@/store/api/delivery";

export default function UploadPickupWidget({ onSubmit }: { onSubmit: () => void }) {
  const [addDynamicPickupDeliveryTasks] = useAddDynamicPickupDeliveryTasksMutation();

  const EXPECTED_COLUMNS = [
    'name',
    'description',
    'expected_delivery_time',
    'awb_id',
    'pickup_address',
    'pickup_latitude',
    'pickup_longitude',
    'delivery_address',
    'delivery_latitude',
    'delivery_longitude'
  ];

  const uploadColumns = [
    { key: 'name' as keyof PickupItemFormData, header: 'Item Name' },
    { key: 'description' as keyof PickupItemFormData, header: 'Description' },
    { key: 'awb_id' as keyof PickupItemFormData, header: 'AWB ID' },
    { key: 'pickup_address' as keyof PickupItemFormData, header: 'Pickup Address' },
    { key: 'delivery_address' as keyof PickupItemFormData, header: 'Delivery Address' },
    {
      key: 'expected_delivery_time' as keyof PickupItemFormData,
      header: 'Expected Time',
      render: (value: PickupItemFormData[keyof PickupItemFormData]) => new Date(value as string).toLocaleDateString()
    }
  ];

  const handleSubmitPickupItems = async (parsedData: PickupItemFormData[]) => {
    await addDynamicPickupDeliveryTasks(parsedData.map((pickupTaskData) => ({
      item: {
        name: pickupTaskData.name,
        description: pickupTaskData.description,
        tool_scan_information: {
          weight: 0,
          volume: 0,
          timestamp: new Date().toISOString(),
        },
        item_location: {
          address: pickupTaskData.pickup_address,
          coordinate: {
            latitude: pickupTaskData.pickup_latitude,
            longitude: pickupTaskData.pickup_longitude,
          }
        }
      },
      delivery_information: {
        expected_delivery_time: pickupTaskData.expected_delivery_time,
        delivery_type: 'pickup',
        awb_id: pickupTaskData.awb_id,
        delivery_location: {
          address: pickupTaskData.delivery_address,
          coordinate: {
            latitude: pickupTaskData.delivery_latitude,
            longitude: pickupTaskData.delivery_longitude,
          }
        }
      }
    }))).unwrap();

    onSubmit();
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


