// import React, { useEffect, useState } from "react";
// import { FaRegEdit, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import Sidebar from "../components/Sidebar";
// import Header from "../components/Header";
// import apiService from "./service/apiService";


// const Orders = () => {
//   const [activeTab, setActiveTab] = useState("list");
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [reportSummary, setReportSummary] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [summaryError, setSummaryError] = useState("");
//   const [transactionsError, setTransactionsError] = useState("");

//   // Fetch orders list - filtered by vendor
//   const fetchOrders = async (page = 1) => {
//     try {
//       setLoading(true);

//       // ✅ Get vendor ID from auth context to filter vendor-specific data
//       const vendorId = localStorage.getItem('vendorId') || localStorage.getItem('tenantId');
//       const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';

//       console.log(`🔄 Fetching orders for Vendor: ${vendorId}, User: ${userId} - Page ${page}...`);

//       // ✅ Use vendor-specific orders endpoint
//       const endpoint = `/vendor/orders?page=${page}&limit=10`;

//       const result = await apiService.request(endpoint, 'GET');

//       console.log('📦 FULL API RESULT:', JSON.stringify(result, null, 2));
//       console.log('📦 result.success:', result?.success);
//       console.log('📦 result.data:', result?.data);

//       if (result && result.success && result.data) {
//         // Log detailed response structure for debugging
//         console.log('📋 result.data type:', typeof result.data);
//         console.log('📋 result.data keys:', Object.keys(result.data || {}));
//         console.log('📋 result.data.orders type:', typeof result.data.orders);
//         console.log('📋 result.data.orders is array?:', Array.isArray(result.data.orders));
//         console.log('📋 result.data.orders content:', result.data.orders);

//         // Extract orders array from potentially nested path for more robust handling
//         const ordersList = result.data.data?.orders || result.data.orders || [];
//         console.log('📋 Extracted ordersList length:', ordersList.length);
//         console.log('📋 Extracted ordersList:', ordersList);

//         if (ordersList.length === 0) {
//           console.warn('⚠️ WARNING: ordersList is empty! Checking all properties:');
//           console.warn('Available properties in result.data:', Object.keys(result.data));
//         }

//         // Map API fields to component state
//         // const mappedOrders = ordersList.map((order, index) => {
//         //   console.log(`📝 Mapping order ${index}:`, order);
//         //   return {
//         //     id: order.id,
//         //     orderNumber: order.orderNumber,
//         //     customerId: order.userId,
//         //     status: order.status,
//         //     paymentStatus: order.paymentStatus,
//         //     totalAmount: order.totalAmountINR,
//         //     type: order.type,
//         //     metal: order.metal,
//         //     grams: order.grams,
//         //     pricePerGramINR: order.pricePerGramINR,
//         //     createdAt: {
//         //       seconds: order.createdAt?._seconds || Date.now() / 1000,
//         //       nanoseconds: order.createdAt?._nanoseconds || 0
//         //     }
//         //   };
//         // });
//         const mappedOrders = ordersList.map((order, index) => {
//           const firstItem = Array.isArray(order.items) && order.items.length > 0 ? order.items[0] : {};
//           return {
//             id: order.id,
//             orderNumber: order.orderNumber,
//             customerId: order.userId,
//             status: order.status,
//             paymentStatus: order.paymentStatus,
//             totalAmount: order.pricing?.totalAmount ?? order.totalAmountINR ?? order.totalAmount ?? 0,
//             type: order.type,
//             metal: firstItem.metalType || order.metal,
//             grams: firstItem.quantityInGrams || order.grams,
//             pricePerGramINR: firstItem.unitPrice ?? order.pricePerGramINR,
//             createdAt: {
//               seconds: order.createdAt?._seconds || Date.now() / 1000,
//               nanoseconds: order.createdAt?._nanoseconds || 0
//             }
//           };
//         });
//         console.log('✅ Mapped orders count:', mappedOrders.length);
//         console.log('✅ Mapped orders:', mappedOrders);

//         setOrders(mappedOrders);
//         setCurrentPage(result.data.data?.page || page);
//         setTotalPages(Math.ceil((result.data.data?.total || 0) / 10));
//         console.log('✅ Orders state updated. Total:', mappedOrders.length);
//       } else {
//         console.error('❌ Invalid response structure:', result);
//         console.error('❌ API call was not successful or data is missing.');

//         // If the API call fails or the data is not in the expected format,
//         // set orders to an empty array to prevent UI errors.
//         setOrders([]);
//         setTotalPages(1);
//       }
//     } catch (error) {
//       console.error('🔴 Error fetching orders:', error.message);
//       console.error('🔴 Full error:', error);
//       console.error('🔴 Error stack:', error.stack);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch order details
//   const fetchOrderDetails = async (orderId) => {
//     try {
//       setLoading(true);
//       console.log(`🔄 Fetching order details for ${orderId}...`);
//       const result = await apiService.request(`/vendor/orders/${orderId}`, 'GET');

