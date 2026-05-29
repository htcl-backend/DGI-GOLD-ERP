import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FaHistory, FaTimes, FaArrowLeft } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import apiService from "./service/apiService";

const SAMPLE_CUSTOMERS = [
  {
    customerId: "customer_demo_002",
    customerName: "Priya Shah",
    email: "priya.shah@example.com",
    phoneNumber: "+919988776655",
    createdAt: "2026-04-22T05:15:45.526Z",
    joinedDate: "2026-04-22T05:15:45.526Z",
    totalOrders: 3,
    totalSpent: 31520,
    currentMonthSpent: 0,
    previousMonthSpent: 31520,
    monthlySpentBreakdown: [],
    orders: [
      { orderId: "seed_order_priya_3", type: "SELL", metal: "GOLD", grams: 0.5, totalAmount: 3450, status: "COMPLETED", createdAt: "2026-04-22T05:15:47.039Z" },
      { orderId: "seed_order_priya_2", type: "BUY", metal: "SILVER", grams: 200, totalAmount: 17000, status: "COMPLETED", createdAt: "2026-04-22T05:15:46.906Z" },
      { orderId: "seed_order_priya_1", type: "BUY", metal: "GOLD", grams: 1.8, totalAmount: 11070, status: "COMPLETED", createdAt: "2026-04-22T05:15:46.767Z" }
    ]
  },
  {
    customerId: "customer_demo_001",
    customerName: "Aman Verma",
    email: "customer.demo@digigold.in",
    phoneNumber: "+919900112233",
    createdAt: "2026-04-16T07:13:43.894Z",
    joinedDate: "2026-04-16T07:13:43.894Z",
    totalOrders: 3,
    totalSpent: 31200,
    currentMonthSpent: 0,
    previousMonthSpent: 31200,
    monthlySpentBreakdown: [],
    orders: [
      { orderId: "seed_order_aman_3", type: "BUY", metal: "PLATINUM", grams: 1, totalAmount: 3400, status: "COMPLETED", createdAt: "2026-04-22T05:15:46.637Z" },
      { orderId: "seed_order_aman_2", type: "BUY", metal: "SILVER", grams: 150, totalAmount: 12300, status: "COMPLETED", createdAt: "2026-04-22T05:15:46.522Z" },
      { orderId: "seed_order_aman_1", type: "BUY", metal: "GOLD", grams: 2.5, totalAmount: 15500, status: "COMPLETED", createdAt: "2026-04-22T05:15:46.385Z" }
    ]
  }
];

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ============================
  // 🔹 FETCH CUSTOMERS LIST
  // ============================
  const fetchCustomers = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      // ✅ GET /analytics/vendor/customers/list with pagination
      const result = await apiService.analytics.vendor.getAllCustomers({ limit: 100, offset: 0 });

      if (result.success && result.data) {
        // The API may wrap the payload inside { data: { total, customers, pagination } }
        const payload = result.data.data || result.data || {};
        const customerList = payload.customers || [];
        setCustomers(customerList);
        setFilteredCustomers(customerList);
        console.log(`✅ Loaded ${customerList.length} customers`, customerList);
      } else {
        // Fallback to sample data when analytics API is unreachable
        console.warn('⚠️ Analytics customers API failed, using local sample data');
        const customerList = SAMPLE_CUSTOMERS;
        setCustomers(customerList);
        setFilteredCustomers(customerList);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      const errMsg = err.message || 'Failed to load customers';
      setErrorMessage(errMsg);
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // 🔹 FETCH CUSTOMER DETAILS
  // ============================
  const handleViewCustomer = async (customerId) => {
    setLoading(true);
    setErrorMessage("");

    try {
      // Compose customer details from analytics endpoints (P&L + Metrics)
      const pnlResult = await apiService.analytics.vendor.getCustomerPnl(customerId);
      const metricsResult = await apiService.analytics.vendor.getCustomerMetrics(customerId);

      if (pnlResult.success || metricsResult.success) {
        const pnlData = pnlResult.data?.data || pnlResult.data || {};
        const metricsData = metricsResult.data?.data || metricsResult.data || {};

        const composed = {
          customerId: pnlData.customerId || metricsData.customerId || customerId,
          customerName: pnlData.customerName || metricsData.customerName || 'N/A',
          email: metricsData.email || pnlData.email || 'N/A',
          phoneNumber: metricsData.phoneNumber || pnlData.phoneNumber || 'N/A',
          joinedDate: pnlData.joinedDate || metricsData.joinedDate,
          totalOrders: pnlData.orderCount || metricsData.orderCount || 0,
          totalSpent: pnlData.totalInvestment || metricsData.totalInvested || 0,
          currentMonthSpent: pnlData.currentMonthSpent || 0,
          previousMonthSpent: pnlData.previousMonthSpent || 0,
          monthlySpentBreakdown: pnlData.monthlySpentBreakdown || [],
          orders: pnlData.orders || [],
          pnl: pnlData,
          metrics: metricsData,
        };

        setSelectedCustomer(composed);
        console.log('✅ Customer details loaded (composed from analytics)');
      } else {
        // Fallback: try to find customer in local sample list
        console.warn('⚠️ Analytics customer details API failed, falling back to sample data');
        const sample = (customers || []).find(c => c.customerId === customerId) || SAMPLE_CUSTOMERS.find(c => c.customerId === customerId);
        if (sample) {
          setSelectedCustomer(sample);
        } else {
          throw new Error((pnlResult.error || metricsResult.error) || 'Invalid response for customer details');
        }
      }
    } catch (err) {
      console.error("Error fetching customer details:", err);
      const errMsg = err.message || 'Failed to load customer details';
      setErrorMessage(errMsg);
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // 🔹 SEARCH FILTER
  // ============================
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = customers.filter((c) =>
      `${c.customerName} ${c.email} ${c.phoneNumber} ${c.city}`
        .toLowerCase()
        .includes(term.toLowerCase())
    );

    setFilteredCustomers(filtered);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="flex overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 ml-[290px] overflow-hidden">
        <Header />

        <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Customers</h2>
          </div>

          {/* SEARCH */}
          {!selectedCustomer && (
            <div className="mb-4">
              <div className="relative max-w-md">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search customers..."
                  className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <CiSearch className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
          )}

          {/* LOADING */}
          {loading && !selectedCustomer && (
            <div className="text-center py-6 text-gray-600">Loading...</div>
          )}

          {/* ============================
              🔹 CUSTOMER LIST TABLE
          ============================ */}
          {!loading && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                      <th className="px-4 md:px-6 py-3 text-right text-sm font-semibold text-gray-700">Total Orders</th>
                      <th className="px-4 md:px-6 py-3 text-right text-sm font-semibold text-gray-700">Total Spent</th>
                      <th className="px-4 md:px-6 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((c) => (
                        <tr key={c.customerId} className="border-b hover:bg-gray-50 text-sm">
                          <td className="px-4 md:px-6 py-3 font-medium">{c.customerName || 'N/A'}</td>
                          <td className="px-4 md:px-6 py-3">{c.email || 'N/A'}</td>
                          <td className="px-4 md:px-6 py-3">{c.phoneNumber || 'N/A'}</td>
                          <td className="px-4 md:px-6 py-3 text-right font-medium">{c.totalOrders || 0}</td>
                          <td className="px-4 md:px-6 py-3 text-right font-semibold text-green-600">
                            ₹{c.totalSpent?.toLocaleString() || 0}
                          </td>
                          <td className="px-4 md:px-6 py-3 text-center">
                            <button
                              onClick={() => handleViewCustomer(c.customerId)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-2 mx-auto transition"
                            >
                              <FaHistory />
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-gray-500">
                          No customers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ERROR */}
          {errorMessage && (
            <div className="text-red-500 mt-4">{errorMessage}</div>
          )}
        </div>
      </div>

      {/* ============================
          🔹 CUSTOMER DETAILS MODAL
      ============================ */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-5 flex justify-between items-center border-b z-10">
              <div className="flex items-center gap-3">
                <FaArrowLeft className="cursor-pointer text-xl hover:text-gray-600" onClick={() => setSelectedCustomer(null)} />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedCustomer.customerName}</h2>
                  <p className="text-sm text-gray-500">Customer Details & History</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-2xl text-gray-500 hover:text-gray-800 transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {loading ? (
                <div className="text-center py-10">Loading details...</div>
              ) : (
                <>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-4">Customer Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Name</p>
                        <p className="font-medium">{selectedCustomer.customerName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Email</p>
                        <p className="font-medium">{selectedCustomer.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Phone</p>
                        <p className="font-medium">{selectedCustomer.phoneNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Joined Date</p>
                        <p className="font-medium">{selectedCustomer.joinedDate ? new Date(selectedCustomer.joinedDate).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Customer ID</p>
                        <p className="font-medium">{selectedCustomer.customerId || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-4">Spending Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Orders</p>
                        <p className="font-medium text-lg">{selectedCustomer.totalOrders || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Spent</p>
                        <p className="font-medium text-lg">₹{selectedCustomer.totalSpent?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Current Month Spent</p>
                        <p className="font-medium text-lg">₹{selectedCustomer.currentMonthSpent?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Previous Month Spent</p>
                        <p className="font-medium text-lg">₹{selectedCustomer.previousMonthSpent?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-4">Recent Orders ({selectedCustomer.orders?.length || 0})</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                            selectedCustomer.orders.map(order => (
                              <tr key={order.orderId} className="border-b hover:bg-gray-50 text-sm">
                                <td className="px-4 py-3">{order.orderId}</td>
                                <td className="px-4 py-3">{new Date(order.createdAt || order.orderDate || Date.now()).toLocaleDateString()}</td>
                                <td className="px-4 py-3">₹{order.totalAmount?.toLocaleString()}</td>
                                <td className="px-4 py-3">{order.status}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center py-6 text-gray-500">No orders found for this customer.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;