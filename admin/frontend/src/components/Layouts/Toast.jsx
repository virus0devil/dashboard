import React from "react";
import {X} from 'lucide-react';

const toastStyles = {
  success: {
    icon: "✓",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "Success",
  },
  error: {
    icon: "✕",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    title: "Error",
  },
  warning: {
    icon: "!",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    title: "Warning",
  },
  info: {
    icon: "i",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Info",
  },
};

const Toast = ({ id, message, type = "success", onClose }) => {
  const style = toastStyles[type] || toastStyles.success;

  return (
    <div className="w-[380px] rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
      <div className="flex items-start gap-3">
        
        {/* Icon */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.iconBg} ${style.iconColor} font-semibold`}
        >
          {style.icon}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">
            {style.title}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {message}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={() => onClose(id)}
          className="text-gray-400 transition hover:text-gray-600"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;