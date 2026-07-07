// import React, { useState, useEffect } from "react";
// import Sidebar from "../components/Sidebar";
// import Header from "../components/Header";
// import { useAuth } from "../Contexts/AuthContext";
// import apiService from "./service/apiService";
// import { FaWallet, FaPlus, FaEye, FaEyeSlash, FaDownload, FaFilter, FaHistory, FaTimes, FaArrowLeft } from "react-icons/fa";

// const WalletPage = () => {
//     const { user } = useAuth();
//     const [isBalanceVisible, setIsBalanceVisible] = useState(true);
//     const [filterType, setFilterType] = useState("all");
//     const [filterDate, setFilterDate] = useState("all");
//     const [selectedCustomer, setSelectedCustomer] = useState(null);
//     const [walletBalance, setWalletBalance] = useState(null);
//     const [transactions, setTransactions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const transactionsPerPage = 10;

//     // Fetch wallet data whenever the authenticated user is available
//     useEffect(() => {
//         const fetchWalletData = async () => {
//             setLoading(true);
//             setError("");

//             try {
//                 // Fetch ledger data from new admin endpoints
//                 const ledgerTransactionResult = await apiService.ledger.admin.getTransactions({ limit: 100 });
//                 const ledgerWalletResult = await apiService.ledger.admin.getWalletLedger({ limit: 100 });

//                 console.log('📊 Ledger Transaction Result:', ledgerTransactionResult);
//                 console.log('💰 Ledger Wallet Result:', ledgerWalletResult);

//                 // Fallback to old method if ledger endpoints fail
//                 const customerResult = await apiService.vendor.customers.getAll({ limit: 50, offset: 0 });

//                 if (!customerResult.success) {
//                     console.warn("⚠️ Vendor customers fetch failed:", customerResult.error);
//                     throw new Error(customerResult.error || "Failed to load vendor customer data");
//                 }

//                 const customers = customerResult.data?.data?.customers || customerResult.data?.customers || [];
//                 const allOrders = customers.flatMap((customer) => customer.orders || []);

//                 const normalizePaymentStatus = (status) => {
//                     const normalized = status?.toString().toLowerCase() || '';
//                     if (normalized === 'pending' || normalized === 'pending_payment') return 'pending_payment';
//                     return normalized;
//                 };

//                 const completedOrders = allOrders.filter((order) => normalizePaymentStatus(order.paymentStatus || order.payment?.status || order.status) === 'completed');
//                 const pendingOrders = allOrders.filter((order) => normalizePaymentStatus(order.paymentStatus || order.payment?.status || order.status) === 'pending_payment');
//                 const failedOrders = allOrders.filter((order) => {
//                     const status = normalizePaymentStatus(order.paymentStatus || order.payment?.status || order.status);
//                     return status === 'failed' || status === 'cancelled';
//                 });

//                 // const totalCompleted = completedOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
//                 // const totalPending = pendingOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
//                 // const totalFailed = failedOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
//                 // const totalBalance = totalCompleted + totalPending + totalFailed;
//                 const getOrderAmount = (order) =>
//                     Number(order.totalAmount ?? order.pricing?.totalAmount ?? order.totalAmountINR ?? 0);

//                 const totalCompleted = completedOrders.reduce((sum, order) => sum + getOrderAmount(order), 0);
//                 const totalPending = pendingOrders.reduce((sum, order) => sum + getOrderAmount(order), 0);
//                 const totalFailed = failedOrders.reduce((sum, order) => sum + getOrderAmount(order), 0);

//                 setWalletBalance({
//                     totalBalance,
//                     availableBalance: totalCompleted,
//                     pendingBalance: totalPending,
//                     lockedBalance: totalFailed,
//                     currency: "₹",
//                     monthlyEarnings: totalCompleted,
//                     status: "Active",
//                     updatedAt: new Date().toISOString(),
//                 });

//                 const formattedTransactions = allOrders.map((order) => {
//                     const orderPaymentStatus = normalizePaymentStatus(order.paymentStatus || order.payment?.status || order.status);
//                     return {
//                         id: order.orderId || order.orderNumber || `${order.type}-${order.totalAmount}-${order.createdAt}`,
//                         date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
//                         type: orderPaymentStatus === "completed" ? "credit" : "debit",
//                         amount: Number(order.totalAmount || 0),
//                         description: `${order.type || "Order"} ${order.orderNumber || ""}`.trim(),
//                         status: orderPaymentStatus || "pending",
//                         reference: order.orderNumber || order.orderId,
//                     };
//                 });