//       console.log('📦 Order Details Response:', result);

//       if (result && result.success && result.data) {
//         // Extract single order object (NOT array) - API returns result.data.data.order
//         const orderData = result.data.data?.order || result.data.data;

//         // Ensure we have an object, not an array
//         const mappedOrder = Array.isArray(orderData) ? orderData[0] : orderData;

//         setSelectedOrder(mappedOrder);
//         console.log('✅ Order details loaded:', mappedOrder);
//       }
//     } catch (error) {
//       console.error('🔴 Error fetching order details:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch order report summary
//   const fetchOrderSummary = async () => {
//     try {
//       setLoading(true);
//       setSummaryError("");
//       console.log('🔄 Fetching order summary...');
//       const result = await apiService.orders.getSummary({ period: '7d' });

//       console.log('📦 Summary Response:', result);

//       if (result && result.success && result.data) {
//         // The actual summary object is in result.data.data
//         const summaryData = result.data.data;
//         console.log('📋 Extracted summaryData:', summaryData);
//         if (summaryData && Object.keys(summaryData).length > 0) {
//           setReportSummary(summaryData);
//           console.log('✅ Summary state updated.');
//         } else {
//           console.warn('⚠️ Summary data is empty or null, showing "No data" message.');
//           setReportSummary(null); // Explicitly set to null to show "No data" message
//         }
//       } else {
//         throw new Error(result.error || "Failed to fetch summary.");
//       }
//     } catch (error) {
//       console.error('🔴 Error fetching summary:', error.message);
//       setSummaryError("Failed to load summary. This may be a server configuration issue (e.g., a missing database index).");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch transaction reports
//   const fetchTransactions = async (page = 1) => {
//     try {
//       setLoading(true);
//       setTransactionsError("");
//       console.log('🔄 Fetching transaction reports...');

//       // ✅ Use the dedicated API method for transactions
//       const result = await apiService.orders.getTransactions({ page: page, limit: 50 });

//       console.log('📦 Transactions Response:', result);

//       if (result && result.success && result.data) {
//         // The transactions array is in result.data.data.transactions
//         const transactionsPayload = result.data.data;
//         const transactionsData = transactionsPayload?.transactions || [];
//         console.log('📋 Extracted transactionsData:', transactionsData);

//         setTransactions(transactionsData);

//         // Update pagination from the same payload
//         setCurrentPage(transactionsPayload?.page || page);
//         setTotalPages(Math.ceil((transactionsPayload?.total || 0) / (transactionsPayload?.limit || 50)));
//         console.log('✅ Transactions loaded:', transactionsData.length);
//       } else {
//         throw new Error(result.error || "Failed to fetch transactions.");
//       }
//     } catch (error) {
//       console.error('🔴 Error fetching transactions:', error.message);
//       if (error.message.includes('Forbidden')) {
//         setTransactionsError("Access Denied. You do not have permission to view transaction reports.");
//       } else {
//         setTransactionsError("Failed to load transactions. Please try again later.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log('🎬 Component mounted - calling fetchOrders()');
//     fetchOrders();
//   }, []);

//   // Log orders state whenever it changes
//   useEffect(() => {
//     console.log('📊 Orders state updated:', orders);
//     console.log('📊 Orders length:', orders.length);
//   }, [orders]);

//   // Load data based on active tab
//   useEffect(() => {
//     if (activeTab === 'summary') {
//       fetchOrderSummary();
//     } else if (activeTab === 'transactions') {
//       fetchTransactions(1); // Fetch first page on tab switch
//     }
//   }, [activeTab]);

//   // Filter orders by search term
//   const filteredOrders = orders.filter(order =>
//     order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     order.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     order.status?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       fetchOrders(currentPage - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       fetchOrders(currentPage + 1);
//     }
//   };

//   const handlePageChange = (pageNum) => {
//     if (pageNum >= 1 && pageNum <= totalPages) {
//       fetchOrders(pageNum);
//     }
//   };

//   const getPaginationNumbers = () => {
//     const pages = [];
//     const maxPagesToShow = 5;
//     let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
//     let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
//     if (endPage - startPage < maxPagesToShow - 1) {
//       startPage = Math.max(1, endPage - maxPagesToShow + 1);
//     }
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }
//     return pages;
//   };

//   const formatStatusLabel = (status) => {
//     if (status === 'PENDING' || status === 'PAYMENT_PENDING') return 'Processing';
//     return status;
//   };

//   const formatPaymentStatusLabel = (paymentStatus) => {
//     if (paymentStatus === 'PENDING' || paymentStatus === 'PENDING_PAYMENT') return 'Processing';
//     return paymentStatus;
//   };

