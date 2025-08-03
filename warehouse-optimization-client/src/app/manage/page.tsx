import Link from 'next/link';

export default function ManagePage() {
  const cards = [
    {
      title: 'Manage Inventory',
      description: 'Upload items with delivery details via Excel. Each item will be wrapped in a delivery task.',
      href: '/manage/inventory',
      icon: '📦',
      color: 'bg-blue-500',
      stats: 'Add new items to inventory'
    },
    {
      title: 'Manage Riders',
      description: 'Upload and manage delivery riders. Add new riders or update existing rider information.',
      href: '/manage/riders',
      icon: '🚴‍♂️',
      color: 'bg-green-500',
      stats: 'Manage delivery personnel'
    },
    {
      title: 'Dispatch Deliveries',
      description: 'View undispatched tasks, select deliveries and riders, then dispatch them for delivery.',
      href: '/manage/dispatch',
      icon: '🚚',
      color: 'bg-purple-500',
      stats: 'Assign deliveries to riders'
    },
    {
      title: 'Add Pickup Items',
      description: 'Add dynamic pickup tasks for items that need to be collected from various locations.',
      href: '/manage/pickup',
      icon: '📋',
      color: 'bg-orange-500',
      stats: 'Schedule pickup operations'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">
          Manage all aspects of your warehouse operations from a single dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-2xl mr-4`}>
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500">{card.stats}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {card.description}
              </p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                Get started
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-medium text-gray-900">Quick Dispatch</div>
            <div className="text-sm text-gray-500">Dispatch pending deliveries instantly</div>
          </button>
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-gray-900">View Reports</div>
            <div className="text-sm text-gray-500">Check delivery performance metrics</div>
          </button>
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-2xl mb-2">🔔</div>
            <div className="font-medium text-gray-900">Notifications</div>
            <div className="text-sm text-gray-500">Check pending alerts and updates</div>
          </button>
        </div>
      </div>
    </div>
  );
}