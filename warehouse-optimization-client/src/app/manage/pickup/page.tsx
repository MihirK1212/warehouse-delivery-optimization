'use client';

import { useState } from 'react';
import ExcelUpload from '@/components/ui/ExcelUpload';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useGetAllDeliveryTasksQuery, useAddDynamicPickupDeliveryTasksMutation } from '@/store/api/delivery';
import { PickupItemFormData } from '@/types/forms';
import { DeliveryTask } from '@/types/delivery/type';
import { DeliveryInformation } from '@/types/common/type';
import { Item } from '@/types/item/type';
import { Rider } from '@/types/rider/type';
import ItemsTooltip from '@/components/shared/ItemsTooltip';

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

export default function AddPickupItemsPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [parsedData, setParsedData] = useState<PickupItemFormData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { data: allTasks = [], isLoading: isLoadingTasks, refetch: refetchTasks } = useGetAllDeliveryTasksQuery();
  const [addDynamicPickupDeliveryTasks] = useAddDynamicPickupDeliveryTasksMutation();

  // Filter pickup tasks
  const pickupTasks = allTasks.filter(task => task.deliveryInformation?.deliveryType === 'pickup');

  const handleDataParsed = (data: PickupItemFormData[]) => {
    setParsedData(data);
    setSubmitStatus(null);
  };

  const handleSubmitPickupItems = async () => {
    if (parsedData.length === 0) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
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
      
      setSubmitStatus({
        type: 'success',
        message: `Successfully added ${parsedData.length} pickup items!`
      });
      
      setParsedData([]);
      refetchTasks();
      
      // Close modal after a short delay
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setSubmitStatus(null);
      }, 2000);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setSubmitStatus({
        type: 'error',
        message: error?.data?.detail || 'Failed to create pickup items. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const uploadColumns = [
    { key: 'name' as keyof PickupItemFormData, header: 'Item Name' },
    { key: 'description' as keyof PickupItemFormData, header: 'Description' },
    { key: 'awb_id' as keyof PickupItemFormData, header: 'AWB ID' },
    { key: 'pickup_address' as keyof PickupItemFormData, header: 'Pickup Address' },
    { key: 'delivery_address' as keyof PickupItemFormData, header: 'Delivery Address' },
    {
      key: 'expected_delivery_time' as keyof PickupItemFormData,
      header: 'Expected Time',
      render: (value: PickupItemFormData[keyof PickupItemFormData]) => new Date(value).toLocaleDateString()
    }
  ];

  const undispatchedPickups = pickupTasks.filter(task => task.status === 'undispatched').length;
  const inProgressPickups = pickupTasks.filter(task => task.status === 'in_progress').length;
  const completedPickups = pickupTasks.filter(task => task.status === 'completed').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add Pickup Items</h2>
          <p className="text-gray-600 mt-1">
            Add dynamic pickup tasks for items that need to be collected from various locations and delivered to customers.
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Pickup Items
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pickups</p>
              <p className="text-2xl font-semibold text-gray-900">{pickupTasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{undispatchedPickups}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{inProgressPickups}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{completedPickups}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pickup Items Info */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">About Pickup Items</h3>
        <div className="text-blue-800 space-y-2">
          <p>• Pickup items are collected from various external locations (not from the warehouse)</p>
          <p>• Each pickup item requires both a pickup location and a final delivery destination</p>
          <p>• Riders will first go to the pickup location, collect the item, then deliver it to the customer</p>
          <p>• These are different from regular warehouse items that are already available in the warehouse</p>
        </div>
      </div>

      {/* Pickup Tasks Table */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Pickup Tasks</h3>
        <DataTable
          data={pickupTasks}
          columns={pickupTaskColumns}
          loading={isLoadingTasks}
          emptyMessage="No pickup tasks found. Add pickup items to get started."
        />
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setParsedData([]);
          setSubmitStatus(null);
        }}
        title="Upload Pickup Items"
        size="xl"
      >
        <div className="space-y-6">
          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="font-medium text-orange-900 mb-2">Pickup Items Requirements</h4>
            <ul className="text-orange-800 text-sm space-y-1">
              <li>• Each item needs both pickup and delivery coordinates</li>
              <li>• Pickup address is where the item will be collected from</li>
              <li>• Delivery address is the final destination for the customer</li>
              <li>• Include accurate latitude/longitude for both locations</li>
            </ul>
          </div>

          <ExcelUpload
            onDataParsed={handleDataParsed}
            expectedColumns={EXPECTED_COLUMNS}
            templateName="pickup_items"
          />

          {submitStatus && (
            <Alert type={submitStatus.type}>
              {submitStatus.message}
            </Alert>
          )}

          {parsedData.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">
                Preview ({parsedData.length} pickup items)
              </h4>
              
              <DataTable
                data={parsedData}
                columns={uploadColumns}
                className="max-h-64 overflow-y-auto"
              />

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setParsedData([])}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={isSubmitting}
                >
                  Clear
                </button>
                <button
                  onClick={handleSubmitPickupItems}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
                  {isSubmitting ? 'Creating Pickup Tasks...' : 'Create Pickup Tasks'}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}