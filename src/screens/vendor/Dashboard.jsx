import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import OverviewCard from '../../components/OverviewCard';
import apiService from '../service/apiService';
import { FaMoneyBillWave, FaShoppingCart, FaUsers, FaBox } from 'react-icons/fa';
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
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const VendorDashboard = () => {
    const { user } = useAuth();
    const { orders, products, metalPrices, loading, error } = useData();
    const [ordersSummary, setOrdersSummary] = useState(null);
    const [holdingsSummary, setHoldingsSummary] = useState(null);

    // Fetch additional summaries
    useEffect(() => {
        const fetchSummaries = async () => {
            const orderResult = await apiService.orders.getSummary();
            if (orderResult.success) {
                setOrdersSummary(orderResult.data.data || orderResult.data);
            }

            const holdingResult = await apiService.holdings.getSummary();
            if (holdingResult.success) {
                setHoldingsSummary(holdingResult.data.data || holdingResult.data);
            }
        };

        if (user) {
            fetchSummaries();
        }
    }, [user]);

    // Calculate metrics
    const metrics = {
        totalRevenue: orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
        totalOrders: orders.length,
        totalCustomers: new Set(orders.map(o => o.customerName || o.userId)).size,
        totalProducts: products.length,
        completedOrders: orders.filter(order => order.status === 'completed').length,
        pendingOrders: orders.filter(order => order.status === 'pending').length,
        lowStockProducts: products.filter(product => product.stock < 10).length,
    };

    // Recent orders (last 5)
    const recentOrders = orders
        .sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt))
        .slice(0, 5);

    // Orders by status
    const ordersByStatus = {
        completed: orders.filter(o => o.status === 'completed').length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    // Revenue trend (last 7 days)
    const getRevenueTrend = () => {
        const days = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }

        return days.map(date => {
            const dayOrders = orders.filter(order =>
                new Date(order.orderDate || order.createdAt).toISOString().split('T')[0] === date
            );
            return {
                date: new Date(date).toLocaleDateString('en-IN', { weekday: 'short' }),
                revenue: dayOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
            };
        });
    };

    const revenueTrend = getRevenueTrend();

    // Chart data
    const statusChartData = {
        labels: ['Completed', 'Pending', 'Processing', 'Cancelled'],
        datasets: [{
            label: 'Orders',
            data: [ordersByStatus.completed, ordersByStatus.pending, ordersByStatus.processing, ordersByStatus.cancelled],
            backgroundColor: [
                'rgba(34, 197, 94, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(239, 68, 68, 0.8)',
            ],
            borderWidth: 1,
        }],
    };

    const revenueChartData = {
        labels: revenueTrend.map(d => d.date),
        datasets: [{
            label: 'Revenue (₹)',
            data: revenueTrend.map(d => d.revenue),
            borderColor: 'rgba(245, 158, 11, 1)',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            tension: 0.4,
        }],
    };

    const getOrderTypeColor = (type) => {
        switch (type) {
            case 'buy':
                return 'text-green-600 bg-green-100';
            case 'sell':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-800">Vendor Dashboard</h1>
                            <p className="text-gray-600 mt-2">Welcome back, {user?.name || 'User'}!</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <OverviewCard
                                title="Total Revenue"
                                value={`₹${metrics.totalRevenue.toLocaleString('en-IN')}`}
                                icon={FaMoneyBillWave}
                                color="green"
                            />
                            <OverviewCard
                                title="Total Orders"
                                value={metrics.totalOrders}
                                icon={FaShoppingCart}
                                color="blue"
                            />
                            <OverviewCard
                                title="Customers"
                                value={metrics.totalCustomers}
                                icon={FaUsers}
                                color="purple"
                            />
                            <OverviewCard
                                title="Products"
                                value={metrics.totalProducts}
                                icon={FaBox}
                                color="amber"
                            />
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Revenue Trend */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trend (Last 7 Days)</h3>
                                <div className="h-64">
                                    <Line
                                        data={revenueChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { display: false },
                                                tooltip: {
                                                    callbacks: {
                                                        label: (context) => `₹${context.parsed.y.toLocaleString('en-IN')}`,
                                                    },
                                                },
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        callback: (value) => `₹${value.toLocaleString('en-IN')}`,
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Order Status Distribution */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
                                <div className="h-64">
                                    <Bar
                                        data={statusChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { display: false },
                                            },
                                            scales: {
                                                y: { beginAtZero: true },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders Table */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {recentOrders.map((order) => (
                                            <tr key={order.id || order._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id || order._id}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{order.customerName || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrderTypeColor(order.type)}`}>
                                                        {order.type ? order.type.toUpperCase() : 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    ₹{(order.totalPrice || 0).toLocaleString('en-IN')}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'completed'
                                                            ? 'text-green-600 bg-green-100'
                                                            : order.status === 'pending'
                                                                ? 'text-yellow-600 bg-yellow-100'
                                                                : order.status === 'processing'
                                                                    ? 'text-blue-600 bg-blue-100'
                                                                    : 'text-red-600 bg-red-100'
                                                            }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {recentOrders.length === 0 && (
                                    <div className="px-6 py-8 text-center text-gray-500">
                                        No orders found
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Completed Orders</span>
                                        <span className="text-sm font-semibold text-green-600">{metrics.completedOrders}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Pending Orders</span>
                                        <span className="text-sm font-semibold text-yellow-600">{metrics.pendingOrders}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Processing Orders</span>
                                        <span className="text-sm font-semibold text-blue-600">{ordersByStatus.processing}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Metal Prices</h3>
                                <div className="space-y-3">
                                    {metalPrices && Object.entries(metalPrices).slice(0, 3).map(([metal, price]) => (
                                        <div key={metal} className="flex justify-between">
                                            <span className="text-sm text-gray-600">{metal}</span>
                                            <span className="text-sm font-semibold text-amber-600">₹{price.toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Avg Order Value</span>
                                        <span className="text-sm font-semibold text-amber-600">
                                            ₹{metrics.totalOrders > 0 ? (metrics.totalRevenue / metrics.totalOrders).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '0'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Success Rate</span>
                                        <span className="text-sm font-semibold text-green-600">
                                            {metrics.totalOrders > 0 ? Math.round((metrics.completedOrders / metrics.totalOrders) * 100) : 0}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;