//   return (
//     <div>
//       <div className="flex overflow-x-hidden">
//         <Sidebar />
//         <div className="w-full md:ml-[290px] ml-0 overflow-hidden">
//           <Header />
//           <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden">
//             <div className="flex flex-col gap-4 mb-6">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Orders Management</h2>
//                 <button
//                   onClick={() => {
//                     console.log('🔄 Manual refresh triggered');
//                     fetchOrders();
//                   }}
//                   className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition font-medium"
//                 >
//                   ↻ Refresh Orders
//                 </button>
//               </div>

//               {/* Tabs */}
//               <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
//                 <div className="border-b border-gray-200 overflow-x-auto">
//                   <nav className="flex flex-nowrap">
//                     {[
//                       { id: 'list', label: 'Order List' },
//                       { id: 'details', label: 'Order Details' },
//                       { id: 'summary', label: 'Summary Report' },
//                       { id: 'transactions', label: 'Transactions' }
//                     ].map(tab => (
//                       <button
//                         key={tab.id}
//                         onClick={() => {
//                           setActiveTab(tab.id);
//                           setSearchTerm('');
//                           setSummaryError('');
//                           setTransactionsError('');
//                         }}
//                         className={`px-3 md:px-6 py-4 font-medium text-xs md:text-sm whitespace-nowrap border-b-2 transition ${activeTab === tab.id
//                           ? 'border-amber-500 text-amber-600'
//                           : 'border-transparent text-gray-500 hover:text-gray-700'
//                           }`}
//                       >
//                         {tab.label}
//                       </button>
//                     ))}
//                   </nav>
//                 </div>
//               </div>

//               {/* Content */}
//               {loading && <div className="text-center py-8">Loading...</div>}

//               {/* Order List Tab */}
//               {activeTab === 'list' && (
//                 <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
//                   {loading && (
//                     <div className="text-center py-8">
//                       <p className="text-gray-600">Loading orders...</p>
//                     </div>
//                   )}

//                   {!loading && (
//                     <>
//                       <div className="mb-4">
//                         <input
//                           type="text"
//                           placeholder="Search orders..."
//                           value={searchTerm}
//                           onChange={(e) => setSearchTerm(e.target.value)}
//                           className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
//                         />
//                         <p className="text-xs md:text-sm text-gray-500 mt-2">Total Orders: {orders.length}</p>
//                       </div>

//                       {filteredOrders.length



//                         > 0 ? (
//                         <>
//                           {/* Desktop Table View */}
//                           <div className="hidden md:block overflow-x-auto">
//                             <table className="w-full">
//                               <thead className="bg-gray-50">
//                                 <tr>
//                                   <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order#</th>
//                                   <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Order ID</th>
//                                   <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
//                                   <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Metal</th>
//                                   <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                                   <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
//                                   <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Date</th>
//                                   <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
//                                 </tr>
//                               </thead>
//                               <tbody className="divide-y divide-gray-200">
//                                 {filteredOrders.map(order => (
//                                   <tr key={order.id} className="hover:bg-gray-50 text-xs md:text-sm">
//                                     {/* <td className="px-3 md:px-6 py-3 md:py-4 font-bold text-amber-600">{order.orderNumber}</td> */}
//                                     <td className="px-3 md:px-6 py-3 md:py-4 font-bold text-amber-600">
//                                       <button
//                                         onClick={() => {
//                                           setActiveTab('details');
//                                           fetchOrderDetails(order.id);
//                                         }}
//                                         className="hover:underline cursor-pointer"
//                                       >
//                                         {order.orderNumber}
//                                       </button>
//                                     </td>
//                                     <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 hidden lg:table-cell truncate">{order.id}</td>
//                                     <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900">{order.type}</td>
//                                     <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 hidden sm:table-cell">{order.metal}</td>
//                                     <td className="px-3 md:px-6 py-3 md:py-4">
//                                       <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
//                                         order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
//                                           order.status === 'PAYMENT_PENDING' ? 'bg-blue-100 text-blue-800' :
//                                             order.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
//                                               order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
//                                                 order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
//                                                   order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
//                                                     'bg-gray-100 text-gray-800'
//                                         }`}>
//                                         {formatStatusLabel(order.status)}
//                                       </span>
//                                     </td>
//                                     <td className="px-3 md:px-6 py-3 md:py-4 font-medium text-amber-600">₹{order.totalAmount?.toLocaleString() || '0'}</td>
//                                     <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 hidden sm:table-cell">
//                                       {new Date(order.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
//                                     </td>
//                                     <td className="px-3 md:px-6 py-3 md:py-4">
//                                       <button
//                                         onClick={() => {
//                                           setActiveTab('details');
//                                           fetchOrderDetails(order.id);
//                                         }}
//                                         className="text-amber-600 hover:text-amber-800 flex items-center gap-1 text-xs md:text-sm"
//                                       >
//                                         <FaRegEdit /> View
//                                       </button>
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>

