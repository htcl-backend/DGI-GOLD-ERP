import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import Pagination from "../components/Pagination";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { NavLink } from "react-router-dom";
import { CiExport, CiSearch } from "react-icons/ci";
import { useData } from "../contexts/DataContext";

const pageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Orders = () => {
  const { orders, loading, error } = useData(); // Use data from context
  const [selected, setSelected] = useState("all"); // 'all' is a better default
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  const handleClick = (status) => {
    setSelected(status);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      filterAndSetOrders(selected);
    } else {
      const lowercasedTerm = term.toLowerCase();
      const filtered = filteredOrders.filter(order =>
        order.customerName?.toLowerCase().includes(lowercasedTerm) ||
        order.productName?.toLowerCase().includes(lowercasedTerm) ||
        order.id?.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredOrders(filtered);
    }
  };

  const filterAndSetOrders = (status) => {
    setSelected(status);
    if (status === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(o => o.status.toLowerCase() === status.toLowerCase()));
    }
  };

  useEffect(() => {
    // Initially load all orders, then filter based on the selected tab
    filterAndSetOrders(selected);
  }, [orders, selected]); // Rerun when original orders or selected tab changes

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Unable to load orders</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[290px] overflow-x-hidden">
        <Header />
        <div className="Dashboard1 p-5 min-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex justify-between my-3">
            <div className="flex gap-2.5 text-neutral-400">
              {[
                { key: "all", label: "All Orders" },
                { key: "Pending", label: "Pending" },
                { key: "Processing", label: "Processing" },
                { key: "Shipped", label: "Shipped" },
                { key: "Delivered", label: "Delivered" },
                { key: "Cancelled", label: "Cancelled" },
              ].map(tab => (
                <h2
                  key={tab.key}
                  className={`mb-5 cursor-pointer ${selected.toLowerCase() === tab.key.toLowerCase()
                    ? "text-amber-500 border-b border-amber-500"
                    : ""
                    }`}
                  onClick={() => filterAndSetOrders(tab.key)}
                >
                  {tab.label}
                </h2>
              ))}
            </div>
            <div className="flex text-[#CC7B25] justify-between gap-6">
              <button className="flex items-center gap-1.5 border border-amber-300 rounded-2xl px-4 py-2 font-bold text-[#CC7B25] hover:bg-amber-100 transition">
                <CiExport className="text-lg" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search orders by customer, product, or order ID..."
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10"
              />
              <CiSearch className="absolute top-2.5 left-3 text-gray-400" />
            </div>
          </div>

          <table className="min-w-full border-collapse table-auto px-4">
            <thead className="text-neutral-600 bg-gray-100">
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th className="py-2 px-4 text-left" scope="col">
                  Order ID
                </th>
                <th className="py-2 px-4 text-left" scope="col">
                  Customer
                </th>
                <th className="py-2 px-4 text-left" scope="col">
                  Product
                </th>
                <th className="py-2 px-4 text-left" scope="col">
                  Order Value
                </th>
                <th className="py-2 px-4 text-left" scope="col">
                  Order Date
                </th>
                <th className="py-2 px-4 text-left" scope="col">
                  Status
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((item) => {
                const getStatusColor = (status) => {
                  switch (status?.toLowerCase()) {
                    case 'delivered': return 'text-green-500 bg-green-100';
                    case 'processing': return 'text-blue-500 bg-blue-100';
                    case 'shipped': return 'text-yellow-500 bg-yellow-100';
                    case 'pending': return 'text-orange-500 bg-orange-100';
                    case 'cancelled': return 'text-red-500 bg-red-100';
                    default: return 'text-gray-500 bg-gray-100';
                  }
                };
                const statusColor = getStatusColor(item.status);

                return (
                  <tr key={item.id} className="hover:bg-gray-100 text-sm">
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 font-bold text-neutral-900 ">
                      <NavLink to={`/orders/${item.id}`}>
                        {item.id}
                      </NavLink>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 ">
                      {item.customerName}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 ">
                      {item.productName}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 font-normal ">
                      ₹{item.totalPrice?.toLocaleString('en-IN') || '-'}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 text-neutral-500 ">
                      {new Date(item.orderDate).toLocaleDateString()}
                    </td>
                    <td className={`py-3 px-4 border-b border-gray-100 text-xs`}>
                      <span
                        className={`w-2 px-1.5 py-1 rounded-full ${statusColor}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <FaRegEdit className="text-base text-neutral-600" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default Orders;