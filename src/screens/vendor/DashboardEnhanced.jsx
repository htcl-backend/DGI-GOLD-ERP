import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import LiveMetalsTicker from '../../components/LiveMetalsTicker';
import { useAuth } from '../../Contexts/AuthContext';
import OverviewCard from '../../components/OverviewCard';
import { FaWallet, FaBox, FaUsers, FaChartBar, FaTruck } from 'react-icons/fa';
import { IconContext } from 'react-icons';

const VendorDashboardEnhanced = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        walletBalance: 450000,
        totalOrders: 128,
        activeProducts: 45,
        staffMembers: 12,
        pendingDeliveries: 8,
        monthlyRevenue: 2850000,
        commoditiesHeld: 156.5,
        holdingsValue: 1025000,
    });

    const metrics = [
        {
            title: "Wallet Balance",
            value: `₹${stats.walletBalance.toLocaleString('en-IN')}`,
            bgColor: "bg-green-500",
            change: "+5.2%",
        },
        {
            title: "Total Orders",
            value: stats.totalOrders.toString(),
            bgColor: "bg-blue-500",
            change: "+12%",
        },
        {
            title: "Active Products",
            value: stats.activeProducts.toString(),
            bgColor: "bg-purple-500",
            change: "+3",
        },
        {
            title: "Staff Members",
            value: stats.staffMembers.toString(),
            bgColor: "bg-orange-500",
            change: "+2",
        },
        {
            title: "Pending Deliveries",
            value: stats.pendingDeliveries.toString(),
            bgColor: "bg-red-500",
            change: "-1",
        },
        {
            title: "Commodities Held",
            value: `${stats.commoditiesHeld} kg`,
            bgColor: "bg-yellow-600",
            change: "+8.5%",
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-4 sm:p-6 lg:p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Welcome Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">
                                Welcome, {user?.name || 'Vendor'}! 👋
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>

                        {/* Live Gold & Silver Prices */}
                        <div className="mb-8">
                            <LiveMetalsTicker />
                        </div>

                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            <IconContext.Provider value={{ size: "1.75rem" }}>
                                {metrics.map((metric, index) => (
                                    <OverviewCard
                                        key={index}
                                        title={metric.title}
                                        value={metric.value}
                                        bgColor={metric.bgColor}
                                        change={metric.change}
                                    />
                                ))}
                            </IconContext.Provider>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <QuickActionCard
                                icon="💰"
                                title="Wallet"
                                description="Manage balance & transactions"
                                link="/vendor/wallet"
                                color="bg-green-50"
                            />
                            <QuickActionCard
                                icon="📦"
                                title="Holdings"
                                description="View commodities & ledger"
                                link="/vendor/holdings"
                                color="bg-blue-50"
                            />
                            <QuickActionCard
                                icon="👥"
                                title="Staff"
                                description="Manage team members"
                                link="/vendor/staff"
                                color="bg-purple-50"
                            />
                            <QuickActionCard
                                icon="📊"
                                title="Analytics"
                                description="View reports & insights"
                                link="/vendor/analytics"
                                color="bg-orange-50"
                            />
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-lg card-shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {[
                                            { id: 'ORD-001', customer: 'Rajesh Kumar', amount: '₹24,500', status: 'Delivered', date: '23 Apr' },
                                            { id: 'ORD-002', customer: 'Priya Sharma', amount: '₹18,900', status: 'Processing', date: '22 Apr' },
                                            { id: 'ORD-003', customer: 'Amit Patel', amount: '₹9,500', status: 'Shipped', date: '21 Apr' },
                                        ].map((order, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 text-sm font-medium text-gray-900">{order.id}</td>
                                                <td className="px-4 py-2 text-sm text-gray-600">{order.customer}</td>
                                                <td className="px-4 py-2 text-sm font-medium text-gray-900">{order.amount}</td>
                                                <td className="px-4 py-2 text-sm">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Delivered' ? 'text-green-700 bg-green-100' :
                                                            order.status === 'Processing' ? 'text-blue-700 bg-blue-100' :
                                                                'text-yellow-700 bg-yellow-100'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-600">{order.date}</td>
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

const QuickActionCard = ({ icon, title, description, link, color }) => (
    <a href={link} className={`${color} rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow`}>
        <div className="text-3xl mb-3">{icon}</div>
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
    </a>
);

export default VendorDashboardEnhanced;
