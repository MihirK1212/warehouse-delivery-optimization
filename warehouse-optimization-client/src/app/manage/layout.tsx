'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/manage/inventory', label: 'Manage Inventory', icon: '📦' },
    { href: '/manage/riders', label: 'Manage Riders', icon: '🚴‍♂️' },
    { href: '/manage/dispatch', label: 'Dispatch Deliveries', icon: '🚚' },
    { href: '/manage/pickup', label: 'Add & Dispatch Pickup Items', icon: '📋' },
    { href: '/manage/monitor', label: 'Monitor Deliveries', icon: '👀' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Warehouse Manager</h1>
            </div>
            <div className="text-sm text-gray-500">
              Manage your warehouse operations and dispatch deliveries
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive(item.href)
                      ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}