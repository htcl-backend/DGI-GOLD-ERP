import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { CiSearch, CiExport } from "react-icons/ci";
import { apiFetch } from "../api";

const Accounts = () => {
    const [activeTab, setActiveTab] = useState("invoices");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let endpoint = "";
            if (activeTab === "invoices") {
                endpoint = "/invoices";
            } else if (activeTab === "payments") {
                endpoint = "/payments";
            } else if (activeTab === "gst") {
                endpoint = "/gst";
            }

            if (endpoint) {
                const response = await apiFetch(endpoint);
                const items = response[activeTab] || [];
                setData(items);
                setFilteredData(items);
            }
        } catch (error) {
            console.error(`Error fetching ${activeTab}:`, error);
            setError(`Failed to load ${activeTab} data`);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.trim() === "") {
            setFilteredData(data);
        } else {
            const filtered = data.filter(item => {
                if (activeTab === "invoices") {
                    return item.customerName?.toLowerCase().includes(term.toLowerCase()) ||
                        item.invoiceNumber?.toLowerCase().includes(term.toLowerCase());
                } else if (activeTab === "payments") {
                    return item.customerName?.toLowerCase().includes(term.toLowerCase()) ||
                        item.paymentMethod?.toLowerCase().includes(term.toLowerCase());
                } else if (activeTab === "gst") {
                    return item.customerName?.toLowerCase().includes(term.toLowerCase()) ||
                        item.gstin?.toLowerCase().includes(term.toLowerCase());
                }
                return false;
            });
            setFilteredData(filtered);
        }
    };

    const handleExport = () => {
        // Export functionality will be implemented later
        console.log(`Export ${activeTab} data`);
    };

    const renderTable = () => {
        if (activeTab === "invoices") {
            return (
                <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Invoice #</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">GST</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((invoice) => (
                            <tr key={invoice._id} className="border-b hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                    {invoice.invoiceNumber || invoice._id?.slice(-8)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {invoice.customerName || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    ₹{invoice.amount || 0}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    ₹{invoice.gstAmount || 0}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                    ₹{invoice.totalAmount || 0}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {invoice.date ? new Date(invoice.date).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${invoice.status === 'paid'
                                        ? 'bg-green-100 text-green-800'
                                        : invoice.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {invoice.status || 'Draft'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else if (activeTab === "payments") {
            return (
                <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Method</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((payment) => (
                            <tr key={payment._id} className="border-b hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                    {payment._id?.slice(-8)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {payment.customerName || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    ₹{payment.amount || 0}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {payment.paymentMethod || 'Cash'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${payment.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : payment.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {payment.status || 'Pending'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else if (activeTab === "gst") {
            return (
                <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">GSTIN</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Invoice Amount</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">GST Rate</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">GST Amount</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Period</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((gst) => (
                            <tr key={gst._id} className="border-b hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                    {gst.gstin || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {gst.customerName || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    ₹{gst.invoiceAmount || 0}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {gst.gstRate || 0}%
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    ₹{gst.gstAmount || 0}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {gst.period || 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">Accounts (GST, Invoices, Payments)</h2>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition"
                        >
                            <CiExport className="text-lg" />
                            Export
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab("invoices")}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === "invoices"
                                ? "bg-amber-500 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            Invoices
                        </button>
                        <button
                            onClick={() => setActiveTab("payments")}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === "payments"
                                ? "bg-amber-500 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            Payments
                        </button>
                        <button
                            onClick={() => setActiveTab("gst")}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === "gst"
                                ? "bg-amber-500 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            GST
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder={`Search ${activeTab}...`}
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
                        <div className="text-center py-8">Loading {activeTab} data...</div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {renderTable()}
                            {filteredData.length === 0 && !loading && (
                                <div className="text-center py-8 text-gray-500">
                                    No {activeTab} data found
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Accounts;