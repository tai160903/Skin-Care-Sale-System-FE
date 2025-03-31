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
  FaSearch,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [timeFilter, setTimeFilter] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState(""); // Thêm state để lưu giá trị dropdown

  // Hàm fetch data chung
  const fetchDashboardData = async (start, end) => {
    setIsLoading(true);
    const data = await getDashboardData({
      startDate: start,
      endDate: end,
    });
    setDashboardData(data);
    setIsLoading(false);
  };

  // Initial data fetch
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setStartDate(today.toISOString().split("T")[0]);
    setEndDate(tomorrow.toISOString().split("T")[0]);
    setSelectedRange(today.toISOString().split("T")[0]); // Đặt giá trị mặc định cho dropdown

    fetchDashboardData(
      today.toISOString().split("T")[0],
      tomorrow.toISOString().split("T")[0],
    );
  }, []);

  const handleSearch = () => {
    if (startDate && endDate) {
      fetchDashboardData(startDate, endDate);
      // Không cần reset selectedRange, giữ nguyên giá trị dropdown
    }
  };

  const handleDateRangeChange = (e) => {
    const selectedDate = e.target.value;
    setSelectedRange(selectedDate); // Cập nhật giá trị dropdown
    setStartDate(selectedDate);

    const calculateEndDate = (start) => {
      const startDateObj = new Date(start);
      const endDateObj = new Date(start);
      const selectedOption =
        e.target.options[e.target.selectedIndex].text.toLowerCase();

      switch (selectedOption) {
        case "today":
          endDateObj.setDate(startDateObj.getDate() + 1);
          break;
        case "last 7 days":
          endDateObj.setDate(startDateObj.getDate() + 7);
          break;
        case "this month":
          endDateObj.setDate(1);
          endDateObj.setMonth(startDateObj.getMonth() + 1);
          endDateObj.setDate(0); // Sửa lại để lấy ngày cuối tháng chính xác
          break;
        case "this year":
          endDateObj.setFullYear(startDateObj.getFullYear());
          endDateObj.setMonth(11); // Tháng 12
          endDateObj.setDate(31); // Ngày cuối năm
          break;
        default:
          endDateObj.setDate(startDateObj.getDate() + 1);
      }

      return endDateObj.toISOString().split("T")[0];
    };

    const newEndDate = calculateEndDate(selectedDate);
    setEndDate(newEndDate);
    fetchDashboardData(selectedDate, newEndDate);
  };

  if (isLoading)
    return (
      <p className="text-center text-lg font-semibold text-gray-600">
        Loading data...
      </p>
    );

  if (!dashboardData)
    return (
      <p className="text-center text-lg font-semibold text-gray-600">
        No data available
      </p>
    );

  const formatCurrency = (value) => {
    if (typeof value !== "number") return "$0";
    return `$${value.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="text-green-700 font-semibold">
            {payload[0].payload.productInfo.name}
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

      {/* Date Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="startDate" className="text-gray-700 font-medium">
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="endDate" className="text-gray-700 font-medium">
            End Date:
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={selectedRange} // Gán giá trị cho dropdown
          onChange={handleDateRangeChange}
          className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Date Range</option>
          <option value={new Date().toISOString().split("T")[0]}>Today</option>
          <option
            value={(() => {
              const oneWeekAgo = new Date();
              oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
              return oneWeekAgo.toISOString().split("T")[0];
            })()}
          >
            Last 7 Days
          </option>
          <option
            value={(() => {
              const firstDayOfMonth = new Date();
              firstDayOfMonth.setDate(1);
              return firstDayOfMonth.toISOString().split("T")[0];
            })()}
          >
            This Month
          </option>
          <option
            value={(() => {
              const firstDayOfYear = new Date();
              firstDayOfYear.setMonth(0);
              firstDayOfYear.setDate(1);
              return firstDayOfYear.toISOString().split("T")[0];
            })()}
          >
            This Year
          </option>
        </select>
        <button
          onClick={handleSearch}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2"
        >
          <FaSearch /> Search
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="border rounded-lg p-6 shadow-lg bg-gradient-to-r from-green-400 to-green-600 text-white flex items-center gap-4">
          <FaCalendarDay className="text-4xl" />
          <div>
            <p className="text-lg">
              {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} Revenue
            </p>
            <p className="text-3xl font-bold">
              {formatCurrency(dashboardData.revenue)}
            </p>
          </div>
        </div>
        <div className="border rounded-lg p-6 shadow-lg bg-white flex items-center gap-4">
          <FaDollarSign className="text-green-500 text-4xl" />
          <div>
            <p className="text-gray-500">Monthly Revenue</p>
            <p className="text-2xl font-bold">
              {formatCurrency(dashboardData.revenue)}
            </p>
          </div>
        </div>
        <div className="border rounded-lg p-6 shadow-lg bg-white flex items-center gap-4">
          <FaDollarSign className="text-green-500 text-4xl" />
          <div>
            <p className="text-gray-500">Yearly Revenue</p>
            <p className="text-2xl font-bold">
              {formatCurrency(dashboardData.revenue)}
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
                <span>
                  {customer.customerInfo.name || "Anonymous"} -{" "}
                  <span className="text-green-600">
                    Spent: {formatCurrency(customer.totalSpent)}
                  </span>
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

export default AdminDashboard;
