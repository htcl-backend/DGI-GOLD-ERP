import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import apiService from "./service/apiService";
import { useAuth } from "../Contexts/AuthContext";

const OrdersAPI = () => {
    const [activeTab, setActiveTab] = useState("list");
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reportSummary, setReportSummary] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [summaryError, setSummaryError] = useState("");
    const [transactionsError, setTransactionsError] = useState("");

    // Fetch orders list
    const fetchOrders = async (page = 1) => {
        try {
            setLoading(true);
            console.log(`🔄 Fetching orders from API - Page ${page}...`);
            const result = await apiService.request(`/orders?page=${page}&limit=20`, 'GET');

            console.log('📦 Full Orders Response:', result);

            if (result && result.success && result.data) {
                // Navigate nested structure to get orders
                const ordersData = result.data.data?.data || result.data.data || result.data;
                const ordersList = Array.isArray(ordersData) ? ordersData : ordersData?.data || [];

                setOrders(ordersList);
                setCurrentPage(page);
                setTotalPages(ordersData?.hasNextPage ? page + 1 : page);
                console.log('✅ Orders loaded:', ordersList.length);
            } else {
                console.error('❌ Invalid response structure:', result);
                setOrders([]);
            }
        } catch (error) {
            console.error('🔴 Error fetching orders:', error.message);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch order details
    const fetchOrderDetails = async (orderId) => {
        try {
            setLoading(true);
            console.log(`🔄 Fetching order details for ${orderId}...`);
            const result = await apiService.request(`/orders/${orderId}`, 'GET');

            if (result && result.success && result.data) {
                const orderData = result.data.data || result.data;
                setSelectedOrder(orderData);
                console.log('✅ Order details loaded:', orderData);
            }
        } catch (error) {
            console.error('🔴 Error fetching order details:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch order report summary
    const fetchOrderSummary = async () => {
        try {
            setLoading(true);
            setSummaryError("");
            console.log('🔄 Fetching order summary...');
            const result = await apiService.request('/orders/reports/summary', 'GET');

            if (result && result.success && result.data) {
                const summaryData = result.data.data || result.data;
                setReportSummary(summaryData);
                console.log('✅ Summary loaded:', summaryData);
            } else {
                throw new Error(result.error || "Failed to fetch summary.");
            }
        } catch (error) {
            console.error('🔴 Error fetching summary:', error.message);
            setSummaryError("Failed to load summary. This may be a server issue or a missing database index.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch transaction reports
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setTransactionsError("");
            console.log('🔄 Fetching transaction reports...');
            console.log('User:', user);
            console.log('Token exists:', !!localStorage.getItem('token'));
            const result = await apiService.request('/orders/reports/transactions', 'GET');

            if (result && result.success && result.data) {
                const transactionsData = Array.isArray(result.data) ? result.data : result.data.data || [];
                setTransactions(transactionsData);
                console.log('✅ Transactions loaded:', transactionsData.length);
            } else {
                throw new Error(result.error || "Failed to fetch transactions.");
            }
        } catch (error) {
            console.error('🔴 Error fetching transactions:', error.message);
            if (error.message.includes('Forbidden')) {
                setTransactionsError("Access Denied. You do not have permission to view transaction reports.");
            } else {
                setTransactionsError("Failed to load transactions. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Load data based on active tab
    useEffect(() => {
        if (activeTab === 'summary') {
            fetchOrderSummary();
        } else if (activeTab === 'transactions') {
            fetchTransactions();
        }
    }, [activeTab]);

    // Filter orders by search term
    const filteredOrders = orders.filter(order =>
        order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const allTabs = [
        { id: 'list', label: 'Order List' },
        { id: 'details', label: 'Order Details' },
        { id: 'summary', label: 'Summary Report' },
        { id: 'transactions', label: 'Transactions' }
    ];

    // Define roles that are allowed to see the transactions tab.
    // This prevents showing a tab that will only lead to an "Access Denied" error.
    const allowedRolesForTransactions = ['VENDOR_OWNER', 'VENDOR_FINANCE', 'SUPER_ADMIN'];
    console.log('User role:', user?.role, 'Allowed:', allowedRolesForTransactions);
    const visibleTabs = allTabs.filter(tab => {
        if (tab.id === 'transactions') {
            const hasAccess = user && allowedRolesForTransactions.includes(user.role?.toUpperCase());
            console.log('Transactions tab access:', hasAccess);
            return hasAccess;
        }
        return true;
    });

    return (
        <div>
            <div className="flex">
                <Sidebar />
                <div className="w-full ml-[290px]">
                    <Header />
                    <div className="p-6 bg-gray-50 min-h-screen">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Orders Management</h2>

                        {/* Tabs */}
                        <div className="bg-white rounded-lg shadow-md mb-6">
                            <div className="border-b border-gray-200">
                                <nav className="flex">
                                    {visibleTabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setSearchTerm('');
                                                setSummaryError('');
                                                setTransactionsError('');
                                            }}
                                            className={`px-6 py-4 font-medium text-sm border-b-2 transition ${activeTab === tab.id
                                                ? 'border-amber-500 text-amber-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Content */}
                        {loading && <div className="text-center py-8">Loading...</div>}

                        {/* Order List Tab */}
                        {activeTab === 'list' && !loading && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Search by Order ID, Customer ID, or Status..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                {filteredOrders.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {filteredOrders.map(order => (
                                                    <tr key={order.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm font-medium text-amber-600">{order.id}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">{order.customerId || 'N/A'}</td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">₹{order.totalAmount?.toLocaleString() || '0'}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {new Date(order.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <button
                                                                onClick={() => {
                                                                    setActiveTab('details');
                                                                    fetchOrderDetails(order.id);
                                                                }}
                                                                className="text-amber-600 hover:text-amber-800 flex items-center gap-2"
                                                            >
                                                                <FaRegEdit /> View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">No orders found</div>
                                )}
                            </div>
                        )}

                        {/* Order Details Tab */}
                        {activeTab === 'details' && selectedOrder && !loading && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-2xl font-bold mb-6">Order Details</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-gray-600 font-medium">Order ID</label>
                                        <p className="text-lg text-gray-900">{selectedOrder.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-gray-600 font-medium">Status</label>
                                        <p className="text-lg text-gray-900">{selectedOrder.status}</p>
                                    </div>
                                    <div>
                                        <label className="text-gray-600 font-medium">Customer</label>
                                        <p className="text-lg text-gray-900">{selectedOrder.customerId}</p>
                                    </div>
                                    <div>
                                        <label className="text-gray-600 font-medium">Total Amount</label>
                                        <p className="text-lg text-gray-900">₹{selectedOrder.totalAmount?.toLocaleString()}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-gray-600 font-medium">Items</label>
                                        <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
                                            {JSON.stringify(selectedOrder.items, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Summary Report Tab */}
                        {activeTab === 'summary' && !loading && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-2xl font-bold mb-6">Order Summary Report</h3>
                                {summaryError ? (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                                        <strong className="font-bold">Error: </strong>
                                        <span className="block sm:inline">{summaryError}</span>
                                    </div>
                                ) : reportSummary ? (
                                    <div className="grid grid-cols-2 gap-6">
                                        {Object.entries(reportSummary).map(([key, value]) => (
                                            <div key={key} className="bg-gray-50 p-4 rounded-lg">
                                                <label className="text-gray-600 font-medium text-sm uppercase">{key}</label>
                                                <p className="text-2xl font-bold text-amber-600">{JSON.stringify(value)}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">No summary data available.</div>
                                )}
                            </div>
                        )}

                        {/* Transactions Tab */}
                        {activeTab === 'transactions' && !loading && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-2xl font-bold mb-6">Transaction Reports</h3>
                                {transactionsError ? (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                                        <strong className="font-bold">Error: </strong>
                                        <span className="block sm:inline">{transactionsError}</span>
                                    </div>
                                ) : transactions.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {transactions.map(tx => (
                                                    <tr key={tx.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm font-medium text-amber-600">{tx.id}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">{tx.orderId}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">₹{tx.amount?.toLocaleString()}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">{tx.status}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                            {new Date(tx.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">No transactions found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersAPI;
