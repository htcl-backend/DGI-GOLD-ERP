// import React, { useState, useEffect } from "react";
// import Sidebar from "../../components/Sidebar";
// import Header from "../../components/Header";
// import { AiOutlineDelete } from "react-icons/ai";
// import { FaRegEdit, FaTimes, FaEye } from "react-icons/fa";
// import { useData } from "../../Contexts/DataContext";

// const BuyGold = () => {
//   const { placeOrder, allOrders, allProducts } = useData();
//   const [formData, setFormData] = useState({
//     material: "gold",
//     customerName: "",
//     customerPhone: "",
//     weight: "",
//     purity: "24K",
//     buyPrice: "",
//     totalAmount: "",
//     date: new Date().toISOString().split("T")[0],
//     delivered: false,
//     notes: "",
//   });

//   const [buyRecords, setBuyRecords] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // Filter buy transactions from all orders
//     const buyTransactions = allOrders.filter(order =>
//       order.type === 'buy' || order.material === 'gold'
//     );
//     setBuyRecords(buyTransactions);
//   }, [allOrders]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       // Find matching product for inventory update
//       const product = allProducts.find(p =>
//         p.name.toLowerCase().includes(formData.material.toLowerCase())
//       );

//       const orderData = {
//         customerName: formData.customerName,
//         customerPhone: formData.customerPhone,
//         productName: `${formData.material} ${formData.purity}`,
//         quantity: parseFloat(formData.weight),
//         price: parseFloat(formData.buyPrice),
//         totalPrice: parseFloat(formData.totalAmount),
//         status: formData.delivered ? 'Delivered' : 'Processing',
//         orderDate: formData.date,
//         type: 'buy',
//         material: formData.material,
//         purity: formData.purity,
//         notes: formData.notes,
//         vendorId: 'v-001', // Default vendor for now
//       };

//       placeOrder(orderData);

//       setFormData({
//         material: "gold",
//         customerName: "",
//         customerPhone: "",
//         weight: "",
//         purity: "24K",
//         buyPrice: "",
//         totalAmount: "",
//         date: new Date().toISOString().split("T")[0],
//         delivered: false,
//         notes: "",
//       });
//     } catch (error) {
//       console.error('Error creating transaction:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       // Update local state instead of API call
//       setBuyRecords(prev => prev.map(record =>
//         record._id === editingRecord._id
//           ? { ...record, ...formData }
//           : record
//       ));

//       setEditingRecord(null);
//       setFormData({
//         material: "gold",
//         customerName: "",
//         customerPhone: "",
//         weight: "",
//         purity: "24K",
//         buyPrice: "",
//         totalAmount: "",
//         date: new Date().toISOString().split("T")[0],
//         delivered: false,
//         notes: "",
//       });
//     } catch (error) {
//       console.error('Error updating transaction:', error);
//     }
//   };

//   const [editingRecord, setEditingRecord] = useState(null);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [showCustomerModal, setShowCustomerModal] = useState(false);

