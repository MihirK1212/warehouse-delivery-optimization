export default function PickupInfo() {
  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <h3 className="text-lg font-medium text-blue-900 mb-2">About Pickup Items</h3>
      <div className="text-blue-800 space-y-2">
        <p>• Pickup items are collected from various external locations (not from the warehouse)</p>
        <p>• Each pickup item requires both a pickup location and a final delivery destination</p>
        <p>• Riders will first go to the pickup location, collect the item, then deliver it to the customer</p>
        <p>• These are different from regular warehouse items that are already available in the warehouse</p>
      </div>
    </div>
  );
}



