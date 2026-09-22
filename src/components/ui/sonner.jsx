import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          padding: "16px",
          fontSize: "14px",
        },
      }}
      richColors
      closeButton
    />
  );
}
