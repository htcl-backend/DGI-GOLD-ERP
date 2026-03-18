import React, { useEffect, useState } from "react";
import { apiFetch } from "../api";
import Sidebar from "../components/Sidebar"; // Added import
import Header from "../components/Header";   // Added import

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllTransactions = async () => { // Renamed function for clarity
            try {
                setLoading(true);
                setError(null);

                // Fetch all combinations
                const goldBuyRes = await apiFetch("/transactions/gold/buy"); // Assuming apiFetch returns the array directly
                const goldSellRes = await apiFetch("/transactions/gold/sell"); // Assuming apiFetch returns the array directly
                const silverBuyRes = await apiFetch("/transactions/silver/buy"); // Assuming apiFetch returns the array directly
                const silverSellRes = await apiFetch("/transactions/silver/sell"); // Assuming apiFetch returns the array directly

                // Combine all transactions
                const allTransactions = [
                    ...(goldBuyRes || []),
                    ...(goldSellRes || []),
                    ...(silverBuyRes || []),
                    ...(silverSellRes || []),
                ];

                setTransactions(allTransactions);
            } catch (err) {
                console.error("Error fetching transactions:", err); // Added console.error for debugging
                setError("Failed to fetch transactions");
            } finally {
                setLoading(false);
            }
        };
        fetchAllTransactions(); // Call the new function
    }, []); // Empty dependency array means it runs once on mount

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />

                <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="p-4 overflow-x-auto">
                        <h2 className="text-2xl font-bold mb-4">Transactions</h2>
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b">ID</th>
                                    <th className="px-4 py-2 border-b">Customer</th>
                                    <th className="px-4 py-2 border-b">Material</th>
                                    <th className="px-4 py-2 border-b">Type</th>
                                    <th className="px-4 py-2 border-b">Weight</th>
                                    <th className="px-4 py-2 border-b">Amount</th>
                                    <th className="px-4 py-2 border-b">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-gray-500">No transactions found.</td>
                                    </tr>
                                ) : (
                                    transactions.map((txn) => (
                                        <tr key={txn._id}>
                                            <td className="px-4 py-2 border-b">{txn._id}</td>
                                            <td className="px-4 py-2 border-b">{txn.customerName || txn.customer || "-"}</td>
                                            <td className="px-4 py-2 border-b capitalize">{txn.material}</td>
                                            <td className="px-4 py-2 border-b capitalize">{txn.type}</td>
                                            <td className="px-4 py-2 border-b">{txn.weight}</td>
                                            <td className="px-4 py-2 border-b">{txn.totalAmount}</td> {/* Changed from txn.amount to txn.totalAmount */}
                                            <td className="px-4 py-2 border-b">{txn.date ? new Date(txn.date).toLocaleDateString() : "-"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
