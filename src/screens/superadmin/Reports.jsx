import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useData } from '../../Contexts/DataContext';
import { FaDownload, FaChartBar, FaCalendarAlt, FaMoneyBillWave, FaShoppingCart, FaUsers, FaStore } from 'react-icons/fa';
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
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Reports = () => {
    const { allOrders, allVendors, allCustomers } = useData();
    const [dateRange, setDateRange] = useState('30d');
    const [reportType, setReportType] = useState('overview');

    // Calculate date range
    const getDateRange = () => {
        const now = new Date();
        const start = new Date();

        switch (dateRange) {
            case '7d':
                start.setDate(now.getDate() - 7);
                break;
            case '30d':
                start.setDate(now.getDate() - 30);
                break;
            case '90d':
                start.setDate(now.getDate() - 90);
                break;
            case '1y':
                start.setFullYear(now.getFullYear() - 1);
                break;
            default:
                start.setDate(now.getDate() - 30);
        }

        return { start, end: now };
    };

    const { start, end } = getDateRange();

    // Filter data by date range
    const filteredOrders = allOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
    });

    // Calculate metrics
    const metrics = {
        totalRevenue: filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0),
        totalOrders: filteredOrders.length,
        totalCustomers: new Set(filteredOrders.map(order => order.customerId)).size,
        avgOrderValue: filteredOrders.length > 0 ?
            filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0) / filteredOrders.length : 0,
        buyOrders: filteredOrders.filter(order => order.type === 'buy').length,
        sellOrders: filteredOrders.filter(order => order.type === 'sell').length,
        completedOrders: filteredOrders.filter(order => order.status === 'completed').length,
        pendingOrders: filteredOrders.filter(order => order.status === 'pending').length
    };

    // Revenue by vendor
    const revenueByVendor = allVendors.map(vendor => {
        const vendorOrders = filteredOrders.filter(order => order.vendorId === vendor.id);
        const revenue = vendorOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        return {
            vendor: vendor.name,
            revenue,
            orders: vendorOrders.length
        };
    }).sort((a, b) => b.revenue - a.revenue);

    // Orders over time (last 30 days)
    const getOrdersOverTime = () => {
        const days = [];
        const now = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }

        return days.map(date => {
            const dayOrders = filteredOrders.filter(order =>
                new Date(order.createdAt).toISOString().split('T')[0] === date
            );
            return {
                date: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                orders: dayOrders.length,
                revenue: dayOrders.reduce((sum, order) => sum + order.totalAmount, 0)
            };
        });
    };

    const ordersOverTime = getOrdersOverTime();

    // Order status distribution
    const statusDistribution = {
        completed: filteredOrders.filter(o => o.status === 'completed').length,
        pending: filteredOrders.filter(o => o.status === 'pending').length,
        processing: filteredOrders.filter(o => o.status === 'processing').length,
        cancelled: filteredOrders.filter(o => o.status === 'cancelled').length
    };

    // Chart data
    const revenueChartData = {
        labels: revenueByVendor.map(v => v.vendor),
        datasets: [{
            label: 'Revenue (₹)',
            data: revenueByVendor.map(v => v.revenue),
            backgroundColor: 'rgba(245, 158, 11, 0.8)',
            borderColor: 'rgba(245, 158, 11, 1)',
            borderWidth: 1,
        }]
    };

    const ordersOverTimeData = {
        labels: ordersOverTime.map(d => d.date),
        datasets: [{
            label: 'Orders',
            data: ordersOverTime.map(d => d.orders),
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
        }]
    };

    const statusChartData = {
        labels: ['Completed', 'Pending', 'Processing', 'Cancelled'],
        datasets: [{
            data: [statusDistribution.completed, statusDistribution.pending, statusDistribution.processing, statusDistribution.cancelled],
            backgroundColor: [
                'rgba(34, 197, 94, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(239, 68, 68, 0.8)',
            ],
            borderWidth: 1,
        }]
    };

    const handleExportReport = () => {
        const reportData = {
            dateRange,
            metrics,
            revenueByVendor,
            ordersOverTime,
            statusDistribution,
            generatedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dgi-gold-report-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
                                <p className="text-gray-600 mt-2">Platform-wide business insights</p>
                            </div>
                            <div className="flex gap-4">
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="7d">Last 7 days</option>
                                    <option value="30d">Last 30 days</option>
                                    <option value="90d">Last 90 days</option>
                                    <option value="1y">Last year</option>
                                </select>
                                <button
                                    onClick={handleExportReport}
                                    className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 flex items-center gap-2"
                                >
                                    <FaDownload /> Export Report
                                </button>
                            </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center">
                                    <FaMoneyBillWave className="h-8 w-8 text-green-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center">
                                    <FaShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                        <p className="text-2xl font-bold text-gray-900">{metrics.totalOrders}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center">
                                    <FaUsers className="h-8 w-8 text-purple-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Active Customers</p>
                                        <p className="text-2xl font-bold text-gray-900">{metrics.totalCustomers}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center">
                                    <FaChartBar className="h-8 w-8 text-amber-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            ₹{metrics.avgOrderValue.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Revenue by Vendor */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Vendor</h3>
                                <div className="h-64">
                                    <Bar
                                        data={revenueChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { display: false },
                                                tooltip: {
                                                    callbacks: {
                                                        label: (context) => `₹${context.parsed.y.toLocaleString('en-IN')}`
                                                    }
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        callback: (value) => `₹${value.toLocaleString('en-IN')}`
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Orders Over Time */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders Trend</h3>
                                <div className="h-64">
                                    <Line
                                        data={ordersOverTimeData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { display: false }
                                            },
                                            scales: {
                                                y: { beginAtZero: true }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Status Distribution */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
                                <div className="h-64 flex items-center justify-center">
                                    <Doughnut
                                        data={statusChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'bottom'
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Top Vendors Table */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Vendors</h3>
                                <div className="space-y-3">
                                    {revenueByVendor.slice(0, 5).map((vendor, index) => (
                                        <div key={vendor.vendor} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-sm font-medium text-amber-800">#{index + 1}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{vendor.vendor}</p>
                                                    <p className="text-xs text-gray-600">{vendor.orders} orders</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                ₹{vendor.revenue.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Detailed Stats */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Statistics</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{metrics.buyOrders}</p>
                                    <p className="text-sm text-gray-600">Buy Orders</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-red-600">{metrics.sellOrders}</p>
                                    <p className="text-sm text-gray-600">Sell Orders</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{metrics.completedOrders}</p>
                                    <p className="text-sm text-gray-600">Completed</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-yellow-600">{metrics.pendingOrders}</p>
                                    <p className="text-sm text-gray-600">Pending</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
