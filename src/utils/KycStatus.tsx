import React from 'react';

type StatusType = 'pending' | 'approved' | 'rejected' | 'not_started';

interface KycStatusChipProps {
  status: StatusType;
}

const statusConfig = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Pending',
  },
  approved: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Approved',
  },
  rejected: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Rejected',
  },
  not_started: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: 'Not Started',
  },
};

const KycStatusChip: React.FC<KycStatusChipProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig.not_started;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

export default KycStatusChip;
