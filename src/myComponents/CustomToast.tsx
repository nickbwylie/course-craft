import { forwardRef } from "react";
import { Toast as ToastPrimitive } from "@/components/ui/toast";
import { ToastProps } from "@/components/ui/toast";
import "@/styles/toast.css";

export const CustomToast = forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <ToastPrimitive
        ref={ref}
        className={`Toaster__toast ${className}`}
        data-variant={variant}
        {...props}
      />
    );
  }
);

CustomToast.displayName = "CustomToast";
