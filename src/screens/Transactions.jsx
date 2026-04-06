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

                // Static mock transactions data
                const mockTransactions = [
                    {
                        _id: "txn001",
                        type: "buy",
                        material: "Gold 24K",
                        customerName: "Rajesh Kumar",
                        weight: 25.5,
                        price: 6500,
                        totalAmount: 165750,
                        date: "2024-01-15",
                        status: "Completed"
                    },
                    {
                        _id: "txn002",
                        type: "sell",
                        material: "Gold 22K",
                        customerName: "Priya Sharma",
                        weight: 15.2,
                        price: 5800,
                        totalAmount: 88160,
                        date: "2024-01-12",
                        status: "Completed"
                    },
                    {
                        _id: "txn003",
                        type: "buy",
                        material: "Silver 999",
                        customerName: "Amit Singh",
                        weight: 500,
                        price: 85,
                        totalAmount: 42500,
                        date: "2024-01-10",
                        status: "Completed"
                    },
                    {
                        _id: "txn004",
                        type: "sell",
                        material: "Gold 18K",
                        customerName: "Sneha Patel",
                        weight: 20.0,
                        price: 4500,
                        totalAmount: 90000,
                        date: "2024-01-08",
                        status: "Completed"
                    },
                    {
                        _id: "txn005",
                        type: "buy",
                        material: "Silver 925",
                        customerName: "Vikram Rao",
                        weight: 300,
                        price: 78,
                        totalAmount: 23400,
                        date: "2024-01-05",
                        status: "Completed"
                    }
                ];

                setTransactions(mockTransactions);
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
