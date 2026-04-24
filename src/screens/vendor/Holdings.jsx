import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useAuth } from '../../Contexts/AuthContext';
import { FaBoxes, FaChartLine, FaCalendar } from 'react-icons/fa';

const VendorHoldings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('summary');
    const [filterDate, setFilterDate] = useState('all');

    // Sample holdings data
    const holdingsData = {
        summary: {
            totalValue: 5035000,
            goldValue: 3275000,
            silverValue: 1760000,
            goldWeight: 156.5,
            silverWeight: 234.8,
            totalGain: 415000,
            gainPercent: 8.95,
        },
        byCustomer: [
            { id: 1, name: 'Arjun Sharma', gold: 45.5, silver: 68.3, value: 1250000, lastUpdate: '2024-04-23' },
            { id: 2, name: 'Priya Patel', gold: 32.2, silver: 45.6, value: 895000, lastUpdate: '2024-04-22' },
            { id: 3, name: 'Rahul Kumar', gold: 28.9, silver: 52.1, value: 785000, lastUpdate: '2024-04-21' },
        ],
        ledger: [
            { date: '2024-04-23', customer: 'Arjun Sharma', type: 'Deposit', commodity: 'Gold', weight: 5.5, rate: 6520, value: 35860, balance: 156.5 },
            { date: '2024-04-22', customer: 'Priya Patel', type: 'Withdrawal', commodity: 'Silver', weight: 10.0, rate: 78, value: 780, balance: 234.8 },
            { date: '2024-04-21', customer: 'Rahul Kumar', type: 'Deposit', commodity: 'Gold', weight: 3.2, rate: 6500, value: 20800, balance: 156.5 },
        ],
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-4 sm:p-6 lg:p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                <FaBoxes className="text-yellow-600" /> Commodity Holdings & Ledger
                            </h1>
                            <p className="text-gray-600 mt-2">Track all commodities owned by customers</p>
                        </div>

                        {/* Holdings Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <SummaryCard
                                title="Total Value"
                                value={`₹${holdingsData.summary.totalValue.toLocaleString('en-IN')}`}
                                icon="💰"
                                color="bg-gradient-to-br from-blue-500 to-blue-600"
                            />
                            <SummaryCard
                                title="Gold Holdings"
                                value={`${holdingsData.summary.goldWeight} kg`}
                                subtitle={`₹${holdingsData.summary.goldValue.toLocaleString('en-IN')}`}
                                icon="🏆"
                                color="bg-gradient-to-br from-yellow-500 to-yellow-600"
                            />
                            <SummaryCard
                                title="Silver Holdings"
                                value={`${holdingsData.summary.silverWeight} kg`}
                                subtitle={`₹${holdingsData.summary.silverValue.toLocaleString('en-IN')}`}
                                icon="⭐"
                                color="bg-gradient-to-br from-gray-400 to-gray-500"
                            />
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-lg card-shadow mb-8">
                            <div className="border-b border-gray-200 flex">
                                {['summary', 'customers', 'ledger'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-4 font-medium text-center transition ${activeTab === tab
                                                ? 'text-blue-600 border-b-2 border-blue-600'
                                                : 'text-gray-600 hover:text-gray-800'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                {activeTab === 'summary' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                                                <h4 className="text-sm font-medium text-green-700 mb-2">Total Gain</h4>
                                                <p className="text-3xl font-bold text-green-900">
                                                    ₹{holdingsData.summary.totalGain.toLocaleString('en-IN')}
                                                </p>
                                                <p className="text-sm text-green-700 mt-2">+{holdingsData.summary.gainPercent}% profit</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                                                <h4 className="text-sm font-medium text-purple-700 mb-2">Market Value</h4>
                                                <p className="text-3xl font-bold text-purple-900">
                                                    ₹{(holdingsData.summary.totalValue - holdingsData.summary.totalGain).toLocaleString('en-IN')}
                                                </p>
                                                <p className="text-sm text-purple-700 mt-2">Current valuation</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'customers' && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gold (kg)</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Silver (kg)</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Update</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {holdingsData.byCustomer.map((holding) => (
                                                    <tr key={holding.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{holding.name}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-600">{holding.gold} kg</td>
                                                        <td className="px-4 py-2 text-sm text-gray-600">{holding.silver} kg</td>
                                                        <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                                            ₹{holding.value.toLocaleString('en-IN')}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-600">{holding.lastUpdate}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === 'ledger' && (
                                    <div className="space-y-4 mb-4">
                                        <div className="flex gap-2">
                                            <FaCalendar className="text-gray-600 mt-3" />
                                            <select
                                                value={filterDate}
                                                onChange={(e) => setFilterDate(e.target.value)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="all">All Dates</option>
                                                <option value="today">Today</option>
                                                <option value="week">This Week</option>
                                                <option value="month">This Month</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'ledger' && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Commodity</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {holdingsData.ledger.map((entry, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 text-sm text-gray-600">{entry.date}</td>
                                                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{entry.customer}</td>
                                                        <td className="px-4 py-2 text-sm">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${entry.type === 'Deposit' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                                                                }`}>
                                                                {entry.type}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-600">{entry.commodity}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-600">{entry.weight} kg</td>
                                                        <td className="px-4 py-2 text-sm text-gray-600">₹{entry.rate}</td>
                                                        <td className="px-4 py-2 text-sm font-medium text-gray-900">₹{entry.value.toLocaleString('en-IN')}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-600">{entry.balance} kg</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SummaryCard = ({ title, value, subtitle, icon, color }) => (
    <div className={`${color} rounded-lg p-6 text-white shadow-lg`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-white/80 text-sm">{title}</p>
                <p className="text-3xl font-bold mt-2">{value}</p>
                {subtitle && <p className="text-sm text-white/70 mt-2">{subtitle}</p>}
            </div>
            <span className="text-4xl">{icon}</span>
        </div>
    </div>
);

export default VendorHoldings;
