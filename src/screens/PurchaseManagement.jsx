import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { CiSearch, CiExport } from "react-icons/ci";
import { apiFetch } from "../api";

const PurchaseManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await apiFetch('/transactions');
            const purchaseTransactions = response.transactions.filter(t => t.type === 'buy');
            setTransactions(purchaseTransactions);
            setFilteredTransactions(purchaseTransactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('Failed to load purchase data');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.trim() === "") {
            setFilteredTransactions(transactions);
        } else {
            const filtered = transactions.filter(transaction =>
                transaction.customerName?.toLowerCase().includes(term.toLowerCase()) ||
                transaction.material?.toLowerCase().includes(term.toLowerCase()) ||
                transaction._id?.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredTransactions(filtered);
        }
    };

    const handleExport = () => {
        // Export functionality will be implemented later
        console.log('Export purchase data');
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">Purchase Management</h2>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition"
                        >
                            <CiExport className="text-lg" />
                            Export
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Search purchases by supplier, material, or transaction ID..."
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10"
                            />
                            <CiSearch className="absolute top-2.5 left-3 text-gray-400" />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 bg-red-50 border border-red-200 rounded p-3 mb-4">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-8">Loading purchase data...</div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Transaction ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Supplier</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Material</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Weight</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Purity</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cost Price</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Amount</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((transaction) => (
                                        <tr key={transaction._id} className="border-b hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                                {transaction._id?.slice(-8)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {transaction.customerName || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {transaction.material || 'Gold'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {transaction.weight}g
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {transaction.purity}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                ₹{transaction.price}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                                ₹{transaction.totalAmount}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${transaction.delivered
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {transaction.delivered ? 'Received' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredTransactions.length === 0 && !loading && (
                                <div className="text-center py-8 text-gray-500">
                                    No purchase transactions found
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PurchaseManagement;