import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useData } from '../../contexts/DataContext';
import { FaEye, FaSearch, FaUser, FaShoppingCart, FaMoneyBillWave } from 'react-icons/fa';

const AllCustomers = () => {
    const { allCustomers, allVendors, allOrders } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [vendorFilter, setVendorFilter] = useState('all');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const getVendorName = (vendorId) => {
        const vendor = allVendors.find(v => v.id === vendorId);
        return vendor ? vendor.name : 'Unknown Vendor';
    };

    const getCustomerStats = (customerId) => {
        const customerOrders = allOrders.filter(order => order.customerId === customerId);
        const totalOrders = customerOrders.length;
        const totalSpent = customerOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        const lastOrder = customerOrders.length > 0 ?
            new Date(Math.max(...customerOrders.map(o => new Date(o.orderDate)))) : null;

        return { totalOrders, totalSpent, lastOrder };
    };

    const filteredCustomers = allCustomers.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm);
        const matchesVendor = vendorFilter === 'all' || customer.vendorId === vendorFilter;

        return matchesSearch && matchesVendor;
    });

    const handleViewDetails = (customer) => {
        setSelectedCustomer(customer);
        setShowDetails(true);
    };

    const stats = {
        total: allCustomers.length,
        active: allCustomers.filter(c => getCustomerStats(c.id).totalOrders > 0).length,
        totalRevenue: allCustomers.reduce((sum, customer) => sum + getCustomerStats(customer.id).totalSpent, 0),
        avgOrderValue: allCustomers.length > 0 ?
            allCustomers.reduce((sum, customer) => sum + getCustomerStats(customer.id).totalSpent, 0) /
            allCustomers.filter(c => getCustomerStats(c.id).totalOrders > 0).length : 0
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-800">All Customers</h1>
                            <p className="text-gray-600 mt-2">Platform-wide customer management</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800">Total Customers</h3>
                                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800">Active Customers</h3>
                                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
                                <p className="text-3xl font-bold text-amber-600">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800">Avg Order Value</h3>
                                <p className="text-3xl font-bold text-purple-600">₹{stats.avgOrderValue.toLocaleString('en-IN')}</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or phone..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={vendorFilter}
                                        onChange={(e) => setVendorFilter(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option value="all">All Vendors</option>
                                        {allVendors.map(vendor => (
                                            <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Customers Table */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">Customers ({filteredCustomers.length})</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-amber-50 text-gray-500 text-left text-xs font-medium uppercase">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Order</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredCustomers.map((customer) => {
                                            const stats = getCustomerStats(customer.id);
                                            return (
                                                <tr key={customer.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                                                                    <FaUser className="h-5 w-5 text-amber-600" />
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                                <div className="text-sm text-gray-500">ID: {customer.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">{customer.email}</div>
                                                        <div className="text-sm text-gray-500">{customer.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {getVendorName(customer.vendorId)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <FaShoppingCart className="h-4 w-4 text-gray-400 mr-2" />
                                                            <span className="text-sm font-medium text-gray-900">{stats.totalOrders}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <FaMoneyBillWave className="h-4 w-4 text-gray-400 mr-1" />
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {stats.totalSpent.toLocaleString('en-IN')}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {stats.lastOrder ? stats.lastOrder.toLocaleDateString() : 'Never'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <button
                                                            onClick={() => handleViewDetails(customer)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                            title="View Details"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Customer Details Modal */}
                        {showDetails && selectedCustomer && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold text-gray-800">Customer Details</h2>
                                            <button
                                                onClick={() => setShowDetails(false)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                ×
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                                        <p className="mt-1 text-sm text-gray-900">{selectedCustomer.name}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                                        <p className="mt-1 text-sm text-gray-900">{selectedCustomer.email}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                                        <p className="mt-1 text-sm text-gray-900">{selectedCustomer.phone}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Address</label>
                                                        <p className="mt-1 text-sm text-gray-900">{selectedCustomer.address}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Vendor</label>
                                                        <p className="mt-1 text-sm text-gray-900">{getVendorName(selectedCustomer.vendorId)}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {new Date(selectedCustomer.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Statistics</h3>
                                                <div className="space-y-4">
                                                    {(() => {
                                                        const stats = getCustomerStats(selectedCustomer.id);
                                                        return (
                                                            <>
                                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                                    <div className="flex items-center">
                                                                        <FaShoppingCart className="h-5 w-5 text-blue-600 mr-3" />
                                                                        <div>
                                                                            <p className="text-sm font-medium text-gray-900">Total Orders</p>
                                                                            <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="bg-green-50 p-4 rounded-lg">
                                                                    <div className="flex items-center">
                                                                        <FaMoneyBillWave className="h-5 w-5 text-green-600 mr-3" />
                                                                        <div>
                                                                            <p className="text-sm font-medium text-gray-900">Total Spent</p>
                                                                            <p className="text-2xl font-bold text-green-600">
                                                                                ₹{stats.totalSpent.toLocaleString('en-IN')}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="bg-purple-50 p-4 rounded-lg">
                                                                    <div className="flex items-center">
                                                                        <div>
                                                                            <p className="text-sm font-medium text-gray-900">Average Order Value</p>
                                                                            <p className="text-2xl font-bold text-purple-600">
                                                                                ₹{stats.totalOrders > 0 ? (stats.totalSpent / stats.totalOrders).toLocaleString('en-IN') : '0'}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-900">Last Order Date</p>
                                                                        <p className="text-lg font-semibold text-gray-800">
                                                                            {stats.lastOrder ? stats.lastOrder.toLocaleString() : 'No orders yet'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recent Orders */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
                                            <div className="space-y-3">
                                                {allOrders
                                                    .filter(order => order.customerId === selectedCustomer.id)
                                                    .sort((a, b) => new Date((b.orderDate || 0)) - new Date((a.orderDate || 0)))
                                                    .slice(0, 5)
                                                    .map((order) => (
                                                        <div key={order.id || Math.random()} className="bg-gray-50 p-4 rounded-lg">
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">Order #{order.id || '—'}</p>
                                                                    <p className="text-xs text-gray-600">
                                                                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Unknown'} • {order.status || 'Unknown'}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-sm font-semibold text-gray-900">
                                                                        ₹{order.totalPrice != null ? order.totalPrice.toLocaleString('en-IN') : '0'}
                                                                    </p>
                                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.type === 'buy' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                                                                        {order.type ? order.type.toUpperCase() : 'N/A'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                {allOrders.filter(order => order.customerId === selectedCustomer.id).length === 0 && (
                                                    <p className="text-sm text-gray-500 text-center py-4">No orders found</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllCustomers;
