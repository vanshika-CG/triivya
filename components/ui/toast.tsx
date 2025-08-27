// frontend/components/ui/toast.tsx
"use client"
import { createContext, useState, useCallback, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = uuidv4();
    const newToast = { ...toast, id };
    setToasts((prev) => {
      const newToasts = [...prev, newToast];
      console.log("Adding toast, new state:", newToasts);
      return newToasts;
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => {
      const newToasts = prev.filter((toast) => toast.id !== id);
      console.log("Removing toast, new state:", newToasts);
      return newToasts;
    });
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}