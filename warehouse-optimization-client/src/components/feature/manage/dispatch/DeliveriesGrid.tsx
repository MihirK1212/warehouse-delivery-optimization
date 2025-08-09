import DataTable from "@/components/common/DataTable";
import ItemsTooltip from "@/components/common/ItemsTooltip";
import { DeliveryTask } from "@/types/delivery/type";
import { DeliveryInformation } from "@/types/common/type";
import { Item } from "@/types/item/type";
import { DeliveryStatus } from "@/types/deliveryStatus";

export default function DeliveriesGrid({
  tasks,
  isLoading,
  selectedDeliveries,
  onSelect,
}: {
  tasks: DeliveryTask[];
  isLoading: boolean;
  selectedDeliveries: DeliveryTask[];
  onSelect: (selected: DeliveryTask[]) => void;
}) {
  const deliveryColumns = [
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
      header: 'Delivery Type',
      render: (value: DeliveryTask[keyof DeliveryTask]) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          (value as DeliveryInformation)?.deliveryType === 'pickup' 
            ? 'bg-orange-100 text-orange-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {(value as DeliveryInformation)?.deliveryType || 'N/A'}
        </span>
      )
    },
    {
      key: 'deliveryInformation' as keyof DeliveryTask,
      header: 'Address',
      render: (value: DeliveryTask[keyof DeliveryTask]) => (value as DeliveryInformation)?.deliveryLocation?.address || 'N/A',
      width: 'w-1/3'
    },
    {
      key: 'deliveryInformation' as keyof DeliveryTask,
      header: 'Expected Delivery',
      render: (value: DeliveryTask[keyof DeliveryTask]) => (value as DeliveryInformation)?.expectedDeliveryTime ? new Date((value as DeliveryInformation).expectedDeliveryTime).toLocaleDateString() : 'N/A',
      sortable: true
    },
    {
      key: 'status' as keyof DeliveryTask,
      header: 'Status',
      render: (value: DeliveryTask[keyof DeliveryTask]) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          {(value as DeliveryStatus).name}
        </span>
      )
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Undispatched Delivery Tasks</h3>
      <DataTable
        data={tasks}
        columns={deliveryColumns}
        loading={isLoading}
        selectable={true}
        onRowSelect={onSelect}
        selectedItems={selectedDeliveries}
        emptyMessage="No undispatched deliveries found."
      />
    </div>
  );
}


