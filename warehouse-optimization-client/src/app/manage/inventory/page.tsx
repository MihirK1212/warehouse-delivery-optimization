"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal";
import { useGetItemsQuery } from "@/store/api/item";
import CreatedInventoryGrid from "@/components/feature/manage/inventory/CreatedInventoryGrid";
import UploadInventoryWidget from "@/components/feature/manage/inventory/UploadInventoryWidget";
import InventoryInfoStats from "@/components/feature/manage/inventory/InventoryInfoStats";
import InventoryHeader from "@/components/feature/manage/inventory/InventoryHeader";

export default function ManageInventoryPage() {
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

	const {
		data: items = [],
		isLoading: isLoadingItems,
		refetch: refetchItems,
	} = useGetItemsQuery();

	return (
		<div className="space-y-8">
			{/* Header */}
			<InventoryHeader onModalOpen={() => setIsUploadModalOpen(true)} />

			{/* Inventory Info Stats */}
			<InventoryInfoStats items={items} />

			{/* Created Inventory Grid */}
			<CreatedInventoryGrid
				items={items}
				isLoadingItems={isLoadingItems}
			/>

			{/* Upload Modal */}
			<Modal
				isOpen={isUploadModalOpen}
				onClose={() => {
					setIsUploadModalOpen(false);
				}}
				title="Upload Items with Delivery Details"
				size="xl"
			>
				<UploadInventoryWidget
					onSubmit={() => {
						refetchItems();
						setIsUploadModalOpen(false);
					}}
				/>
			</Modal>
		</div>
	);
}
