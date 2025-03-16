import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  startSmileVerification,
  // SmileVerificationPayload,
  kycStatus,
  uploadImage,
  ImageUploadPayload,
} from '../api/verificationApi';
import '@smileid/web-components';
import { useEffect, useState, useRef } from 'react';
import KycStatusChip from '../utils/KycStatus';
import { toast } from 'react-toastify';

type StatusType = 'pending' | 'approved' | 'rejected' | 'not_started';

declare global {
  // eslint-disable-next-line
  namespace JSX {
    interface IntrinsicElements {
      'smart-camera-web': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export function Verification() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const smartCameraRef = useRef<HTMLElement>(null);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: startSmileVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kycStatus'] });
      setIsModalOpen(false);
      toast.success('Verification submitted successfully');
    },
    onError: () => {
      toast.error('Verification failed. Please try again.');
    },
  });

  const {
    data: statusData,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['kycStatus'], queryFn: kycStatus });

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
  });

  useEffect(() => {
    const cameraEl = smartCameraRef.current;
    if (!cameraEl) return;

    const handlePublish = (event: Event) => {
      const e = event as CustomEvent;
      const processedTypes = new Set<number>();
      console.log('[SmileID] Publish event:', e.detail);

      e.detail.images.forEach(
        async (imageData: { image_type_id: number; image: string }) => {
          const relevantTypes = [2, 3, 6, 7];

          if (!relevantTypes.includes(imageData.image_type_id)) return;
          if (processedTypes.has(imageData.image_type_id)) return;

          processedTypes.add(imageData.image_type_id);
          let code: ImageUploadPayload['code'];
          switch (imageData.image_type_id) {
            case 2:
              code = 'id_front';
              break;
            case 3:
              code = 'id_back';
              break;
            case 6:
            case 7:
              code = 'selfie';
              break;
            default:
              return;
          }

          await uploadImageMutation.mutateAsync({
            code,
            image: imageData.image,
          });
        }
      );
      mutate(e.detail);
    };

    const handleCancelled = () => {
      console.log('[SmileID] Capture cancelled');
      setIsModalOpen(false);
    };

    const handleSmileEvent = (event: Event) => {
      const e = event as CustomEvent;
      console.log('[SmileID] General event:', e.detail || event);
    };

    cameraEl.addEventListener('smart-camera-web.publish', handlePublish);
    cameraEl.addEventListener('smart-camera-web.cancelled', handleCancelled);
    cameraEl.addEventListener('smile-event', handleSmileEvent);
    console.log('[SmileID] Event listeners attached');

    return () => {
      cameraEl.removeEventListener('smart-camera-web.publish', handlePublish);
      cameraEl.removeEventListener(
        'smart-camera-web.cancelled',
        handleCancelled
      );
      cameraEl.removeEventListener('smile-event', handleSmileEvent);
    };
  }, [isModalOpen]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const isCardClickable = !(
    statusData?.kycStatus === 'pending' || statusData?.kycStatus === 'approved'
  );

  const handleCardClick = () => {
    if (isCardClickable) {
      toggleModal();
    }
  };
  const renderArrowOrStatus = () => {
    if (
      statusData?.kycStatus === 'pending' ||
      statusData?.kycStatus === 'approved' ||
      statusData?.kycStatus === 'rejected'
    ) {
      return <KycStatusChip status={statusData?.kycStatus} />;
    } else {
      return (
        <div className='flex items-center space-x-2'>
          <KycStatusChip status={statusData.kycStatus} />
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='currentColor'
            className='h-5 w-5 text-customGray-500'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 5l7 7-7 7'
            />
          </svg>
        </div>
      );
    }
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth='2'
        stroke='currentColor'
        className='h-5 w-5 text-customGray-500'
      >
        <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
      </svg>
    );
  };

  const renderSkeleton = () => (
    <div className='animate-pulse cursor-pointer rounded-xl border border-gray-200 bg-gray-100 p-6'>
      <div className='h-6 w-2/5 rounded bg-gray-300'></div>
      <div className='mt-2 h-4 w-3/4 rounded bg-gray-300'></div>
    </div>
  );

  const renderStatus = () => {
    const currentStatus: StatusType =
      (statusData?.kycStatus as StatusType) || 'not_started';
    return (
      <div className='mt-4 flex items-center gap-2'>
        <span className='text-sm font-medium text-gray-700'>Status:</span>
        <KycStatusChip status={currentStatus} />
      </div>
    );
  };

  return (
    <div className='p-0 md:p-6'>
      <h1 className='mb-4 text-2xl font-medium text-customGray-900'>
        Verification
      </h1>
      {isLoading || isError ? (
        renderSkeleton()
      ) : (
        <button
          className='cursor-pointer rounded-xl border border-customGray-200 bg-customGray-50 px-3 py-4 transition duration-200 hover:bg-customGray-100 md:p-6'
          onClick={handleCardClick}
        >
          <div className='flex items-center justify-between'>
            <div>
              <div className='flex items-center justify-between gap-2'>
                <h2 className='mb-2 text-nowrap text-xl font-medium text-customGray-900'>
                  Verification of identity
                </h2>
                <span className='md:hidden'>
                  {isLoading || isError ? (
                    <div>...</div>
                  ) : (
                    renderArrowOrStatus()
                  )}
                </span>
              </div>
              <p className='text-base font-normal text-customGray-500'>
                Provide personal details and upload valid documents to verify
                your identity.
              </p>
            </div>
            <div className='hidden md:block'>
              {isLoading || isError ? <div>...</div> : renderArrowOrStatus()}
            </div>
          </div>
        </button>
      )}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg md:w-3/4'>
            <div className='flex items-center justify-between border-b pb-2'>
              <h2 className='text-lg font-medium text-gray-900'>
                Verification
              </h2>
              <button
                onClick={toggleModal}
                className='text-gray-500 hover:text-gray-700'
              >
                &times;
              </button>
            </div>

            <div className='custom-select__menu-list mt-4 max-h-[600px] overflow-y-auto'>
              <smart-camera-web ref={smartCameraRef} capture-id />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
