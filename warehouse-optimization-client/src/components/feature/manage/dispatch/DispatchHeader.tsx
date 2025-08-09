export default function DispatchHeader({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dispatch Deliveries</h2>
        <p className="text-gray-600 mt-1">
          Select undispatched delivery tasks and assign them to available riders.
        </p>
      </div>
      <button
        onClick={onOpen}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Dispatch Selected
      </button>
    </div>
  );
}