//                           {/* Mobile Card View */}
//                           <div className="md:hidden space-y-4">
//                             {filteredOrders.map(order => (
//                               <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
//                                 <div className="flex justify-between items-start mb-3">
//                                   <div>
//                                     <p className="font-bold text-amber-600 text-sm">#{order.orderNumber}</p>
//                                     <p className="text-xs text-gray-500 mt-1 truncate">{order.id}</p>
//                                   </div>
//                                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
//                                     order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
//                                       order.status === 'PAYMENT_PENDING' ? 'bg-blue-100 text-blue-800' :
//                                         order.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
//                                           order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
//                                             order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
//                                               order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
//                                                 'bg-gray-100 text-gray-800'
//                                     }`}>
//                                     {formatStatusLabel(order.status)}
//                                   </span>
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
//                                   <div>
//                                     <p className="text-gray-600 text-xs">Type</p>
//                                     <p className="font-medium text-gray-900">{order.type}</p>
//                                   </div>
//                                   <div>
//                                     <p className="text-gray-600 text-xs">Metal</p>
//                                     <p className="font-medium text-gray-900">{order.metal}</p>
//                                   </div>
//                                   <div>
//                                     <p className="text-gray-600 text-xs">Amount</p>
//                                     <p className="font-bold text-amber-600">₹{order.totalAmount?.toLocaleString() || '0'}</p>
//                                   </div>
//                                   <div>
//                                     <p className="text-gray-600 text-xs">Date</p>
//                                     <p className="text-gray-900 text-xs">{new Date(order.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</p>
//                                   </div>
//                                 </div>
//                                 <button
//                                   onClick={() => {
//                                     setActiveTab('details');
//                                     fetchOrderDetails(order.id);
//                                   }}
//                                   className="w-full bg-amber-500 text-white py-2 rounded text-sm font-medium hover:bg-amber-600 flex items-center justify-center gap-2"
//                                 >
//                                   <FaRegEdit /> View Details
//                                 </button>
//                               </div>
//                             ))}
//                           </div>
//                         </>
//                       ) : (
//                         <div className="text-center py-12 text-gray-500">
//                           <p className="text-lg font-medium">No orders found</p>
//                           <p className="text-sm mt-2">Total orders available: {orders.length}</p>
//                           {searchTerm && (
//                             <p className="text-sm mt-1">
//                               No results match your search: <span className="font-medium">{searchTerm}</span>
//                             </p>
//                           )}
//                         </div>
//                       )}

//                       {/* Pagination Controls */}
//                       {filteredOrders.length > 0 && totalPages > 1 && (
//                         <div className="flex items-center justify-between px-4 py-4 bg-gray-50 border-t border-gray-200 mt-4 rounded-lg">
//                           <div className="text-xs md:text-sm text-gray-600">
//                             Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span> | Showing <span className="font-semibold">{orders.length}</span> orders
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={handlePrevPage}
//                               disabled={currentPage === 1}
//                               className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                               title="Previous page"
//                             >
//                               <FaChevronLeft size={16} />
//                             </button>
//                             <div className="flex gap-1">
//                               {getPaginationNumbers().map((pageNum) => (
//                                 <button
//                                   key={pageNum}
//                                   onClick={() => handlePageChange(pageNum)}
//                                   className={currentPage === pageNum ? 'w-8 h-8 md:w-10 md:h-10 rounded-lg font-medium transition bg-amber-600 text-white text-xs md:text-sm' : 'w-8 h-8 md:w-10 md:h-10 rounded-lg font-medium transition bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs md:text-sm'}
//                                 >
//                                   {pageNum}
//                                 </button>
//                               ))}
//                             </div>
//                             <button
//                               onClick={handleNextPage}
//                               disabled={currentPage >= totalPages}
//                               className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                               title="Next page"
//                             >
//                               <FaChevronRight size={16} />
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               )}

