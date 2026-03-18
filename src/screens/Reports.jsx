import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { apiFetch } from "../api";
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
  const [goldReports, setGoldReports] = useState([]);
  const [silverReports, setSilverReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const goldData = await apiFetch('/reports/gold');
      const silverData = await apiFetch('/reports/silver');
      setGoldReports(goldData.reports || goldData || []);
      setSilverReports(silverData.reports || silverData || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentReports = activeTab === "gold" ? goldReports : silverReports;

  // Sort reports by date for the chart
  const sortedReports = [...currentReports].sort((a, b) => new Date(a.date) - new Date(b.date));

  const reportChartData = {
    labels: sortedReports.map(report => new Date(report.date).toLocaleDateString()),
    datasets: [
      {
        label: `${activeTab === 'gold' ? 'Gold' : 'Silver'} Sales Amount`,
        data: sortedReports.map(report => report.totalAmount),
        borderColor: '#c27803', // amber-600
        backgroundColor: 'rgba(194, 120, 3, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const reportChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Daily Sales for ${activeTab === 'gold' ? 'Gold' : 'Silver'}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `₹${value / 1000}k`
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Sidebar />
        <div className="w-full ml-[290px]">
          <Header />
          <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="text-xl">Loading reports...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Sidebar />
      <div className="w-full ml-[290px]">
        <Header />
        <div className="p-6 bg-gray-50 min-h-screen">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Reports</h2>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex">
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

          {/* Chart */}
          <div className="bg-white rounded-lg shadow-md mb-6 p-6">
            <Line options={reportChartOptions} data={reportChartData} />
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {activeTab === "gold" ? "Gold" : "Silver"} Transaction Reports
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  {currentReports.map((report, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.weight}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.purity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.totalAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.delivered
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                          }`}>
                          {report.delivered ? "Delivered" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;