//                 setTransactions(formattedTransactions);
//             } catch (err) {
//                 console.error("❌ Error fetching wallet data:", err);
//                 setError("Failed to load wallet data");
//                 setTransactions([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (user) {
//             fetchWalletData();
//         }
//     }, [user]);

//     // Wallet data - merge API data with user info
//     const walletData = {
//         totalBalance: walletBalance?.totalBalance ?? walletBalance?.balance ?? walletBalance?.availableBalance ?? 0,
//         availableBalance: walletBalance?.availableBalance ?? 0,
//         lockedBalance: walletBalance?.lockedBalance ?? 0,
//         pendingBalance: walletBalance?.pendingBalance ?? 0,
//         currency: walletBalance?.currency || "₹",
//         vendorName: user?.businessName || "Vendor Account",
//         accountHolder: user?.name || "Account Holder",
//         email: user?.email || "vendor@dgi.com",
//         phone: user?.phone || "+91-9876543210",
//         accountStatus: walletBalance?.status || "Active",
//         bankAccount: walletBalance?.bankAccount || "XXXX XXXX XXXX ****",
//         ifsc: walletBalance?.ifsc || "XXXX0000001",
//         gstin: user?.gstin || "N/A",
//         kycStatus: user?.kycStatus || "Verified",
//         totalTransactions: transactions?.length || 0,
//         monthlyEarnings: walletBalance?.monthlyEarnings ?? 0,
//         lastUpdated: walletBalance?.updatedAt
//             ? new Date(walletBalance.updatedAt).toLocaleDateString()
//             : new Date().toLocaleDateString(),
//         allTransactions: transactions || [],
//     };

//     const formatCurrency = (amount = 0) => {
//         return `${walletData.currency}${Number(amount).toLocaleString("en-IN")}`;
//     };

//     // Filter transactions
//     const getFilteredTransactions = () => {
//         let filtered = walletData.allTransactions;

//         if (filterType !== "all") {
//             filtered = filtered.filter(t => t.type === filterType);
//         }

//         if (filterDate === "today") {
//             const today = new Date().toISOString().split("T")[0];
//             filtered = filtered.filter(t => t.date === today);
//         } else if (filterDate === "week") {
//             const weekAgo = new Date();
//             weekAgo.setDate(weekAgo.getDate() - 7);
//             filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
//         } else if (filterDate === "month") {
//             const monthAgo = new Date();
//             monthAgo.setMonth(monthAgo.getMonth() - 1);
//             filtered = filtered.filter(t => new Date(t.date) >= monthAgo);
//         }

//         return filtered;
//     };

//     // Get transactions for specific customer
//     const getCustomerTransactions = (customerName) => {
//         return walletData.allTransactions.filter(t => t.customer === customerName || t.customer.includes(customerName));
//     };

//     // Get overall customer transactions (all time)
//     const getCustomerAllTransactions = (customerName) => {
//         return walletData.allTransactions.filter(t => t.customer === customerName || t.customer.includes(customerName));
//     };

//     const filteredTransactions = getFilteredTransactions();
//     const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / transactionsPerPage));
//     const paginatedTransactions = filteredTransactions.slice(
//         (currentPage - 1) * transactionsPerPage,
//         currentPage * transactionsPerPage
//     );

//     React.useEffect(() => {
//         setCurrentPage(1);
//     }, [filterType, filterDate, transactions.length]);

//     const handlePageChange = (newPage) => {
//         if (newPage >= 1 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     return (
//         <div className="flex min-h-screen bg-gray-50">
//             <Sidebar />
//             <div className="flex-1 md:ml-[290px] ml-0">
//                 <Header />
//                 <div className="p-8 overflow-y-auto">
//                     <div className="max-w-7xl mx-auto space-y-8">
//                         {/* Page Header */}
//                         <div className="flex justify-between items-center">
//                             <div>
//                                 <h1 className="text-4xl font-bold text-gray-800">Wallet Management</h1>
//                                 <p className="text-gray-600 mt-2">Last updated: {walletData.lastUpdated}</p>
//                             </div>
//                             <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition font-semibold">
//                                 <FaDownload />
//                                 <span>Download Statement</span>
//                             </button>
//                         </div>

//                         {/* Loading State */}
//                         {loading && (
//                             <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
//                                 <p>Loading wallet data...</p>
//                             </div>
//                         )}

//                         {/* Error State */}
//                         {error && (
//                             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//                                 <p>⚠️ {error}</p>
//                             </div>
//                         )}

