import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../Contexts/AuthContext";
import apiService from "./service/apiService";
import { FaWallet, FaPlus, FaEye, FaEyeSlash, FaDownload, FaFilter, FaHistory, FaTimes, FaArrowLeft } from "react-icons/fa";

const WalletPage = () => {
    const { user } = useAuth();
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const [filterType, setFilterType] = useState("all");
    const [filterDate, setFilterDate] = useState("all");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch wallet data on component mount
    useEffect(() => {
        const fetchWalletData = async () => {
            setLoading(true);
            setError("");
            try {
                // Fetch balance
                const balanceResult = await apiService.wallet.getBalance();
                console.log("💰 Wallet Balance:", balanceResult);

                // Fetch transactions
                const txnResult = await apiService.wallet.getTransactions({ limit: 20 });
                console.log("📋 Wallet Transactions:", txnResult);

                if (balanceResult.success) {
                    setWalletBalance(balanceResult.data);
                }

                if (txnResult.success && txnResult.data) {
                    // Handle nested response structure if needed
                    const txnData = txnResult.data?.data || txnResult.data;
                    setTransactions(Array.isArray(txnData) ? txnData : []);
                }
            } catch (err) {
                console.error("❌ Error fetching wallet data:", err);
                setError("Failed to load wallet data");
            } finally {
                setLoading(false);
            }
        };

        fetchWalletData();
    }, []);

    // Wallet data - merge API data with user info
    const walletData = {
        totalBalance: walletBalance?.balance || walletBalance?.availableBalance || 0,
        currency: "₹",
        vendorName: user?.businessName || "Vendor Account",
        accountHolder: user?.name || "Account Holder",
        email: user?.email || "vendor@dgi.com",
        phone: user?.phone || "+91-9876543210",
        accountStatus: walletBalance?.status || "Active",
        bankAccount: walletBalance?.bankAccount || "XXXX XXXX XXXX ****",
        ifsc: walletBalance?.ifsc || "XXXX0000001",
        gstin: user?.gstin || "N/A",
        kycStatus: user?.kycStatus || "Verified",
        totalTransactions: transactions?.length || 0,
        monthlyEarnings: walletBalance?.monthlyEarnings || 0,
        lastUpdated: new Date().toLocaleDateString(),
        allTransactions: transactions || [],
    };

    const formatCurrency = (amount) => {
        return `${walletData.currency}${amount.toLocaleString("en-IN")}`;
    };

    // Filter transactions
    const getFilteredTransactions = () => {
        let filtered = walletData.allTransactions;

        if (filterType !== "all") {
            filtered = filtered.filter(t => t.type === filterType);
        }

        if (filterDate === "today") {
            const today = new Date().toISOString().split("T")[0];
            filtered = filtered.filter(t => t.date === today);
        } else if (filterDate === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
        } else if (filterDate === "month") {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            filtered = filtered.filter(t => new Date(t.date) >= monthAgo);
        }

        return filtered;
    };

    // Get transactions for specific customer
    const getCustomerTransactions = (customerName) => {
        return walletData.allTransactions.filter(t => t.customer === customerName || t.customer.includes(customerName));
    };

    // Get overall customer transactions (all time)
    const getCustomerAllTransactions = (customerName) => {
        return walletData.allTransactions.filter(t => t.customer === customerName || t.customer.includes(customerName));
    };

    const filteredTransactions = getFilteredTransactions();

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-[290px]">
                <Header />
                <div className="p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Page Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800">Wallet Management</h1>
                                <p className="text-gray-600 mt-2">Last updated: {walletData.lastUpdated}</p>
                            </div>
                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition font-semibold">
                                <FaDownload />
                                <span>Download Statement</span>
                            </button>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                                <p>Loading wallet data...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                <p>⚠️ {error}</p>
                            </div>
                        )}

                        {/* Balance Card */}
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl p-8 shadow-xl">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg opacity-90">Total Balance</span>
                                        <button
                                            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                                            className="text-2xl hover:opacity-80 transition"
                                        >
                                            {isBalanceVisible ? <FaEye /> : <FaEyeSlash />}
                                        </button>
                                    </div>
                                    <h2 className="text-5xl font-bold mb-6 tracking-wide">
                                        {isBalanceVisible ? formatCurrency(walletData.totalBalance) : "••••••••"}
                                    </h2>
                                    <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2">
                                        <FaPlus />
                                        Add Money
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-purple-500 bg-opacity-30 p-4 rounded-lg">
                                        <p className="text-sm opacity-75">Monthly Earnings</p>
                                        <p className="text-2xl font-bold">{formatCurrency(walletData.monthlyEarnings)}</p>
                                    </div>
                                    <div className="bg-purple-500 bg-opacity-30 p-4 rounded-lg">
                                        <p className="text-sm opacity-75">Total Transactions</p>
                                        <p className="text-2xl font-bold">{walletData.totalTransactions}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <p className="text-gray-600 text-sm mb-2">Account Holder</p>
                                <p className="font-bold text-gray-800">{walletData.accountHolder}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <p className="text-gray-600 text-sm mb-2">Account Status</p>
                                <p className="font-bold text-green-600">{walletData.accountStatus} ✓</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <p className="text-gray-600 text-sm mb-2">KYC Status</p>
                                <p className="font-bold text-green-600">{walletData.kycStatus}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <p className="text-gray-600 text-sm mb-2">GSTIN</p>
                                <p className="font-bold text-gray-800">{walletData.gstin}</p>
                            </div>
                        </div>

                        {/* Contact & Banking */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Contact Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-gray-600 text-sm">Email</p>
                                        <p className="font-semibold text-gray-800">{walletData.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Phone</p>
                                        <p className="font-semibold text-gray-800">{walletData.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Business Name</p>
                                        <p className="font-semibold text-gray-800">{walletData.vendorName}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Banking Details</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-gray-600 text-sm">Account Number</p>
                                        <p className="font-semibold text-gray-800">{walletData.bankAccount}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">IFSC Code</p>
                                        <p className="font-semibold text-gray-800">{walletData.ifsc}</p>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Transactions Section */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-800">Transaction History</h3>
                                <div className="flex gap-3">
                                    <div className="flex items-center gap-2">
                                        <FaFilter className="text-gray-600" />
                                        <select
                                            value={filterType}
                                            onChange={(e) => setFilterType(e.target.value)}
                                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="all">All Types</option>
                                            <option value="credit">Credit</option>
                                            <option value="debit">Debit</option>
                                        </select>
                                    </div>
                                    <select
                                        value={filterDate}
                                        onChange={(e) => setFilterDate(e.target.value)}
                                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="all">All Time</option>
                                        <option value="today">Today</option>
                                        <option value="week">Last 7 Days</option>
                                        <option value="month">Last 30 Days</option>
                                    </select>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Description</th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Customer</th>
                                            <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                                            <th className="px-6 py-3 text-right font-semibold text-gray-700">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filteredTransactions.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-gray-600">{new Date(transaction.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 font-medium text-gray-800">{transaction.description}</td>
                                                <td className="px-6 py-4 text-gray-600">{transaction.customer}</td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.status === "completed"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                    >
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                                <td
                                                    className={`px-6 py-4 text-right font-bold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"
                                                        }`}
                                                >
                                                    {transaction.type === "credit" ? "+" : "-"}
                                                    {formatCurrency(transaction.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {filteredTransactions.length === 0 && (
                                <div className="text-center py-8 text-gray-500">No transactions found</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer History Modal - Positioned at root level to show sidebar */}
            {selectedCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center shadow-lg z-[10000]\">
                            <div className="flex items-center gap-3">
                                <FaArrowLeft className="cursor-pointer text-2xl hover:opacity-80" onClick={() => setSelectedCustomer(null)} />
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                                    <p className="text-blue-100">Complete Transaction History</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="text-3xl hover:opacity-80 transition"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Customer Info Card */}
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
                                <h3 className="text-lg font-bold text-blue-900 mb-4">Customer Information</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <p className="text-gray-600 text-sm mb-1">Total Orders</p>
                                        <p className="text-2xl font-bold text-blue-600">{selectedCustomer.orders}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <p className="text-gray-600 text-sm mb-1">Total Spent</p>
                                        <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedCustomer.totalSpent)}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <p className="text-gray-600 text-sm mb-1">Email</p>
                                        <p className="font-semibold text-gray-800 text-sm">{selectedCustomer.email}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <p className="text-gray-600 text-sm mb-1">Phone</p>
                                        <p className="font-semibold text-gray-800 text-sm">{selectedCustomer.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Full Transaction History */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                    <h3 className="text-lg font-bold text-gray-800">Full Transaction History</h3>
                                    <p className="text-sm text-gray-600 mt-1">All-time transactions for this customer</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
                                                <th className="px-6 py-3 text-left font-semibold text-gray-700">Description</th>
                                                <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                                                <th className="px-6 py-3 text-right font-semibold text-gray-700">Amount</th>
                                                <th className="px-6 py-3 text-center font-semibold text-gray-700">Type</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {getCustomerAllTransactions(selectedCustomer.name).length > 0 ? (
                                                getCustomerAllTransactions(selectedCustomer.name).map((transaction) => (
                                                    <tr key={transaction.id} className="hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 text-gray-600">{new Date(transaction.date).toLocaleDateString()}</td>
                                                        <td className="px-6 py-4 font-medium text-gray-800">{transaction.description}</td>
                                                        <td className="px-6 py-4">
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.status === "completed"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                                    }`}
                                                            >
                                                                {transaction.status}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className={`px-6 py-4 text-right font-bold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"
                                                                }`}
                                                        >
                                                            {transaction.type === "credit" ? "+" : "-"}
                                                            {formatCurrency(transaction.amount)}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.type === "credit"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                                }`}>
                                                                {transaction.type === "credit" ? "Incoming" : "Outgoing"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                                        No transactions found for this customer
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Summary Stats */}
                                {getCustomerAllTransactions(selectedCustomer.name).length > 0 && (
                                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <p className="text-gray-600 text-sm mb-1">Total Transactions</p>
                                                <p className="text-2xl font-bold text-gray-800">{getCustomerAllTransactions(selectedCustomer.name).length}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-gray-600 text-sm mb-1">Total Credits</p>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {formatCurrency(
                                                        getCustomerAllTransactions(selectedCustomer.name)
                                                            .filter(t => t.type === "credit")
                                                            .reduce((sum, t) => sum + t.amount, 0)
                                                    )}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-gray-600 text-sm mb-1">Total Debits</p>
                                                <p className="text-2xl font-bold text-red-600">
                                                    {formatCurrency(
                                                        getCustomerAllTransactions(selectedCustomer.name)
                                                            .filter(t => t.type === "debit")
                                                            .reduce((sum, t) => sum + t.amount, 0)
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-end sticky bottom-0 bg-white py-4 border-t border-gray-200">
                                <button
                                    onClick={() => setSelectedCustomer(null)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                                >
                                    <FaArrowLeft />
                                    Back to List
                                </button>
                                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2">
                                    <FaDownload />
                                    Download History
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletPage;
