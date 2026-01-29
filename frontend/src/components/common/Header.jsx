import React, { useState, useEffect } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { APP_NAME, COMPANY_NAME } from "@/utils/constants";
import { formatDateTime } from "@/utils/formatters";

const Header = ({ onMenuToggle, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    const confirmed = window.confirm("Bạn có chắc muốn đăng xuất?");
    if (confirmed) {
      const result = await logout();
      if (result.success) {
        navigate("/login");
      }
    }
  };

  return (
    <header className="glass-card border-b border-slate-200/50 px-4 md:px-6 py-4 flex items-center justify-between flex-shrink-0">
      {/* Left side - Logo and title */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-slate-600" />
          ) : (
            <Menu className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* Logo */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>

        {/* Title and company name */}
        <div className="hidden sm:block">
          <h1 className="text-base md:text-lg font-bold text-slate-900">
            {APP_NAME}
          </h1>
          <p className="text-xs text-slate-600">{COMPANY_NAME}</p>
        </div>
      </div>

      {/* Right side - Time and user info */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Current time */}
        <div className="text-right hidden md:block">
          <p className="text-xs text-slate-600">
            {formatDateTime(currentTime, "EEEE, dd/MM/yyyy")}
          </p>
          <p className="text-base md:text-lg font-semibold text-slate-900">
            {formatDateTime(currentTime, "HH:mm:ss")}
          </p>
        </div>

        {/* User info */}
        {user && (
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user.fullName?.charAt(0) || user.username?.charAt(0) || "A"}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-slate-900">
                {user.fullName || user.username}
              </p>
              <p className="text-xs text-slate-600">{user.role || "Admin"}</p>
            </div>
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-50 transition-colors group"
          title="Đăng xuất"
        >
          <LogOut className="w-5 h-5 text-slate-600 group-hover:text-red-600 transition-colors" />
        </button>
      </div>
    </header>
  );
};

export default Header;
