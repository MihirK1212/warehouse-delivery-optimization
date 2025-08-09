'use client';

import { useState } from 'react';
import DataTable from '@/components/common/DataTable';
import Modal from '@/components/common/Modal';
import Alert from '@/components/common/Alert';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useGetItemsQuery, useScanItemMutation } from '@/store/api/item';
import { ScanFormData } from '@/types/forms';
import { Item } from '@/types/item/type';

export default function ScanPage() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [scanData, setScanData] = useState<ScanFormData>({ weight: 0, volume: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'scanned' | 'unscanned'>('all');

  const { data: items = [], isLoading: isLoadingItems, refetch: refetchItems } = useGetItemsQuery();
  const [scanItem] = useScanItemMutation();

  // Generate random scan values for demo purposes
  const generateRandomScanValues = () => {
    const weight = Math.round((Math.random() * 5 + 0.5) * 100) / 100; // 0.5 to 5.5 kg
    const volume = Math.round((Math.random() * 10 + 1) * 100) / 100; // 1 to 11 L
    setScanData({ weight, volume });
  };

  const handleStartScan = (item: Item) => {
    setSelectedItem(item);
    setIsScanModalOpen(true);
    setScanStatus(null);
    // Auto-generate random values for demo
    generateRandomScanValues();
  };

  const handleScanSubmit = async () => {
    if (!selectedItem || scanData.weight <= 0 || scanData.volume <= 0) {
      setScanStatus({
        type: 'error',
        message: 'Please enter valid weight and volume values.'
      });
      return;
    }

    setIsScanning(true);
    setScanStatus(null);

    try {
      await scanItem({
        itemId: selectedItem.id,
        scanData
      }).unwrap();

      setScanStatus({
        type: 'success',
        message: 'Item scanned successfully!'
      });

      refetchItems();

      // Close modal after a short delay
      setTimeout(() => {
        setIsScanModalOpen(false);
        setSelectedItem(null);
        setScanData({ weight: 0, volume: 0 });
        setScanStatus(null);
      }, 1500);

    } catch (error: any) {
      setScanStatus({
        type: 'error',
        message: error?.data?.detail || 'Failed to scan item. Please try again.'
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Filter items based on scan status
  const filteredItems = items.filter(item => {
    if (filter === 'scanned') return item.toolScanInformation !== null;
    if (filter === 'unscanned') return item.toolScanInformation === null;
    return true;
  });

  const itemColumns = [
    {
      key: 'name' as keyof Item,
      header: 'Item Name',
      sortable: true
    },
    {
      key: 'description' as keyof Item,
      header: 'Description',
      sortable: true
    },
    {
      key: 'toolScanInformation' as keyof Item,
      header: 'Scan Status',
      render: (value: any) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value ? 'Scanned' : 'Pending Scan'}
        </span>
      )
    },
    {
      key: 'toolScanInformation' as keyof Item,
      header: 'Weight',
      render: (value: any) => value ? `${value.weight} kg` : '-'
    },
    {
      key: 'toolScanInformation' as keyof Item,
      header: 'Volume',
      render: (value: any) => value ? `${value.volume} L` : '-'
    },
    {
      key: 'timestampCreated' as keyof Item,
      header: 'Added',
      render: (value: any) => value?.format('DD/MM/YYYY') || 'N/A',
      sortable: true
    },
    {
      key: 'id' as keyof Item,
      header: 'Actions',
      render: (value: any, row: Item) => (
        <button
          onClick={() => handleStartScan(row)}
          disabled={row.toolScanInformation !== null}
          className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            row.toolScanInformation 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-100 text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500'
          }`}
        >
          {row.toolScanInformation ? 'Scanned' : 'Scan Item'}
        </button>
      )
    }
  ];

  const scannedItems = items.filter(item => item.toolScanInformation).length;
  const unscannedItems = items.filter(item => !item.toolScanInformation).length;
  const totalWeight = items.reduce((total, item) => total + (item.toolScanInformation?.weight || 0), 0);
  const totalVolume = items.reduce((total, item) => total + (item.toolScanInformation?.volume || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Scanning Dashboard</h1>
              <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Scanning Personnel
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Scan items to record their weight and volume
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Filter and Stats */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Items ({items.length})
              </button>
              <button
                onClick={() => setFilter('unscanned')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'unscanned'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Pending Scan ({unscannedItems})
              </button>
              <button
                onClick={() => setFilter('scanned')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === 'scanned'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Scanned ({scannedItems})
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-semibold text-gray-900">{items.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Scanned</p>
                  <p className="text-2xl font-semibold text-gray-900">{scannedItems}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-3m-3 3l-3-3" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Weight</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalWeight.toFixed(1)}kg</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Progress Bar */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">Scanning Progress</h3>
              <span className="text-sm text-gray-500">
                {scannedItems} of {items.length} items scanned
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${items.length > 0 ? (scannedItems / items.length) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {items.length > 0 ? Math.round((scannedItems / items.length) * 100) : 0}% complete
            </p>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Items to Scan {filter !== 'all' && `(${filter})`}
            </h3>
            <DataTable
              data={filteredItems}
              columns={itemColumns}
              loading={isLoadingItems}
              emptyMessage={
                filter === 'unscanned' 
                  ? "All items have been scanned! Great job!" 
                  : filter === 'scanned'
                  ? "No scanned items yet. Start scanning to see results here."
                  : "No items found. Items need to be added by the warehouse manager first."
              }
            />
          </div>

          {/* Scan Modal */}
          <Modal
            isOpen={isScanModalOpen}
            onClose={() => {
              setIsScanModalOpen(false);
              setSelectedItem(null);
              setScanData({ weight: 0, volume: 0 });
              setScanStatus(null);
            }}
            title={`Scan Item: ${selectedItem?.name}`}
            size="md"
          >
            <div className="space-y-6">
              {/* Item Info */}
              {selectedItem && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Item Details</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Name:</strong> {selectedItem.name}</p>
                    <p><strong>Description:</strong> {selectedItem.description}</p>
                  </div>
                </div>
              )}

              {/* Scan Tool Simulation */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Scan Tool Simulation</h4>
                <p className="text-sm text-blue-800 mb-4">
                  For demo purposes, random weight and volume values are generated. In a real system, these would come from scanning equipment.
                </p>
                <button
                  onClick={generateRandomScanValues}
                  className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generate New Values
                </button>
              </div>

              {/* Scan Values Form */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    value={scanData.weight}
                    onChange={(e) => setScanData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter weight in kg"
                  />
                </div>
                
                <div>
                  <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
                    Volume (L)
                  </label>
                  <input
                    type="number"
                    id="volume"
                    value={scanData.volume}
                    onChange={(e) => setScanData(prev => ({ ...prev, volume: parseFloat(e.target.value) || 0 }))}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter volume in liters"
                  />
                </div>
              </div>

              {scanStatus && (
                <Alert type={scanStatus.type}>
                  {scanStatus.message}
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsScanModalOpen(false);
                    setSelectedItem(null);
                    setScanData({ weight: 0, volume: 0 });
                    setScanStatus(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={isScanning}
                >
                  Cancel
                </button>
                <button
                  onClick={handleScanSubmit}
                  disabled={isScanning || scanData.weight <= 0 || scanData.volume <= 0}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isScanning && <LoadingSpinner size="sm" className="mr-2" />}
                  {isScanning ? 'Scanning...' : 'Confirm Scan'}
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}