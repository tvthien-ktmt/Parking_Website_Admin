import React, { useState, useEffect } from "react";
import { useParkingData } from "@/hooks/useParkingData";
import { useWebSocket } from "@/hooks/useWebSocket";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import Loading from "@/components/common/Loading";
import { formatCurrency, getRelativeTime } from "@/utils/formatters";
import { PARKING_STATUS } from "@/utils/constants";

const Dashboard = () => {
  const { statistics, allSessions, isLoading, refreshData } = useParkingData();

  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    values: [],
  });

  // WebSocket for real-time updates
  useWebSocket(
    (data) => {
      console.log("Dashboard received update:", data);
      refreshData();
    },
    (data) => {
      console.log("Dashboard received payment:", data);
      refreshData();
    },
  );

  // Update recent activity
  useEffect(() => {
    if (allSessions && allSessions.length > 0) {
      const recent = [...allSessions]
        .sort(
          (a, b) =>
            new Date(b.created_at || b.time_in) -
            new Date(a.created_at || a.time_in),
        )
        .slice(0, 10);
      setRecentActivity(recent);
    }
  }, [allSessions]);

  // Update chart data (last 7 days revenue)
  useEffect(() => {
    if (allSessions && allSessions.length > 0) {
      const last7Days = [];
      const today = new Date();

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last7Days.push(date);
      }

      const labels = last7Days.map((date) =>
        date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
      );

      const values = last7Days.map((date) => {
        const dateStr = date.toDateString();
        const dayRevenue = allSessions
          .filter(
            (s) =>
              s.status === PARKING_STATUS.PAID &&
              new Date(s.time_out).toDateString() === dateStr,
          )
          .reduce((sum, s) => sum + (s.amount || 0), 0);
        return dayRevenue;
      });

      setChartData({ labels, values });
    }
  }, [allSessions]);

  // Get status badge and icon
  const getActivityIcon = (status) => {
    switch (status) {
      case PARKING_STATUS.IN_PARKING:
        return "🚗";
      case PARKING_STATUS.PAID:
        return "✅";
      case PARKING_STATUS.DEBT:
      case PARKING_STATUS.UNPAID:
        return "⚠️";
      default:
        return "📋";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case PARKING_STATUS.IN_PARKING:
        return (
          <span className="status-badge status-badge-parking">Đang gửi</span>
        );
      case PARKING_STATUS.PAID:
        return <span className="status-badge status-badge-paid">Đã TT</span>;
      case PARKING_STATUS.DEBT:
      case PARKING_STATUS.UNPAID:
        return <span className="status-badge status-badge-debt">Nợ</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="Đang tải dữ liệu..." />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          // icon="🚗"
          label="Đang gửi"
          value={statistics.totalParking}
          color="blue"
        />
        <StatCard
          // icon="✅"
          label="Đã thanh toán"
          value={statistics.totalPaid}
          color="green"
        />
        <StatCard
          // icon="⚠️"
          label="Còn nợ"
          value={statistics.totalDebt}
          color="red"
        />
        <StatCard
          // icon="💰"
          label="Doanh thu hôm nay"
          value={formatCurrency(statistics.todayRevenue)}
          color="cyan"
        />
      </div>

      {/* Chart */}
      <RevenueChart
        data={chartData}
        type="bar"
        title="Doanh thu 7 ngày gần đây"
      />

      {/* Recent Activity */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 status-pulse"></span>
          Hoạt động gần đây
        </h3>

        {recentActivity.length === 0 ? (
          <div className="empty-state py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-slate-500">Chưa có hoạt động nào</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-auto scrollbar-thin">
            {recentActivity.map((activity, index) => (
              <div
                key={activity.id || activity._id || index}
                className="activity-item"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {getActivityIcon(activity.status)}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">
                      {activity.plate_number}
                    </p>
                    <p className="text-xs text-slate-600">
                      {activity.vehicle_type} •{" "}
                      {getRelativeTime(activity.created_at || activity.time_in)}
                    </p>
                  </div>
                </div>
                {getStatusBadge(activity.status)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4">
          <h4 className="text-sm font-medium text-slate-600 mb-2">
            Trung bình thời gian gửi
          </h4>
          <p className="text-2xl font-bold text-slate-900">2.5h</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <h4 className="text-sm font-medium text-slate-600 mb-2">
            Tổng lượt gửi hôm nay
          </h4>
          <p className="text-2xl font-bold text-slate-900">
            {statistics.totalParking + statistics.totalPaid}
          </p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <h4 className="text-sm font-medium text-slate-600 mb-2">
            Tỷ lệ thanh toán
          </h4>
          <p className="text-2xl font-bold text-green-600">
            {statistics.totalPaid + statistics.totalDebt > 0
              ? Math.round(
                  (statistics.totalPaid /
                    (statistics.totalPaid + statistics.totalDebt)) *
                    100,
                )
              : 0}
            %
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
