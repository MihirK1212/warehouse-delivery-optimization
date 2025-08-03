'use client';

import { useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useGetUndispatchedDeliveryTasksQuery, useDispatchDeliveryTasksMutation } from '@/store/api/delivery';
import { useGetRidersQuery } from '@/store/api/rider';
import { DeliveryTask } from '@/types/delivery/type';
import { Rider } from '@/types/rider/type';
import { DeliveryInformation } from '@/types/common/type';
import { Item } from '@/types/item/type';
import ItemsTooltip from '@/components/shared/ItemsTooltip';

export default function DispatchDeliveriesPage() {
  const [selectedDeliveries, setSelectedDeliveries] = useState<DeliveryTask[]>([]);
  const [selectedRiders, setSelectedRiders] = useState<Rider[]>([]);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { data: undispatchedTasks = [], isLoading: isLoadingTasks, refetch: refetchTasks } = useGetUndispatchedDeliveryTasksQuery();
  const { data: riders = [], isLoading: isLoadingRiders } = useGetRidersQuery();
  const [dispatchDeliveryTasks] = useDispatchDeliveryTasksMutation();

  const handleDispatch = async () => {
    if (selectedDeliveries.length === 0 || selectedRiders.length === 0) {
      setDispatchStatus({
        type: 'error',
        message: 'Please select both deliveries and riders to dispatch.'
      });
      return;
    }

    setIsDispatching(true);
    setDispatchStatus(null);

    try {
      await dispatchDeliveryTasks({
        delivery_task_ids: selectedDeliveries.map(task => task.id),
        rider_ids: selectedRiders.map(rider => rider.id)
      }).unwrap();

      setDispatchStatus({
        type: 'success',
        message: `Successfully dispatched ${selectedDeliveries.length} deliveries to ${selectedRiders.length} riders!`
      });

      // Close modal after a short delay
      setTimeout(() => {
        setSelectedDeliveries([]);
        setSelectedRiders([]);
        refetchTasks();

        setIsDispatchModalOpen(false);
        setDispatchStatus(null);

        setIsDispatching(false);
      }, 2000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setDispatchStatus({
        type: 'error',
        message: error?.data?.detail || 'Failed to dispatch deliveries. Please try again.'
      });
      setIsDispatching(false);
    } 
  };

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
          {value as string}
        </span>
      )
    }
  ];

  const riderColumns = [
    {
      key: 'name' as keyof Rider,
      header: 'Name',
      sortable: true
    },
    {
      key: 'bagVolume' as keyof Rider,
      header: 'Bag Volume',
      render: (value: Rider[keyof Rider]) => `${value} L`,
      sortable: true
    },
    {
      key: 'phoneNumber' as keyof Rider,
      header: 'Phone',
      sortable: true
    }
  ];

  const totalVolume = selectedDeliveries.reduce((total, task) => {
    return total + (task.items?.reduce((itemTotal, item) => {
      return itemTotal + (item.toolScanInformation?.volume || 0);
    }, 0) || 0);
  }, 0);

  const totalRiderCapacity = selectedRiders.reduce((total, rider) => total + rider.bagVolume, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dispatch Deliveries</h2>
          <p className="text-gray-600 mt-1">
            Select undispatched delivery tasks and assign them to available riders.
          </p>
        </div>
        <button
          onClick={() => setIsDispatchModalOpen(true)}
          disabled={selectedDeliveries.length === 0}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Dispatch Selected ({selectedDeliveries.length})
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Dispatch</p>
              <p className="text-2xl font-semibold text-gray-900">{undispatchedTasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Selected Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{selectedDeliveries.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Riders</p>
              <p className="text-2xl font-semibold text-gray-900">{riders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Volume</p>
              <p className="text-2xl font-semibold text-gray-900">{totalVolume.toFixed(1)}L</p>
            </div>
          </div>
        </div>
      </div>

      {/* Undispatched Deliveries Table */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Undispatched Delivery Tasks</h3>
        <DataTable
          data={undispatchedTasks}
          columns={deliveryColumns}
          loading={isLoadingTasks}
          selectable={true}
          onRowSelect={setSelectedDeliveries}
          selectedItems={selectedDeliveries}
          emptyMessage="No undispatched deliveries found."
        />
      </div>

      {/* Dispatch Modal */}
      <Modal
        isOpen={isDispatchModalOpen}
        onClose={() => {
          setIsDispatchModalOpen(false);
          setDispatchStatus(null);
        }}
        title="Dispatch Deliveries"
        size="xl"
      >
        <div className="space-y-6">
          {dispatchStatus && (
            <Alert type={dispatchStatus.type}>
              {dispatchStatus.message}
            </Alert>
          )}

          {/* Selected Deliveries Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Selected Deliveries ({selectedDeliveries.length})</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <span className="font-medium">Total Items:</span> {selectedDeliveries.reduce((total, task) => total + (task.items?.length || 0), 0)}
              </div>
              <div>
                <span className="font-medium">Total Volume:</span> {totalVolume.toFixed(1)}L
              </div>
              <div>
                <span className="font-medium">Delivery Types:</span> {[...new Set(selectedDeliveries.map(task => task.deliveryInformation?.deliveryType))].join(', ')}
              </div>
            </div>
          </div>

          {/* Rider Selection */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Select Riders</h4>
            <DataTable
              data={riders}
              columns={riderColumns}
              loading={isLoadingRiders}
              selectable={true}
              onRowSelect={setSelectedRiders}
              selectedItems={selectedRiders}
              emptyMessage="No riders available."
            />
          </div>

          {/* Capacity Check */}
          {selectedRiders.length > 0 && (
            <div className={`rounded-lg p-4 ${totalRiderCapacity >= totalVolume ? 'bg-green-50' : 'bg-red-50'}`}>
              <h5 className={`font-medium mb-2 ${totalRiderCapacity >= totalVolume ? 'text-green-900' : 'text-red-900'}`}>
                Capacity Check
              </h5>
              <div className={`text-sm ${totalRiderCapacity >= totalVolume ? 'text-green-800' : 'text-red-800'}`}>
                <div>Selected Riders Capacity: {totalRiderCapacity}L</div>
                <div>Required Volume: {totalVolume.toFixed(1)}L</div>
                <div className="font-medium mt-1">
                  {totalRiderCapacity >= totalVolume 
                    ? '✅ Sufficient capacity' 
                    : '⚠️ Insufficient capacity - consider selecting more riders'
                  }
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsDispatchModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isDispatching}
            >
              Cancel
            </button>
            <button
              onClick={handleDispatch}
              disabled={isDispatching || selectedDeliveries.length === 0 || selectedRiders.length === 0}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDispatching && <LoadingSpinner size="sm" className="mr-2" />}
              {isDispatching ? 'Dispatching...' : 'Dispatch Deliveries'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}