import React, { useState } from "react";
import { FaWallet, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";

const Wallet = ({ vendorData = {} }) => {
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);

    // Sample wallet data - in real app, this would come from API
    const walletData = {
        totalBalance: vendorData.totalRevenue || 125000,
        currency: "₹",
        vendorName: vendorData.businessName || "Ramesh Jewellers Pvt Ltd",
        accountHolder: vendorData.name || "Ramesh Kumar",
        email: vendorData.email || "vendor@dgi.com",
        phone: vendorData.phone || "+91-9876543210",
        recentTransactions: [
            {
                id: 1,
                type: "credit",
                amount: 50000,
                date: "2024-04-05",
                description: "Gold Purchase Order #ORD-001",
                customer: "Customer Name 1"
            },
            {
                id: 2,
                type: "debit",
                amount: 5000,
                date: "2024-04-04",
                description: "Withdrawal",
                customer: "-"
            },
            {
                id: 3,
                type: "credit",
                amount: 30000,
                date: "2024-04-03",
                description: "Silver Purchase Order #ORD-002",
                customer: "Customer Name 2"
            },
        ]
    };

    const formatCurrency = (amount) => {
        return `${walletData.currency}${amount.toLocaleString("en-IN")}`;
    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-500 p-3 rounded-lg">
                        <FaWallet className="text-white text-xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Wallet</h2>
                        <p className="text-sm text-gray-600">{walletData.vendorName}</p>
                    </div>
                </div>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
                    <FaPlus className="text-sm" />
                    <span className="text-sm font-medium">Add Money</span>
                </button>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl p-8 mb-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm opacity-90">Total Balance</span>
                    <button
                        onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                        className="text-lg hover:opacity-80 transition"
                    >
                        {isBalanceVisible ? <FaEye /> : <FaEyeSlash />}
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-4xl font-bold tracking-wide">
                        {isBalanceVisible ? formatCurrency(walletData.totalBalance) : "••••••••"}
                    </h3>
                </div>

                <div className="border-t border-purple-500 border-opacity-30 pt-4">
                    <p className="text-xs opacity-75 mb-1">Account Holder: {walletData.accountHolder}</p>
                    <p className="text-xs opacity-75">Email: {walletData.email}</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <span className="text-xs text-gray-600 block mb-2">Payment Method</span>
                    <p className="text-sm font-semibold text-gray-800">Bank Transfer</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <span className="text-xs text-gray-600 block mb-2">Phone</span>
                    <p className="text-sm font-semibold text-gray-800">{walletData.phone}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <span className="text-xs text-gray-600 block mb-2">Status</span>
                    <p className="text-sm font-semibold text-green-600">Active ✓</p>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h3>

                <div className="max-h-64 overflow-y-auto">
                    {walletData.recentTransactions.length > 0 ? (
                        <div className="space-y-3">
                            {walletData.recentTransactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition border-l-4"
                                    style={{
                                        borderLeftColor: transaction.type === "credit" ? "#10b981" : "#ef4444"
                                    }}
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800 text-sm">
                                            {transaction.description}
                                        </p>
                                        <div className="flex gap-3 text-xs text-gray-600 mt-1">
                                            <span>📅 {new Date(transaction.date).toLocaleDateString()}</span>
                                            <span>👤 {transaction.customer}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`font-bold text-sm ${transaction.type === "credit"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                }`}
                                        >
                                            {transaction.type === "credit" ? "+" : "-"}
                                            {formatCurrency(transaction.amount)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No transactions yet</p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <button className="bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50 py-3 rounded-lg font-semibold transition">
                    Withdraw Money
                </button>
                <button className="bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50 py-3 rounded-lg font-semibold transition">
                    View Full History
                </button>
            </div>
        </div>
    );
};

export default Wallet;