//                         {/* Balance Card */}
//                         <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl p-8 shadow-xl">
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
//                                 <div>
//                                     <div className="flex justify-between items-center mb-4">
//                                         <span className="text-lg opacity-90">Total Balance</span>
//                                         <button
//                                             onClick={() => setIsBalanceVisible(!isBalanceVisible)}
//                                             className="text-2xl hover:opacity-80 transition"
//                                         >
//                                             {isBalanceVisible ? <FaEye /> : <FaEyeSlash />}
//                                         </button>
//                                     </div>
//                                     <h2 className="text-5xl font-bold mb-6 tracking-wide">
//                                         {isBalanceVisible ? formatCurrency(walletData.totalBalance) : "••••••••"}
//                                     </h2>
//                                     <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2">
//                                         <FaPlus />
//                                         Add Money
//                                     </button>
//                                 </div>
//                                 <div className="space-y-3">
//                                     <div className="bg-purple-500 bg-opacity-30 p-4 rounded-lg">
//                                         <p className="text-sm opacity-75">Monthly Earnings</p>
//                                         <p className="text-2xl font-bold">{formatCurrency(walletData.monthlyEarnings)}</p>
//                                     </div>
//                                     <div className="bg-purple-500 bg-opacity-30 p-4 rounded-lg">
//                                         <p className="text-sm opacity-75">Total Transactions</p>
//                                         <p className="text-2xl font-bold">{walletData.totalTransactions}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Balance Breakdown */}
//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                                 <p className="text-gray-600 text-sm mb-2">Available Balance</p>
//                                 <p className="text-3xl font-bold text-gray-900">{formatCurrency(walletData.availableBalance)}</p>
//                             </div>
//                             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                                 <p className="text-gray-600 text-sm mb-2">Pending Balance</p>
//                                 <p className="text-3xl font-bold text-yellow-600">{formatCurrency(walletData.pendingBalance)}</p>
//                             </div>
//                             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                                 <p className="text-gray-600 text-sm mb-2">Locked Balance</p>
//                                 <p className="text-3xl font-bold text-red-600">{formatCurrency(walletData.lockedBalance)}</p>
//                             </div>
//                         </div>

//                         {/* Account Details Grid */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//                             <div className="bg-white p-6 rounded-lg shadow-md">
//                                 <p className="text-gray-600 text-sm mb-2">Account Holder</p>
//                                 <p className="font-bold text-gray-800">{walletData.accountHolder}</p>
//                             </div>
//                             <div className="bg-white p-6 rounded-lg shadow-md">
//                                 <p className="text-gray-600 text-sm mb-2">Account Status</p>
//                                 <p className="font-bold text-green-600">{walletData.accountStatus} ✓</p>
//                             </div>
//                             <div className="bg-white p-6 rounded-lg shadow-md">
//                                 <p className="text-gray-600 text-sm mb-2">KYC Status</p>
//                                 <p className="font-bold text-green-600">{walletData.kycStatus}</p>
//                             </div>
//                             <div className="bg-white p-6 rounded-lg shadow-md">
//                                 <p className="text-gray-600 text-sm mb-2">GSTIN</p>
//                                 <p className="font-bold text-gray-800">{walletData.gstin}</p>
//                             </div>
//                         </div>

//                         {/* Contact & Banking */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
//                             <div className="bg-white p-6 rounded-lg shadow-md">
//                                 <h3 className="text-lg font-bold text-gray-800 mb-4">Contact Information</h3>
//                                 <div className="space-y-3">
//                                     <div>
//                                         <p className="text-gray-600 text-sm">Email</p>
//                                         <p className="font-semibold text-gray-800">{walletData.email}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-gray-600 text-sm">Phone</p>
//                                         <p className="font-semibold text-gray-800">{walletData.phone}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-gray-600 text-sm">Business Name</p>
//                                         <p className="font-semibold text-gray-800">{walletData.vendorName}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="bg-white p-6 rounded-lg shadow-md">
//                                 <h3 className="text-lg font-bold text-gray-800 mb-4">Banking Details</h3>
//                                 <div className="space-y-3">
//                                     <div>
//                                         <p className="text-gray-600 text-sm">Account Number</p>
//                                         <p className="font-semibold text-gray-800">{walletData.bankAccount}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-gray-600 text-sm">IFSC Code</p>
//                                         <p className="font-semibold text-gray-800">{walletData.ifsc}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>



