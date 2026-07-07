import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import OverviewCard from "../components/OverviewCard";
import { FaTimes } from "react-icons/fa";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { apiFetch } from "../api";
import apiService from "./service/apiService";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from 'chart.js';
import GoldPriceDashboard from "./GoldPriceDashboard";
import LiveMetalsTicker from "../components/LiveMetalsTicker";
import { IconContext } from "react-icons";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedModal, setSelectedModal] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("🔄 Fetching dashboard data...");

      const [summaryResult, ordersResult, inventoryResult] = await Promise.all([
        apiService.request('/dashboard/summary', 'GET'),
        apiService.request('/orders?limit=5&sortBy=createdAt:desc', 'GET'),
        apiService.request('/products/inventory/report', 'GET'),
      ]);

      console.log("📊 Summary Response:", summaryResult);
      console.log("📋 Orders Response:", ordersResult);
      console.log("📦 Inventory Response:", inventoryResult);

      // Extract real data with proper fallbacks
      const summaryData = summaryResult.success ? summaryResult.data : {};
      const ordersData = ordersResult.success ? ordersResult.data : {};
      const inventoryData = inventoryResult.success ? inventoryResult.data : {};

      // Handle nested data structures from API
      const recentOrders = ordersData?.data?.orders || ordersData?.orders || ordersData?.items || [];
      const totalOrdersCount = ordersData?.data?.total || ordersData?.total || ordersData?.meta?.total || ordersData?.count || ordersData?.totalCount || recentOrders.length;
      const inventoryReport = inventoryData?.data || inventoryData;

      setStats({
        ...summaryData,
        recentOrders,
        totalOrdersCount,
        inventoryReport,
      });
      console.log("✅ Dashboard data loaded successfully");
    } catch (err) {
      console.error("🔴 Error fetching dashboard data:", err);
      setError("Unable to connect to API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Overview metrics
  const metrics = [
    {
      title: "Today's Sales",
      value: stats?.overview?.todaysSales != null ? `₹${stats.overview.todaysSales.toLocaleString('en-IN')}` : "-",
      bgColor: "bg-gradient-to-br from-green-400 to-green-600",
      change: "+12%",
    },
    {
      title: "Gold Rate (24K)",
      value: stats?.overview?.goldRate != null ? `₹${stats.overview.goldRate.toLocaleString('en-IN')}/g` : "-",
      bgColor: "bg-gradient-to-br from-yellow-300 to-yellow-600",
      change: "Live",
    },
    {
      title: "Active Orders",
      value: stats?.overview?.activeOrders != null ? stats.overview.activeOrders.toString() : "-",
      bgColor: "bg-gradient-to-br from-pink-400 to-pink-600",
      change: "+12%",
    },
    {
      title: "Total Orders",
      value: stats?.overview?.totalOrders != null ? stats.overview.totalOrders.toString() : stats?.totalOrdersCount != null ? stats.totalOrdersCount.toString() : "-",
      bgColor: "bg-gradient-to-br from-violet-400 to-violet-600",
      change: stats?.overview?.totalOrdersChange ? `${stats.overview.totalOrdersChange}` : "",
    },
    {
      title: "Total Stock",
      value: stats?.overview?.totalStockKg != null ? `${stats.overview.totalStockKg} kg` : "-",
      bgColor: "bg-gradient-to-br from-cyan-400 to-cyan-600",
      change: "+8%",
    },
    {
      title: "Total Revenue",
      value: stats?.overview?.totalRevenue != null ? `₹${stats.overview.totalRevenue.toLocaleString('en-IN')}` : "-",
      bgColor: "bg-gradient-to-br from-purple-400 to-purple-600",
      change: "+15%",
    },
    {
      title: "Cash Balance",
      value: stats?.overview?.cashBalance != null ? `₹${stats.overview.cashBalance.toLocaleString('en-IN')}` : "-",
      bgColor: "bg-gradient-to-br from-indigo-400 to-indigo-600",
      change: "+5%",
    },
    {
      title: "Total Products",
      value: stats?.inventoryReport?.totalProducts?.toString() || "-",
      bgColor: "bg-gradient-to-br from-blue-400 to-blue-600",
      change: `${stats?.inventoryReport?.activeProducts || 0} active`,
    },
    {
      title: "Stock Value",
      value: stats?.inventoryReport?.totalStockValue != null ? `₹${stats.inventoryReport.totalStockValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : "-",
      bgColor: "bg-gradient-to-br from-orange-400 to-orange-600",
      change: "Updated",
    }
  ];

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Monthly Sales Chart Data
  const monthlySalesData = {
    labels:
      stats?.monthlySales?.map((item) => monthLabels[(item.month || 1) - 1] || item.month) ||
      stats?.monthlySalesData?.map((item) => item.label) ||
      [],
    datasets: [
      {
        label: 'Monthly Sales',
        data:
          stats?.monthlySales?.map((item) => item.sales ?? item.revenue ?? item.amount) ||
          stats?.monthlySalesData?.map((item) => item.value) ||
          [],
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#FF6B6B',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
      }
    ]
  };

  const monthlySalesOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: '#e5e7eb',
        },
        ticks: {
          callback: function (value) {
            return value / 1000 + 'k';
          }
        }
      },
      x: {
        grid: {
          displayBorder: false,
          drawBorder: false,
          display: false,
        }
      }
    }
  };

  // Sales Orders by Status (Circular Graph)
  const orderStatusItems = (() => {
    if (Array.isArray(stats?.orderStatus)) return stats.orderStatus;
    if (Array.isArray(stats?.orderStatusDetails)) return stats.orderStatusDetails;
    if (stats?.ordersByStatus && typeof stats.ordersByStatus === 'object') {
      return Object.entries(stats.ordersByStatus).map(([status, count]) => ({ status, count }));
    }
    if (Array.isArray(stats?.overview?.orderStatus)) return stats.overview.orderStatus;
    return [];
  })();

  const orderStatusData = {
    labels: orderStatusItems.map((item) => item.status),
    datasets: [
      {
        data: orderStatusItems.map((item) => item.count || item.value || 0),
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#C7CEEA'],
        hoverBackgroundColor: ['#FF4757', '#2FBAA0', '#FFC837', '#6CC8D0', '#B39DDB'],
        borderColor: '#fff',
        borderWidth: 3,
      }
    ]
  };

  const orderStatusOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Sales Orders by Status'
      }
    },
    onClick: () => setSelectedModal('orderStatus')
  };

  // Top Materials by Stock Value (Bar Graph)
  const stockValueData = {
    labels: stats?.topMaterials?.map((item) => item.material || item.name) || [],
    datasets: [
      {
        label: 'Stock Value',
        data: stats?.topMaterials?.map((item) => item.value || item.stockValue) || [],
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#C7CEEA', '#FF8B94'],
        borderColor: ['#FF4757', '#2FBAA0', '#FFC837', '#6CC8D0', '#B39DDB', '#FF6B7A'],
        borderWidth: 2,
        borderRadius: 5,
      }
    ]
  };

  const stockValueOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top Materials by Stock Value'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value (Trillion Rp)'
        }
      }
    },
    onClick: () => setSelectedModal('materialStock')
  };

  // Inventory by Metal (Doughnut Chart)
  const inventoryByMetalData = {
    labels: stats?.inventoryReport?.byMetal ? Object.keys(stats.inventoryReport.byMetal).filter(k => stats.inventoryReport.byMetal[k] > 0) : ['GOLD', 'SILVER'],
    datasets: [
      {
        data: stats?.inventoryReport?.byMetal ? Object.values(stats.inventoryReport.byMetal).filter(v => v > 0) : [110, 25],
        backgroundColor: ['#FFD700', '#C0C0C0', '#FF6B6B', '#4ECDC4', '#FFE66D'],
        hoverBackgroundColor: ['#FFC800', '#A8A8A8', '#FF4757', '#2FBAA0', '#FFC837'],
        borderColor: '#fff',
        borderWidth: 3,
      }
    ]
  };

  const inventoryByMetalOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Inventory by Metal (Product Count)'
      }
    },
  };

  // Use real recent orders from API
  const recentOrders = stats?.recentOrders || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-100';
      case 'Processing': return 'text-blue-600 bg-blue-100';
      case 'Shipped': return 'text-yellow-600 bg-yellow-100';
      case 'Pending': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const closeModal = () => setSelectedModal(null);

  const renderModal = () => {
    const cashBalanceHistory = stats?.cashBalanceHistory || [];
    const revenueHistory = stats?.revenueHistory || [];
    const stockHistory = stats?.stockHistory || [];
    const activeOrdersData = stats?.activeOrdersData || [];
    const orderStatusDetails = stats?.orderStatusDetails || [];
    const materialStockDetails = stats?.materialStockDetails || [];
    const statusColors = { "Pending": "#FF6384", "Processing": "#36A2EB", "Shipped": "#FFCE56", "Delivered": "#4BC0C0", "Cancelled": "#9966FF" };

    if (!selectedModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-semibold">
              {selectedModal === 'cashBalance' && 'Cash Balance History'}
              {selectedModal === 'totalRevenue' && 'Revenue History'}
              {selectedModal === 'totalStock' && 'Stock Details'}
              {selectedModal === 'activeOrders' && 'Active Orders Details'}
              {selectedModal === 'orderStatus' && 'Sales Orders by Status Details'}
              {selectedModal === 'materialStock' && 'Material Stock Value Details'}
            </h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <FaTimes size={18} />
            </button>
          </div>

          <div className="p-6">
            {selectedModal === 'cashBalance' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cashBalanceHistory.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm">{item.date}</td>
                        <td className="px-4 py-2 text-sm">{item.transaction}</td>
                        <td className={`px-4 py-2 text-sm font-medium ${item.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {item.amount}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium">{item.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedModal === 'totalRevenue' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {revenueHistory.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm">{item.month}</td>
                        <td className="px-4 py-2 text-sm font-medium">{item.revenue}</td>
                        <td className="px-4 py-2 text-sm text-green-600 font-medium">{item.growth}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedModal === 'totalStock' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stockHistory.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm font-medium">{item.material}</td>
                        <td className="px-4 py-2 text-sm">{item.currentStock}</td>
                        <td className="px-4 py-2 text-sm font-medium">₹{item.value?.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedModal === 'activeOrders' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activeOrdersData.map((order, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm font-medium">{order._id}</td>
                        <td className="px-4 py-2 text-sm">{order.customer?.name || 'N/A'}</td>
                        <td className="px-4 py-2 text-sm">{order.productName || 'N/A'}</td>
                        <td className="px-4 py-2 text-sm font-medium">₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">{new Date(order.orderDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedModal === 'orderStatus' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {orderStatusDetails.map((status, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{status.status}</h4>
                        <p className="text-2xl font-bold text-gray-800">{status.count}</p>
                        <p className="text-sm text-gray-600">{status.percentage}</p>
                      </div>
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                        style={{ backgroundColor: statusColors[status.status] || '#cccccc' }}
                      >
                        {status.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedModal === 'materialStock' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(() => {
                      const totalValue = materialStockDetails.reduce((sum, m) => sum + m.value, 0);
                      return materialStockDetails.map((material, index) => {
                        const percentage = totalValue > 0 ? ((material.value / totalValue) * 100).toFixed(1) + '%' : '0%';
                        return (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm font-medium">{material.material}</td>
                            <td className="px-4 py-2 text-sm">{material.currentStock}</td>
                            <td className="px-4 py-2 text-sm font-medium">₹{material.value?.toLocaleString('en-IN')}</td>
                            <td className="px-4 py-2 text-sm">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: percentage }}></div>
                                </div>
                                <span className="text-xs">{percentage}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-72 overflow-x-hidden">
        <Header />
        <div className="p-4 sm:p-6 lg:p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-8">
              <IconContext.Provider value={{ size: "1.75rem" }}>
                {metrics.map((metric, index) => (
                  <OverviewCard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    // icon={metric.icon}
                    bgColor={metric.bgColor}
                    change={metric.change}
                    onClick={() => {
                      if (metric.title === "Total Stock") setSelectedModal('totalStock');
                      else if (metric.title === "Active Orders") setSelectedModal('activeOrders');
                      else if (metric.title === "Total Revenue") setSelectedModal('totalRevenue');
                      else if (metric.title === "Stock Value") setSelectedModal('materialStock');
                      else if (metric.title === "Cash Balance") setSelectedModal('cashBalance');
                    }}
                  />
                ))}
              </IconContext.Provider>
            </div>
            {/* Low Stock Alerts */}
            {
              stats?.lowStockAlerts && stats.lowStockAlerts.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                  <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                    ⚠️ Low Stock Alerts
                  </h3>
                  <div className="space-y-2">
                    {stats.lowStockAlerts.map((alert, index) => (
                      <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                        <span className="font-medium text-gray-800">{alert.name}</span>
                        <span className="text-red-600 font-semibold">
                          {alert.currentStock} units (Threshold: {alert.threshold})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
            {/* Gold Price Dashboard */}
            <div className="mb-8">
              <GoldPriceDashboard />
            </div>
            {/* Live Metals Ticker */}
            <div className="mb-8">
              <LiveMetalsTicker />
            </div>
            {/* Other Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8">
              {/* Monthly Sales Chart */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg card-shadow p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all border border-blue-100" onClick={() => setSelectedModal('totalRevenue')}>
                <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">📊 Monthly Sales</h3>
                <div style={{ height: '300px' }}>
                  <Line data={monthlySalesData} options={monthlySalesOptions} />
                </div>
              </div>
              {/* Stock Value Chart */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg card-shadow p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all border border-purple-100" onClick={() => setSelectedModal('orderStatus')}>
                <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">🔄 Sales Orders by Status</h3>
                <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                  <Doughnut data={orderStatusData} options={orderStatusOptions} />
                </div>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg card-shadow p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all border border-cyan-100" onClick={() => setSelectedModal('materialStock')}>
                <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">📈 Top Materials by Stock Value</h3>
                <div style={{ height: '300px' }}>
                  <Bar data={stockValueData} options={stockValueOptions} />
                </div>
              </div>
              {/* Inventory by Metal Chart */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg card-shadow p-4 sm:p-6 border border-yellow-100">
                <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">💎 Inventory by Metal</h3>
                <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                  <Doughnut data={inventoryByMetalData} options={inventoryByMetalOptions} />
                </div>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg card-shadow p-6 border border-gray-200">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-700 to-gray-700 bg-clip-text text-transparent mb-4">📋 Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b-2 border-blue-300">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">Order Number</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">Material</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">Value</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders && recentOrders.length > 0 ? (
                      recentOrders.map((order, index) => (
                        <tr key={index} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {order.orderNumber || order.orderId || order._id}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {order.customerName || order.customer?.name || order.userId || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {order.material || order.metal || order.productName || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            ₹{order.totalAmountINR?.toLocaleString('en-IN') || order.totalPrice?.toLocaleString('en-IN') || '0'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                          No recent orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div >
        {renderModal()}
      </div >
    </div >
  );
};

export default Dashboard;
