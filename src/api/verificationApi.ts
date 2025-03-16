export interface VerificationResponse {
  success: boolean;
  job_id: string;
  job_status: string;
}

export interface ImageUploadPayload {
  code: 'id_front' | 'id_back' | 'selfie';
  image: string;
}

export const startSmileVerification = async (
  data: any
): Promise<VerificationResponse> => {
  console.log('Verification data:', data);
  return {
    success: true,
    job_id: 'mock-job-id',
    job_status: 'completed',
  };
};

export const kycStatus = async () => {
  return {
    kycStatus: 'pending',
  };
};

export const uploadImage = async (data: ImageUploadPayload) => {
  console.log('Uploading image:', data.code);
  return {
    success: true,
    url: 'mock-image-url',
  };
};
