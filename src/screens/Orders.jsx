import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import Pagination from "../components/Pagination";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { NavLink } from "react-router-dom";
import { CiExport, CiSearch } from "react-icons/ci";
import { apiFetch } from "../api";

const pageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Orders = () => {
  const [selected, setSelected] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  const handleClick = (status) => {
    setSelected(status);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order =>
        order.company_name.toLowerCase().includes(term.toLowerCase()) ||
        order.manager.toLowerCase().includes(term.toLowerCase()) ||
        order.id.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  };

  const formatOrder = (order) => ({
    id: order._id,
    company_name: order.customerName || order.customer?.name || "-",
    manager: order.productName || order.product?.name || "-",
    order_value: order.totalPrice ? `₹${order.totalPrice}` : "-",
    order_date: order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "",
    status: order.status || "",
  });

  const mapStatusToApi = (status) => {
    if (status === "new") return "pending";
    if (status === "progress") return "processing";
    if (status === "dispatched") return "shipped";
    if (status === "Cancelled") return "cancelled";
    return status;
  };

  const fetchOrders = async (status) => {
    setLoading(true);
    setError("");
    try {
      const apiStatus = mapStatusToApi(status);
      const query = apiStatus && apiStatus !== "orders" ? `?status=${apiStatus}` : "";
      const result = await apiFetch(`/orders${query}`);
      const items = Array.isArray(result.orders) ? result.orders : [];
      const formattedOrders = items.map(formatOrder);
      setOrders(formattedOrders);
      setFilteredOrders(formattedOrders);
    } catch (err) {
      setError(err.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(selected);
  }, [selected]);

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
              <h2
                className={`mb-5 cursor-pointer ${selected === "orders"
                  ? "text-amber-500 border-b border-amber-500"
                  : ""
                  }`}
                onClick={() => handleClick("orders")}
              >
                All orders
              </h2>
              <h2
                className={`mb-5 cursor-pointer ${selected === "new"
                  ? "text-amber-500 border-b border-amber-500"
                  : ""
                  }`}
                onClick={() => handleClick("new")}
              >
                New
              </h2>
              <h2
                className={`mb-5 cursor-pointer ${selected === "delivered"
                  ? "text-amber-500 border-b border-amber-500"
                  : ""
                  }`}
                onClick={() => handleClick("delivered")}
              >
                Delivered
              </h2>

              <h2
                className={`mb-5 cursor-pointer ${selected === "progress"
                  ? "text-amber-500 border-b border-amber-500"
                  : ""
                  }`}
                onClick={() => handleClick("progress")}
              >
                In Progress
              </h2>
              <h2
                className={`mb-5 cursor-pointer ${selected === "dispatched"
                  ? "text-amber-500 border-b border-amber-500"
                  : ""
                  }`}
                onClick={() => handleClick("dispatched")}
              >
                Dispatched
              </h2>
              <h2
                className={`mb-5 cursor-pointer ${selected === "shipped"
                  ? "text-amber-500 border-b border-amber-500"
                  : ""
                  }`}
                onClick={() => handleClick("shipped")}
              >
                Shipped
              </h2>
              <h2
                className={`mb-5 cursor-pointer ${selected === "Cancelled"
                  ? "text-amber-500 border-b border-amber-500"
                  : ""
                  }`}
                onClick={() => handleClick("Cancelled")}
              >
                Cancelled
              </h2>
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
                placeholder="Search orders by company, manager, or order ID..."
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
                  Company Name
                </th>
                <th className="py-2 px-4 text-left" scope="col">
                  Manager
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
                const statusColor =
                  item.status === "New"
                    ? "text-blue-500 bg-blue-100"
                    : item.status === "Completed"
                      ? "text-green-500 bg-green-100"
                      : "text-orange-500 bg-orange-100";

                return (
                  <tr key={item.id} className="hover:bg-gray-100 text-sm">
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 font-bold text-neutral-900 ">
                      <NavLink to={`/order-details/${item.id}`}>
                        {item.company_name}
                      </NavLink>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 ">
                      {item.manager}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 font-normal ">
                      {item.order_value}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 text-neutral-500 ">
                      {item.order_date}
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
