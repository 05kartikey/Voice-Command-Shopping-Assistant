export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

type ToastListener = (message: string, type: ToastType) => void;
let listener: ToastListener | null = null;

export function registerToastListener(fn: ToastListener | null) {
  listener = fn;
}

export function toast(message: string, type: ToastType = 'success') {
  listener?.(message, type);
}
