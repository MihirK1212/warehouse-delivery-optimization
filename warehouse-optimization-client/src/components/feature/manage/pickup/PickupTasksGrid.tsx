import DataTable from "@/components/common/DataTable";
import ItemsTooltip from "@/components/common/ItemsTooltip";
import { DeliveryTask } from "@/types/delivery/type";
import { DeliveryInformation } from "@/types/common/type";
import { Item } from "@/types/item/type";
import { Rider } from "@/types/rider/type";

export default function PickupTasksGrid({ tasks, isLoading }: { tasks: DeliveryTask[]; isLoading: boolean }) {
  const pickupTaskColumns = [
    {
      key: 'deliveryInformation' as keyof DeliveryTask,
      header: 'AWB ID',
      render: (value: DeliveryTask[keyof DeliveryTask]) => (value as DeliveryInformation)?.awbId || 'N/A',
      sortable: true
    },
    {
      key: 'items' as keyof DeliveryTask,
      header: 'Items',
      render: (value: DeliveryTask[keyof DeliveryTask]) => (
        <ItemsTooltip items={(value as Item[]) || []}>
          <span>{`${(value as Item[])?.length || 0} item(s)`}</span>
        </ItemsTooltip>
      )
    },
    {
      key: 'deliveryInformation' as keyof DeliveryTask,
      header: 'Pickup Address',
      render: (value: DeliveryTask[keyof DeliveryTask]) => (value as DeliveryInformation)?.deliveryLocation?.address || 'N/A',
      width: 'w-1/3'
    },
    {
      key: 'deliveryInformation' as keyof DeliveryTask,
      header: 'Expected Time',
      render: (value: DeliveryTask[keyof DeliveryTask]) => (value as DeliveryInformation)?.expectedDeliveryTime ? new Date((value as DeliveryInformation).expectedDeliveryTime).toLocaleDateString() : 'N/A',
      sortable: true
    },
    {
      key: 'status' as keyof DeliveryTask,
      header: 'Status',
      render: (value: DeliveryTask[keyof DeliveryTask]) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'undispatched' ? 'bg-yellow-100 text-yellow-800' :
          value === 'dispatched' ? 'bg-blue-100 text-blue-800' :
          value === 'in_progress' ? 'bg-purple-100 text-purple-800' :
          value === 'completed' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value as string}
        </span>
      )
    },
    {
      key: 'rider' as keyof DeliveryTask,
      header: 'Assigned Rider',
      render: (value: DeliveryTask[keyof DeliveryTask]) => (value as Rider)?.name || 'Unassigned'
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Current Pickup Tasks</h3>
      <DataTable
        data={tasks}
        columns={pickupTaskColumns}
        loading={isLoading}
        emptyMessage="No pickup tasks found. Add pickup items to get started."
      />
    </div>
  );
}


