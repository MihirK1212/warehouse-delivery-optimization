import DataTable from "@/components/common/DataTable";
import { Rider } from "@/types/rider/type";

export default function CurrentRidersGrid({
  riders,
  isLoading,
  onDelete,
}: {
  riders: Rider[];
  isLoading: boolean;
  onDelete: (riderId: string) => void;
}) {
  const riderColumns = [
    { key: "name" as keyof Rider, header: "Name", sortable: true },
    { key: "age" as keyof Rider, header: "Age", sortable: true },
    {
      key: "bagVolume" as keyof Rider,
      header: "Bag Volume (L)",
      sortable: true,
      render: (value: Rider[keyof Rider]) => `${value} L`,
    },
    { key: "phoneNumber" as keyof Rider, header: "Phone Number", sortable: true },
    {
      key: "id" as keyof Rider,
      header: "Actions",
      render: (_value: unknown, row: Rider) => (
        <button
          onClick={() => onDelete(row.id)}
          className="text-red-600 hover:text-red-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Current Riders</h3>
      <DataTable
        data={riders}
        columns={riderColumns}
        loading={isLoading}
        emptyMessage="No riders found. Upload riders to get started."
      />
    </div>
  );
}


