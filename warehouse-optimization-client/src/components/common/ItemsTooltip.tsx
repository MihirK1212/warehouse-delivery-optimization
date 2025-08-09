'use client';

import { useState } from 'react';
import { Item } from '@/types/item/type';

interface ItemsTooltipProps {
  items: Item[];
  children: React.ReactNode;
}

export default function ItemsTooltip({ items, children }: ItemsTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (!items || items.length === 0) {
    return <>{children}</>;
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="cursor-help">
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute z-50 p-4 bg-white border border-gray-300 rounded-lg shadow-lg min-w-96 max-w-2xl -top-2 left-full ml-2">
          {/* Arrow pointing to the trigger */}
          <div className="absolute top-3 -left-2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-gray-300"></div>
          <div className="absolute top-3 -left-1 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white"></div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Item Details ({items.length} item{items.length !== 1 ? 's' : ''})
            </h4>
            
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Name</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Description</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Weight</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Volume</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 border-b border-gray-200">
                        <div className="font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-3 py-2 border-b border-gray-200">
                        <div className="text-gray-600 max-w-32 truncate" title={item.description}>
                          {item.description || 'N/A'}
                        </div>
                      </td>
                      <td className="px-3 py-2 border-b border-gray-200">
                        <div className="text-gray-900">
                          {item.toolScanInformation?.weight 
                            ? `${item.toolScanInformation.weight} kg` 
                            : 'N/A'
                          }
                        </div>
                      </td>
                      <td className="px-3 py-2 border-b border-gray-200">
                        <div className="text-gray-900">
                          {item.toolScanInformation?.volume 
                            ? `${item.toolScanInformation.volume} L` 
                            : 'N/A'
                          }
                        </div>
                      </td>
                      <td className="px-3 py-2 border-b border-gray-200">
                        <div className="text-gray-600 max-w-40 truncate" title={item.itemLocation?.address}>
                          {item.itemLocation?.address || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {items.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Total Weight: {items.reduce((sum, item) => sum + (item.toolScanInformation?.weight || 0), 0).toFixed(2)} kg</span>
                    <span>Total Volume: {items.reduce((sum, item) => sum + (item.toolScanInformation?.volume || 0), 0).toFixed(2)} L</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}