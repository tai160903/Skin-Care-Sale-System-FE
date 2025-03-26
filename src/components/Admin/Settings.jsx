import { useEffect, useState } from "react";
import { getDashboardData } from "../services/adminService/dashboardService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FaDollarSign,
  FaShoppingCart,
  FaBox,
  FaCalendarDay,
  FaCrown,
} from "react-icons/fa";

const Setting = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [timeFilter, setTimeFilter] = useState("daily");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDashboardData(timeFilter);
      setDashboardData(data);
    };
    fetchData();
  }, [timeFilter]);

  if (!dashboardData)
    return (
      <p className="text-center text-lg font-semibold text-gray-600">
        Loading data...
      </p>
    );

  const formatCurrency = (value) => {
    if (typeof value !== "number") return "$0";
    return `$${value.toLocaleString()}`;
  };

  // Tooltip tuỳ chỉnh cho biểu đồ
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="text-green-700 font-semibold">
            {payload[0].payload.name}
          </p>
          <p className="text-gray-600">
            <span className="font-bold">Total Sold:</span> {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-green-700">
        Admin Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="border rounded-lg p-6 shadow-lg bg-gradient-to-r from-green-400 to-green-600 text-white flex items-center gap-4">
          <FaCalendarDay className="text-4xl" />
          <div>
            <p className="text-lg">
              {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} Revenue
            </p>
            <p className="text-3xl font-bold">
              {formatCurrency(dashboardData.dailyRevenue)}
            </p>
          </div>
        </div>
        <div className="border rounded-lg p-6 shadow-lg bg-white flex items-center gap-4">
          <FaDollarSign className="text-green-500 text-4xl" />
          <div>
            <p className="text-gray-500">Monthly Revenue</p>
            <p className="text-2xl font-bold">
              {formatCurrency(dashboardData.monthlyRevenue)}
            </p>
          </div>
        </div>
        <div className="border rounded-lg p-6 shadow-lg bg-white flex items-center gap-4">
          <FaDollarSign className="text-green-500 text-4xl" />
          <div>
            <p className="text-gray-500">Yearly Revenue</p>
            <p className="text-2xl font-bold">
              {formatCurrency(dashboardData.yearlyRevenue)}
            </p>
          </div>
        </div>
        <div className="border rounded-lg p-6 shadow-lg bg-white flex items-center gap-4">
          <FaShoppingCart className="text-blue-500 text-4xl" />
          <div>
            <p className="text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold">
              {dashboardData.totalOrders || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Best Selling Products */}
      <div className="border rounded-lg p-6 shadow-lg bg-white">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <FaBox className="text-green-500" /> Best Selling Products
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={dashboardData.bestSellingProducts}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis
              dataKey="productInfo.name"
              tick={{ fill: "#4CAF50", fontSize: 14 }}
            />
            <YAxis tick={{ fill: "#4CAF50", fontSize: 14 }} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(76, 175, 80, 0.2)" }}
            />
            <Legend wrapperStyle={{ fontSize: 14, color: "#4CAF50" }} />
            <Bar
              dataKey="totalSold"
              fill="url(#colorUv)"
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#81C784" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Customers */}
      <div className="border rounded-lg p-6 shadow-lg bg-white">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <FaCrown className="text-yellow-500" /> Top Customers
        </h2>
        {dashboardData.topCustomers.length > 0 ? (
          <ul className="list-disc pl-6 space-y-2">
            {dashboardData.topCustomers.map((customer) => (
              <li
                key={customer._id}
                className="font-medium text-gray-700 flex items-center gap-2"
              >
                <FaDollarSign className="text-green-500" />
                <span className="text-green-600">
                  Spent: {formatCurrency(customer.totalSpent)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No data available</p>
        )}
      </div>
    </div>
  );
};

export default Setting;