//                         {/* Transactions Section */}
//                         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                             <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
//                                 <h3 className="text-xl font-bold text-gray-800">Transaction History</h3>
//                                 <div className="flex gap-3">
//                                     <div className="flex items-center gap-2">
//                                         <FaFilter className="text-gray-600" />
//                                         <select
//                                             value={filterType}
//                                             onChange={(e) => setFilterType(e.target.value)}
//                                             className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                         >
//                                             <option value="all">All Types</option>
//                                             <option value="credit">Credit</option>
//                                             <option value="debit">Debit</option>
//                                         </select>
//                                     </div>
//                                     <select
//                                         value={filterDate}
//                                         onChange={(e) => setFilterDate(e.target.value)}
//                                         className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                     >
//                                         <option value="all">All Time</option>
//                                         <option value="today">Today</option>
//                                         <option value="week">Last 7 Days</option>
//                                         <option value="month">Last 30 Days</option>
//                                     </select>
//                                 </div>
//                             </div>
//                             <div className="overflow-x-auto">
//                                 <table className="w-full text-sm">
//                                     <thead className="bg-gray-50 border-b">
//                                         <tr>
//                                             <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
//                                             <th className="px-6 py-3 text-left font-semibold text-gray-700">Description</th>
//                                             <th className="px-6 py-3 text-left font-semibold text-gray-700">Customer</th>
//                                             <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
//                                             <th className="px-6 py-3 text-right font-semibold text-gray-700">Amount</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y">
//                                         {paginatedTransactions.map((transaction) => (
//                                             <tr key={transaction.id} className="hover:bg-gray-50 transition">
//                                                 <td className="px-6 py-4 text-gray-600">{new Date(transaction.date).toLocaleDateString()}</td>
//                                                 <td className="px-6 py-4 font-medium text-gray-800">{transaction.description}</td>
//                                                 <td className="px-6 py-4 text-gray-600">{transaction.customer}</td>
//                                                 <td className="px-6 py-4">
//                                                     <span
//                                                         className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.status === "completed"
//                                                             ? "bg-green-100 text-green-800"
//                                                             : "bg-yellow-100 text-yellow-800"
//                                                             }`}
//                                                     >
//                                                         {transaction.status}
//                                                     </span>
//                                                 </td>
//                                                 <td
//                                                     className={`px-6 py-4 text-right font-bold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"
//                                                         }`}
//                                                 >
//                                                     {transaction.type === "credit" ? "+" : "-"}
//                                                     {formatCurrency(transaction.amount)}
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             {filteredTransactions.length === 0 && (
//                                 <div className="text-center py-8 text-gray-500">No transactions found</div>
//                             )}

//                             {filteredTransactions.length > transactionsPerPage && (
//                                 <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
//                                     <button
//                                         onClick={() => handlePageChange(currentPage - 1)}
//                                         disabled={currentPage === 1}
//                                         className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
//                                     >
//                                         Previous
//                                     </button>
//                                     <div className="flex items-center gap-2 text-sm text-gray-700">
//                                         <span>Page</span>
//                                         <span className="font-semibold">{currentPage}</span>
//                                         <span>of</span>
//                                         <span className="font-semibold">{totalPages}</span>
//                                     </div>
//                                     <button
//                                         onClick={() => handlePageChange(currentPage + 1)}
//                                         disabled={currentPage === totalPages}
//                                         className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
//                                     >
//                                         Next
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Customer History Modal - Positioned at root level to show sidebar */}
//             {selectedCustomer && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
//                     <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-auto">
//                         {/* Modal Header */}
//                         <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center shadow-lg z-[10000]\">
//                             <div className="flex items-center gap-3">
//                                 <FaArrowLeft className="cursor-pointer text-2xl hover:opacity-80" onClick={() => setSelectedCustomer(null)} />
//                                 <div>
//                                     <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
//                                     <p className="text-blue-100">Complete Transaction History</p>
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={() => setSelectedCustomer(null)}
//                                 className="text-3xl hover:opacity-80 transition"
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>

//                         <div className="p-8 space-y-8">
//                             {/* Customer Info Card */}
//                             <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
//                                 <h3 className="text-lg font-bold text-blue-900 mb-4">Customer Information</h3>
//                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                                     <div className="bg-white p-4 rounded-lg shadow-sm">
//                                         <p className="text-gray-600 text-sm mb-1">Total Orders</p>
//                                         <p className="text-2xl font-bold text-blue-600">{selectedCustomer.orders}</p>
//                                     </div>
//                                     <div className="bg-white p-4 rounded-lg shadow-sm">
//                                         <p className="text-gray-600 text-sm mb-1">Total Spent</p>
//                                         <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedCustomer.totalSpent)}</p>
//                                     </div>
//                                     <div className="bg-white p-4 rounded-lg shadow-sm">
//                                         <p className="text-gray-600 text-sm mb-1">Email</p>
//                                         <p className="font-semibold text-gray-800 text-sm">{selectedCustomer.email}</p>
//                                     </div>
//                                     <div className="bg-white p-4 rounded-lg shadow-sm">
//                                         <p className="text-gray-600 text-sm mb-1">Phone</p>
//                                         <p className="font-semibold text-gray-800 text-sm">{selectedCustomer.phone}</p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Full Transaction History */}
//                             <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//                                 <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//                                     <h3 className="text-lg font-bold text-gray-800">Full Transaction History</h3>
//                                     <p className="text-sm text-gray-600 mt-1">All-time transactions for this customer</p>
//                                 </div>
//                                 <div className="overflow-x-auto">
//                                     <table className="w-full text-sm">
//                                         <thead className="bg-gray-50 border-b">
//                                             <tr>
//                                                 <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
//                                                 <th className="px-6 py-3 text-left font-semibold text-gray-700">Description</th>
//                                                 <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
//                                                 <th className="px-6 py-3 text-right font-semibold text-gray-700">Amount</th>
//                                                 <th className="px-6 py-3 text-center font-semibold text-gray-700">Type</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="divide-y">
//                                             {getCustomerAllTransactions(selectedCustomer.name).length > 0 ? (
//                                                 getCustomerAllTransactions(selectedCustomer.name).map((transaction) => (
//                                                     <tr key={transaction.id} className="hover:bg-gray-50 transition">
//                                                         <td className="px-6 py-4 text-gray-600">{new Date(transaction.date).toLocaleDateString()}</td>
//                                                         <td className="px-6 py-4 font-medium text-gray-800">{transaction.description}</td>
//                                                         <td className="px-6 py-4">
//                                                             <span
//                                                                 className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.status === "completed"
//                                                                     ? "bg-green-100 text-green-800"
//                                                                     : "bg-yellow-100 text-yellow-800"
//                                                                     }`}
//                                                             >
//                                                                 {transaction.status}
//                                                             </span>
//                                                         </td>
//                                                         <td
//                                                             className={`px-6 py-4 text-right font-bold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"
//                                                                 }`}
//                                                         >
//                                                             {transaction.type === "credit" ? "+" : "-"}
//                                                             {formatCurrency(transaction.amount)}
//                                                         </td>
//                                                         <td className="px-6 py-4 text-center">
//                                                             <span className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.type === "credit"
//                                                                 ? "bg-green-100 text-green-800"
//                                                                 : "bg-red-100 text-red-800"
//                                                                 }`}>
//                                                                 {transaction.type === "credit" ? "Incoming" : "Outgoing"}
//                                                             </span>
//                                                         </td>
//                                                     </tr>
//                                                 ))
//                                             ) : (
//                                                 <tr>
//                                                     <td colSpan="5" className="text-center py-8 text-gray-500">
//                                                         No transactions found for this customer
//                                                     </td>
//                                                 </tr>
//                                             )}
//                                         </tbody>
//                                     </table>
//                                 </div>

//                                 {/* Summary Stats */}
//                                 {getCustomerAllTransactions(selectedCustomer.name).length > 0 && (
//                                     <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
//                                         <div className="grid grid-cols-3 gap-4">
//                                             <div className="text-center">
//                                                 <p className="text-gray-600 text-sm mb-1">Total Transactions</p>
//                                                 <p className="text-2xl font-bold text-gray-800">{getCustomerAllTransactions(selectedCustomer.name).length}</p>
//                                             </div>
//                                             <div className="text-center">
//                                                 <p className="text-gray-600 text-sm mb-1">Total Credits</p>
//                                                 <p className="text-2xl font-bold text-green-600">
//                                                     {formatCurrency(
//                                                         getCustomerAllTransactions(selectedCustomer.name)
//                                                             .filter(t => t.type === "credit")
//                                                             .reduce((sum, t) => sum + t.amount, 0)
//                                                     )}
//                                                 </p>
//                                             </div>
//                                             <div className="text-center">
//                                                 <p className="text-gray-600 text-sm mb-1">Total Debits</p>
//                                                 <p className="text-2xl font-bold text-red-600">
//                                                     {formatCurrency(
//                                                         getCustomerAllTransactions(selectedCustomer.name)
//                                                             .filter(t => t.type === "debit")
//                                                             .reduce((sum, t) => sum + t.amount, 0)
//                                                     )}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="flex gap-3 justify-end sticky bottom-0 bg-white py-4 border-t border-gray-200">
//                                 <button
//                                     onClick={() => setSelectedCustomer(null)}
//                                     className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
//                                 >
//                                     <FaArrowLeft />
//                                     Back to List
//                                 </button>
//                                 <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2">
//                                     <FaDownload />
//                                     Download History
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default WalletPage;

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../Contexts/AuthContext";
import apiService from "./service/apiService";
import { FaWallet, FaPlus, FaEye, FaEyeSlash, FaDownload, FaFilter, FaHistory, FaTimes, FaArrowLeft } from "react-icons/fa";

// Helper: read order amount from whichever field the backend actually used
const getOrderAmount = (order) =>
    Number(
        order.totalAmount ??
        order.pricing?.totalAmount ??
        order.totalAmountINR ??
        0
    );

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
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 10;

    // Fetch wallet data whenever the authenticated user is available
    useEffect(() => {
        const fetchWalletData = async () => {
            setLoading(true);
            setError("");

            try {
                // Fetch ledger data from new admin endpoints
                const ledgerTransactionResult = await apiService.ledger.admin.getTransactions({ limit: 100 });
                const ledgerWalletResult = await apiService.ledger.admin.getWalletLedger({ limit: 100 });

                console.log('📊 Ledger Transaction Result:', ledgerTransactionResult);
                console.log('💰 Ledger Wallet Result:', ledgerWalletResult);

                // Fallback to old method if ledger endpoints fail
                const customerResult = await apiService.vendor.customers.getAll({ limit: 50, offset: 0 });

                if (!customerResult.success) {
                    console.warn("⚠️ Vendor customers fetch failed:", customerResult.error);
                    throw new Error(customerResult.error || "Failed to load vendor customer data");
                }

                const customers = customerResult.data?.data?.customers || customerResult.data?.customers || [];
                const allOrders = customers.flatMap((customer) => customer.orders || []);

                // Debug: inspect the real shape of an order so we know which amount field is populated
                if (allOrders.length > 0) {
                    console.log('🔍 Sample order shape:', JSON.stringify(allOrders[0], null, 2));
                }

                const normalizePaymentStatus = (status) => {
                    const normalized = status?.toString().toLowerCase() || '';
                    if (normalized === 'pending' || normalized === 'pending_payment') return 'pending_payment';
                    return normalized;
                };

                const completedOrders = allOrders.filter((order) => normalizePaymentStatus(order.paymentStatus || order.payment?.status || order.status) === 'completed');
                const pendingOrders = allOrders.filter((order) => normalizePaymentStatus(order.paymentStatus || order.payment?.status || order.status) === 'pending_payment');
                const failedOrders = allOrders.filter((order) => {
                    const status = normalizePaymentStatus(order.paymentStatus || order.payment?.status || order.status);
                    return status === 'failed' || status === 'cancelled';
                });

                const totalCompleted = completedOrders.reduce((sum, order) => sum + getOrderAmount(order), 0);
                const totalPending = pendingOrders.reduce((sum, order) => sum + getOrderAmount(order), 0);
                const totalFailed = failedOrders.reduce((sum, order) => sum + getOrderAmount(order), 0);
                const orderBasedBalance = totalCompleted + totalPending + totalFailed;

                // Pull the raw ledger transaction list (used both for the table and as a balance fallback)
                const ledgerTxData = ledgerTransactionResult?.data?.data || ledgerTransactionResult?.data || {};
                const ledgerTxList = ledgerTxData.transactions || [];

                // Compute balance directly from ledger transactions: CREDIT adds, BUY_METAL spends
                const ledgerCredits = ledgerTxList
                    .filter((tx) => tx.type === "CREDIT")
                    .reduce((sum, tx) => sum + Number(tx.amountINR || 0), 0);
                const ledgerDebits = ledgerTxList
                    .filter((tx) => tx.type === "BUY_METAL")
                    .reduce((sum, tx) => sum + Number(tx.amountINR || 0), 0);
                const ledgerComputedBalance = ledgerCredits - ledgerDebits;

                // Priority: explicit wallet-summary endpoint > computed from ledger transactions > computed from orders
                const ledgerWalletData = ledgerWalletResult?.data?.data || ledgerWalletResult?.data || {};
                const hasExplicitWalletBalance =
                    ledgerWalletResult?.success &&
                    (ledgerWalletData.balance !== undefined || ledgerWalletData.totalBalance !== undefined || ledgerWalletData.availableBalance !== undefined);

                if (hasExplicitWalletBalance) {
                    setWalletBalance({
                        totalBalance: ledgerWalletData.balance ?? ledgerWalletData.totalBalance ?? ledgerComputedBalance,
                        availableBalance: ledgerWalletData.availableBalance ?? ledgerComputedBalance,
                        pendingBalance: ledgerWalletData.pendingBalance ?? 0,
                        lockedBalance: ledgerWalletData.lockedBalance ?? 0,
                        currency: "₹",
                        monthlyEarnings: ledgerWalletData.monthlyEarnings ?? ledgerCredits,
                        status: ledgerWalletData.status || "Active",
                        updatedAt: ledgerWalletData.updatedAt || new Date().toISOString(),
                    });
                } else if (ledgerTxList.length > 0) {
                    setWalletBalance({
                        totalBalance: ledgerComputedBalance,
                        availableBalance: ledgerComputedBalance,
                        pendingBalance: 0,
                        lockedBalance: 0,
                        currency: "₹",
                        monthlyEarnings: ledgerCredits,
                        status: "Active",
                        updatedAt: new Date().toISOString(),
                    });
                } else {
                    setWalletBalance({
                        totalBalance: orderBasedBalance,
                        availableBalance: totalCompleted,
                        pendingBalance: totalPending,
                        lockedBalance: totalFailed,
                        currency: "₹",
                        monthlyEarnings: totalCompleted,
                        status: "Active",
                        updatedAt: new Date().toISOString(),
                    });
                }

                // Build transaction table rows from the same ledger transaction list
                if (ledgerTxList.length > 0) {
                    const formattedLedgerTransactions = ledgerTxList.map((tx) => {
                        const isCredit = tx.type === "CREDIT" || tx.type === "credit";
                        const description = isCredit
                            ? `Wallet credit ₹${Number(tx.amountINR || 0).toLocaleString("en-IN")}`
                            : `Bought ${tx.grams ?? ""}g metal · ₹${Number(tx.amountINR || 0).toLocaleString("en-IN")}`;

                        return {
                            id: tx.id,
                            // tx.createdAt is already a valid ISO string from the backend
                            date: tx.createdAt || new Date().toISOString(),
                            type: isCredit ? "credit" : "debit",
                            amount: Number(tx.amountINR || 0),
                            description,
                            // No status field comes back per-transaction from the ledger; these are settled entries
                            status: "completed",
                            reference: tx.orderId || tx.id,
                        };
                    });
                    setTransactions(formattedLedgerTransactions);
                } else {
                    setTransactions(buildTransactionsFromOrders(allOrders, normalizePaymentStatus));
                }
            } catch (err) {
                console.error("❌ Error fetching wallet data:", err);
                setError("Failed to load wallet data");
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchWalletData();
        }
    }, [user]);

    // Wallet data - merge API data with user info
    const walletData = {
        totalBalance: walletBalance?.totalBalance ?? walletBalance?.balance ?? walletBalance?.availableBalance ?? 0,
        availableBalance: walletBalance?.availableBalance ?? 0,
        lockedBalance: walletBalance?.lockedBalance ?? 0,
        pendingBalance: walletBalance?.pendingBalance ?? 0,
        currency: walletBalance?.currency || "₹",
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
        monthlyEarnings: walletBalance?.monthlyEarnings ?? 0,
        lastUpdated: walletBalance?.updatedAt
            ? new Date(walletBalance.updatedAt).toLocaleDateString()
            : new Date().toLocaleDateString(),
        allTransactions: transactions || [],
    };

    const formatCurrency = (amount = 0) => {
        return `${walletData.currency}${Number(amount).toLocaleString("en-IN")}`;
    };

    // Filter transactions
    const getFilteredTransactions = () => {
        let filtered = walletData.allTransactions;

        if (filterType !== "all") {
            filtered = filtered.filter(t => t.type === filterType);
        }

        if (filterDate === "today") {
            const now = new Date();
            filtered = filtered.filter(t => {
                const txDate = new Date(t.date);
                return (
                    txDate.getFullYear() === now.getFullYear() &&
                    txDate.getMonth() === now.getMonth() &&
                    txDate.getDate() === now.getDate()
                );
            });
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
        return walletData.allTransactions.filter(t => t.customer === customerName || t.customer?.includes(customerName));
    };

    // Get overall customer transactions (all time)
    const getCustomerAllTransactions = (customerName) => {
        return walletData.allTransactions.filter(t => t.customer === customerName || t.customer?.includes(customerName));
    };

    const filteredTransactions = getFilteredTransactions();
    const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / transactionsPerPage));
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * transactionsPerPage,
        currentPage * transactionsPerPage
    );

    React.useEffect(() => {
        setCurrentPage(1);
    }, [filterType, filterDate, transactions.length]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Build a CSV file from transactions and trigger a browser download
    const downloadStatementCsv = (rows, filenamePrefix) => {
        if (!rows || rows.length === 0) {
            alert("No transactions available to download.");
            return;
        }

        const headers = ["Date", "Description", "Reference", "Status", "Type", "Amount (INR)"];
        const escapeCsvValue = (value) => {
            const str = String(value ?? "");
            // Wrap in quotes and escape any embedded quotes if the value contains a comma, quote, or newline
            if (/[",\n]/.test(str)) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const csvRows = [
            headers.join(","),
            ...rows.map((t) =>
                [
                    new Date(t.date).toLocaleString("en-IN"),
                    t.description,
                    t.reference,
                    t.status,
                    t.type,
                    t.type === "credit" ? t.amount : -t.amount,
                ]
                    .map(escapeCsvValue)
                    .join(",")
            ),
        ];

        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const dateStamp = new Date().toISOString().split("T")[0];
        link.href = url;
        link.setAttribute("download", `${filenamePrefix}-${dateStamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDownloadStatement = () => {
        downloadStatementCsv(filteredTransactions, "wallet-statement");
    };

    const handleDownloadCustomerHistory = () => {
        if (!selectedCustomer) return;
        const customerTx = getCustomerAllTransactions(selectedCustomer.name);
        downloadStatementCsv(customerTx, `${selectedCustomer.name.replace(/\s+/g, "-")}-history`);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 md:ml-[290px] ml-0">
                <Header />
                <div className="p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Page Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800">Wallet Management</h1>
                                <p className="text-gray-600 mt-2">Last updated: {walletData.lastUpdated}</p>
                            </div>
                            <button
                                onClick={handleDownloadStatement}
                                className="bg-gradient-to-r from-cyan-500 to-green-400 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition font-semibold"
                            >
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
                        <div className="bg-gradient-to-r from-slate-900 to-gray-800 text-white rounded-2xl p-8 shadow-xl border border-yellow-600/20">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div>
            <div className="flex justify-between items-center mb-4">
                <span className="text-xl opacity-90">Total Balance</span>
                <button
                    onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                    className="text-2xl hover:opacity-80 transition text-yellow-500"
                >
                    {isBalanceVisible ? <FaEye /> : <FaEyeSlash />}
                </button>
            </div>
            <h2 className="text-5xl font-bold mb-6 tracking-wide text-yellow-400">
                {isBalanceVisible ? formatCurrency(walletData.totalBalance) : "•••••••"}
            </h2>
            <button className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center gap-2">
                <FaPlus />
                Add Money
            </button>
        </div>
        <div className="space-y-3">
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 p-4 rounded-lg">
                <p className="text-sm text-black/70">Monthly Earnings</p>
                <p className="text-2xl font-bold text-black">{formatCurrency(walletData.monthlyEarnings)}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 p-4 rounded-lg">
                <p className="text-sm text-black/70">Total Transactions</p>
                <p className="text-2xl font-bold text-black">{walletData.totalTransactions}</p>
            </div>
        </div>
    </div>
</div>

                        {/* Balance Breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <p className="text-gray-600 text-sm mb-2">Available Balance</p>
                                <p className="text-3xl font-bold text-gray-900">{formatCurrency(walletData.availableBalance)}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <p className="text-gray-600 text-sm mb-2">Pending Balance</p>
                                <p className="text-3xl font-bold text-yellow-600">{formatCurrency(walletData.pendingBalance)}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <p className="text-gray-600 text-sm mb-2">Locked Balance</p>
                                <p className="text-3xl font-bold text-red-600">{formatCurrency(walletData.lockedBalance)}</p>
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
                                        {paginatedTransactions.map((transaction) => (
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

                            {filteredTransactions.length > transactionsPerPage && (
                                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <span>Page</span>
                                        <span className="font-semibold">{currentPage}</span>
                                        <span>of</span>
                                        <span className="font-semibold">{totalPages}</span>
                                    </div>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
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
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center shadow-lg z-[10000]">
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
                                <button
                                    onClick={handleDownloadCustomerHistory}
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                                >
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

// Builds the transaction list from raw orders (used when ledger endpoints aren't available)
function buildTransactionsFromOrders(allOrders, normalizePaymentStatus) {
    return allOrders.map((order) => {
        const orderPaymentStatus = normalizePaymentStatus(order.paymentStatus || order.payment?.status || order.status);
        return {
            id: order.orderId || order.orderNumber || `${order.type}-${getOrderAmount(order)}-${order.createdAt}`,
            date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
            type: orderPaymentStatus === "completed" ? "credit" : "debit",
            amount: getOrderAmount(order),
            description: `${order.type || "Order"} ${order.orderNumber || ""}`.trim(),
            status: orderPaymentStatus || "pending",
            reference: order.orderNumber || order.orderId,
        };
    });
}

export default WalletPage;