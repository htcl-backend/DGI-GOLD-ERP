import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegEdit, FaTimes, FaEye } from "react-icons/fa";

const SellGold = () => {
  const [formData, setFormData] = useState({
    material: "gold",
    customerName: "",
    customerPhone: "",
    weight: "",
    purity: "24K",
    sellPrice: "",
    totalAmount: "",
    date: new Date().toISOString().split("T")[0],
    delivered: false,
    notes: "",
  });

  const [sellRecords, setSellRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellRecords();
  }, []);

  const fetchSellRecords = async () => {
    try {
      // Static mock data for sell records
      const mockSellRecords = [
        {
          _id: "sell001",
          material: "gold",
          customerName: "Rajesh Kumar",
          customerPhone: "+91-9876543210",
          weight: 25.5,
          purity: "24K",
          sellPrice: 6500,
          totalAmount: 165750,
          date: "2024-01-15",
          delivered: true,
          notes: "High purity gold sale",
          type: "sell"
        },
        {
          _id: "sell002",
          material: "gold",
          customerName: "Priya Sharma",
          customerPhone: "+91-9876543211",
          weight: 15.2,
          purity: "22K",
          sellPrice: 5800,
          totalAmount: 88160,
          date: "2024-01-12",
          delivered: true,
          notes: "Wedding jewelry purchase",
          type: "sell"
        },
        {
          _id: "sell003",
          material: "gold",
          customerName: "Amit Singh",
          customerPhone: "+91-9876543212",
          weight: 30.0,
          purity: "18K",
          sellPrice: 4500,
          totalAmount: 135000,
          date: "2024-01-10",
          delivered: false,
          notes: "Bulk gold purchase",
          type: "sell"
        },
        {
          _id: "sell004",
          material: "gold",
          customerName: "Sneha Patel",
          customerPhone: "+91-9876543213",
          weight: 10.8,
          purity: "24K",
          sellPrice: 6800,
          totalAmount: 73440,
          date: "2024-01-08",
          delivered: true,
          notes: "Investment purchase",
          type: "sell"
        }
      ];

      setSellRecords(mockSellRecords);
    } catch (error) {
      console.error('Error fetching sell records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulate adding new sell record with static data
      const newRecord = {
        _id: Date.now().toString(),
        ...formData,
        type: 'sell'
      };

      setSellRecords(prev => [...prev, newRecord]);

      setFormData({
        material: "gold",
        customerName: "",
        customerPhone: "",
        weight: "",
        purity: "24K",
        sellPrice: "",
        totalAmount: "",
        date: new Date().toISOString().split("T")[0],
        delivered: false,
        notes: "",
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Update local state instead of API call
      setSellRecords(prev => prev.map(record =>
        record._id === editingRecord._id
          ? { ...record, ...formData }
          : record
      ));

      setEditingRecord(null);
      setFormData({
        material: "gold",
        customerName: "",
        customerPhone: "",
        weight: "",
        purity: "24K",
        sellPrice: "",
        totalAmount: "",
        date: new Date().toISOString().split("T")[0],
        delivered: false,
        notes: "",
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Update local state instead of API call
      setSellRecords(prev => prev.filter(record => record._id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Sample customer data
  const customerData = {
    "Amit Patel": {
      name: "Amit Patel",
      phone: "9988776655",
      email: "amit.patel@email.com",
      address: "789 Jewel Lane, Ahmedabad",
      totalOrders: 12,
      totalValue: "₹6,50,000",
      lastOrder: "2024-03-06",
      status: "Active"
    },
    "Sneha Sharma": {
      name: "Sneha Sharma",
      phone: "9876543211",
      email: "sneha.sharma@email.com",
      address: "321 Gold Plaza, Bangalore",
      totalOrders: 9,
      totalValue: "₹5,20,000",
      lastOrder: "2024-03-05",
      status: "Active"
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      material: "gold",
      customerName: record.customerName,
      customerPhone: record.customerPhone,
      weight: record.weight,
      purity: record.purity,
      sellPrice: record.price,
      totalAmount: record.totalAmount,
      date: record.date,
      delivered: record.delivered,
      notes: record.notes || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setFormData({
      material: "gold",
      customerName: "",
      customerPhone: "",
      weight: "",
      purity: "24K",
      sellPrice: "",
      totalAmount: "",
      date: new Date().toISOString().split("T")[0],
      delivered: false,
      notes: "",
    });
  };

  const handleCustomerClick = (customerName) => {
    setSelectedCustomer(customerData[customerName]);
    setShowCustomerModal(true);
  };

  const closeCustomerModal = () => {
    setShowCustomerModal(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full ml-[290px]">
        <Header />
        <div className="p-6 bg-gray-50 min-h-screen">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Sell Gold</h2>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Records List Section */}
            <div className="w-full">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Weight
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Purity
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Price/g
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Delivered
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellRecords.map((record) => (
                      <tr
                        key={record._id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 text-sm text-gray-800">
                          <button
                            onClick={() => handleCustomerClick(record.customerName)}
                            className="text-red-600 hover:text-red-800 font-medium hover:underline"
                          >
                            {record.customerName}
                          </button>
                          <br />
                          <span className="text-xs text-gray-500">
                            {record.customerPhone}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {record.goldWeight}g
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {record.goldPurity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          ₹{record.sellPrice}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                          ₹{record.totalAmount}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${record.delivered
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            {record.delivered ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(record)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <FaRegEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(record._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <AiOutlineDelete size={16} />
                            </button>
                          </div>
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
}

export default SellGold;