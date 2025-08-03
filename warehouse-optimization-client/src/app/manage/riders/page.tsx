'use client';

import { useState } from 'react';
import ExcelUpload from '@/components/ui/ExcelUpload';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useGetRidersQuery, useCreateRidersMutation, useDeleteRiderMutation } from '@/store/api/rider';
import { RiderUploadFormData } from '@/types/forms';
import { Rider } from '@/types/rider/type';

const EXPECTED_COLUMNS = [
  'name',
  'age',
  'bag_volume',
  'phone_number'
];

export default function ManageRidersPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [parsedData, setParsedData] = useState<RiderUploadFormData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { data: riders = [], isLoading: isLoadingRiders, refetch: refetchRiders } = useGetRidersQuery();
  const [createRiders] = useCreateRidersMutation();
  const [deleteRider] = useDeleteRiderMutation();

  const handleDataParsed = (data: RiderUploadFormData[]) => {
    setParsedData(data);
    setSubmitStatus(null);
  };

  const handleSubmitRiders = async () => {
    if (parsedData.length === 0) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await createRiders(parsedData).unwrap();
      
      setSubmitStatus({
        type: 'success',
        message: `Successfully added ${parsedData.length} riders!`
      });
      
      setParsedData([]);
      refetchRiders();
      
      // Close modal after a short delay
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setSubmitStatus(null);
      }, 2000);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setSubmitStatus({
        type: 'error',
        message: error?.data?.detail || 'Failed to create riders. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRider = async (riderId: string) => {
    if (confirm('Are you sure you want to delete this rider? This action cannot be undone.')) {
      try {
        await deleteRider(riderId).unwrap();
        refetchRiders();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        alert('Failed to delete rider. Please try again.');
      }
    }
  };

  const riderColumns = [
    {
      key: 'name' as keyof Rider,
      header: 'Name',
      sortable: true
    },
    {
      key: 'age' as keyof Rider,
      header: 'Age',
      sortable: true
    },
    {
      key: 'bagVolume' as keyof Rider,
      header: 'Bag Volume (L)',
      sortable: true,
      render: (value: Rider[keyof Rider]) => `${value} L`
    },
    {
      key: 'phoneNumber' as keyof Rider,
      header: 'Phone Number',
      sortable: true
    },
    {
      key: 'id' as keyof Rider,
      header: 'Actions',
      render: (_value: unknown, row: Rider) => (
        <button
          onClick={() => handleDeleteRider(row.id)}
          className="text-red-600 hover:text-red-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
        >
          Delete
        </button>
      )
    }
  ];

  const uploadColumns = [
    { key: 'name' as keyof RiderUploadFormData, header: 'Name' },
    { key: 'age' as keyof RiderUploadFormData, header: 'Age' },
    { 
      key: 'bag_volume' as keyof RiderUploadFormData, 
      header: 'Bag Volume',
      render: (value: RiderUploadFormData[keyof RiderUploadFormData]) => `${value} L`
    },
    { key: 'phone_number' as keyof RiderUploadFormData, header: 'Phone Number' }
  ];

  const averageBagVolume = riders.length > 0 
    ? (riders.reduce((sum, rider) => sum + rider.bagVolume, 0) / riders.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Riders</h2>
          <p className="text-gray-600 mt-1">
            Upload and manage delivery riders. Add new riders or update existing rider information.
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Riders
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Riders</p>
              <p className="text-2xl font-semibold text-gray-900">{riders.length}</p>
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
              <p className="text-sm font-medium text-gray-600">Available</p>
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
              <p className="text-sm font-medium text-gray-600">Avg Bag Volume</p>
              <p className="text-2xl font-semibold text-gray-900">{averageBagVolume}L</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">On Delivery</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Riders Table */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Riders</h3>
        <DataTable
          data={riders}
          columns={riderColumns}
          loading={isLoadingRiders}
          emptyMessage="No riders found. Upload riders to get started."
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
        title="Upload Riders"
        size="lg"
      >
        <div className="space-y-6">
          <ExcelUpload
            onDataParsed={handleDataParsed}
            expectedColumns={EXPECTED_COLUMNS}
            templateName="delivery_riders"
          />

          {submitStatus && (
            <Alert type={submitStatus.type}>
              {submitStatus.message}
            </Alert>
          )}

          {parsedData.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">
                Preview ({parsedData.length} riders)
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
                  onClick={handleSubmitRiders}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
                  {isSubmitting ? 'Adding Riders...' : 'Add Riders'}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}