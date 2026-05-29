import React, { useState, useEffect } from 'react';
import {
    FaChartBar,
    FaCalendar,
    FaArrowUp,
    FaArrowDown,
    FaSpinner,
    FaExclamationTriangle,
} from 'react-icons/fa';
import { Bar, Line } from 'react-chartjs-2';
import apiService from '../screens/service/apiService';

const MonthlyPnL = () => {
    const [pnlData, setPnlData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    // Fetch monthly P&L data
    useEffect(() => {
        const fetchMonthlyPnL = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await apiService.analytics.vendor.getMonthlyPnl({
                    year: selectedYear,
                    month: selectedMonth,
                });

                if (result.success && result.data) {
                    setPnlData(result.data.data || result.data);
                    console.log('✅ Fetched monthly P&L:', result.data.data || result.data);
                } else {
                    throw new Error(result.error || 'Failed to fetch monthly P&L');
                }
            } catch (err) {
                console.error('Error fetching monthly P&L:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMonthlyPnL();
    }, [selectedYear, selectedMonth]);

    const formatCurrency = (value) => {
        return `₹${(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    };

    const getMonthName = (month) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[month - 1] || '';
    };

    const data = pnlData || {};
    const isPnlPositive = (data.monthlyPnl || 0) >= 0;

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center justify-center gap-3">
                    <FaSpinner className="animate-spin text-amber-600 text-xl" />
                    <p className="text-gray-600">Loading monthly P&L data...</p>
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
                        <h3 className="font-semibold text-red-800">Error Loading Monthly P&L</h3>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <FaChartBar className="text-amber-600" />
                    Monthly P&L Analysis
                </h2>
                <p className="text-gray-600 mt-1">
                    Detailed monthly profit and loss report
                </p>
            </div>

            {/* Date Selector */}
            <div className="bg-white rounded-lg shadow-md p-4 flex gap-4 flex-wrap items-end">
                <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaCalendar className="inline mr-2" />
                        Year
                    </label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                    >
                        {[2024, 2025, 2026, 2027].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Month
                    </label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                            <option key={month} value={month}>
                                {getMonthName(month)} ({month})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Monthly P&L Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Revenue */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Total Revenue</h4>
                        <FaChartBar className="text-blue-500 text-xl" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(data.totalRevenue || data.monthlyRevenue || 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        From all transactions
                    </p>
                </div>

                {/* Total Cost */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Total Cost</h4>
                        <FaChartBar className="text-red-500 text-xl" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(data.totalCost || data.monthlyCost || 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        Expenses & costs
                    </p>
                </div>

                {/* Monthly P&L */}
                <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${isPnlPositive ? 'border-emerald-500' : 'border-orange-500'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Monthly P&L</h4>
                        {isPnlPositive ? (
                            <FaArrowUp className="text-emerald-500 text-xl" />
                        ) : (
                            <FaArrowDown className="text-orange-500 text-xl" />
                        )}
                    </div>
                    <p className={`text-2xl font-bold ${isPnlPositive ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {isPnlPositive ? '+' : ''}{formatCurrency(data.monthlyPnl || 0)}
                    </p>
                    <p className={`text-sm font-semibold mt-2 ${isPnlPositive ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {isPnlPositive ? '+' : ''}{(data.pnlPercentage || data.pnlPercent || 0).toFixed(2)}%
                    </p>
                </div>

                {/* Order Count */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600">Total Orders</h4>
                        <FaChartBar className="text-purple-500 text-xl" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                        {data.totalOrders || data.orderCount || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        Transactions
                    </p>
                </div>
            </div>

            {/* Detailed Breakdown */}
            {data.breakdown && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Breakdown</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(data.breakdown).map(([key, value]) => (
                            <div key={key} className="p-3 bg-gray-50 rounded">
                                <p className="text-sm font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</p>
                                <p className="text-lg font-bold text-gray-800">
                                    {typeof value === 'number' ? formatCurrency(value) : value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Key Metrics */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Performance Indicators</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded p-3">
                        <p className="text-xs text-gray-600 font-medium">Profit Margin</p>
                        <p className="text-xl font-bold text-gray-800">
                            {data.profitMargin ? `${(data.profitMargin || 0).toFixed(2)}%` : 'N/A'}
                        </p>
                    </div>
                    <div className="bg-white rounded p-3">
                        <p className="text-xs text-gray-600 font-medium">Avg Order Value</p>
                        <p className="text-xl font-bold text-gray-800">
                            {formatCurrency((data.totalRevenue || 0) / Math.max(data.totalOrders || 1, 1))}
                        </p>
                    </div>
                    <div className="bg-white rounded p-3">
                        <p className="text-xs text-gray-600 font-medium">Month</p>
                        <p className="text-xl font-bold text-gray-800">
                            {getMonthName(selectedMonth)} {selectedYear}
                        </p>
                    </div>
                    <div className="bg-white rounded p-3">
                        <p className="text-xs text-gray-600 font-medium">Status</p>
                        <p className={`text-xl font-bold ${isPnlPositive ? 'text-emerald-600' : 'text-orange-600'}`}>
                            {isPnlPositive ? '📈 Profit' : '📉 Loss'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyPnL;
