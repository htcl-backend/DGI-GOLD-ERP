import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../Contexts/AuthContext";
import { FaWallet, FaPlus, FaEye, FaEyeSlash, FaDownload, FaFilter, FaHistory, FaTimes, FaArrowLeft } from "react-icons/fa";

const WalletPage = () => {
    const { user } = useAuth();
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const [filterType, setFilterType] = useState("all");
    const [filterDate, setFilterDate] = useState("all");
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Wallet data
    const walletData = {
        totalBalance: user?.totalRevenue || 125000,
        currency: "₹",
        vendorName: user?.businessName || "Ramesh Jewellers Pvt Ltd",
        accountHolder: user?.name || "Ramesh Kumar",
        email: user?.email || "vendor@dgi.com",
        phone: user?.phone || "+91-9876543210",
        accountStatus: "Active",
        bankAccount: "XXXX XXXX XXXX 1234",
        ifsc: "ICIC0000001",
        gstin: user?.gstin || "27AABCU9603R1ZX",
        kycStatus: user?.kycStatus || "Verified",
        totalTransactions: 28,
        monthlyEarnings: 89500,
        lastUpdated: new Date().toLocaleDateString(),
        allCustomers: [
            { id: 1, name: "Arjun Sharma", email: "arjun@email.com", phone: "+91-9876543201", totalSpent: 50000, orders: 3 },
            { id: 2, name: "Priya Patel", email: "priya@email.com", phone: "+91-9876543202", totalSpent: 75000, orders: 5 },
            { id: 3, name: "Rahul Kumar", email: "rahul@email.com", phone: "+91-9876543203", totalSpent: 42000, orders: 2 },
            { id: 4, name: "Anjali Singh", email: "anjali@email.com", phone: "+91-9876543204", totalSpent: 38000, orders: 4 },
            { id: 5, name: "Vikram Gupta", email: "vikram@email.com", phone: "+91-9876543205", totalSpent: 60000, orders: 3 },
        ],
        allTransactions: [
            {
                id: 1,
                type: "credit",
                amount: 50000,
                date: "2024-04-05",
                description: "Gold Purchase Order #ORD-001",
                customer: "Customer Name 1",
                status: "completed",
            },
            {
                id: 2,
                type: "debit",
                amount: 5000,
                date: "2024-04-04",
                description: "Withdrawal",
                customer: "-",
                status: "completed",
            },
            {
                id: 3,
                type: "credit",
                amount: 30000,
                date: "2024-04-03",
                description: "Silver Purchase Order #ORD-002",
                customer: "Customer Name 2",
                status: "completed",
            },
            {
                id: 4,
                type: "credit",
                amount: 25000,
                date: "2024-04-02",
                description: "Platinum Order #ORD-003",
                customer: "Customer Name 3",
                status: "pending",
            },
            {
                id: 5,
                type: "debit",
                amount: 3000,
                date: "2024-04-01",
                description: "Service Charges",
                customer: "-",
                status: "completed",
            },
            {
                id: 6,
                type: "credit",
                amount: 45000,
                date: "2024-03-31",
                description: "Gold Purchase Order #ORD-004",
                customer: "Customer Name 4",
                status: "completed",
            },
            {
                id: 7,
                type: "credit",
                amount: 20000,
                date: "2024-03-30",
                description: "Silver Order #ORD-005",
                customer: "Customer Name 5",
                status: "completed",
            },
        ]
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

                        {/* Balance Card */}
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl p-8 shadow-xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                        {/* Customers Section */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-xl font-bold text-gray-800">Customer List ({walletData.allCustomers.length})</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                                            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total Spent</th>
                                            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Orders</th>
                                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {walletData.allCustomers.map((customer) => (
                                            <tr key={customer.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-gray-800 font-medium">{customer.name}</td>
                                                <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                                                <td className="px-6 py-4 text-gray-600">{customer.phone}</td>
                                                <td className="px-6 py-4 text-right font-semibold text-green-600">{formatCurrency(customer.totalSpent)}</td>
                                                <td className="px-6 py-4 text-right text-gray-800 font-medium">{customer.orders}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => setSelectedCustomer(customer)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 mx-auto transition"
                                                    >
                                                        <FaHistory />
                                                        View History
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
