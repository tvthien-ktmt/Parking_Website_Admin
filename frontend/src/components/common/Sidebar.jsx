import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "Tổng quan",
    },
    {
      to: "/parking",
      icon: Car,
      label: "Xe đang gửi",
    },
    {
      to: "/paid",
      icon: CheckCircle,
      label: "Đã thanh toán",
    },
    {
      to: "/debt",
      icon: AlertTriangle,
      label: "Chưa thanh toán",
    },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 glass-card border-r border-slate-200/50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="text-xl">{item.emoji}</span>
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200/50">
          <div className="text-xs text-slate-600 text-center">
            <p>Version 1.0.0</p>
            <p className="mt-1">© 2024 Smart Parking</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
