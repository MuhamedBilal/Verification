# Verification

## Overview
This repository contains a verification component that integrates with SmileID for KYC verification. The component handles ID document capture and selfie verification.

## Known Issues
1. **Image Capture Behavior**:
   - The component captures 3 images in total but I get 11 images
   - Image type distribution:
     - Type 2: ID Front (1 image)
     - Type 3: ID Back (1 image)
     - Type 7: Initial Selfie (1 image)
     - Type 6: Additional Selfies (8 images)
   - Current implementation processes types 2, 3, 6, and 7 but 6 8 times.
   
2. **Modal Close Button Issue**:
   - The close button (×) in the modal is currently non-functional

## Debugging Focus Areas

### 1. Image Processing
```typescript
// Current image processing logic in Verification.tsx
e.detail.images.forEach(
  async (imageData: { image_type_id: number; image: string }) => {
    const relevantTypes = [2, 3, 6, 7];
    
    // Check why we're getting 8 type 6 images and if all are needed
    if (!relevantTypes.includes(imageData.image_type_id)) return;
    if (processedTypes.has(imageData.image_type_id)) return;
    
    // Image type mapping
    switch (imageData.image_type_id) {
      case 2: code = 'id_front'; break;
      case 3: code = 'id_back'; break;
      case 6:
      case 7: code = 'selfie'; break;
    }
  }
);
```

### 2. Modal Close Function
```typescript
// Current non-working implementation
const toggleModal = () => {
  setIsModalOpen(!isModalOpen);
};

// Modal close button
<button
  onClick={toggleModal}
  className="text-gray-500 hover:text-gray-700"
>
  &times;
</button>
```

### 3. Event Handling
The component uses three main SmileID events:
- `smart-camera-web.publish`: Handles captured images
- `smart-camera-web.cancelled`: Handles cancellation
- `smile-event`: Handles general events

## Testing Steps

1. **Verification Flow**:
   - Start verification process
   - Capture ID front (type 2)
   - Capture ID back (type 3)
   - Capture selfie (types 6 and 7)
   - Monitor console for image processing logs

2. **Modal Behavior**:
   - Test modal open/close
   - Verify backdrop click behavior
   - Check close button functionality

3. **Status Updates**:
   - Verify KYC status updates
   - Check status chip rendering
   - Test different status scenarios

## Common Issues and Solutions

1. **Multiple Image Captures**:
   - Problem: Component captures 11 images (1 type 2, 1 type 3, 1 type 7, 8 type 6)

2. **Modal Close Button**:
   - Problem: Close button doesn't dismiss the modal

## API Integration Notes

```typescript
// Example API response structure
interface VerificationResponse {
  success: boolean;
  job_id: string;
  job_status: string;
  // Add other relevant fields
}

// Expected image upload payload
interface ImageUploadPayload {
  code: 'id_front' | 'id_back' | 'selfie';
  image: string; // base64
}
```
