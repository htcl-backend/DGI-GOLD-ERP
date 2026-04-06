import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FaRegEdit, FaTimes, FaEye } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { apiFetch } from "../api";

const Delivered = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      // Static mock data for deliveries
      const mockDeliveries = [
        {
          id: 1,
          orderNumber: "ORD-001",
          customerName: "Rajesh Kumar",
          customerPhone: "+91-9876543210",
          goldWeight: 25.5,
          goldPurity: "24K",
          totalAmount: 165750,
          orderDate: "2024-01-15",
          deliveryDate: "2024-01-18",
          status: "Delivered",
          address: "123 MG Road, Bangalore, Karnataka 560001"
        },
        {
          id: 2,
          orderNumber: "ORD-002",
          customerName: "Priya Sharma",
          customerPhone: "+91-9876543211",
          goldWeight: 15.2,
          goldPurity: "22K",
          totalAmount: 88280,
          orderDate: "2024-01-16",
          deliveryDate: "2024-01-20",
          status: "In Transit",
          address: "456 Brigade Road, Bangalore, Karnataka 560025"
        },
        {
          id: 3,
          orderNumber: "ORD-003",
          customerName: "Amit Singh",
          customerPhone: "+91-9876543212",
          goldWeight: 30.0,
          goldPurity: "18K",
          totalAmount: 135000,
          orderDate: "2024-01-17",
          deliveryDate: "2024-01-22",
          status: "Out for Delivery",
          address: "789 Commercial Street, Bangalore, Karnataka 560001"
        },
        {
          id: 4,
          orderNumber: "ORD-004",
          customerName: "Sneha Patel",
          customerPhone: "+91-9876543213",
          goldWeight: 10.8,
          goldPurity: "24K",
          totalAmount: 70200,
          orderDate: "2024-01-18",
          deliveryDate: "2024-01-25",
          status: "Pending",
          address: "321 Residency Road, Bangalore, Karnataka 560025"
        },
        {
          id: 5,
          orderNumber: "ORD-005",
          customerName: "Vikram Rao",
          customerPhone: "+91-9876543214",
          goldWeight: 45.3,
          goldPurity: "22K",
          totalAmount: 263340,
          orderDate: "2024-01-19",
          deliveryDate: "2024-01-21",
          status: "Delivered",
          address: "654 Cunningham Road, Bangalore, Karnataka 560052"
        }
      ];

      setDeliveries(mockDeliveries);
      setError(null);
    } catch (err) {
      setError("Failed to fetch deliveries.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const [selectedModal, setSelectedModal] = useState(null);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [modalHistory, setModalHistory] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  const handleStatusClick = async (status) => {
    setSelectedModal(status);
    setModalLoading(true);
    try {
      // Static mock data for delivery history based on status
      const mockHistoryData = {
        "Delivered": [
          {
            date: "2024-01-18",
            orderId: "ORD-001",
            customer: "Rajesh Kumar",
            action: "Delivered successfully",
            location: "Bangalore, Karnataka"
          },
          {
            date: "2024-01-21",
            orderId: "ORD-005",
            customer: "Vikram Rao",
            action: "Delivered successfully",
            location: "Bangalore, Karnataka"
          }
        ],
        "In Transit": [
          {
            date: "2024-01-19",
            orderId: "ORD-002",
            customer: "Priya Sharma",
            action: "Package picked up from warehouse",
            location: "Bangalore Warehouse"
          },
          {
            date: "2024-01-20",
            orderId: "ORD-002",
            customer: "Priya Sharma",
            action: "In transit to delivery center",
            location: "En route to Bangalore"
          }
        ],
        "Out for Delivery": [
          {
            date: "2024-01-21",
            orderId: "ORD-003",
            customer: "Amit Singh",
            action: "Out for delivery",
            location: "Bangalore Delivery Center"
          }
        ],
        "Pending": [
          {
            date: "2024-01-18",
            orderId: "ORD-004",
            customer: "Sneha Patel",
            action: "Order confirmed, awaiting processing",
            location: "Order Processing"
          }
        ]
      };

      setModalHistory(mockHistoryData[status] || []);
    } catch (err) {
      console.error(`Failed to fetch history for ${status}`, err);
      setModalHistory([]); // clear previous history on error
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditClick = (delivery) => {
    setEditingDelivery(delivery);
    setEditForm({
      orderNumber: delivery.orderNumber,
      customerName: delivery.customerName,
      customerPhone: delivery.customerPhone,
      goldWeight: delivery.goldWeight,
      goldPurity: delivery.goldPurity,
      totalAmount: delivery.totalAmount,
      orderDate: delivery.orderDate,
      deliveryDate: delivery.deliveryDate,
      status: delivery.status,
      address: delivery.address,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update local state instead of API call
      setDeliveries(prevDeliveries =>
        prevDeliveries.map(delivery =>
          delivery.id === editingDelivery.id
            ? { ...delivery, ...editForm }
            : delivery
        )
      );
      setEditingDelivery(null);
      setEditForm({});
      alert("Delivery updated successfully!");
    } catch (err) {
      console.error("Failed to update delivery", err);
      alert("Failed to update delivery.");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteClick = async (deliveryId) => {
    if (window.confirm("Are you sure you want to delete this delivery record?")) {
      try {
        // Update local state instead of API call
        setDeliveries(prevDeliveries =>
          prevDeliveries.filter(delivery => delivery.id !== deliveryId)
        );
        alert("Delivery deleted successfully!");
      } catch (err) {
        console.error("Failed to delete delivery", err);
        alert("Failed to delete delivery.");
      }
    }
  };

  const closeModal = () => {
    setSelectedModal(null);
  };

  const closeEditModal = () => {
    setEditingDelivery(null);
    setEditForm({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "In Transit":
        return "bg-blue-100 text-blue-800";
      case "Out for Delivery":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return "✓";
      case "In Transit":
        return "→";
      case "Out for Delivery":
        return "◐";
      case "Pending":
        return "⏱";
      default:
        return "○";
    }
  };

  const renderModal = () => {
    if (!selectedModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-semibold">{selectedModal} History</h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <FaTimes size={20} />
            </button>
          </div>

          <div className="p-6">
            {modalLoading ? (
              <p>Loading history...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {modalHistory.length > 0 ? (
                      modalHistory.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm">{item.date}</td>
                          <td className="px-4 py-2 text-sm font-medium">{item.orderId}</td>
                          <td className="px-4 py-2 text-sm">{item.customer}</td>
                          <td className="px-4 py-2 text-sm">{item.action}</td>
                          <td className="px-4 py-2 text-sm">{item.location}</td>
                        </tr>
                      ))         // ← closes only the .map()
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4">No history found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderEditModal = () => {
    if (!editingDelivery) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-semibold">Edit Delivery</h3>
            <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">
              <FaTimes size={20} />
            </button>
          </div>

          <form onSubmit={handleEditSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
                <input
                  type="text"
                  name="orderNumber"
                  value={editForm.orderNumber || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={editForm.customerName || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={editForm.customerPhone || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gold Weight (g)</label>
                <input
                  type="number"
                  name="goldWeight"
                  value={editForm.goldWeight || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gold Purity</label>
                <select
                  name="goldPurity"
                  value={editForm.goldPurity || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option>24K</option>
                  <option>22K</option>
                  <option>20K</option>
                  <option>18K</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <input
                  type="number"
                  name="totalAmount"
                  value={editForm.totalAmount || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                <input
                  type="date"
                  name="orderDate"
                  value={editForm.orderDate || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={editForm.deliveryDate || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={editForm.status || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option>Pending</option>
                  <option>In Transit</option>
                  <option>Out for Delivery</option>
                  <option>Delivered</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={editForm.address || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 h-20"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
              >
                Update Delivery
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[290px] overflow-x-hidden">
        <Header />
        <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] overflow-y-auto">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>}
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Delivery Management</h2>

            {/* Status Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {["Delivered", "In Transit", "Pending", "Out for Delivery"].map((status) => {
                const count = deliveries.filter(d => d.status === status).length;
                return (
                  <div
                    key={status}
                    className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleStatusClick(status)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{status}</p>
                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                      </div>
                      <div className="text-2xl">{getStatusIcon(status)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery Table */}
            {loading ? (
              <p>Loading deliveries...</p>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800">All Deliveries</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Weight
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Delivery Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {deliveries.length > 0 ? deliveries.map((delivery) => (
                        <tr key={delivery.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {delivery.orderNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="font-medium">{delivery.customerName}</div>
                              <div className="text-gray-500">{delivery.customerPhone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {delivery.goldWeight}g ({delivery.goldPurity})
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            ₹{delivery.totalAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {delivery.orderDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {delivery.deliveryDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                              {delivery.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEditClick(delivery)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <FaRegEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(delivery.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <AiOutlineDelete size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="8" className="text-center py-4">No deliveries found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {renderModal()}
      {renderEditModal()}
    </div>
  );
};

export default Delivered;