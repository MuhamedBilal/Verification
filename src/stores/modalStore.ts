import { create } from 'zustand';

interface ModalStore {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  openModal: (params?: {
    title?: string;
    message?: string;
    confirmText?: string;
  }) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '',
  openModal: (params = {}) =>
    set({
      isOpen: true,
      title: params.title || 'Notification',
      message: params.message || '',
      confirmText: params.confirmText || 'OK',
    }),
  closeModal: () =>
    set({
      isOpen: false,
      title: '',
      message: '',
      confirmText: '',
    }),
}));

export default useModalStore;