//               {/* Order Details Tab */}
//               {activeTab === 'details' && selectedOrder && !loading && (
//                 <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
//                   <h3 className="text-xl md:text-2xl font-bold mb-6">Order Details</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
//                     <div>
//                       <label className="text-gray-600 font-medium">Order#</label>
//                       <p className="text-lg font-bold text-amber-600">{selectedOrder.orderNumber}</p>
//                     </div>
//                     <div>
//                       <label className="text-gray-600 font-medium">Order ID</label>
//                       <p className="text-lg text-gray-900">{selectedOrder.id}</p>
//                     </div>
//                     <div>
//                       <label className="text-gray-600 font-medium">Status</label>
//                       <p className="text-lg text-gray-900">
//                         <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedOrder.status === 'PAYMENT_PENDING' ? 'bg-yellow-100 text-yellow-800' :
//                           selectedOrder.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
//                             selectedOrder.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
//                               'bg-gray-100 text-gray-800'
//                           }`}>
//                           {selectedOrder.status}
//                         </span>
//                       </p>
//                     </div>
//                     <div>
//                       <label className="text-gray-600 font-medium">Payment Status</label>
//                       <p className="text-lg text-gray-900">{selectedOrder.paymentStatus}</p>
//                     </div>
//                     <div>
//                       <label className="text-gray-600 font-medium">Type</label>
//                       <p className="text-lg text-gray-900">{selectedOrder.type}</p>
//                     </div>
//                     <div>
//                       <label className="text-gray-600 font-medium">Metal</label>
//                       <p className="text-lg text-gray-900">{selectedOrder.items?.[0]?.metalType}</p>
//                     </div>
//                     <div>
//                       <label className="text-gray-600 font-medium">Quantity</label>
//                       <p className="text-lg text-gray-900">{selectedOrder.items?.[0]?.quantityInGrams}g</p>
//                     </div>
//                     <div>
//                       <label className="text-gray-600 font-medium">Price per Gram</label>
//                       <p className="text-lg text-gray-900">₹{selectedOrder.items?.[0]?.unitPrice?.toLocaleString()}</p>
//                     </div>
//                     <div>
//                       <label className="text-gray-600 font-medium">Metal Value (Subtotal)</label>
//                       <p className="text-lg text-gray-900">₹{selectedOrder.pricing?.subtotal?.toLocaleString() || '0'}</p>
//                     </div>
//                     <div>
//                       <label className="text-gray-600 font-medium">Making Charges</label>
//                       <p className="text-lg text-gray-900">₹{selectedOrder.makingChargesINR?.toLocaleString() || '0'}</p>
//                     </div>
//                     <div>
//                       <label className="text-gray-600 font-medium">Packaging Charges</label>
//                       <p className="text-lg text-gray-900">₹{selectedOrder.packagingChargesINR?.toLocaleString() || '0'}</p>
//                     </div>
//                     <div>
//                       <label className="text-gray-600 font-medium">Delivery Charges</label>
//                       <p className="text-lg text-gray-900">₹{selectedOrder.deliveryChargesINR?.toLocaleString() || '0'}</p>
//                     </div>
//                     <div>
//                       <label className="text-gray-600 font-medium">GST ({selectedOrder.pricing?.gstPercent || 0}%)</label>
//                       <p className="text-lg text-gray-900">₹{selectedOrder.pricing?.gstAmount?.toLocaleString() || '0'}</p>
//                     </div>
//                     <div>
//                       <label className="text-gray-600 font-medium">Customer ID</label>
//                       <p className="text-lg text-gray-900">{selectedOrder.userId}</p>
//                     </div>
//                     <div>
//                       <label className="text-gray-600 font-medium">Shipping</label>
//                       <p className="text-lg text-gray-900">₹{selectedOrder.pricing?.shippingBase?.toLocaleString() || '0'}</p>
//                     </div>
//                     <div>
//                       <label className="text-gray-600 font-medium">Total Amount</label>
//                       <p className="text-lg font-bold text-amber-600">₹{selectedOrder.pricing?.totalAmount?.toLocaleString() || '0'}</p>
//                     </div>
//                     <div>
//                       <label className="text-gray-600 font-medium">Handling Fee</label>
//                       <p className="text-lg text-gray-900">₹{selectedOrder.pricing?.handlingFee?.toLocaleString() || '0'}</p>
//                     </div>
//                     <div className="col-span-2">
//                       <label className="text-gray-600 font-medium">Payment Method</label>
//                       <p className="text-lg text-gray-900">{selectedOrder.payment?.paymentProvider || 'N/A'}</p>

//                     </div>
//                     <div className="col-span-2">
//                       <label className="text-gray-600 font-medium">Created At</label>
//                       <p className="text-lg text-gray-900">
//                         {new Date(selectedOrder.createdAt?.seconds * 1000 || Date.now()).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Summary Report Tab */}
//               {activeTab === 'summary' && !loading && (
//                 <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
//                   <h3 className="text-xl md:text-2xl font-bold mb-6">Order Summary Report</h3>
//                   {summaryError ? (
//                     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
//                       <strong className="font-bold">Error: </strong>
//                       <span className="block sm:inline">{summaryError}</span>
//                     </div>
//                   ) : reportSummary ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
//                       {Object.entries(reportSummary).map(([key, value]) => (
//                         <div key={key} className="bg-gray-50 p-4 rounded-lg">
//                           <label className="text-gray-600 font-medium text-sm uppercase">{key}</label>
//                           <p className="text-2xl font-bold text-amber-600">{JSON.stringify(value)}</p>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8 text-gray-500">No summary data available.</div>
//                   )}
//                 </div>
//               )}

