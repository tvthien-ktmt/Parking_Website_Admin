import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { CHART_COLORS } from "@/utils/constants";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const RevenueChart = ({ data, type = "bar", title = "Biểu đồ doanh thu" }) => {
  // Chart options
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: {
              family: "Be Vietnam Pro",
              size: 12,
            },
            padding: 15,
            usePointStyle: true,
          },
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleFont: {
            family: "Be Vietnam Pro",
            size: 13,
            weight: "bold",
          },
          bodyFont: {
            family: "Be Vietnam Pro",
            size: 12,
          },
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                label +=
                  new Intl.NumberFormat("vi-VN").format(context.parsed.y) + "đ";
              }
              return label;
            },
          },
        },
      },
      scales:
        type !== "doughnut"
          ? {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  font: {
                    family: "Be Vietnam Pro",
                    size: 11,
                  },
                },
              },
              y: {
                grid: {
                  color: "rgba(148, 163, 184, 0.1)",
                },
                ticks: {
                  font: {
                    family: "Be Vietnam Pro",
                    size: 11,
                  },
                  callback: function (value) {
                    return (
                      new Intl.NumberFormat("vi-VN", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(value) + "đ"
                    );
                  },
                },
              },
            }
          : undefined,
    }),
    [type],
  );

  // Chart data
  const chartData = useMemo(() => {
    if (type === "doughnut") {
      return {
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            backgroundColor: [
              CHART_COLORS.primary,
              CHART_COLORS.success,
              CHART_COLORS.danger,
              CHART_COLORS.warning,
              CHART_COLORS.info,
              CHART_COLORS.purple,
              CHART_COLORS.pink,
            ],
            borderWidth: 2,
            borderColor: "#ffffff",
          },
        ],
      };
    }

    return {
      labels: data.labels,
      datasets: [
        {
          label: "Doanh thu",
          data: data.values,
          backgroundColor:
            type === "line"
              ? "rgba(59, 130, 246, 0.1)"
              : "rgba(59, 130, 246, 0.8)",
          borderColor: CHART_COLORS.primary,
          borderWidth: 2,
          fill: type === "line",
          tension: 0.4,
          pointRadius: type === "line" ? 4 : 0,
          pointHoverRadius: type === "line" ? 6 : 0,
          pointBackgroundColor: CHART_COLORS.primary,
        },
      ],
    };
  }, [data, type]);

  // Render chart based on type
  const renderChart = () => {
    const chartProps = {
      data: chartData,
      options,
    };

    switch (type) {
      case "line":
        return <Line {...chartProps} />;
      case "doughnut":
        return <Doughnut {...chartProps} />;
      case "bar":
      default:
        return <Bar {...chartProps} />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="h-[300px] md:h-[350px]">{renderChart()}</div>
    </div>
  );
};

export default RevenueChart;
