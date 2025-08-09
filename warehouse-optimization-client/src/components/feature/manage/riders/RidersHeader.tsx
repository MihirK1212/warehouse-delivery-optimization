export default function RidersHeader({ onModalOpen }: { onModalOpen: () => void }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Manage Riders</h2>
        <p className="text-gray-600 mt-1">
          Upload and manage delivery riders. Add new riders or update existing rider information.
        </p>
      </div>
      <button
        onClick={onModalOpen}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Riders
      </button>
    </div>
  );
}


