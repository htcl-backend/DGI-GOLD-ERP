import React, { useState, useEffect } from 'react';
import {
    FaChartLine,
    FaCoins,
    FaCalendar,
    FaBoxOpen,
    FaMoneyBillWave,
    FaArrowUp,
    FaArrowDown,
    FaUser,
    FaExclamationTriangle,
} from 'react-icons/fa';
import apiService from '../screens/service/apiService';

const CustomerAnalysis = ({ customerId = 'cust_12345' }) => {
    const [pnlData, setPnlData] = useState(null);
    const [metricsData, setMetricsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch customer P&L and metrics data
    useEffect(() => {
        const fetchAnalyticsData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [pnlResult, metricsResult] = await Promise.all([
                    apiService.analytics.vendor.getCustomerPnl(customerId),
                    apiService.analytics.vendor.getCustomerMetrics(customerId),
                ]);

                if (pnlResult.success && pnlResult.data) {
                    setPnlData(pnlResult.data.data || pnlResult.data);
                } else {
                    throw new Error(pnlResult.error || 'Failed to fetch P&L data');
                }

                if (metricsResult.success && metricsResult.data) {
                    setMetricsData(metricsResult.data.data || metricsResult.data);
                } else {
                    throw new Error(metricsResult.error || 'Failed to fetch metrics data');
                }
            } catch (err) {
                console.error('Error fetching customer analytics:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (customerId) {
            fetchAnalyticsData();
        }
    }, [customerId]);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                        <p className="mt-4 text-gray-600">Loading customer analytics...</p>
                    </div>
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
                        <h3 className="font-semibold text-red-800">Error Loading Analytics</h3>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const formatCurrency = (value) => {
        return `₹${(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const pnl = pnlData || {};
    const metrics = metricsData || {};

    // Determine if gains are positive or negative
    const isGainPositive = (pnl.unrealizedGain || 0) >= 0;
    const isMetricsPnlPositive = (metrics.pnl || 0) >= 0;

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <FaChartLine className="text-amber-600" />
                    Customer Analytics & P&L
                </h2>
                <p className="text-gray-600 mt-1">
                    Detailed financial analysis for customer {pnl.customerId || customerId}
                </p>
            </div>

            {/* Customer Header Info */}
            {(pnl.customerName || metrics.customerName) && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-600 text-white rounded-full p-4">
                            <FaUser className="text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                {pnl.customerName || metrics.customerName || 'Unknown Customer'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Customer ID: {pnl.customerId || customerId}
                            </p>
                            <p className="text-sm text-gray-600">
                                Joined: {formatDate(pnl.joinedDate || metrics.joinedDate || new Date())}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* P&L Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Investment */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Total Investment</h4>
                        <FaCoins className="text-blue-500 text-xl" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(pnl.totalInvestment || 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        {pnl.totalGramsBought ? `${pnl.totalGramsBought} grams` : 'N/A'}
                    </p>
                </div>

                {/* Current Value */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Current Value</h4>
                        <FaMoneyBillWave className="text-green-500 text-xl" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(pnl.currentValue || 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        Holdings Value
                    </p>
                </div>

                {/* Unrealized Gain/Loss */}
                <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${isGainPositive ? 'border-emerald-500' : 'border-red-500'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Unrealized P&L</h4>
                        {isGainPositive ? (
                            <FaArrowUp className="text-emerald-500 text-xl" />
                        ) : (
                            <FaArrowDown className="text-red-500 text-xl" />
                        )}
                    </div>
                    <p className={`text-2xl font-bold ${isGainPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isGainPositive ? '+' : ''}{formatCurrency(pnl.unrealizedGain || 0)}
                    </p>
                    <p className={`text-sm font-semibold mt-2 ${isGainPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isGainPositive ? '+' : ''}{(pnl.unrealizedGainPercent || 0).toFixed(2)}%
                    </p>
                </div>

                {/* Average Unit Cost */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Avg Unit Cost</h4>
                        <FaChartLine className="text-purple-500 text-xl" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(pnl.averageUnitCost || 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        Per gram
                    </p>
                </div>
            </div>

            {/* Customer Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Order Count */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Total Orders</h4>
                        <FaBoxOpen className="text-indigo-500 text-xl" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                        {metrics.orderCount || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        {metrics.orderFrequency ? `${metrics.orderFrequency} buyer` : 'N/A'}
                    </p>
                </div>

                {/* Total Invested */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Total Invested</h4>
                        <FaMoneyBillWave className="text-cyan-500 text-xl" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(metrics.totalInvested || 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        Avg: {formatCurrency(metrics.averageInvestment || 0)}
                    </p>
                </div>

                {/* Holdings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Total Holdings</h4>
                        <FaCoins className="text-amber-500 text-xl" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                        {metrics.totalGramsHeld ? `${metrics.totalGramsHeld.toLocaleString('en-IN')}g` : '0g'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        {formatCurrency(metrics.walletValue || 0)}
                    </p>
                </div>

                {/* Metrics P&L */}
                <div className={`bg-white rounded-lg shadow-md p-6 ${isMetricsPnlPositive ? 'border-b-4 border-emerald-500' : 'border-b-4 border-red-500'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">P&L from Metrics</h4>
                        {isMetricsPnlPositive ? (
                            <FaArrowUp className="text-emerald-500 text-xl" />
                        ) : (
                            <FaArrowDown className="text-red-500 text-xl" />
                        )}
                    </div>
                    <p className={`text-2xl font-bold ${isMetricsPnlPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isMetricsPnlPositive ? '+' : ''}{formatCurrency(metrics.pnl || 0)}
                    </p>
                    <p className={`text-sm font-semibold mt-2 ${isMetricsPnlPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isMetricsPnlPositive ? '+' : ''}{(metrics.pnlPercent || 0).toFixed(2)}%
                    </p>
                </div>
            </div>

            {/* Customer Segmentation & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Segmentation Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Segmentation</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <span className="text-sm font-medium text-gray-700">Segment</span>
                            <span className="text-sm font-bold text-amber-600 uppercase">
                                {metrics.segmentation || 'N/A'}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600">
                            <p className="mb-2 font-medium">Customer Profile:</p>
                            {metrics.segmentation === 'inactive' && (
                                <p>This customer has been inactive. Consider re-engagement campaigns.</p>
                            )}
                            {metrics.segmentation === 'occasional' && (
                                <p>Occasional buyer. Potential for increased engagement.</p>
                            )}
                            {metrics.segmentation === 'active' && (
                                <p>Active customer with regular purchases. High-value relationship.</p>
                            )}
                            {metrics.segmentation === 'vip' && (
                                <p>VIP customer with significant investment. Priority support recommended.</p>
                            )}
                            {!metrics.segmentation && (
                                <p>Customer data is being processed. Check back soon.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Holding Details */}
                {pnl.holdingsByMetal && Object.keys(pnl.holdingsByMetal).length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Holdings by Metal</h3>
                        <div className="space-y-3">
                            {Object.entries(pnl.holdingsByMetal).map(([metal, holding]) => (
                                <div key={metal} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 capitalize">{metal}</p>
                                        <p className="text-xs text-gray-500">
                                            {holding.quantity ? `${holding.quantity} grams` : 'N/A'}
                                        </p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-800">
                                        {formatCurrency(holding.value || 0)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Orders Information */}
            {pnl.orders && pnl.orders.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pnl.orders.slice(0, 5).map((order, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {formatDate(order.date || order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {formatCurrency(order.amount || 0)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.type === 'buy'
                                                ? 'text-green-600 bg-green-100'
                                                : 'text-red-600 bg-red-100'
                                                }`}>
                                                {order.type || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {order.quantity || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerAnalysis;
