import React, { useState, useEffect } from 'react';
import { FaUsers, FaSpinner, FaExclamationTriangle, FaSearch, FaEye } from 'react-icons/fa';
import apiService from '../screens/service/apiService';

const CustomerList = ({ onSelectCustomer, selectedCustomerId }) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch all customers
    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await apiService.analytics.vendor.getAllCustomers({
                    limit: 50,
                    offset: 0,
                });

                if (result.success && result.data) {
                    const customersList = result.data.data?.customers || result.data.customers || [];
                    setCustomers(Array.isArray(customersList) ? customersList : []);
                    console.log('✅ Fetched customers:', customersList);
                } else {
                    throw new Error(result.error || 'Failed to fetch customers');
                }
            } catch (err) {
                console.error('Error fetching customers:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    // Filter customers based on search
    const filteredCustomers = customers.filter(customer =>
        customer.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center justify-center gap-3">
                    <FaSpinner className="animate-spin text-amber-600 text-xl" />
                    <p className="text-gray-600">Loading customers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-3">
                    <FaExclamationTriangle className="text-red-600 text-xl" />
                    <div>
                        <h3 className="font-semibold text-red-800">Error Loading Customers</h3>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <FaUsers className="text-amber-600 text-2xl" />
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">All Customers</h3>
                    <p className="text-sm text-gray-600">
                        {filteredCustomers.length} of {customers.length} customers
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name, ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                />
            </div>

            {/* Customers List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                        <div
                            key={customer.customerId}
                            className={`p-4 border rounded-lg cursor-pointer transition ${selectedCustomerId === customer.customerId
                                    ? 'bg-amber-50 border-amber-500 border-2'
                                    : 'bg-white border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                                }`}
                            onClick={() => onSelectCustomer(customer.customerId)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800">{customer.customerName}</h4>
                                    <p className="text-sm text-gray-600">ID: {customer.customerId}</p>
                                    <p className="text-sm text-gray-500">{customer.email}</p>
                                    <div className="flex gap-4 mt-2 text-xs text-gray-600">
                                        <span>📦 Orders: {customer.totalOrders || 0}</span>
                                        <span>💰 Spent: ₹{(customer.totalSpent || 0).toLocaleString('en-IN')}</span>
                                        <span>📅 Joined: {new Date(customer.joinedDate).toLocaleDateString('en-IN')}</span>
                                    </div>
                                </div>
                                {selectedCustomerId === customer.customerId && (
                                    <div className="ml-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectCustomer(customer.customerId);
                                            }}
                                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded font-medium flex items-center gap-2"
                                        >
                                            <FaEye /> View
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>No customers found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerList;
