// frontend/components/ui/use-toast.tsx
import { useCallback, useContext } from "react";
import { ToastContext, Toast } from "./toast";

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const { addToast } = context;

  const toast = useCallback((props: Omit<Toast, "id">) => {
    console.log("useToast: Adding toast with props:", props);
    addToast(props);
  }, [addToast]); // Depend on addToast, which should be stable

  return { toast };
};