import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";

// Pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ActiveParking from "@/pages/ActiveParking";
import PaidParking from "@/pages/PaidParking";
import DebtParking from "@/pages/DebtParking";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes with layout */}
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <div className="h-full w-full flex flex-col gradient-bg">
              {/* Header */}
              <Header
                onMenuToggle={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
              />

              {/* Main content with sidebar */}
              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

                {/* Main content area */}
                <main className="flex-1 overflow-auto scrollbar-thin p-4 md:p-6">
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/dashboard" replace />}
                    />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/parking" element={<ActiveParking />} />
                    <Route path="/paid" element={<PaidParking />} />
                    <Route path="/debt" element={<DebtParking />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </PrivateRoute>
        }
      />

      {/* 404 for unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
