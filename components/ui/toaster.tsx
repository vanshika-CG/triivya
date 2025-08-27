// frontend/components/ui/toaster.tsx
"use client";

import { useContext, useEffect } from "react";
import { ToastContext } from "./toast";

export function Toaster() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("Toaster must be used within a ToastProvider");
  }

  const { toasts, removeToast } = context;

  console.log("Toaster rendering, number of toasts:", toasts.length);
  console.log("Toaster toasts:", toasts);

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        removeToast(toasts[0].id);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toasts, removeToast]);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-[100]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] ${
            toast.variant === "destructive"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          <div>
            <h3 className="font-semibold">{toast.title}</h3>
            {toast.description && <p className="text-sm">{toast.description}</p>}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-sm underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}