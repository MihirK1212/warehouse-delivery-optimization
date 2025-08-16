"use client";

import { useGetDeliveryTasksBatchesForTodayQuery } from "@/store/api/deliveryBatch";



export default function ManageMonitorPage() {
    const { data: deliveryTasksBatches = [], isLoading: isLoadingDeliveryTasksBatches } = useGetDeliveryTasksBatchesForTodayQuery();

    console.log("[ROUTE] deliveryTasksBatches", deliveryTasksBatches);

	return <div>
        <div>
            <h1>Delivery Tasks Batches</h1>
            <p>Total: {deliveryTasksBatches.length}</p>
        </div>
    </div>;
}