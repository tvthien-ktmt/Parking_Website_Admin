import React from "react";

const StatCard = ({
  icon,
  label,
  value,
  color = "blue",
  trend = null,
  onClick = null,
}) => {
  // Color variants
  const colorClasses = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    red: "bg-red-100",
    yellow: "bg-yellow-100",
    cyan: "bg-cyan-100",
    purple: "bg-purple-100",
  };

  const textColorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
    cyan: "text-cyan-600",
    purple: "text-purple-600",
  };

  const iconBg = colorClasses[color] || colorClasses.blue;
  const valueColor = textColorClasses[color] || textColorClasses.blue;

  return (
    <div
      className={`stat-card ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}
        >
          {typeof icon === "string" ? (
            <span className="text-xl">{icon}</span>
          ) : (
            icon
          )}
        </div>
        <span className="text-slate-600 text-sm font-medium">{label}</span>
      </div>

      <div className="flex items-end justify-between">
        <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>

        {trend && (
          <div
            className={`text-xs font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
          >
            <span>{trend.isPositive ? "↑" : "↓"}</span>
            <span className="ml-1">{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
