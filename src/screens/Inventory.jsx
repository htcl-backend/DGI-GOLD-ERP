import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import apiService from "./service/apiService";
import { FaBoxOpen, FaDollarSign, FaBoxes, FaChartPie, FaExclamationTriangle, FaSync } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Inventory = () => {
    const [inventoryReport, setInventoryReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [fetchAttempted, setFetchAttempted] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [lowStockLoading, setLowStockLoading] = useState(true);
    const [lowStockError, setLowStockError] = useState("");
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 3000; // 3 seconds between retries

    const fetchInventoryReport = useCallback(async () => {
        setLoading(true);
        setError("");
        console.log(`🔄 Fetching inventory report (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})...`);

        try {
            // Use the new apiService.products.getInventoryReport() method
            console.log("📍 Calling apiService.products.getInventoryReport()");
            const result = await apiService.products.getInventoryReport();

            console.log(`📦 API Response:`, result);

            if (result.success && result.data) {
                // Handle different response structures
                let processedData = result.data;

                // If response is wrapped in 'data' property
                if (result.data.data && typeof result.data.data === 'object') {
                    processedData = result.data.data;
                }

                // Validate required fields
                if (processedData.totalProducts !== undefined || processedData.activeProducts !== undefined) {
                    console.log("✅ Inventory report loaded successfully:", processedData);
                    setInventoryReport(processedData);
                    setError("");
                    setLoading(false);
                    setFetchAttempted(true);
                    return; // Success
                } else {
                    throw new Error("Invalid inventory data structure - missing required fields");
                }
            } else if (result.status === 429) {
                // Handle rate limiting
                console.warn(`⚠️ Rate limited (429)`);
                if (retryCount < MAX_RETRIES) {
                    setError(`Rate limited. Retrying in ${RETRY_DELAY / 1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
                    setTimeout(() => {
                        console.log(`🔄 Retrying after rate limit delay...`);
                        setRetryCount(prev => prev + 1);
                    }, RETRY_DELAY);
                    setLoading(false);
                    return;
                }
                throw new Error(`Rate limited (429). Maximum retries (${MAX_RETRIES}) exceeded. Please try again later.`);
            } else if (result.status === 403) {
                throw new Error(`Access Denied (403) - Check your permissions or vendor context`);
            } else {
                throw new Error(result.error || "Failed to fetch inventory report");
            }
        } catch (err) {
            console.error("❌ Error fetching inventory report:", err);
            setError(`Unable to load inventory report: ${err.message}`);
            setLoading(false);
            setFetchAttempted(true);
        }
    }, [retryCount]);

    useEffect(() => {
        // Prevent double-fetching in React strict mode
        if (fetchAttempted && retryCount === 0) return;

        // Only fetch if we haven't tried yet or if retry was triggered
        if (!fetchAttempted || retryCount > 0) {
            fetchInventoryReport();
        }
    }, [retryCount, fetchAttempted, fetchInventoryReport]);

    const handleRetry = () => {
        console.log("🔄 Manual retry triggered");
        setFetchAttempted(false);
        setRetryCount(0);
    };

    const normalizeLowStockResponse = (result) => {
        if (!result || !result.success || !result.data) return [];
        const payload = result.data.data?.data || result.data.data || result.data;
        if (Array.isArray(payload)) return payload;
        if (payload && Array.isArray(payload.data)) return payload.data;
        return [];
    };

    const fetchLowStockProducts = async () => {
        setLowStockLoading(true);
        setLowStockError("");

        try {
            const result = await apiService.products.getLowStockProducts();
            const rawProducts = normalizeLowStockResponse(result);
            setLowStockProducts(rawProducts);
        } catch (err) {
            console.error("❌ Error fetching low stock products:", err);
            setLowStockError(err.message || "Failed to load low stock products");
            setLowStockProducts([]);
        } finally {
            setLowStockLoading(false);
        }
    };

    useEffect(() => {
        fetchLowStockProducts();
    }, []);

    const inventoryByMetalData = {
        labels: inventoryReport?.byMetal ? Object.keys(inventoryReport.byMetal).filter(k => inventoryReport.byMetal[k] > 0) : [],
        datasets: [
            {
                data: inventoryReport?.byMetal ? Object.values(inventoryReport.byMetal).filter(v => v > 0) : [],
                backgroundColor: ['#FFD700', '#C0C0C0', '#E5E4E2', '#b87333', '#F4A460'], // Gold, Silver, Platinum, Copper, Palladium
                hoverBackgroundColor: ['#FFD700', '#C0C0C0', '#E5E4E2', '#b87333', '#F4A460'],
                borderColor: '#fff',
                borderWidth: 2,
            }
        ]
    };

    const inventoryByMetalOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Products by Metal'
            }
        },
    };

    const StatCard = ({ icon, title, value }) => (
        <div className={`bg-white p-4 rounded-lg shadow-md flex items-center space-x-3 min-w-0`}>
            <div className="text-3xl flex-shrink-0">{icon}</div>
            <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{title}</p>
                <p className="text-lg sm:text-xl font-bold text-gray-800 truncate">{value}</p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 md:ml-[290px] ml-0 overflow-x-hidden">
                    <Header />
                    <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] flex items-center justify-center">
                        <p className="text-gray-600">Loading inventory report...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 md:ml-[290px] ml-0 overflow-x-hidden">
                    <Header />
                    <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] flex items-center justify-center">
                        <div className="w-full max-w-md">
                            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-lg" role="alert">
                                <div className="flex items-start gap-3">
                                    <FaExclamationTriangle className="text-2xl mt-1 flex-shrink-0" />
                                    <div className="flex-1">
                                        <strong className="font-bold block mb-2">Error Loading Inventory</strong>
                                        <p className="text-sm mb-4">{error}</p>
                                        <button
                                            onClick={handleRetry}
                                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
                                        >
                                            <FaSync className="text-lg" />
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 md:ml-[290px] ml-0 overflow-x-hidden">
                <Header />
                <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] overflow-y-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Inventory Report</h2>

                    {inventoryReport ? (
                        <div className="space-y-8">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                <StatCard icon={<FaBoxes className="text-blue-500" />} title="Total Products" value={inventoryReport.totalProducts || 0} />
                                <StatCard icon={<FaBoxOpen className="text-green-500" />} title="Active Products" value={inventoryReport.activeProducts || 0} />
                                <StatCard icon={<FaDollarSign className="text-yellow-500" />} title="Total Stock Value" value={`₹${inventoryReport.totalStockValue?.toLocaleString('en-IN') || 0}`} />
                                <StatCard icon={<FaExclamationTriangle className="text-red-500" />} title="Low Stock Items" value={inventoryReport.lowStock || 0} />
                                <StatCard icon={<FaExclamationTriangle className="text-orange-500" />} title="Out of Stock" value={inventoryReport.outOfStock || 0} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Low Stock Alerts Table */}
                                <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="p-6 border-b">
                                        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                            <FaExclamationTriangle className="text-red-500" />
                                            Low Stock Alerts
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Threshold</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {lowStockLoading ? (
                                                    <tr>
                                                        <td colSpan="4" className="text-center py-8 text-gray-500">
                                                            Loading low stock products...
                                                        </td>
                                                    </tr>
                                                ) : lowStockError ? (
                                                    <tr>
                                                        <td colSpan="4" className="text-center py-8 text-red-600">
                                                            {lowStockError}
                                                        </td>
                                                    </tr>
                                                ) : lowStockProducts.length > 0 ? (
                                                    lowStockProducts.map((item, index) => (
                                                        <tr key={item.id || item.sku || index}>
                                                            <td className="px-6 py-4 text-sm text-gray-800">{item.name || item.sku || 'Unnamed Product'}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-500">{item.sku || item.code || '-'}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-500">{item.stockQuantity ?? item.stock ?? 0}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-500">{item.lowStockThreshold ?? '-'}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="text-center py-8 text-gray-500">
                                                            No low stock products found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Inventory by Metal Chart */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <FaChartPie className="text-purple-500" />
                                        Inventory by Metal
                                    </h3>
                                    <div className="h-64">
                                        {inventoryByMetalData.datasets[0].data.length > 0 ? (
                                            <Doughnut data={inventoryByMetalData} options={inventoryByMetalOptions} />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-500">
                                                <p>No chart data available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg font-medium">No inventory data available.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inventory;
