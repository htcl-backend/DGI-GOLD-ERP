import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { apiFetch } from "../api";
import { useData } from "../Contexts/DataContext";
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
  const { allOrders } = useData();
  const [activeTab, setActiveTab] = useState("gold");

  // Process reports from orders data
  const { goldReports, silverReports } = useMemo(() => {
    const gold = [];
    const silver = [];

    allOrders.forEach(order => {
      const report = {
        customerName: order.customerName || 'N/A',
        weight: order.weight,
        purity: order.purity,
        price: order.price,
        totalAmount: order.totalAmount,
        date: order.date,
        delivered: order.delivered
      };

      if (order.category === 'gold') {
        gold.push(report);
      } else if (order.category === 'silver') {
        silver.push(report);
      }
    });

    return { goldReports: gold, silverReports: silver };
  }, [allOrders]);

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-[290px] ml-0 h-screen overflow-y-auto">
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

            {/* Chart */}
            <div className="bg-white rounded-lg shadow-md mb-6 p-6">
              <div className="w-full h-80">
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
                    {currentReports.map((report, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900 break-words">
                          {report.customerName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 break-words">
                          {report.weight}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 break-words">
                          {report.purity}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 break-words">
                          {report.price}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 break-words">
                          {report.totalAmount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 break-words">
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
    </div>
  );
};

export default Reports;