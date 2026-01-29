import React from "react";
import { Loader2 } from "lucide-react";

const Loading = ({
  size = "md",
  fullScreen = false,
  message = "Đang tải...",
}) => {
  // Size variants
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  // Full screen loading
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="glass-card rounded-2xl p-8 flex flex-col items-center gap-4">
          <Loader2 className={`${spinnerSize} text-blue-600 animate-spin`} />
          {message && <p className="text-slate-700 font-medium">{message}</p>}
        </div>
      </div>
    );
  }

  // Inline loading
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${spinnerSize} text-blue-600 animate-spin`} />
        {message && <p className="text-slate-600 text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default Loading;
