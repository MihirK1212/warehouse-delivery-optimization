export default function PickupHeader({ onModalOpen }: { onModalOpen: () => void }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Add Pickup Items</h2>
        <p className="text-gray-600 mt-1">
          Add dynamic pickup tasks for items that need to be collected from various locations and delivered to customers.
        </p>
      </div>
      <button
        onClick={onModalOpen}
        className="inline-flex items-center px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Pickup Items
      </button>
    </div>
  );
}


