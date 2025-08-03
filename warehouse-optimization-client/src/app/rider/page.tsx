'use client';

import DataTable from '@/components/ui/DataTable';
import { useGetAllDeliveryTasksQuery } from '@/store/api/delivery';
import { DeliveryTask } from '@/types/delivery/type';

export default function RiderPage() {
  const { data: allTasks = [], isLoading: isLoadingTasks } = useGetAllDeliveryTasksQuery();

  // Filter tasks that are assigned to riders
  const assignedTasks = allTasks.filter(task => task.rider);
  const inProgressTasks = assignedTasks.filter(task => task.status === 'in_progress');
  const completedTasks = assignedTasks.filter(task => task.status === 'completed');
  const dispatchedTasks = assignedTasks.filter(task => task.status === 'dispatched');

  const taskColumns = [
    {
      key: 'deliveryInformation' as keyof DeliveryTask,
      header: 'AWB ID',
      render: (value: any) => value?.awbId || 'N/A',
      sortable: true
    },
    {
      key: 'items' as keyof DeliveryTask,
      header: 'Items',
      render: (value: any) => `${value?.length || 0} item(s)`
    },
    {
      key: 'deliveryInformation' as keyof DeliveryTask,
      header: 'Type',
      render: (value: any) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value?.deliveryType === 'pickup' 
            ? 'bg-orange-100 text-orange-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {value?.deliveryType || 'N/A'}
        </span>
      )
    },
    {
      key: 'deliveryInformation' as keyof DeliveryTask,
      header: 'Address',
      render: (value: any) => value?.deliveryLocation?.address || 'N/A',
      width: 'w-1/3'
    },
    {
      key: 'rider' as keyof DeliveryTask,
      header: 'Assigned Rider',
      render: (value: any) => value?.name || 'Unassigned'
    },
    {
      key: 'status' as keyof DeliveryTask,
      header: 'Status',
      render: (value: any) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'dispatched' ? 'bg-blue-100 text-blue-800' :
          value === 'in_progress' ? 'bg-purple-100 text-purple-800' :
          value === 'completed' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Rider Dashboard</h1>
              <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                Delivery Personnel
              </span>
            </div>
            <div className="text-sm text-gray-500">
              View assigned deliveries and track delivery status
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Assigned</p>
                  <p className="text-2xl font-semibold text-gray-900">{assignedTasks.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Pending Start</p>
                  <p className="text-2xl font-semibold text-gray-900">{dispatchedTasks.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-semibold text-gray-900">{inProgressTasks.length}</p>
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
                  <p className="text-2xl font-semibold text-gray-900">{completedTasks.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-purple-900 mb-2">Rider Dashboard</h3>
            <div className="text-purple-800 space-y-2">
              <p>• This dashboard shows all delivery tasks assigned to riders</p>
              <p>• In a full system, riders would be able to:</p>
              <p className="ml-4">- View their personal assigned deliveries</p>
              <p className="ml-4">- Update delivery status (start delivery, mark as completed)</p>
              <p className="ml-4">- Access delivery routes and navigation</p>
              <p className="ml-4">- Upload proof of delivery photos</p>
              <p>• For this demo, we show all assigned deliveries across all riders</p>
            </div>
          </div>

          {/* Assigned Deliveries Table */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">All Assigned Deliveries</h3>
            <DataTable
              data={assignedTasks}
              columns={taskColumns}
              loading={isLoadingTasks}
              emptyMessage="No deliveries have been assigned to riders yet."
            />
          </div>
        </div>
      </div>
    </div>
  );
}