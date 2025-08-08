'use client';

import { DeliveryTask } from '@/types/delivery/type';
import { useUpdateDeliveryTaskStatusMutation } from '@/store/api/delivery';
import moment from 'moment';

interface DeliveryCardProps {
  delivery: DeliveryTask;
  onSelect: (delivery: DeliveryTask) => void;
  isSelected: boolean;
}

export default function DeliveryCard({ delivery, onSelect, isSelected }: DeliveryCardProps) {
  const [updateStatus, { isLoading: isUpdating }] = useUpdateDeliveryTaskStatusMutation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dispatched':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'dispatched':
        return 'in_progress';
      case 'in_progress':
        return 'completed';
      default:
        return null;
    }
  };

  const getNextStatusLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case 'dispatched':
        return 'Start Delivery';
      case 'in_progress':
        return 'Mark Complete';
      default:
        return null;
    }
  };

  const handleStatusUpdate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = getNextStatus(delivery.status);
    if (nextStatus) {
      try {
        await updateStatus({ 
          id: delivery.id, 
          status: nextStatus as "dispatched" | "in_progress" | "completed" 
        }).unwrap();
      } catch (error) {
        console.error('Failed to update status:', error);
      }
    }
  };

  const totalVolume = delivery.items.reduce((sum, item) => 
    sum + (item.toolScanInformation?.volume || 0), 0
  );

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 border-2 transition-all cursor-pointer hover:shadow-lg ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
      onClick={() => onSelect(delivery)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            AWB: {delivery.deliveryInformation.awbId}
          </h3>
          <p className="text-sm text-gray-600">
            {delivery.deliveryInformation.deliveryType === 'pickup' ? 'Pickup' : 'Delivery'}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(delivery.status)}`}>
          {delivery.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* Location */}
      <div className="mb-3">
        <div className="flex items-start">
          <svg className="w-4 h-4 text-gray-400 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm text-gray-700 line-clamp-2">
            {delivery.deliveryInformation.deliveryLocation.address}
          </p>
        </div>
      </div>

      {/* Items and Volume */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-xs text-gray-500">Items</p>
          <p className="text-sm font-medium">{delivery.items.length} item(s)</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Volume</p>
          <p className="text-sm font-medium">{totalVolume.toFixed(2)} cm³</p>
        </div>
      </div>

      {/* Expected Delivery Time */}
      <div className="mb-4">
        <p className="text-xs text-gray-500">Expected Delivery</p>
        <p className="text-sm font-medium">
          {moment(delivery.deliveryInformation.expectedDeliveryTime).format('MMM DD, YYYY - HH:mm')}
        </p>
      </div>

      {/* Action Button */}
      {getNextStatus(delivery.status) && (
        <button
          onClick={handleStatusUpdate}
          disabled={isUpdating}
          className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            delivery.status === 'dispatched'
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isUpdating ? 'Updating...' : getNextStatusLabel(delivery.status)}
        </button>
      )}
    </div>
  );
}