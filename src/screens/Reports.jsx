import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import apiService from "./service/apiService";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
);

const Reports = () => {
  const [activeTab, setActiveTab] = useState("gold");
  const [reportSummary, setReportSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryError, setSummaryError] = useState("");
  const [transactionsError, setTransactionsError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setSummaryError("");
      setTransactionsError("");

      try {
        const summaryResult = await apiService.orders.getSummary({ period: '7d' });
        if (summaryResult.success) {
          setReportSummary(summaryResult.data?.data || summaryResult.data || {});
        } else {
          setSummaryError(summaryResult.error || 'Failed to load summary report');
        }
      } catch (error) {
        setSummaryError(error.message || 'Failed to load summary report');
      }

      try {
        const txResult = await apiService.orders.getTransactions({ page: 1, limit: 50 });
        if (txResult.success) {
          const payload = txResult.data?.data || txResult.data || {};
          const txList = Array.isArray(payload) ? payload : payload.transactions || [];
          setTransactions(txList);
        } else {
          setTransactionsError(txResult.error || 'Failed to load transaction reports');
        }
      } catch (error) {
        setTransactionsError(error.message || 'Failed to load transaction reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const transactionMatchesMetal = (transaction, metal) => {
    if (!transaction) return false;
    if (transaction.metal) {
      return transaction.metal.toUpperCase() === metal;
    }
    if (Array.isArray(transaction.items)) {
      return transaction.items.some(item => item.metalType?.toUpperCase() === metal);
    }
    return false;
  };

  const filteredTransactions = useMemo(() => {
    const metal = activeTab.toUpperCase();
    return transactions.filter(tx => transactionMatchesMetal(tx, metal));
  }, [transactions, activeTab]);

  const getTransactionMetalTypes = (transaction) => {
    if (!transaction) return [];
    if (transaction.metal) {
      return [transaction.metal.toUpperCase()];
    }
    if (Array.isArray(transaction.items)) {
      return transaction.items
        .map(item => item.metalType?.toUpperCase())
        .filter(Boolean);
    }
    return [];
  };

  const reportChartData = useMemo(() => {
    const dateMap = {
      GOLD: {},
      SILVER: {},
    };

    transactions.forEach(tx => {
      const ts = tx.createdAt?.seconds ? tx.createdAt.seconds * 1000 : tx.createdAt ? new Date(tx.createdAt).getTime() : Date.now();
      const dateKey = new Date(ts).toLocaleDateString();
      const amount = tx.totalAmountINR || tx.totalAmount || tx.pricing?.totalAmount || 0;
      const metals = getTransactionMetalTypes(tx);

      metals.forEach(metal => {
        if (!dateMap[metal]) dateMap[metal] = {};
        dateMap[metal][dateKey] = (dateMap[metal][dateKey] || 0) + Number(amount || 0);
      });
    });

    const labels = Array.from(
      new Set([
        ...Object.keys(dateMap.GOLD || {}),
        ...Object.keys(dateMap.SILVER || {}),
      ])
    ).sort((a, b) => new Date(a) - new Date(b));

    const goldData = labels.map(label => Number(dateMap.GOLD[label] || 0));
    const silverData = labels.map(label => Number(dateMap.SILVER[label] || 0));

    const combinedData = labels.map(label => goldData[labels.indexOf(label)] + silverData[labels.indexOf(label)]);

    return {
      labels,
      datasets: [
        {
          label: 'Combined Transaction Value',
          data: combinedData,
          borderColor: '#0f172a',
          backgroundColor: 'rgba(15, 23, 42, 0.08)',
          fill: false,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
        {
          label: 'Gold Transaction Value',
          data: goldData,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.08)',
          fill: false,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
        {
          label: 'Silver Transaction Value',
          data: silverData,
          borderColor: '#14b8a6',
          backgroundColor: 'rgba(20, 184, 166, 0.08)',
          fill: false,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [transactions]);

  const reportChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Gold & Silver Transaction Value',
        font: {
          size: 16,
          weight: '600',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y || 0;
            return `${context.dataset.label}: ₹${value.toLocaleString()}`;
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.4,
        borderJoinStyle: 'round',
        borderCapStyle: 'round',
      },
      point: {
        radius: 0,
        hoverRadius: 6,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.2)',
        },
        ticks: {
          callback: (value) => `₹${value / 1000}k`,
        },
      },
    },
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const millis = timestamp.seconds ? timestamp.seconds * 1000 : new Date(timestamp).getTime();
    return new Date(millis).toLocaleDateString();
  };

  const formatAmount = (transaction) => {
    const amount = transaction.totalAmountINR || transaction.totalAmount || transaction.pricing?.totalAmount || 0;
    return `₹${Number(amount).toLocaleString()}`;
  };

  const statusLabel = (transaction) => {
    return transaction.paymentStatus || transaction.status || transaction.payment?.status || 'N/A';
  };

  const getCustomerName = (transaction) => {
    return transaction.customerName || transaction.userId || transaction.tenantId || 'Unknown';
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-72.5 ml-0 h-screen overflow-y-auto">
        <Header />
        <div className="p-4 sm:p-8 md:p-10 bg-gray-50">
          <div className="w-full max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Reports</h2>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex flex-wrap">
                  <button
                    onClick={() => setActiveTab("gold")}
                    className={`flex-1 px-6 py-4 font-medium text-sm border-b-2 transition ${activeTab === "gold"
                      ? "border-amber-500 text-amber-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Gold Reports
                  </button>
                  <button
                    onClick={() => setActiveTab("silver")}
                    className={`flex-1 px-6 py-4 font-medium text-sm border-b-2 transition ${activeTab === "silver"
                      ? "border-amber-500 text-amber-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Silver Reports
                  </button>
                </nav>
              </div>
            </div>

            {/* Summary cards */}
            {summaryError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                <strong className="font-bold">Summary Error:</strong> {summaryError}
              </div>
            ) : reportSummary ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(reportSummary).map(([key, value]) => (
                  <div key={key} className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                    <p className="text-sm text-gray-500 uppercase tracking-wide">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="mt-3 text-2xl font-semibold text-amber-600">{typeof value === 'number' ? `₹${value.toLocaleString()}` : JSON.stringify(value)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
                No summary data available.
              </div>
            )}

            {/* Chart */}
            <div className="bg-white rounded-lg shadow-md mb-6 p-6">
              <div className="w-full h-[320px]">
                <Line options={reportChartOptions} data={reportChartData} />
              </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  {activeTab === "gold" ? "Gold" : "Silver"} Transaction Reports
                </h3>
              </div>
              <div className="w-full overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                        Customer Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weight
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900 wrap-break-word">{tx.orderNumber || tx.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 wrap-break-word">{getCustomerName(tx)}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 wrap-break-word">{tx.type || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 wrap-break-word">{tx.metal || tx.items?.[0]?.metalType || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 wrap-break-word">{formatAmount(tx)}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 wrap-break-word">{statusLabel(tx)}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 wrap-break-word">{formatDate(tx.createdAt)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">{transactionsError || 'No transactions found for this metal.'}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;