//               {/* Transactions Tab */}
//               {activeTab === 'transactions' && !loading && (
//                 <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
//                   <h3 className="text-xl md:text-2xl font-bold mb-6">Transaction Reports</h3>
//                   {transactionsError ? (
//                     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
//                       <strong className="font-bold">Error: </strong>
//                       <span className="block sm:inline">{transactionsError}</span>
//                     </div>
//                   ) : transactions.length > 0 ? (
//                     <>
//                       {/* Desktop Table View */}
//                       <div className="hidden md:block overflow-x-auto">
//                         <table className="w-full">
//                           <thead className="bg-gray-50">
//                             <tr>
//                               <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order#</th>
//                               <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Transaction ID</th>
//                               <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
//                               <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Metal</th>
//                               <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
//                               <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Payment Status</th>
//                               <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                             </tr>
//                           </thead>
//                           <tbody className="divide-y divide-gray-200">
//                             {transactions.map(tx => (
//                               <tr key={tx.id} className="hover:bg-gray-50 text-xs md:text-sm">
//                                 <td className="px-3 md:px-6 py-3 md:py-4 font-bold text-amber-600">{tx.orderNumber}</td>
//                                 <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 hidden lg:table-cell truncate">{tx.id}</td>
//                                 <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900">{tx.type}</td>
//                                 <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 hidden sm:table-cell">{tx.metal}</td>
//                                 <td className="px-3 md:px-6 py-3 md:py-4 font-medium text-amber-600">₹{tx.totalAmountINR?.toLocaleString()}</td>
//                                 <td className="px-3 md:px-6 py-3 md:py-4 hidden sm:table-cell">
//                                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
//                                     tx.paymentStatus === 'PENDING' || tx.paymentStatus === 'PENDING_PAYMENT' ? 'bg-blue-100 text-blue-800' :
//                                       tx.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
//                                         'bg-gray-100 text-gray-800'
//                                     }`}>
//                                     {formatPaymentStatusLabel(tx.paymentStatus)}
//                                   </span>
//                                 </td>
//                                 <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900">
//                                   {new Date(tx.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>

