import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import OverviewCard from "../components/OverviewCard";
import { FaRupeeSign, FaClipboard, FaArchive, FaMoneyBillWave, FaTimes } from "react-icons/fa";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { apiFetch } from "../api";
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

  useEffect(() => {
    const fetchStats = async () => {
      setError("");
      try {
        const data = await apiFetch("/dashboard/stats");
        setStats(data);
      } catch (err) {
        setError(err.message || "Unable to load dashboard data");
      }
    };

    const initialFetch = async () => {
      setLoading(true);
      await fetchStats();
      setLoading(false);
    };

    initialFetch();
    const intervalId = setInterval(fetchStats, 60000); // Refresh stats every 60 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount

  }, []);

  // Overview metrics
  const metrics = [
    {
      title: "Today's Sales",
      value: stats?.todaysSales != null ? `₹${stats.todaysSales}` : "-",
      bgColor: "bg-green-500",
      change: "+12%",
    },
    {
      title: "Gold Rate (24K)",
      value: stats?.goldRate != null ? `₹${stats.goldRate}/g` : "-",
      bgColor: "bg-yellow-500",
      change: "Live",
    },
    {
      title: "Active Orders",
      value: stats?.activeOrders != null ? stats.activeOrders.toString() : "-",
      bgColor: "bg-orange-500",
      change: "+12%",
    },
    {
      title: "Total Stock",
      value: stats?.totalStock != null ? `${stats.totalStock} kg` : "-",
      bgColor: "bg-orange-500",
      change: "+8%",
    },
    {
      title: "Total Revenue",
      value: stats?.totalRevenue != null ? `₹${stats.totalRevenue}` : "-",
      bgColor: "bg-orange-500",
      change: "+15%",
    },
    {
      title: "Cash Balance",
      value: stats?.cashBalance != null ? `₹${stats.cashBalance}` : "-",
      bgColor: "bg-orange-500",
      change: "+5%",
    }
  ];

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Monthly Sales Chart Data
  const monthlySalesData = {
    labels:
      stats?.monthlySales?.map((item) => monthLabels[(item.month || 1) - 1] || item.month) ||
      ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Monthly Sales',
        data:
          stats?.monthlySales?.map((item) => item.sales ?? item.revenue) ||
          [13000, 19500, 15000, 22000, 26000],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
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
  const orderStatusData = {
    labels: stats?.orderStatus?.map((item) => item.status) || ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: stats?.orderStatus?.map((item) => item.count) || [45, 78, 32, 156, 12],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
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
    labels: stats?.topMaterials?.map((item) => item.material) || ['Gold 24K', 'Gold 22K', 'Gold 18K', 'Silver 999', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'Stock Value',
        data: stats?.topMaterials?.map((item) => item.value) || [45.2, 32.8, 28.5, 15.3, 12.7, 8.9],
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1
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

  // Sample data for Recent Orders
  const recentOrders = stats?.recentOrders || [
    { orderNumber: "ORD-2024-001", customer: "Rajesh Kumar", material: "Gold 24K", value: "₹2,45,000", status: "Delivered" },
    { orderNumber: "ORD-2024-002", customer: "Priya Sharma", material: "Gold 22K", value: "₹1,89,000", status: "Processing" },
    { orderNumber: "ORD-2024-003", customer: "Amit Patel", material: "Silver 999", value: "₹95,000", status: "Shipped" },
    { orderNumber: "ORD-2024-004", customer: "Sneha Gupta", material: "Gold 18K", value: "₹3,25,000", status: "Pending" },
    { orderNumber: "ORD-2024-005", customer: "Vikram Singh", material: "Platinum", value: "₹8,75,000", status: "Delivered" },
    { orderNumber: "ORD-2024-006", customer: "Meera Joshi", material: "Diamond", value: "₹12,50,000", status: "Processing" }
  ];

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div className="flex-1 ml-[290px] overflow-x-hidden">
        <Header />
        <div className="p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            {/* Other Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Monthly Sales Chart */}
              <div className="bg-white rounded-lg card-shadow p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedModal('totalRevenue')}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales</h3>
                <div style={{ height: '300px' }}>
                  <Line data={monthlySalesData} options={monthlySalesOptions} />
                </div>
              </div>
              {/* Stock Value Chart */}
              <div className="bg-white rounded-lg card-shadow p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedModal('orderStatus')}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Orders by Status</h3>
                <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                  <Doughnut data={orderStatusData} options={orderStatusOptions} />
                </div>
              </div>
              <div className="bg-white rounded-lg card-shadow p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedModal('materialStock')}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Materials by Stock Value</h3>
                <div style={{ height: '300px' }}>
                  <Bar data={stockValueData} options={stockValueOptions} />
                </div>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-lg card-shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Number</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {order.orderNumber || order.orderId || order._id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {order.customerName || order.customer?.name || order.customer || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {order.material || order.productName || order.product?.name || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          {order.value || order.totalPrice}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
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
