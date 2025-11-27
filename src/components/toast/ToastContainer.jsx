// src/components/ToastContainer.jsx
import { useSelector, useDispatch } from "react-redux";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useEffect } from "react";
import { removeToast } from "@/redux/features/toast/toastSlice";
export default function ToastContainer() {
  const toasts = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, toast.duration);
      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);
  return (
    <div className="fixed top-5 right-5 flex flex-col gap-2 z-50">
      {toasts.map((alert) => (
        <Alert key={alert.id} variant={alert.type} className="w-80">
          <AlertTitle>
            {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
          </AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
