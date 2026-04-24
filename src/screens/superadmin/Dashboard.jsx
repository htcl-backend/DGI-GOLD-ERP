import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import OverviewCard from "../../components/OverviewCard";
import { FaMoneyBillWave, FaShoppingCart, FaUsers, FaStore, FaUserCheck } from "react-icons/fa";
import { Line, Doughnut, Bar } from "react-chartjs-2";
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
import { useData } from "../../Contexts/DataContext";
import GoldPriceDashboard from "../GoldPriceDashboard";
import { useNavigate } from "react-router-dom";

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

const COLORS = ["#CC7B25", "#EDCDA4", "#10b981", "#ef4444", "#6366f1"];


const SuperAdminDashboard = () => {
    const { allOrders, allCustomers, allVendors, allProducts } = useData();
    const navigate = useNavigate();
    const [selectedModal, setSelectedModal] = useState(null);
    const [goldRate, setGoldRate] = useState({
        "24K": 6520,
        "22K": 6200,
        "18K": 5400,
        silver: 88,
    });

    const currentGoldRate24K = goldRate?.["24K"] ?? 0;

    // Calculate stats from all data
    const stats = {
        totalVendors: allVendors.length,
        totalCustomers: allCustomers.length,
        totalOrders: allOrders.length,
        totalRevenue: allOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
        activeOrders: allOrders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length,
        pendingKyc: allVendors.filter(v => v.kycStatus === 'pending').length,
        todaysRevenue: allOrders
            .filter(o => new Date(o.orderDate).toDateString() === new Date().toDateString())
            .reduce((sum, order) => sum + order.totalPrice, 0)
    };

    const metrics = [
        {
            title: "Total Vendors",
            value: stats.totalVendors.toString(),
            bgColor: "bg-blue-500",
            change: "+2 this month",
            icon: FaStore,
            onClick: () => navigate('/superadmin/vendors'),
        },
        {
            title: "Total Customers",
            value: stats.totalCustomers.toString(),
            bgColor: "bg-green-500",
            change: "+15 this month",
            icon: FaUsers,
            onClick: () => navigate('/superadmin/all-customers'),
        },
        {
            title: "Active Orders",
            value: stats.activeOrders.toString(),
            bgColor: "bg-orange-500",
            change: "Across all vendors",
            icon: FaShoppingCart,
            onClick: () => navigate('/superadmin/all-orders'),
        },
        {
            title: "Total Revenue",
            value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
            bgColor: "bg-purple-500",
            change: "+12% this month",
            icon: FaMoneyBillWave,
            onClick: () => navigate('/superadmin/reports'),
        },
        {
            title: "KYC Pending",
            value: stats.pendingKyc.toString(),
            bgColor: "bg-yellow-500",
            change: "Needs review",
            icon: FaUserCheck,
            onClick: () => navigate('/superadmin/kyc-approvals'),
        }
    ];

    // Monthly revenue chart data
    const monthlyRevenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Monthly Revenue',
            data: [850000, 920000, 1100000, 980000, 1250000, 1150000],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
        }]
    };

    // Order status distribution
    const orderStatusData = {
        labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        datasets: [{
            data: [
                allOrders.filter(o => o.status === 'Pending').length,
                allOrders.filter(o => o.status === 'Processing').length,
                allOrders.filter(o => o.status === 'Shipped').length,
                allOrders.filter(o => o.status === 'Delivered').length,
                allOrders.filter(o => o.status === 'Cancelled').length,
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }]
    };

    // Top vendors by revenue
    const topVendorsData = {
        labels: allVendors.map(v => v.name),
        datasets: [{
            label: 'Revenue',
            data: allVendors.map(v => v.totalRevenue),
            backgroundColor: '#36A2EB',
        }]
    };

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

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-4 sm:p-6 lg:p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Super Admin Dashboard</h1>
                        {/* <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-center mb-4">
                            <p className="text-xs text-amber-600 font-medium">Live Gold Rate</p>
                            <p className="text-lg font-bold text-amber-700">₹{currentGoldRate24K.toLocaleString()}<span className="text-xs font-normal">/g 24K</span></p>
                        </div> */}

                        {/* Live gold rate chart (stock market style) */}


                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 mb-8">
                            {metrics.map((metric, index) => (
                                <OverviewCard
                                    icon={metric.icon}
                                    key={index}
                                    title={metric.title}
                                    value={metric.value}
                                    bgColor={metric.bgColor}
                                    change={metric.change}
                                    onClick={metric.onClick}
                                />
                            ))}
                        </div>
                        <div className="mb-8">
                            <GoldPriceDashboard />
                        </div>
                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8">
                            <div className="bg-white rounded-lg card-shadow p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Monthly Revenue</h3>
                                <Line data={monthlyRevenueData} options={{
                                    responsive: true,
                                    plugins: { legend: { display: false } }
                                }} />
                            </div>

                            <div className="bg-white rounded-lg card-shadow p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
                                <Doughnut data={orderStatusData} />
                            </div>

                            <div className="bg-white rounded-lg card-shadow p-4 sm:p-6 lg:col-span-2">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Top Vendors by Revenue</h3>
                                <Bar data={topVendorsData} options={{
                                    responsive: true,
                                    plugins: { legend: { display: false } }
                                }} />
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-lg card-shadow p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Recent Orders (All Vendors)</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm sm:text-base">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Vendor</th>
                                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Customer</th>
                                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Product</th>
                                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                            <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {allOrders.slice(0, 5).map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 text-xs sm:text-sm">
                                                <td className="px-3 sm:px-4 py-3 font-medium text-gray-900">{order.id}</td>
                                                <td className="px-3 sm:px-4 py-3 text-gray-900 hidden sm:table-cell">{order.vendorName}</td>
                                                <td className="px-3 sm:px-4 py-3 text-gray-900 hidden md:table-cell">{order.customerName}</td>
                                                <td className="px-3 sm:px-4 py-3 text-gray-900 hidden lg:table-cell">{order.productName}</td>
                                                <td className="px-3 sm:px-4 py-3 font-medium text-gray-900">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                                                <td className="px-3 sm:px-4 py-3">
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
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