//                       {/* Mobile Card View */}
//                       <div className="md:hidden space-y-4">
//                         {transactions.map(tx => (
//                           <div key={tx.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
//                             <div className="flex justify-between items-start mb-3">
//                               <p className="font-bold text-amber-600 text-sm">#{tx.orderNumber}</p>
//                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
//                                 tx.paymentStatus === 'PENDING' || tx.paymentStatus === 'PENDING_PAYMENT' ? 'bg-blue-100 text-blue-800' :
//                                   tx.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
//                                     'bg-gray-100 text-gray-800'
//                                 }`}>
//                                 {formatPaymentStatusLabel(tx.paymentStatus)}
//                               </span>
//                             </div>
//                             <p className="text-xs text-gray-500 mb-3 truncate">ID: {tx.id}</p>
//                             <div className="grid grid-cols-2 gap-3 text-sm">
//                               <div>
//                                 <p className="text-gray-600 text-xs">Type</p>
//                                 <p className="font-medium text-gray-900">{tx.type}</p>
//                               </div>
//                               <div>
//                                 <p className="text-gray-600 text-xs">Metal</p>
//                                 <p className="font-medium text-gray-900">{tx.metal}</p>
//                               </div>
//                               <div>
//                                 <p className="text-gray-600 text-xs">Amount</p>
//                                 <p className="font-bold text-amber-600">₹{tx.totalAmountINR?.toLocaleString()}</p>
//                               </div>
//                               <div>
//                                 <p className="text-gray-600 text-xs">Date</p>
//                                 <p className="text-gray-900 text-xs">{new Date(tx.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </>
//                   ) : (
//                     <div className="text-center py-8 text-gray-500">{transactionsError || 'No transactions found'}</div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Orders;
import React, { useEffect, useState } from "react";
import { FaRegEdit, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import apiService from "./service/apiService";

// Helper: read the order/transaction amount from whichever field the backend actually populated
const getAmount = (record) =>
  Number(
    record.totalAmount ??
    record.pricing?.totalAmount ??
    record.totalAmountINR ??
    record.amountINR ??
    0
  );

// Helper: read the metal type from whichever field/shape is populated
const getMetal = (record) => {
  const firstItem = Array.isArray(record.items) && record.items.length > 0 ? record.items[0] : {};
  return firstItem.metalType || record.metal || "—";
};

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

      // ✅ Use vendor-specific orders endpoint
      const endpoint = `/vendor/orders?page=${page}&limit=10`;

      const result = await apiService.request(endpoint, 'GET');

      console.log('📦 FULL API RESULT:', JSON.stringify(result, null, 2));

      if (result && result.success && result.data) {
        // Extract orders array from potentially nested path for more robust handling
        const ordersList = result.data.data?.orders || result.data.orders || [];

        if (ordersList.length === 0) {
          console.warn('⚠️ WARNING: ordersList is empty! Checking all properties:');
          console.warn('Available properties in result.data:', Object.keys(result.data));
        }

        // Map API fields to component state
        const mappedOrders = ordersList.map((order) => {
          const firstItem = Array.isArray(order.items) && order.items.length > 0 ? order.items[0] : {};
          return {
            id: order.id,
            orderNumber: order.orderNumber,
            customerId: order.userId,
            status: order.status,
            paymentStatus: order.paymentStatus,
            totalAmount: getAmount(order),
            type: order.type,
            metal: getMetal(order),
            grams: firstItem.quantityInGrams || order.grams,
            pricePerGramINR: firstItem.unitPrice ?? order.pricePerGramINR,
            createdAt: {
              seconds: order.createdAt?._seconds || Date.now() / 1000,
              nanoseconds: order.createdAt?._nanoseconds || 0
            }
          };
        });

        setOrders(mappedOrders);
        setCurrentPage(result.data.data?.page || page);
        setTotalPages(Math.ceil((result.data.data?.total || 0) / 10));
        console.log('✅ Orders state updated. Total:', mappedOrders.length);
      } else {
        console.error('❌ Invalid response structure:', result);
        setOrders([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('🔴 Error fetching orders:', error.message);
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
      const result = await apiService.request(`/vendor/orders/${orderId}`, 'GET');

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
      const result = await apiService.orders.getSummary({ period: '7d' });

      console.log('📦 Summary Response:', result);

      if (result && result.success && result.data) {
        const summaryData = result.data.data;
        if (summaryData && Object.keys(summaryData).length > 0) {
          setReportSummary(summaryData);
        } else {
          setReportSummary(null);
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
        const rawTransactions = transactionsPayload?.transactions || [];

        // Normalize each transaction so the table always has a usable amount/metal,
        // regardless of which field name the backend used for this record.
        const transactionsData = rawTransactions.map((tx) => ({
          ...tx,
          totalAmount: getAmount(tx),
          metal: getMetal(tx),
        }));

        console.log('📋 Normalized transactionsData:', transactionsData);

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
    fetchOrders();
  }, []);

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

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchOrders(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchOrders(currentPage + 1);
    }
  };

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      fetchOrders(pageNum);
    }
  };

  const getPaginationNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const formatStatusLabel = (status) => {
    if (status === 'PENDING' || status === 'PAYMENT_PENDING') return 'Processing';
    return status;
  };

  const formatPaymentStatusLabel = (paymentStatus) => {
    if (paymentStatus === 'PENDING' || paymentStatus === 'PENDING_PAYMENT') return 'Processing';
    return paymentStatus;
  };

  // Opens the Order Details tab and loads the full order for the given id
  const openOrderDetails = (orderId) => {
    setActiveTab('details');
    fetchOrderDetails(orderId);
  };

  return (
    <div>
      <div className="flex overflow-x-hidden">
        <Sidebar />
        <div className="w-full md:ml-[290px] ml-0 overflow-hidden">
          <Header />
          <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Orders Management</h2>
                <button
                  onClick={() => fetchOrders()}
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

                      {filteredOrders.length > 0 ? (
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
                                    <td className="px-3 md:px-6 py-3 md:py-4 font-bold text-amber-600">
                                      <button
                                        onClick={() => openOrderDetails(order.id)}
                                        className="hover:underline cursor-pointer"
                                      >
                                        {order.orderNumber}
                                      </button>
                                    </td>
                                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 hidden lg:table-cell truncate">{order.id}</td>
                                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900">{order.type}</td>
                                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 hidden sm:table-cell">{order.metal}</td>
                                    <td className="px-3 md:px-6 py-3 md:py-4">
                                      <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                          order.status === 'PAYMENT_PENDING' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                                              order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {formatStatusLabel(order.status)}
                                      </span>
                                    </td>
                                    <td className="px-3 md:px-6 py-3 md:py-4 font-medium text-amber-600">₹{order.totalAmount?.toLocaleString() || '0'}</td>
                                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 hidden sm:table-cell">
                                      {new Date(order.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
                                    </td>
                                    <td className="px-3 md:px-6 py-3 md:py-4">
                                      <button
                                        onClick={() => openOrderDetails(order.id)}
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
                                      order.status === 'PAYMENT_PENDING' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                                          order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                              order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                    }`}>
                                    {formatStatusLabel(order.status)}
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
                                  onClick={() => openOrderDetails(order.id)}
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

                      {/* Pagination Controls */}
                      {filteredOrders.length > 0 && totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-4 bg-gray-50 border-t border-gray-200 mt-4 rounded-lg">
                          <div className="text-xs md:text-sm text-gray-600">
                            Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span> | Showing <span className="font-semibold">{orders.length}</span> orders
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handlePrevPage}
                              disabled={currentPage === 1}
                              className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                              title="Previous page"
                            >
                              <FaChevronLeft size={16} />
                            </button>
                            <div className="flex gap-1">
                              {getPaginationNumbers().map((pageNum) => (
                                <button
                                  key={pageNum}
                                  onClick={() => handlePageChange(pageNum)}
                                  className={currentPage === pageNum ? 'w-8 h-8 md:w-10 md:h-10 rounded-lg font-medium transition bg-amber-600 text-white text-xs md:text-sm' : 'w-8 h-8 md:w-10 md:h-10 rounded-lg font-medium transition bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs md:text-sm'}
                                >
                                  {pageNum}
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={handleNextPage}
                              disabled={currentPage >= totalPages}
                              className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                              title="Next page"
                            >
                              <FaChevronRight size={16} />
                            </button>
                          </div>
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
                      <p className="text-lg text-gray-900">{selectedOrder.items?.[0]?.metalType}</p>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium">Quantity</label>
                      <p className="text-lg text-gray-900">{selectedOrder.items?.[0]?.quantityInGrams}g</p>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium">Price per Gram</label>
                      <p className="text-lg text-gray-900">₹{selectedOrder.items?.[0]?.unitPrice?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium">Metal Value (Subtotal)</label>
                      <p className="text-lg text-gray-900">₹{selectedOrder.pricing?.subtotal?.toLocaleString() || '0'}</p>
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
                      <label className="text-gray-600 font-medium">GST ({selectedOrder.pricing?.gstPercent || 0}%)</label>
                      <p className="text-lg text-gray-900">₹{selectedOrder.pricing?.gstAmount?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium">Customer ID</label>
                      <p className="text-lg text-gray-900">{selectedOrder.userId}</p>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium">Shipping</label>
                      <p className="text-lg text-gray-900">₹{selectedOrder.pricing?.shippingBase?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium">Total Amount</label>
                      <p className="text-lg font-bold text-amber-600">₹{getAmount(selectedOrder).toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium">Handling Fee</label>
                      <p className="text-lg text-gray-900">₹{selectedOrder.pricing?.handlingFee?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-gray-600 font-medium">Payment Method</label>
                      <p className="text-lg text-gray-900">{selectedOrder.payment?.paymentProvider || 'N/A'}</p>

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
                              {/* <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th> */}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {transactions.map(tx => (
                              <tr key={tx.id} className="hover:bg-gray-50 text-xs md:text-sm">
                                <td className="px-3 md:px-6 py-3 md:py-4 font-bold text-amber-600">
                                  <button
                                    onClick={() => openOrderDetails(tx.orderId || tx.id)}
                                    className="hover:underline cursor-pointer"
                                  >
                                    {tx.orderNumber || tx.id}
                                  </button>
                                </td>
                                <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 hidden lg:table-cell truncate">{tx.id}</td>
                                <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900">{tx.type}</td>
                                <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 hidden sm:table-cell">{tx.metal}</td>
                                <td className="px-3 md:px-6 py-3 md:py-4 font-medium text-amber-600">₹{tx.totalAmount?.toLocaleString() || '0'}</td>
                                <td className="px-3 md:px-6 py-3 md:py-4 hidden sm:table-cell">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                    tx.paymentStatus === 'PENDING' || tx.paymentStatus === 'PENDING_PAYMENT' ? 'bg-blue-100 text-blue-800' :
                                      tx.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {formatPaymentStatusLabel(tx.paymentStatus) || '—'}
                                  </span>
                                </td>
                                {/* <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900">
                                  {tx.createdAt
                                    ? new Date(tx.createdAt?.seconds ? tx.createdAt.seconds * 1000 : tx.createdAt).toLocaleDateString()
                                    : '—'}
                                </td> */}
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
                              <button
                                onClick={() => openOrderDetails(tx.orderId || tx.id)}
                                className="font-bold text-amber-600 text-sm hover:underline cursor-pointer"
                              >
                                #{tx.orderNumber || tx.id}
                              </button>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                tx.paymentStatus === 'PENDING' || tx.paymentStatus === 'PENDING_PAYMENT' ? 'bg-blue-100 text-blue-800' :
                                  tx.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                {formatPaymentStatusLabel(tx.paymentStatus) || '—'}
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
                                <p className="font-bold text-amber-600">₹{tx.totalAmount?.toLocaleString() || '0'}</p>
                              </div>
                              <div>
                                <p className="text-gray-600 text-xs">Date</p>
                                <p className="text-gray-900 text-xs">
                                  {tx.createdAt
                                    ? new Date(tx.createdAt?.seconds ? tx.createdAt.seconds * 1000 : tx.createdAt).toLocaleDateString()
                                    : '—'}
                                </p>
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
    </div>
  );
};

export default Orders;