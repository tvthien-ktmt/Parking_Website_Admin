import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl p-8 md:p-12 max-w-lg w-full text-center animate-fade-in">
        {/* 404 Icon */}
        <div className="mb-6">
          <div className="text-8xl md:text-9xl font-bold text-gradient mb-4">
            404
          </div>
          <div className="text-6xl mb-4">🚧</div>
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          Trang không tồn tại
        </h1>
        <p className="text-slate-600 mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-primary inline-flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </button>
        </div>

        {/* Additional info */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Nếu bạn nghĩ đây là lỗi, vui lòng liên hệ quản trị viên
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
