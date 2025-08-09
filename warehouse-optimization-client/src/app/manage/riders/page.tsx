'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import { useGetRidersQuery, useDeleteRiderMutation } from '@/store/api/rider';
import RidersHeader from '@/components/feature/manage/riders/RidersHeader';
import RidersInfoStats from '@/components/feature/manage/riders/RidersInfoStats';
import CurrentRidersGrid from '@/components/feature/manage/riders/CurrentRidersGrid';
import UploadRidersWidget from '@/components/feature/manage/riders/UploadRidersWidget';

export default function ManageRidersPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { data: riders = [], isLoading: isLoadingRiders, refetch: refetchRiders } = useGetRidersQuery();
  const [deleteRider] = useDeleteRiderMutation();

  const handleDeleteRider = async (riderId: string) => {
    if (confirm('Are you sure you want to delete this rider? This action cannot be undone.')) {
      try {
        await deleteRider(riderId).unwrap();
        refetchRiders();
      } catch (_error) {
        alert('Failed to delete rider. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-8">
      <RidersHeader onModalOpen={() => setIsUploadModalOpen(true)} />

      <RidersInfoStats riders={riders} />

      <CurrentRidersGrid riders={riders} isLoading={isLoadingRiders} onDelete={handleDeleteRider} />

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Riders"
        size="lg"
      >
        <UploadRidersWidget
          onSubmit={() => {
            refetchRiders();
            setIsUploadModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}