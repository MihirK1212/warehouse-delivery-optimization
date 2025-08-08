'use client';

import { useState, useEffect } from 'react';
import { useGetAllDeliveryTasksQuery } from '@/store/api/delivery';
import { DeliveryTask } from '@/types/delivery/type';
import { Rider } from '@/types/rider/type';
import DeliveryCard from './components/DeliveryCard';
import DeliveryDetail from './components/DeliveryDetail';
import DeliverySidebar from './components/DeliverySidebar';
import RiderLogin from './components/RiderLogin';

interface LoggedInRider {
  rider: Rider;
  userName: string;
}

export default function RiderPage() {
  const { data: allTasks = [], isLoading: isLoadingTasks } = useGetAllDeliveryTasksQuery();
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryTask | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loggedInRider, setLoggedInRider] = useState<LoggedInRider | null>(null);

  // Load logged in rider from localStorage on component mount
  useEffect(() => {
    const savedRider = localStorage.getItem('loggedInRider');
    if (savedRider) {
      try {
        setLoggedInRider(JSON.parse(savedRider));
      } catch (error) {
        console.error('Failed to parse saved rider data:', error);
        localStorage.removeItem('loggedInRider');
      }
    }
  }, []);

  // Filter tasks that are assigned to the logged-in rider only
  const assignedTasks = allTasks.filter(task => 
    task.rider && loggedInRider && task.rider.id === loggedInRider.rider.id
  );
  const inProgressTasks = assignedTasks.filter(task => task.status === 'in_progress');
  const completedTasks = assignedTasks.filter(task => task.status === 'completed');
  const dispatchedTasks = assignedTasks.filter(task => task.status === 'dispatched');

  const handleLogin = (rider: Rider, userName: string) => {
    const riderData = { rider, userName };
    setLoggedInRider(riderData);
    localStorage.setItem('loggedInRider', JSON.stringify(riderData));
  };

  const handleLogout = () => {
    setLoggedInRider(null);
    setSelectedDelivery(null);
    localStorage.removeItem('loggedInRider');
  };

  const handleSelectDelivery = (delivery: DeliveryTask) => {
    setSelectedDelivery(delivery);
  };

  const handleCloseDetail = () => {
    setSelectedDelivery(null);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Show login page if no rider is logged in
  if (!loggedInRider) {
    return <RiderLogin onLogin={handleLogin} />;
  }

  if (isLoadingTasks) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your deliveries...</p>
        </div>
      </div>
    );
  }

  if (selectedDelivery) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <DeliverySidebar
          deliveries={assignedTasks}
          selectedDelivery={selectedDelivery}
          onSelectDelivery={handleSelectDelivery}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
        <div className="flex-1 flex flex-col">
          <DeliveryDetail
            delivery={selectedDelivery}
            onClose={handleCloseDetail}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Rider Dashboard</h1>
              <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {loggedInRider.userName}
              </span>
              <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {loggedInRider.rider.name}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                View and manage your assigned deliveries
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
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

          {/* Interactive Deliveries Grid */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Your Assigned Deliveries</h3>
              <p className="text-sm text-gray-500">
                Click on any delivery to view detailed information and update its status
              </p>
            </div>

            {assignedTasks.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2m0 0v1" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Deliveries Assigned</h3>
                <p className="text-gray-500">
                  Hi {loggedInRider.userName}! You don&apos;t have any deliveries assigned to {loggedInRider.rider.name}&apos;s profile yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignedTasks.map((delivery) => (
                  <DeliveryCard
                    key={delivery.id}
                    delivery={delivery}
                    onSelect={handleSelectDelivery}
                    isSelected={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}