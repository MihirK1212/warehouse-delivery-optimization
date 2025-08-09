'use client';

import { useMemo, useState } from 'react';
import Modal from '@/components/common/Modal';
import { useGetAllDeliveryTasksQuery } from '@/store/api/delivery';
import PickupHeader from '@/components/feature/manage/pickup/PickupHeader';
import PickupInfo from '@/components/feature/manage/pickup/PickupInfo';
import PickupTasksGrid from '@/components/feature/manage/pickup/PickupTasksGrid';
import UploadPickupWidget from '@/components/feature/manage/pickup/UploadPickupWidget';
import PickupStats from '@/components/feature/manage/pickup/PickupStats';

export default function AddPickupItemsPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { data: allTasks = [], isLoading: isLoadingTasks, refetch: refetchTasks } = useGetAllDeliveryTasksQuery();

  const pickupTasks = useMemo(() => allTasks.filter(task => task.deliveryInformation?.deliveryType === 'pickup'), [allTasks]);
  

  return (
    <div className="space-y-8">
      <PickupHeader onModalOpen={() => setIsUploadModalOpen(true)} />

      <PickupStats pickupTasks={pickupTasks} />

      <PickupInfo />

      <PickupTasksGrid tasks={pickupTasks} isLoading={isLoadingTasks} />

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Pickup Items"
        size="xl"
      >
        <UploadPickupWidget
          onSubmit={() => {
            refetchTasks();
            setIsUploadModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}