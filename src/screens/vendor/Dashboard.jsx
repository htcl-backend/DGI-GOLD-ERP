import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import LiveMetalsTicker from '../../components/LiveMetalsTicker';
import { useAuth } from '../../Contexts/AuthContext';
import { useData } from '../../Contexts/DataContext';
import OverviewCard from '../../components/OverviewCard';
import CustomerAnalysis from '../../components/CustomerAnalysis';
import CustomerList from '../../components/CustomerList';
import MonthlyPnL from '../../components/MonthlyPnL';
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

// Error boundary
class VendorDashboardErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('🔴 VendorDashboard Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-red-50">
                    <div className="text-red-600 text-center">
                        <h1 className="text-2xl font-bold mb-2">Error Loading Vendor Dashboard</h1>
                        <p className="text-red-500 mb-4">{this.state.error?.message}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

const VendorDashboardContent = () => {
    const { user, loading: authLoading } = useAuth();
    const { orders, products, metalPrices, loading, error } = useData();
    const [ordersSummary, setOrdersSummary] = useState(null);
    const [holdingsSummary, setHoldingsSummary] = useState(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState('cust_12345');
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [showMonthlyPnL, setShowMonthlyPnL] = useState(false);
    const [showCustomerList, setShowCustomerList] = useState(false);
    const [dashboardMetrics, setDashboardMetrics] = useState({
        totalInvestment: 0,
        currentValue: 0,
        unrealizedPnl: 0,
        avgUnitCost: 0,
        totalOrders: 0,
        totalInvested: 0,
        totalHoldings: 0,
        pnlFromMetrics: 0,
    });
    const navigate = useNavigate();

    // Debug logging
    useEffect(() => {
        console.log('🔍 VendorDashboard: user=', user);
        console.log('🔍 VendorDashboard: authLoading=', authLoading);
        console.log('🔍 VendorDashboard: dataLoading=', loading);
        console.log('🔍 VendorDashboard: orders.length=', orders?.length);
        console.log('🔍 VendorDashboard: products.length=', products?.length);
        console.log('🔍 VendorDashboard: orders=', orders);
    }, [user, authLoading, loading, orders, products]);

    // Fetch additional summaries with fallback data
    useEffect(() => {
        const fetchSummaries = async () => {
            try {
                // Fetch orders summary
                const orderResult = await apiService.orders.getSummary();
                if (orderResult.success) {
                    setOrdersSummary(orderResult.data.data || orderResult.data);
                } else {
                    // Fallback: calculate from local orders data
                    setOrdersSummary({
                        totalOrders: orders.length,
                        totalRevenue: orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
                        totalCustomers: new Set(orders.map(o => o.customerName || o.userId)).size,
                        ordersByStatus: {
                            'Pending': orders.filter(o => o.status?.toLowerCase() === 'pending').length,
                            'Processing': orders.filter(o => o.status?.toLowerCase() === 'processing' || o.status?.toLowerCase() === 'shipped').length,
                            'Shipped': orders.filter(o => o.status?.toLowerCase() === 'shipped').length,
                            'Delivered': orders.filter(o => o.status?.toLowerCase() === 'delivered').length,
                        }
                    });
                }
            } catch (err) {
                console.warn('Orders summary fetch failed, using fallback data:', err);
                setOrdersSummary({
                    totalOrders: orders.length,
                    totalRevenue: orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
                    totalCustomers: new Set(orders.map(o => o.customerName || o.userId)).size,
                    ordersByStatus: {
                        'Pending': orders.filter(o => o.status?.toLowerCase() === 'pending').length,
                        'Processing': orders.filter(o => o.status?.toLowerCase() === 'processing' || o.status?.toLowerCase() === 'shipped').length,
                        'Shipped': orders.filter(o => o.status?.toLowerCase() === 'shipped').length,
                        'Delivered': orders.filter(o => o.status?.toLowerCase() === 'delivered').length,
                    }
                });
            }

            try {
                // Fetch holdings summary
                const holdingResult = await apiService.holdings.getSummary();
                if (holdingResult.success) {
                    setHoldingsSummary(holdingResult.data.data || holdingResult.data);
                } else {
                    // Fallback: use default holdings data
                    setHoldingsSummary({
                        totalValue: 5035000,
                        goldValue: 3275000,
                        silverValue: 1760000,
                        totalGain: 415000,
                    });
                }
            } catch (err) {
                console.warn('Holdings summary fetch failed, using fallback data:', err);
                setHoldingsSummary({
                    totalValue: 5035000,
                    goldValue: 3275000,
                    silverValue: 1760000,
                    totalGain: 415000,
                });
            }

            try {
                const ltvResult = await apiService.analytics.vendor.getAllCustomersLtv({ limit: 50 });
                if (ltvResult.success) {
                    const ltvPayload = ltvResult.data?.data || ltvResult.data || {};
                    const ltvRows = Array.isArray(ltvPayload.data) ? ltvPayload.data : ltvPayload || [];
                    const totalInvestment = ltvRows.reduce((sum, item) => sum + (item.lifetimeValue || 0), 0);
                    const totalOrdersCount = ltvRows.reduce((sum, item) => sum + (item.orderCount || 0), 0);
                    const avgUnitCost = ltvRows.length ? Math.round(ltvRows.reduce((sum, item) => sum + (item.averageOrderValue || 0), 0) / ltvRows.length) : 0;
                    const totalInvested = ltvRows.reduce((sum, item) => sum + (item.lifetimeValue || 0), 0);
                    const totalHoldingsValue = holdingsSummary?.totalValue || 0;
                    const unrealized = holdingsSummary?.totalGain || 0;
                    const pnlFromMetrics = totalHoldingsValue - totalInvestment;

                    setDashboardMetrics({
                        totalInvestment,
                        currentValue: totalHoldingsValue,
                        unrealizedPnl: unrealized,
                        avgUnitCost,
                        totalOrders: totalOrdersCount || ordersSummary?.totalOrders || metrics.totalOrders,
                        totalInvested,
                        totalHoldings: totalHoldingsValue,
                        pnlFromMetrics,
                    });
                } else {
                    setDashboardMetrics(prev => ({
                        ...prev,
                        totalInvestment: ordersSummary?.totalRevenue || metrics.totalRevenue,
                        currentValue: holdingsSummary?.totalValue || 0,
                        unrealizedPnl: holdingsSummary?.totalGain || 0,
                        avgUnitCost: metrics.totalOrders ? Math.round(metrics.totalRevenue / metrics.totalOrders) : 0,
                        totalOrders: ordersSummary?.totalOrders || metrics.totalOrders,
                        totalInvested: ordersSummary?.totalRevenue || metrics.totalRevenue,
                        totalHoldings: holdingsSummary?.totalValue || 0,
                        pnlFromMetrics: holdingsSummary?.totalGain || 0,
                    }));
                }
            } catch (err) {
                console.warn('Customer LTV metrics fetch failed, using fallback metrics:', err);
                setDashboardMetrics(prev => ({
                    ...prev,
                    totalInvestment: ordersSummary?.totalRevenue || metrics.totalRevenue,
                    currentValue: holdingsSummary?.totalValue || 0,
                    unrealizedPnl: holdingsSummary?.totalGain || 0,
                    avgUnitCost: metrics.totalOrders ? Math.round(metrics.totalRevenue / metrics.totalOrders) : 0,
                    totalOrders: ordersSummary?.totalOrders || metrics.totalOrders,
                    totalInvested: ordersSummary?.totalRevenue || metrics.totalRevenue,
                    totalHoldings: holdingsSummary?.totalValue || 0,
                    pnlFromMetrics: holdingsSummary?.totalGain || 0,
                }));
            }
        };

        if (user) {
            fetchSummaries();
        }
    }, [user, orders]);

    // Calculate metrics - with case-insensitive status matching
    const metrics = {
        totalRevenue: orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
        totalOrders: orders.length,
        totalCustomers: new Set(orders.map(o => o.customerName || o.userId)).size,
        totalProducts: products.length,
        completedOrders: orders.filter(order => order.status?.toLowerCase() === 'completed' || order.status?.toLowerCase() === 'delivered').length,
        pendingOrders: orders.filter(order => order.status?.toLowerCase() === 'pending').length,
        lowStockProducts: products.filter(product => product.stock < 10).length,
    };

    // Recent orders (last 5)
    const recentOrders = orders
        .sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt))
        .slice(0, 5);

    // Orders by status - normalized to handle API response (capitalized) and dummy data (lowercase)
    const ordersByStatus = {
        completed: orders.filter(o => o.status?.toLowerCase() === 'completed' || o.status?.toLowerCase() === 'delivered').length,
        pending: orders.filter(o => o.status?.toLowerCase() === 'pending').length,
        processing: orders.filter(o => o.status?.toLowerCase() === 'processing' || o.status?.toLowerCase() === 'shipped').length,
        cancelled: orders.filter(o => o.status?.toLowerCase() === 'cancelled').length,
    };

    // Revenue trend (last 7 days) - fixed date comparison
    const getRevenueTrend = () => {
        const days = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }

        return days.map(date => {
            const dayOrders = orders.filter(order => {
                const orderDate = new Date(order.orderDate || order.createdAt);
                const orderDateStr = orderDate.toISOString().split('T')[0];
                return orderDateStr === date;
            });
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

    if (loading) return <div className="flex items-center justify-center h-screen">Loading dashboard data...</div>;

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-4 sm:p-6 lg:p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-4 sm:mb-6">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Vendor Dashboard</h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-2">Welcome back, {user?.name || 'Vendor'}!</p>
                            {/* DEBUG INFO */}
                            {/* <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                                <p>User: {user?.email}</p>
                                <p>Role: {user?.role}</p>
                                <p>Orders loaded: {orders.length}</p>
                            </div> */}
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Live Gold & Silver Prices */}
                        <div className="mb-8">
                            <LiveMetalsTicker />
                        </div>

                        {/* Overview Cards - Live Data from API */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-8">
                            {[
                                { title: 'Total Revenue', value: `₹${metrics.totalRevenue.toLocaleString('en-IN')}`, subtitle: 'All time revenue', theme: 'from-sky-500 to-cyan-500', icon: '💰' },
                                { title: 'Total Orders', value: metrics.totalOrders.toLocaleString('en-IN'), subtitle: 'View order list', theme: 'from-slate-800 to-gray-800', icon: '📦', action: '/orders' },
                                { title: 'Total Products', value: metrics.totalProducts.toLocaleString('en-IN'), subtitle: 'View holdings inventory', theme: 'from-rose-500 to-pink-500', icon: '📊', action: '/inventory' },
                                { title: 'Total Customers', value: metrics.totalCustomers.toLocaleString('en-IN'), subtitle: 'Customer base', theme: 'from-emerald-500 to-teal-500', icon: '👥' },
                            ].map((card) => (
                                card.action ? (
                                    <button
                                        key={card.title}
                                        onClick={() => navigate(card.action)}
                                        className={`group bg-gradient-to-br ${card.theme} text-white rounded-3xl shadow-xl p-5 text-left hover:shadow-2xl transition transform hover:scale-105 hover:-translate-y-1 cursor-pointer`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-2xl group-hover:scale-125 transition-transform">{card.icon}</span>
                                        </div>
                                        <div className="text-xs uppercase tracking-wide opacity-80 mb-2 group-hover:opacity-100 transition">{card.title}</div>
                                        <div className="text-2xl font-semibold mb-2">{card.value}</div>
                                        <div className="text-sm opacity-90 group-hover:underline">{card.subtitle}</div>
                                    </button>
                                ) : (
                                    <div
                                        key={card.title}
                                        className={`bg-gradient-to-br ${card.theme} text-white rounded-3xl shadow-xl p-5 hover:shadow-2xl transition transform hover:scale-105 hover:-translate-y-1 cursor-pointer`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-2xl hover:scale-125 transition-transform">{card.icon}</span>
                                        </div>
                                        <div className="text-xs uppercase tracking-wide opacity-80 mb-2 hover:opacity-100 transition">{card.title}</div>
                                        <div className="text-2xl font-semibold mb-2">{card.value}</div>
                                        <div className="text-sm opacity-90">{card.subtitle}</div>
                                    </div>
                                )
                            ))}
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-8">
                            {[
                                { title: 'Completed Orders', value: metrics.completedOrders, subtitle: 'Successfully completed', theme: 'from-green-500 to-emerald-500', icon: '✅' },
                                { title: 'Pending Orders', value: metrics.pendingOrders, subtitle: 'Awaiting processing', theme: 'from-yellow-500 to-amber-500', icon: '⏳' },
                                { title: 'Low Stock Items', value: metrics.lowStockProducts, subtitle: 'Need restocking', theme: 'from-orange-500 to-red-500', icon: '⚠️' },
                                { title: 'Avg Order Value', value: `₹${metrics.totalOrders > 0 ? (metrics.totalRevenue / metrics.totalOrders).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '0'}`, subtitle: 'Average per order', theme: 'from-indigo-500 to-purple-500', icon: '📈' },
                            ].map((card) => (
                                <div
                                    key={card.title}
                                    className={`bg-gradient-to-br ${card.theme} text-white rounded-3xl shadow-xl p-5 hover:shadow-2xl transition transform hover:scale-105 hover:-translate-y-1 cursor-pointer`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="text-2xl hover:scale-125 transition-transform">{card.icon}</span>
                                    </div>
                                    <div className="text-xs uppercase tracking-wide opacity-80 mb-2 hover:opacity-100 transition">{card.title}</div>
                                    <div className="text-2xl font-semibold mb-2">{card.value}</div>
                                    <div className="text-sm opacity-90">{card.subtitle}</div>
                                </div>
                            ))}
                        </div>


                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8">
                            {/* Revenue Trend */}
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Revenue Trend (Last 7 Days)</h3>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                            <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 lg:p-6">
                                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4">Order Summary</h3>
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

                        {/* Customer Analysis Section */}
                        {/* <div className="mt-8 border-t-2 border-gray-200 pt-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Customer P&L Analysis</h2>
                                    <p className="text-gray-600 mt-1">Deep dive into individual customer performance and holdings</p>
                                </div>
                                {!showAnalysis && (
                                    <button
                                        onClick={() => setShowAnalysis(!showAnalysis)}
                                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition"
                                    >
                                        View Analysis
                                    </button>
                                )}
                            </div>

                            {showAnalysis && (
                                <div className="bg-gray-50 rounded-lg p-6">

                                    <div className="mb-6 flex gap-4 flex-wrap items-end">
                                        <div className="flex-1 min-w-[250px]">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Select Customer
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter Customer ID (e.g., cust_12345)"
                                                value={selectedCustomerId}
                                                onChange={(e) => setSelectedCustomerId(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                                            />
                                        </div>
                                        <button
                                            onClick={() => setShowAnalysis(!showAnalysis)}
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
                                        >
                                            Close
                                        </button>
                                    </div>

                                    <CustomerAnalysis customerId={selectedCustomerId} />
                                </div>
                            )}
                        </div> */}

                        {/* Monthly P&L Section */}
                        {/* <div className="mt-8 border-t-2 border-gray-200 pt-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Monthly Financial Report</h2>
                                    <p className="text-gray-600 mt-1">Track your monthly profit and loss trends</p>
                                </div>
                                {!showMonthlyPnL && (
                                    <button
                                        onClick={() => setShowMonthlyPnL(!showMonthlyPnL)}
                                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition"
                                    >
                                        View Report
                                    </button>
                                )}
                            </div>

                            {showMonthlyPnL && (
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="mb-4 flex justify-end">
                                        <button
                                            onClick={() => setShowMonthlyPnL(!showMonthlyPnL)}
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
                                        >
                                            Close
                                        </button>
                                    </div>
                                    <MonthlyPnL />
                                </div>
                            )}
                        </div> */}

                        {/* Customer List Section */}
                        {/* <div className="mt-8 border-t-2 border-gray-200 pt-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">View All Customers</h2>
                                    <p className="text-gray-600 mt-1">Browse and manage all your customers</p>
                                </div>
                                {!showCustomerList && (
                                    <button
                                        onClick={() => setShowCustomerList(!showCustomerList)}
                                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition"
                                    >
                                        View Customers
                                    </button>
                                )}
                            </div>

                            {showCustomerList && (
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="mb-4 flex justify-end">
                                        <button
                                            onClick={() => setShowCustomerList(!showCustomerList)}
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
                                        >
                                            Close
                                        </button>
                                    </div>
                                    <CustomerList
                                        onSelectCustomer={(customerId) => {
                                            setSelectedCustomerId(customerId);
                                            setShowAnalysis(true);
                                            setShowCustomerList(false);
                                        }}
                                        selectedCustomerId={selectedCustomerId}
                                    />
                                </div>
                            )}
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

const VendorDashboard = () => {
    return (
        <VendorDashboardErrorBoundary>
            <VendorDashboardContent />
        </VendorDashboardErrorBoundary>
    );
};

export default VendorDashboard;