//   // Sample customer data
//   const customerData = {
//     "Raj Kumar": {
//       name: "Raj Kumar",
//       phone: "9876543210",
//       email: "raj.kumar@email.com",
//       address: "123 Gold Street, Mumbai",
//       totalOrders: 15,
//       totalValue: "₹8,50,000",
//       lastOrder: "2024-03-08",
//       status: "Active"
//     },
//     "Priya Singh": {
//       name: "Priya Singh",
//       phone: "9123456789",
//       email: "priya.singh@email.com",
//       address: "456 Diamond Road, Delhi",
//       totalOrders: 8,
//       totalValue: "₹4,20,000",
//       lastOrder: "2024-03-07",
//       status: "Active"
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleEdit = (record) => {
//     setEditingRecord(record);
//     setFormData({
//       material: record.material,
//       customerName: record.customerName,
//       customerPhone: record.customerPhone,
//       weight: record.weight,
//       purity: record.purity,
//       buyPrice: record.price,
//       totalAmount: record.totalAmount,
//       date: record.date,
//       delivered: record.delivered,
//       notes: record.notes || "",
//     });
//   };

//   const handleCancelEdit = () => {
//     setEditingRecord(null);
//     setFormData({
//       material: "gold",
//       customerName: "",
//       customerPhone: "",
//       weight: "",
//       purity: "24K",
//       buyPrice: "",
//       totalAmount: "",
//       date: new Date().toISOString().split("T")[0],
//       delivered: false,
//       notes: "",
//     });
//   };

//   const handleCustomerClick = (customerName) => {
//     setSelectedCustomer(customerData[customerName]);
//     setShowCustomerModal(true);
//   };

//   const closeCustomerModal = () => {
//     setShowCustomerModal(false);
//     setSelectedCustomer(null);
//   };

//   const handleDelete = async (id) => {
//     try {
//       // Update local state instead of API call
//       setBuyRecords(prev => prev.filter(record => record._id !== id));
//     } catch (error) {
//       console.error('Error deleting transaction:', error);
//     }
//   };

//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="w-full ml-[290px]">
//         <Header />
//         <div className="p-6 bg-gray-50 min-h-screen">
//           <h2 className="text-3xl font-bold mb-6 text-gray-800">Buy Gold</h2>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Form Section */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h3 className="text-xl font-semibold mb-4 text-gray-800">
//                   {editingRecord ? "Edit Buy Record" : "Add Buy Record"}
//                 </h3>
//                 <form onSubmit={editingRecord ? handleUpdate : handleSubmit} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Material
//                     </label>
//                     <select
//                       name="material"
//                       value={formData.material}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
//                     >
//                       <option value="gold">Gold</option>
//                       <option value="silver">Silver</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Customer Name
//                     </label>
//                     <input
//                       type="text"
//                       name="customerName"
//                       value={formData.customerName}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Customer Phone
//                     </label>
//                     <input
//                       type="tel"
//                       name="customerPhone"
//                       value={formData.customerPhone}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Weight (grams)
//                     </label>
//                     <input
//                       type="number"
//                       name="weight"
//                       value={formData.weight}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Purity
//                     </label>
//                     <select
//                       name="purity"
//                       value={formData.purity}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
//                     >
//                       {formData.material === "gold" ? (
//                         <>
//                           <option value="24K">24K (99.9%)</option>
//                           <option value="22K">22K (91.6%)</option>
//                           <option value="18K">18K (75%)</option>
//                         </>
//                       ) : (
//                         <>
//                           <option value="999">999 (99.9%)</option>
//                           <option value="925">925 (92.5%)</option>
//                         </>
//                       )}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Price per gram (₹)
//                     </label>
//                     <input
//                       type="number"
//                       name="buyPrice"
//                       value={formData.buyPrice}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Date
//                     </label>
//                     <input
//                       type="date"
//                       name="date"
//                       value={formData.date}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
//                       required
//                     />
//                   </div>

//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       name="delivered"
//                       checked={formData.delivered}
//                       onChange={handleInputChange}
//                       className="w-4 h-4 text-amber-500 rounded"
//                     />
//                     <label className="ml-2 text-sm text-gray-700">
//                       Delivered
//                     </label>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Notes
//                     </label>
//                     <textarea
//                       name="notes"
//                       value={formData.notes}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-20"
//                     />
//                   </div>

//                   <div className="flex gap-2">
//                     <button
//                       type="submit"
//                       className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
//                     >
//                       {editingRecord ? "Update Record" : "Add Buy Record"}
//                     </button>
//                     {editingRecord && (
//                       <button
//                         type="button"
//                         onClick={handleCancelEdit}
//                         className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-semibold"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </div>
//                 </form>
//               </div>
//             </div>

//             {/* Records List Section */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                 <table className="w-full">
//                   <thead className="bg-gray-100 border-b">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//                         Material
//                       </th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//                         Customer
//                       </th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//                         Weight
//                       </th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//                         Purity
//                       </th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//                         Price/g
//                       </th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//                         Total
//                       </th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
//                         Delivered
//                       </th>
//                       <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {buyRecords.map((record) => (
//                       <tr
//                         key={record._id}
//                         className="border-b hover:bg-gray-50 transition"
//                       >
//                         <td className="px-4 py-3 text-sm text-gray-800 font-medium">
//                           {record.material || "gold"}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-800">
//                           <button
//                             onClick={() => handleCustomerClick(record.customerName)}
//                             className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
//                           >
//                             {record.customerName}
//                           </button>
//                           <br />
//                           <span className="text-xs text-gray-500">
//                             {record.customerPhone}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-800">
//                           {record.weight}g
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-800">
//                           {record.purity}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-800">
//                           ₹{record.buyPrice}
//                         </td>
//                         <td className="px-4 py-3 text-sm font-semibold text-gray-800">
//                           ₹{record.totalAmount}
//                         </td>
//                         <td className="px-4 py-3 text-sm">
//                           <span
//                             className={`px-3 py-1 rounded-full text-xs font-semibold ${record.delivered
//                               ? "bg-green-100 text-green-800"
//                               : "bg-yellow-100 text-yellow-800"
//                               }`}
//                           >
//                             {record.delivered ? "Yes" : "No"}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-center">
//                           <div className="flex justify-center gap-2">
//                             <button
//                               onClick={() => handleEdit(record)}
//                               className="text-blue-500 hover:text-blue-700"
//                             >
//                               <FaRegEdit size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleDelete(record._id)}
//                               className="text-red-500 hover:text-red-700"
//                             >
//                               <AiOutlineDelete size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Customer Details Modal */}
//       {showCustomerModal && selectedCustomer && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg max-w-md w-full mx-4">
//             <div className="flex justify-between items-center p-6 border-b">
//               <h3 className="text-xl font-semibold">Customer Details</h3>
//               <button onClick={closeCustomerModal} className="text-gray-500 hover:text-gray-700">
//                 <FaTimes size={20} />
//               </button>
//             </div>

//             <div className="p-6">
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Name</label>
//                   <p className="text-gray-900">{selectedCustomer.name}</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone</label>
//                   <p className="text-gray-900">{selectedCustomer.phone}</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <p className="text-gray-900">{selectedCustomer.email}</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Address</label>
//                   <p className="text-gray-900">{selectedCustomer.address}</p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Total Orders</label>
//                     <p className="text-gray-900 font-semibold">{selectedCustomer.totalOrders}</p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Total Value</label>
//                     <p className="text-gray-900 font-semibold">{selectedCustomer.totalValue}</p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Last Order</label>
//                     <p className="text-gray-900">{selectedCustomer.lastOrder}</p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Status</label>
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedCustomer.status === 'Active'
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-red-100 text-red-800'
//                       }`}>
//                       {selectedCustomer.status}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BuyGold;