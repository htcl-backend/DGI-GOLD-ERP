import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import apiService from './service/apiService';

const Transactions = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const extractOrdersFromResponse = (payload) => {
        if (Array.isArray(payload)) return payload;
        if (!payload || typeof payload !== 'object') return [];
        if (Array.isArray(payload.orders)) return payload.orders;
        if (Array.isArray(payload.data)) return payload.data;
        if (Array.isArray(payload.results)) return payload.results;
        if (Array.isArray(payload.items)) return payload.items;
        if (Array.isArray(payload.payload)) return payload.payload;
        return [];
    };

    const fetchOrders = async (filter = 'pending') => {
        try {
            setLoading(true);
            setError(null);

            // GET /api/v1/orders/admin/pending - fetches all pending/approval orders
            // Note: This endpoint returns orders that need approval (pending and recently rejected)
            const params = {};
            const response = await apiService.orders.getAdminPending(params);
            console.log('🔎 Admin pending orders response:', response);

            if (response?.success === false) {
                setError(response?.error || 'Unable to load approval orders');
                setOrders([]);
                return;
            }

            // Handle response structure: { statusCode, data: { orders: [...] }, success: true }
            // Note: response.data is the apiService wrapper, need to extract actual API response
            const apiResponse = response?.data;
            console.log('📦 API Response:', apiResponse);

            let ordersList = [];
            // First check if apiResponse.data has orders (nested structure from API)
            if (apiResponse?.data?.orders && Array.isArray(apiResponse.data.orders)) {
                ordersList = apiResponse.data.orders;
                console.log('✅ Extracted from apiResponse.data.orders:', ordersList.length, 'orders');
            } else if (apiResponse?.orders && Array.isArray(apiResponse.orders)) {
                ordersList = apiResponse.orders;
                console.log('✅ Extracted from apiResponse.orders:', ordersList.length, 'orders');
            } else if (Array.isArray(apiResponse)) {
                ordersList = apiResponse;
                console.log('✅ apiResponse is array:', ordersList.length, 'orders');
            } else {
                ordersList = extractOrdersFromResponse(apiResponse) || [];
                console.log('✅ Extracted using fallback:', ordersList.length, 'orders');
            }

            console.log('📊 Final orders list with all statuses:', ordersList);
            console.log('📊 Order statuses:', ordersList.map(o => ({ id: o._id || o.orderId, status: o.status || o.paymentStatus })));
            setError(null);
            setOrders(ordersList);
        } catch (err) {
            console.error('❌ Error loading transaction orders:', err);
            setError(err?.message || 'Failed to load transaction orders');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleApprove = async (orderId) => {
        if (!orderId) return;
        try {
            setActionLoading(true);
            console.log('Approving order:', orderId);
            // Send approval with a note
            const response = await apiService.orders.approveOrder(orderId, {
                note: 'Order approved by admin'
            });

            console.log('Approve response:', response);
            if (response?.success || response?.status === 200) {
                console.log('Order approved successfully, refetching orders...');
                setError(null);
                fetchOrders(activeFilter);
            } else {
                const errorMsg = response?.error || 'Unable to approve order';
                console.error('Approval failed:', errorMsg);
                setError(errorMsg);
            }
        } catch (err) {
            console.error('Error approving order:', err);
            setError('Approval failed. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (orderId) => {
        if (!orderId) return;
        const rejectionReason = window.prompt('Enter rejection reason for this order:');
        if (!rejectionReason?.trim()) {
            console.log('Rejection cancelled - no reason provided');
            return;
        }

        try {
            setActionLoading(true);
            console.log('Rejecting order:', orderId, 'with reason:', rejectionReason);
            const response = await apiService.orders.rejectOrder(orderId, {
                reason: rejectionReason.trim(),
            });

            console.log('Reject response:', response);
            if (response?.success || response?.status === 200) {
                console.log('Order rejected successfully, refetching orders...');
                setError(null);
                fetchOrders(activeFilter);
            } else {
                const errorMsg = response?.error || 'Unable to reject order';
                console.error('Rejection failed:', errorMsg);
                setError(errorMsg);
            }
        } catch (err) {
            console.error('Error rejecting order:', err);
            setError('Rejection failed. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const filteredOrders = useMemo(() => {
        const normalizedSearch = searchTerm.toLowerCase().trim();
        return orders
            .filter((order) => {
                // Check all possible status fields
                const orderStatus = (order.paymentStatus || order.status || order.payment?.status || '').toString().toLowerCase();
                if (activeFilter === 'pending') {
                    // Consider PAYMENT_SUCCESS, PENDING, PENDING_PAYMENT as pending approval
                    return orderStatus === 'pending' || orderStatus === 'pending_payment' || orderStatus === 'payment_success' || orderStatus === 'paid';
                }
                if (activeFilter === 'rejected') {
                    // Include all rejection variations
                    return orderStatus === 'rejected' || orderStatus === 'reject' || orderStatus === 'failed' || orderStatus === 'rejection' || orderStatus === 'declined';
                }
                return true;
            })
            .filter((order) => {
                if (!normalizedSearch) return true;
                const id = order._id || order.id || order.orderId || '';
                const customer = order.customerName || order.userId || order.customer?.name || order.customer || '';

                // Extract material from items
                let material = '';
                if (order.items && Array.isArray(order.items) && order.items.length > 0) {
                    material = order.items[0].metalType || '';
                }
                material = material || order.material || order.productName || order.type || '';

                return (
                    id.toString().toLowerCase().includes(normalizedSearch) ||
                    customer.toString().toLowerCase().includes(normalizedSearch) ||
                    material.toString().toLowerCase().includes(normalizedSearch)
                );
            });
    }, [activeFilter, orders, searchTerm]);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredOrders, currentPage, itemsPerPage]);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePageChange = (pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum);
    };

    const getPaginationNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    // Reset to page 1 when filter or search changes
    useMemo(() => {
        setCurrentPage(1);
    }, [activeFilter, searchTerm]);

    const orderCount = orders.length;
    const pendingCount = orders.filter((order) => {
        const orderStatus = (order.paymentStatus || order.status || order.payment?.status || '').toString().toLowerCase();
        return orderStatus === 'pending' || orderStatus === 'pending_payment' || orderStatus === 'payment_success' || orderStatus === 'paid';
    }).length;
    const rejectedCount = orders.filter((order) => {
        const orderStatus = (order.paymentStatus || order.status || order.payment?.status || '').toString().toLowerCase();
        return orderStatus === 'rejected' || orderStatus === 'reject' || orderStatus === 'failed' || orderStatus === 'rejection' || orderStatus === 'declined';
    }).length;

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 md:ml-[290px] ml-0 overflow-x-hidden">
                <Header />
                <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="p-6 bg-white rounded-xl shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold">Transactions Approval</h2>
                                <p className="text-sm text-gray-500">Review pending orders and rejected history without changing the existing orders transaction view.</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['all', 'pending', 'rejected'].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}>
                                        {filter === 'all' ? 'All Orders' : filter === 'pending' ? 'Pending' : 'Rejected'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">{error}</div>}

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
                                <p className="text-sm text-gray-500">Total Orders</p>
                                <p className="mt-2 text-2xl font-semibold">{orderCount}</p>
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="mt-2 text-2xl font-semibold">{pendingCount}</p>
                            </div>
                            <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
                                <p className="text-sm text-gray-500">Rejected</p>
                                <p className="mt-2 text-2xl font-semibold">{rejectedCount}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="grow">
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by order ID, customer or material"
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                            <div className="text-sm text-gray-600">Showing {filteredOrders.length} of {orderCount} orders</div>
                        </div>

                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Order ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Customer</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Material</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Created</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-6 text-center text-sm text-gray-500">
                                                {activeFilter === 'pending' && 'No pending approval orders found.'}
                                                {activeFilter === 'rejected' && 'No rejected orders found.'}
                                                {activeFilter === 'all' && 'No orders found for the selected criteria.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedOrders.map((order) => {
                                            const id = order._id || order.id || order.orderId || '-';
                                            const customer = order.customerName || order.customer?.name || order.userId || order.customer || '-';

                                            // Extract material from items (new API format)
                                            let material = '-';
                                            if (order.items && Array.isArray(order.items) && order.items.length > 0) {
                                                const firstItem = order.items[0];
                                                if (firstItem.metalType) {
                                                    material = `${firstItem.quantityInGrams}g ${firstItem.metalType}`;
                                                }
                                            } else {
                                                material = order.material || order.productName || order.type || '-';
                                            }

                                            const amount = order.pricing?.totalAmount || order.totalAmount || order.amount || order.price || 0;
                                            const statusValue = (order.paymentStatus || order.payment?.status || order.status || 'Unknown').toString();
                                            const statusLower = statusValue.toLowerCase();

                                            // Handle createdAt - could be timestamp object or string
                                            let createdAt = order.createdAt || order.createdAtDate || order.date || order.payment?.createdAt || '-';

                                            const isPending = statusLower === 'pending' || statusLower === 'pending_payment' || statusLower === 'payment_success' || statusLower === 'paid';

                                            // Display status label
                                            const displayStatus = isPending ? 'Processing' : statusValue;

                                            return (
                                                <tr key={id}>
                                                    <td className="px-4 py-4 text-sm text-gray-700">{order.orderNumber || id}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-700">{customer}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-700">{material}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-700">₹{Number(amount).toLocaleString()}</td>
                                                    <td className="px-4 py-4 text-sm">
                                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isPending ? 'bg-blue-100 text-blue-800' :
                                                            statusLower === 'rejected' || statusLower === 'failed' ? 'bg-red-100 text-red-800' :
                                                                statusLower === 'approved' ? 'bg-green-100 text-green-800' :
                                                                    'bg-slate-100 text-slate-700'
                                                            }`}>
                                                            {displayStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-500">{createdAt ? new Date(createdAt._seconds ? createdAt._seconds * 1000 : createdAt).toLocaleDateString() : '-'}</td>
                                                    <td className="px-4 py-4 text-right text-sm font-medium">
                                                        {isPending ? (
                                                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                                                <button
                                                                    onClick={() => handleApprove(id)}
                                                                    disabled={actionLoading}
                                                                    className="rounded-full bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(id)}
                                                                    disabled={actionLoading}
                                                                    className="rounded-full bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500">No actions</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Controls */}
                        {filteredOrders.length > 0 && (
                            <div className="flex items-center justify-between px-4 py-4 bg-gray-50 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                    Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span> | Showing <span className="font-semibold">{paginatedOrders.length}</span> of <span className="font-semibold">{filteredOrders.length}</span> orders
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        title="Previous page"
                                    >
                                        <FaChevronLeft size={16} />
                                    </button>
                                    <div className="flex gap-1">
                                        {getPaginationNumbers().map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={currentPage === pageNum ? 'w-10 h-10 rounded-lg font-medium transition bg-blue-600 text-white' : 'w-10 h-10 rounded-lg font-medium transition bg-gray-100 text-gray-700 hover:bg-gray-200'}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage >= totalPages}
                                        className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        title="Next page"
                                    >
                                        <FaChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
