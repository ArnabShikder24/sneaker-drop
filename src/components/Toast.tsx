import { Toaster } from 'sonner';

/** Mounts the sonner toast container. Place once in App.tsx. */
export function Toast() {
  return (
    <Toaster
      position="top-right"
      theme="dark"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: '#18181b',
          border: '1px solid #3f3f46',
          color: '#fafafa',
        },
      }}
    />
  );
}