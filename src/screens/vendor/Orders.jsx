import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useAuth } from '../../Contexts/AuthContext';
import { FaShoppingCart, FaFilter, FaDownload } from 'react-icons/fa';

const VendorOrders = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [orders, setOrders] = useState([
        {
            id: 'ORD-001',
            date: '2024-04-23',
            customer: 'Arjun Sharma',
            email: 'arjun@email.com',
            amount: 245000,
            commodity: 'Gold 24K',
            quantity: 37.5,
            status: 'delivered',
            payment: 'completed',
        },
        {
            id: 'ORD-002',
            date: '2024-04-22',
            customer: 'Priya Patel',
            email: 'priya@email.com',
            amount: 189000,
            commodity: 'Gold 22K',
            quantity: 30.5,
            status: 'processing',
            payment: 'completed',
        },
        {
            id: 'ORD-003',
            date: '2024-04-21',
            customer: 'Rahul Kumar',
            email: 'rahul@email.com',
            amount: 95000,
            commodity: 'Silver 999',
            quantity: 1220,
            status: 'shipped',
            payment: 'completed',
        },
        {
            id: 'ORD-004',
            date: '2024-04-20',
            customer: 'Anjali Singh',
            email: 'anjali@email.com',
            amount: 325000,
            commodity: 'Gold 24K',
            quantity: 49.8,
            status: 'pending',
            payment: 'pending',
        },
        {
            id: 'ORD-005',
            date: '2024-04-19',
            customer: 'Vikram Gupta',
            email: 'vikram@email.com',
            amount: 150000,
            commodity: 'Silver 999',
            quantity: 1923,
            status: 'delivered',
            payment: 'completed',
        },
    ]);

    const statusColors = {
        pending: 'text-orange-700 bg-orange-100',
        processing: 'text-blue-700 bg-blue-100',
        shipped: 'text-yellow-700 bg-yellow-100',
        delivered: 'text-green-700 bg-green-100',
        cancelled: 'text-red-700 bg-red-100',
    };

    const paymentColors = {
        pending: 'text-orange-700 bg-orange-100',
        completed: 'text-green-700 bg-green-100',
        failed: 'text-red-700 bg-red-100',
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        totalRevenue: orders.reduce((sum, o) => sum + o.amount, 0),
    };

    const handleExport = () => {
        const csv = [
            ['Order ID', 'Date', 'Customer', 'Amount', 'Commodity', 'Quantity', 'Status', 'Payment'],
            ...orders.map(o => [
                o.id,
                o.date,
                o.customer,
                o.amount,
                o.commodity,
                o.quantity,
                o.status,
                o.payment,
            ])
        ].map(row => row.join(',')).join('\n');

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
        element.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.csv`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-4 sm:p-6 lg:p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8 flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaShoppingCart className="text-blue-600" /> Orders
                                </h1>
                                <p className="text-gray-600 mt-2">View and manage all customer orders</p>
                            </div>
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
                            >
                                <FaDownload /> Export CSV
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                            <StatCard
                                title="Total Orders"
                                value={stats.total}
                                icon="📦"
                                color="bg-blue-50"
                            />
                            <StatCard
                                title="Pending"
                                value={stats.pending}
                                icon="⏳"
                                color="bg-orange-50"
                            />
                            <StatCard
                                title="Processing"
                                value={stats.processing}
                                icon="🔄"
                                color="bg-blue-50"
                            />
                            <StatCard
                                title="Shipped"
                                value={stats.shipped}
                                icon="📮"
                                color="bg-yellow-50"
                            />
                            <StatCard
                                title="Delivered"
                                value={stats.delivered}
                                icon="✅"
                                color="bg-green-50"
                            />
                            <StatCard
                                title="Total Revenue"
                                value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
                                icon="💰"
                                color="bg-purple-50"
                            />
                        </div>

                        {/* Filter */}
                        <div className="mb-6 flex gap-2">
                            <FaFilter className="text-gray-600 mt-3" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Orders Table */}
                        <div className="bg-white rounded-lg card-shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commodity</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <p className="font-medium text-gray-900">{order.customer}</p>
                                                        <p className="text-gray-500">{order.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{order.commodity}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{order.quantity} g</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    ₹{order.amount.toLocaleString('en-IN')}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${paymentColors[order.payment]}`}>
                                                        {order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <button
                                                        onClick={() => alert(`View details for ${order.id}`)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        ₹{stats.totalRevenue.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Average Order Value</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        ₹{(stats.totalRevenue / stats.total).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className={`${color} rounded-lg p-4 border border-gray-200`}>
        <div className="flex justify-between items-center">
            <div>
                <p className="text-gray-600 text-xs font-medium uppercase">{title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
            </div>
            <span className="text-2xl">{icon}</span>
        </div>
    </div>
);

export default VendorOrders;
