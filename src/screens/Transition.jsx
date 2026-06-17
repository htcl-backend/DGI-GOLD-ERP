import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import apiService from './service/apiService';

const Transition = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const normalizeOrderList = (data) => {
        if (Array.isArray(data)) return data;
        if (data?.orders && Array.isArray(data.orders)) return data.orders;
        if (data?.data && Array.isArray(data.data)) return data.data;
        if (data?.data?.orders && Array.isArray(data.data.orders)) return data.data.orders;
        if (data?.data?.data && Array.isArray(data.data.data)) return data.data.data;
        return [];
    };

    const isPaymentPending = (paymentStatus) => ['pending', 'pending_payment'].includes(paymentStatus);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = activeFilter === 'all'
                ? await apiService.orders.getAll()
                : await apiService.orders.getAdminPending({ page: 1, limit: 50 });

            const ordersList = normalizeOrderList(response?.data ?? response);

            if (!ordersList.length && response?.success === false) {
                setError(response?.error || 'Unable to load transition orders');
            } else {
                setOrders(ordersList);
            }
        } catch (err) {
            console.error('Error loading transition orders:', err);
            setError('Failed to load transition orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [activeFilter]);

    const handleApprove = async (orderId) => {
        if (!orderId) return;
        try {
            setActionLoading(true);
            const response = await apiService.orders.approveOrder(orderId);
            if (response?.success || response?.status === 200) {
                fetchOrders();
            } else {
                setError(response?.error || 'Unable to approve order');
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
        if (!rejectionReason?.trim()) return;

        try {
            setActionLoading(true);
            const response = await apiService.orders.rejectOrder(orderId, {
                reason: rejectionReason,
            });
            if (response?.success || response?.status === 200) {
                fetchOrders();
            } else {
                setError(response?.error || 'Unable to reject order');
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
                const status = order.status?.toLowerCase() || '';
                const paymentStatus = order.payment?.status?.toLowerCase() || '';

                if (activeFilter === 'pending') {
                    return isPaymentPending(paymentStatus) || status.includes('pending');
                }
                if (activeFilter === 'rejected') {
                    return paymentStatus === 'rejected' || status === 'rejected';
                }
                return true;
            })
            .filter((order) => {
                if (!normalizedSearch) return true;
                const id = order._id || order.id || order.orderId || '';
                const customer = order.customerName || order.customer?.name || order.customer || '';
                const material = order.material || order.productName || order.type || '';
                return (
                    id.toString().toLowerCase().includes(normalizedSearch) ||
                    customer.toString().toLowerCase().includes(normalizedSearch) ||
                    material.toString().toLowerCase().includes(normalizedSearch)
                );
            });
    }, [activeFilter, orders, searchTerm]);

    const orderCount = orders.length;
    const pendingCount = orders.filter((order) => {
        const status = order.status?.toLowerCase() || '';
        const paymentStatus = order.payment?.status?.toLowerCase() || '';
        return isPaymentPending(paymentStatus) || status.includes('pending');
    }).length;
    const rejectedCount = orders.filter((order) => {
        const status = order.status?.toLowerCase() || '';
        const paymentStatus = order.payment?.status?.toLowerCase() || '';
        return paymentStatus === 'rejected' || status === 'rejected';
    }).length;

    if (loading) return <div className="p-4">Loading transition orders...</div>;

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 md:ml-[290px] ml-0 overflow-x-hidden">
                <Header />
                <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="p-6 bg-white rounded-xl shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold">Transition Approval Workflow</h2>
                                <p className="text-sm text-gray-500">Manage pending approvals and review rejected order history.</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['all', 'pending', 'rejected'].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                        {filter === 'all' ? 'All Orders' : filter === 'pending' ? 'Pending Approval' : 'Rejected'}
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
                            <div className="text-sm text-gray-600">
                                Showing {filteredOrders.length} of {orderCount} orders
                            </div>
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
                                                No orders match this filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order) => {
                                            const id = order._id || order.id || order.orderId || '-';
                                            const customer = order.customerName || order.customer?.name || order.customer || '-';
                                            const material = order.material || order.productName || order.type || '-';
                                            const amount = order.pricing?.totalAmount || order.totalAmount || order.amount || order.price || 0;
                                            const status = order.status || 'Unknown';
                                            const createdAtValue = order.createdAt || order.createdAtDate || order.date || '-';
                                            const createdAt = createdAtValue?._seconds
                                                ? new Date(createdAtValue._seconds * 1000).toLocaleDateString()
                                                : createdAtValue
                                                    ? new Date(createdAtValue).toLocaleDateString()
                                                    : '-';
                                            const paymentStatus = order.payment?.status?.toLowerCase() || '';
                                            const isPending = isPaymentPending(paymentStatus) || status.toLowerCase().includes('pending');

                                            return (
                                                <tr key={id}>
                                                    <td className="px-4 py-4 text-sm text-gray-700">{id}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-700">{customer}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-700">{material}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-700">₹{amount.toLocaleString()}</td>
                                                    <td className="px-4 py-4 text-sm">
                                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                                                                    'bg-slate-100 text-slate-700'
                                                            }`}>
                                                            {status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-500">{createdAt ? new Date(createdAt).toLocaleDateString() : '-'}</td>
                                                    <td className="px-4 py-4 text-right text-sm font-medium">
                                                        {isPending ? (
                                                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                                                <button
                                                                    onClick={() => handleApprove(id)}
                                                                    disabled={actionLoading}
                                                                    className="rounded-full bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300">
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(id)}
                                                                    disabled={actionLoading}
                                                                    className="rounded-full bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transition;
