import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import apiService from "./service/apiService";


const Orders = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reportSummary, setReportSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [summaryError, setSummaryError] = useState("");
  const [transactionsError, setTransactionsError] = useState("");

  // Fetch orders list - filtered by vendor
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);

      // ✅ Get vendor ID from auth context to filter vendor-specific data
      const vendorId = localStorage.getItem('vendorId') || localStorage.getItem('tenantId');
      const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';

      console.log(`🔄 Fetching orders for Vendor: ${vendorId}, User: ${userId} - Page ${page}...`);

      // ✅ Filter by vendor/tenant and paginate
      const endpoint = vendorId
        ? `/orders?page=${page}&limit=20&vendorId=${vendorId}`
        : `/orders?page=${page}&limit=20`;

      const result = await apiService.request(endpoint, 'GET');

      console.log('📦 FULL API RESULT:', JSON.stringify(result, null, 2));
      console.log('📦 result.success:', result?.success);
      console.log('📦 result.data:', result?.data);

      if (result && result.success && result.data) {
        // Log detailed response structure for debugging
        console.log('📋 result.data type:', typeof result.data);
        console.log('📋 result.data keys:', Object.keys(result.data || {}));
        console.log('📋 result.data.orders type:', typeof result.data.orders);
        console.log('📋 result.data.orders is array?:', Array.isArray(result.data.orders));
        console.log('📋 result.data.orders content:', result.data.orders);

        // Extract orders array from potentially nested path for more robust handling
        const ordersList = result.data.data?.orders || result.data.orders || [];
        console.log('📋 Extracted ordersList length:', ordersList.length);
        console.log('📋 Extracted ordersList:', ordersList);

        if (ordersList.length === 0) {
          console.warn('⚠️ WARNING: ordersList is empty! Checking all properties:');
          console.warn('Available properties in result.data:', Object.keys(result.data));
        }

        // Map API fields to component state
        const mappedOrders = ordersList.map((order, index) => {
          console.log(`📝 Mapping order ${index}:`, order);
          return {
            id: order.id,
            orderNumber: order.orderNumber,
            customerId: order.userId,
            status: order.status,
            paymentStatus: order.paymentStatus,
            totalAmount: order.totalAmountINR,
            type: order.type,
            metal: order.metal,
            grams: order.grams,
            pricePerGramINR: order.pricePerGramINR,
            createdAt: {
              seconds: order.createdAt?._seconds || Date.now() / 1000,
              nanoseconds: order.createdAt?._nanoseconds || 0
            }
          };
        });

        console.log('✅ Mapped orders count:', mappedOrders.length);
        console.log('✅ Mapped orders:', mappedOrders);

        setOrders(mappedOrders);
        setCurrentPage(result.data.data?.page || page);
        setTotalPages(Math.ceil((result.data.data?.total || 0) / 20));
        console.log('✅ Orders state updated. Total:', mappedOrders.length);
      } else {
        console.error('❌ Invalid response structure:', result);
        console.error('❌ API call was not successful or data is missing.');

        // If the API call fails or the data is not in the expected format,
        // set orders to an empty array to prevent UI errors.
        setOrders([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('🔴 Error fetching orders:', error.message);
      console.error('🔴 Full error:', error);
      console.error('🔴 Error stack:', error.stack);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch order details
  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      console.log(`🔄 Fetching order details for ${orderId}...`);
      const result = await apiService.request(`/orders/${orderId}`, 'GET');

      console.log('📦 Order Details Response:', result);

      if (result && result.success && result.data) {
        // Extract single order object (NOT array) - API returns result.data.data.order
        const orderData = result.data.data?.order || result.data.data;

        // Ensure we have an object, not an array
        const mappedOrder = Array.isArray(orderData) ? orderData[0] : orderData;

        setSelectedOrder(mappedOrder);
        console.log('✅ Order details loaded:', mappedOrder);
      }
    } catch (error) {
      console.error('🔴 Error fetching order details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch order report summary
  const fetchOrderSummary = async () => {
    try {
      setLoading(true);
      setSummaryError("");
      console.log('🔄 Fetching order summary...');
      const result = await apiService.request('/orders/reports/summary', 'GET');

      console.log('📦 Summary Response:', result);

      if (result && result.success && result.data) {
        // The actual summary object is in result.data.data
        const summaryData = result.data.data;
        console.log('📋 Extracted summaryData:', summaryData);
        if (summaryData && Object.keys(summaryData).length > 0) {
          setReportSummary(summaryData);
          console.log('✅ Summary state updated.');
        } else {
          console.warn('⚠️ Summary data is empty or null, showing "No data" message.');
          setReportSummary(null); // Explicitly set to null to show "No data" message
        }
      } else {
        throw new Error(result.error || "Failed to fetch summary.");
      }
    } catch (error) {
      console.error('🔴 Error fetching summary:', error.message);
      setSummaryError("Failed to load summary. This may be a server configuration issue (e.g., a missing database index).");
    } finally {
      setLoading(false);
    }
  };

  // Fetch transaction reports
  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
      setTransactionsError("");
      console.log('🔄 Fetching transaction reports...');

      // ✅ Use the dedicated API method for transactions
      const result = await apiService.orders.getTransactions({ page: page, limit: 50 });

      console.log('📦 Transactions Response:', result);

      if (result && result.success && result.data) {
        // The transactions array is in result.data.data.transactions
        const transactionsPayload = result.data.data;
        const transactionsData = transactionsPayload?.transactions || [];
        console.log('📋 Extracted transactionsData:', transactionsData);

        setTransactions(transactionsData);

        // Update pagination from the same payload
        setCurrentPage(transactionsPayload?.page || page);
        setTotalPages(Math.ceil((transactionsPayload?.total || 0) / (transactionsPayload?.limit || 50)));
        console.log('✅ Transactions loaded:', transactionsData.length);
      } else {
        throw new Error(result.error || "Failed to fetch transactions.");
      }
    } catch (error) {
      console.error('🔴 Error fetching transactions:', error.message);
      if (error.message.includes('Forbidden')) {
        setTransactionsError("Access Denied. You do not have permission to view transaction reports.");
      } else {
        setTransactionsError("Failed to load transactions. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🎬 Component mounted - calling fetchOrders()');
    fetchOrders();
  }, []);

  // Log orders state whenever it changes
  useEffect(() => {
    console.log('📊 Orders state updated:', orders);
    console.log('📊 Orders length:', orders.length);
  }, [orders]);

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'summary') {
      fetchOrderSummary();
    } else if (activeTab === 'transactions') {
      fetchTransactions(1); // Fetch first page on tab switch
    }
  }, [activeTab]);

  // Filter orders by search term
  const filteredOrders = orders.filter(order =>
    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="w-full ml-[290px]">
          <Header />
          <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Orders Management</h2>
              <button
                onClick={() => {
                  console.log('🔄 Manual refresh triggered');
                  fetchOrders();
                }}
                className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition font-medium"
              >
                ↻ Refresh Orders
              </button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
              <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="flex flex-nowrap">
                  {[
                    { id: 'list', label: 'Order List' },
                    { id: 'details', label: 'Order Details' },
                    { id: 'summary', label: 'Summary Report' },
                    { id: 'transactions', label: 'Transactions' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSearchTerm('');
                        setSummaryError('');
                        setTransactionsError('');
                      }}
                      className={`px-3 md:px-6 py-4 font-medium text-xs md:text-sm whitespace-nowrap border-b-2 transition ${activeTab === tab.id
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            {loading && <div className="text-center py-8">Loading...</div>}

            {/* Order List Tab */}
            {activeTab === 'list' && (
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                {loading && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Loading orders...</p>
                  </div>
                )}

                {!loading && (
                  <>
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                      <p className="text-xs md:text-sm text-gray-500 mt-2">Total Orders: {orders.length}</p>
                    </div>

                    {filteredOrders.length     
                    
                    
                    
                    > 0 ? (
                      <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order#</th>
                                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Order ID</th>
                                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Metal</th>
                                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Date</th>
                                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {filteredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 text-xs md:text-sm">
                                  <td className="px-3 md:px-6 py-3 md:py-4 font-bold text-amber-600">{order.orderNumber}</td>
                                  <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 hidden lg:table-cell truncate">{order.id}</td>
                                  <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900">{order.type}</td>
                                  <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 hidden sm:table-cell">{order.metal}</td>
                                  <td className="px-3 md:px-6 py-3 md:py-4">
                                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                        order.status === 'PAYMENT_PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                                              order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                  'bg-gray-100 text-gray-800'
                                      }`}>
                                      {order.status}
                                    </span>
                                  </td>
                                  <td className="px-3 md:px-6 py-3 md:py-4 font-medium text-amber-600">₹{order.totalAmount?.toLocaleString() || '0'}</td>
                                  <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 hidden sm:table-cell">
                                    {new Date(order.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
                                  </td>
                                  <td className="px-3 md:px-6 py-3 md:py-4">
                                    <button
                                      onClick={() => {
                                        setActiveTab('details');
                                        fetchOrderDetails(order.id);
                                      }}
                                      className="text-amber-600 hover:text-amber-800 flex items-center gap-1 text-xs md:text-sm"
                                    >
                                      <FaRegEdit /> View
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                          {filteredOrders.map(order => (
                            <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="font-bold text-amber-600 text-sm">#{order.orderNumber}</p>
                                  <p className="text-xs text-gray-500 mt-1 truncate">{order.id}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                    order.status === 'PAYMENT_PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                              'bg-gray-100 text-gray-800'
                                  }`}>
                                  {order.status}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                <div>
                                  <p className="text-gray-600 text-xs">Type</p>
                                  <p className="font-medium text-gray-900">{order.type}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600 text-xs">Metal</p>
                                  <p className="font-medium text-gray-900">{order.metal}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600 text-xs">Amount</p>
                                  <p className="font-bold text-amber-600">₹{order.totalAmount?.toLocaleString() || '0'}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600 text-xs">Date</p>
                                  <p className="text-gray-900 text-xs">{new Date(order.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setActiveTab('details');
                                  fetchOrderDetails(order.id);
                                }}
                                className="w-full bg-amber-500 text-white py-2 rounded text-sm font-medium hover:bg-amber-600 flex items-center justify-center gap-2"
                              >
                                <FaRegEdit /> View Details
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <p className="text-lg font-medium">No orders found</p>
                        <p className="text-sm mt-2">Total orders available: {orders.length}</p>
                        {searchTerm && (
                          <p className="text-sm mt-1">
                            No results match your search: <span className="font-medium">{searchTerm}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Order Details Tab */}
            {activeTab === 'details' && selectedOrder && !loading && (
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold mb-6">Order Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="text-gray-600 font-medium">Order#</label>
                    <p className="text-lg font-bold text-amber-600">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Order ID</label>
                    <p className="text-lg text-gray-900">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Status</label>
                    <p className="text-lg text-gray-900">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedOrder.status === 'PAYMENT_PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        selectedOrder.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          selectedOrder.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {selectedOrder.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Payment Status</label>
                    <p className="text-lg text-gray-900">{selectedOrder.paymentStatus}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Type</label>
                    <p className="text-lg text-gray-900">{selectedOrder.type}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Metal</label>
                    <p className="text-lg text-gray-900">{selectedOrder.metal}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Quantity</label>
                    <p className="text-lg text-gray-900">{selectedOrder.grams}g</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Price per Gram</label>
                    <p className="text-lg text-gray-900">₹{selectedOrder.pricePerGramINR?.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Metal Value</label>
                    <p className="text-lg text-gray-900">₹{selectedOrder.metalValueINR?.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Making Charges</label>
                    <p className="text-lg text-gray-900">₹{selectedOrder.makingChargesINR?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Packaging Charges</label>
                    <p className="text-lg text-gray-900">₹{selectedOrder.packagingChargesINR?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Delivery Charges</label>
                    <p className="text-lg text-gray-900">₹{selectedOrder.deliveryChargesINR?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">GST</label>
                    <p className="text-lg text-gray-900">₹{selectedOrder.gstINR?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Customer ID</label>
                    <p className="text-lg text-gray-900">{selectedOrder.userId}</p>
                  </div>
                  <div>
                    <label className="text-gray-600 font-medium">Total Amount</label>
                    <p className="text-lg font-bold text-amber-600">₹{selectedOrder.totalAmountINR?.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-600 font-medium">Payment Method</label>
                    <p className="text-lg text-gray-900">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-600 font-medium">Created At</label>
                    <p className="text-lg text-gray-900">
                      {new Date(selectedOrder.createdAt?.seconds * 1000 || Date.now()).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Report Tab */}
            {activeTab === 'summary' && !loading && (
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold mb-6">Order Summary Report</h3>
                {summaryError ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{summaryError}</span>
                  </div>
                ) : reportSummary ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {Object.entries(reportSummary).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-gray-600 font-medium text-sm uppercase">{key}</label>
                        <p className="text-2xl font-bold text-amber-600">{JSON.stringify(value)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No summary data available.</div>
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && !loading && (
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold mb-6">Transaction Reports</h3>
                {transactionsError ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{transactionsError}</span>
                  </div>
                ) : transactions.length > 0 ? (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order#</th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Transaction ID</th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Metal</th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Payment Status</th>
                            <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {transactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-gray-50 text-xs md:text-sm">
                              <td className="px-3 md:px-6 py-3 md:py-4 font-bold text-amber-600">{tx.orderNumber}</td>
                              <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 hidden lg:table-cell truncate">{tx.id}</td>
                              <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900">{tx.type}</td>
                              <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 hidden sm:table-cell">{tx.metal}</td>
                              <td className="px-3 md:px-6 py-3 md:py-4 font-medium text-amber-600">₹{tx.totalAmountINR?.toLocaleString()}</td>
                              <td className="px-3 md:px-6 py-3 md:py-4 hidden sm:table-cell">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                  tx.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    tx.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'
                                  }`}>
                                  {tx.paymentStatus}
                                </span>
                              </td>
                              <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900">
                                {new Date(tx.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {transactions.map(tx => (
                        <div key={tx.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-3">
                            <p className="font-bold text-amber-600 text-sm">#{tx.orderNumber}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              tx.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                tx.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                              }`}>
                              {tx.paymentStatus}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-3 truncate">ID: {tx.id}</p>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-600 text-xs">Type</p>
                              <p className="font-medium text-gray-900">{tx.type}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 text-xs">Metal</p>
                              <p className="font-medium text-gray-900">{tx.metal}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 text-xs">Amount</p>
                              <p className="font-bold text-amber-600">₹{tx.totalAmountINR?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 text-xs">Date</p>
                              <p className="text-gray-900 text-xs">{new Date(tx.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">{transactionsError || 'No transactions found'}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;