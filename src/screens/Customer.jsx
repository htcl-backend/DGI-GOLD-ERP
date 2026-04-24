import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { apiFetch } from "../api";

const Customer = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerHistory, setCustomerHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    gstin: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(term.toLowerCase()) ||
        customer.email.toLowerCase().includes(term.toLowerCase()) ||
        customer.phone.includes(term) ||
        customer.city?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  };

  const handleViewCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setActiveTab("details");

    // Use static mock data for customer purchase history
    try {
      const mockTransactions = [
        {
          _id: "t1",
          date: "2024-01-15",
          type: "Purchase",
          amount: 245000,
          description: "Gold 24K purchase",
          status: "Completed"
        },
        {
          _id: "t2",
          date: "2024-01-10",
          type: "Purchase",
          amount: 189000,
          description: "Gold 22K purchase",
          status: "Completed"
        },
        {
          _id: "t3",
          date: "2024-01-05",
          type: "Purchase",
          amount: 95000,
          description: "Silver 999 purchase",
          status: "Completed"
        }
      ];

      const mockInvoices = [
        {
          _id: "i1",
          invoiceNumber: "INV-2024-001",
          date: "2024-01-15",
          amount: 245000,
          status: "Paid",
          dueDate: "2024-01-20"
        },
        {
          _id: "i2",
          invoiceNumber: "INV-2024-002",
          date: "2024-01-10",
          amount: 189000,
          status: "Paid",
          dueDate: "2024-01-15"
        },
        {
          _id: "i3",
          invoiceNumber: "INV-2024-003",
          date: "2024-01-05",
          amount: 95000,
          status: "Paid",
          dueDate: "2024-01-10"
        }
      ];

      setCustomerHistory({
        transactions: mockTransactions,
        invoices: mockInvoices
      });
    } catch (error) {
      console.error('Error fetching customer history:', error);
      setCustomerHistory({ transactions: [], invoices: [] });
    }
  };

  const handleBackToList = () => {
    setSelectedCustomer(null);
    setActiveTab("list");
    setCustomerHistory([]);
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Static mock data for customers
      const mockCustomers = [
        {
          _id: "1",
          name: "Rajesh Kumar",
          email: "rajesh.kumar@email.com",
          phone: "+91-9876543210",
          address: "123 MG Road",
          city: "Bangalore",
          state: "Karnataka",
          zipCode: "560001",
          gstin: "29AAAAA0000A1Z5"
        },
        {
          _id: "2",
          name: "Priya Sharma",
          email: "priya.sharma@email.com",
          phone: "+91-9876543211",
          address: "456 Brigade Road",
          city: "Bangalore",
          state: "Karnataka",
          zipCode: "560025",
          gstin: "29BBBBB0000B1Z6"
        },
        {
          _id: "3",
          name: "Amit Singh",
          email: "amit.singh@email.com",
          phone: "+91-9876543212",
          address: "789 Commercial Street",
          city: "Bangalore",
          state: "Karnataka",
          zipCode: "560001",
          gstin: "29CCCCC0000C1Z7"
        },
        {
          _id: "4",
          name: "Sneha Patel",
          email: "sneha.patel@email.com",
          phone: "+91-9876543213",
          address: "321 Residency Road",
          city: "Bangalore",
          state: "Karnataka",
          zipCode: "560025",
          gstin: "29DDDDD0000D1Z8"
        },
        {
          _id: "5",
          name: "Vikram Rao",
          email: "vikram.rao@email.com",
          phone: "+91-9876543214",
          address: "654 Cunningham Road",
          city: "Bangalore",
          state: "Karnataka",
          zipCode: "560052",
          gstin: "29EEEEE0000E1Z9"
        }
      ];

      setCustomers(mockCustomers);
      setFilteredCustomers(mockCustomers);
    } catch (err) {
      setErrorMessage("Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      // Simulate adding customer with static data
      const newCustomer = {
        _id: Date.now().toString(), // Simple ID generation
        ...formData
      };

      setCustomers((prev) => [...prev, newCustomer]);
      setFilteredCustomers((prev) => [...prev, newCustomer]);

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        gstin: "",
      });
      setShowForm(false);
    } catch (err) {
      setErrorMessage(err.message || "Unable to save customer");
    }
  };

  const handleDelete = async (id) => {
    setErrorMessage("");
    try {
      // Update local state instead of API call
      setCustomers((prev) => prev.filter((customer) => customer._id !== id));
      setFilteredCustomers((prev) => prev.filter((customer) => customer._id !== id));
    } catch (err) {
      setErrorMessage(err.message || "Unable to delete customer");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[290px] overflow-x-hidden">
        <Header />
        <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">
                {activeTab === "list" ? "Customers" : `Customer: ${selectedCustomer?.name}`}
              </h2>
              {activeTab === "list" ? (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
                >
                  <AiOutlinePlus size={18} />
                  Add Customer
                </button>
              ) : (
                <button
                  onClick={handleBackToList}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-semibold"
                >
                  Back to List
                </button>
              )}
            </div>

            {/* Add Customer Form */}
            {showForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Add New Customer
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GSTIN
                    </label>
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2 flex gap-3">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
                    >
                      Save Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'list' && (
              /* Search Bar */
              <div className="mb-4">
                <div className="relative max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search customers by name, email, phone, or city..."
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                  />
                  <CiSearch className="absolute top-2.5 left-3 text-gray-400" />
                </div>
              </div>
            )}

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      City
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      GSTIN
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.city}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.gstin}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          <button className="text-blue-500 hover:text-blue-700 transition">
                            <FaRegEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(customer._id)}
                            className="text-red-500 hover:text-red-700 transition"
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

            {filteredCustomers.length === 0 && !loading && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500 text-lg">No customers found. Add a new customer to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;