import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";

const OrdersDetails = () => {
  const [orders] = useState([
    {
      id: 1,
      company_name: "Mahesh",
      manager: "Bhima",
      order_value: "₹4,66,000",
      order_date: "10/07/2023",
      status: "New",
      delivered: "No",
    },
    {
      id: 2,
      company_name: "Titan Hyd",
      manager: "SmoozeShift",
      order_value: "₹4,66,000",
      order_date: "24/07/2023",
      status: "In-progress",
      delivered: "No",
    },
    {
      id: 3,
      company_name: "Kalyan Nellore",
      manager: "Prime Time Telecom",
      order_value: "₹4,66,000",
      order_date: "08/08/2023",
      status: "In-progress",
      delivered: "No",
    },
    {
      id: 4,
      company_name: "GRT Chennai",
      manager: "OmniTech Corporation",
      order_value: "₹4,66,000",
      order_date: "31/08/2023",
      status: "Delivered",
      delivered: "Yes",
    },
    {
      id: 5,
      company_name: "Mukesh Jewellers",
      manager: "DataStream Inc.",
      order_value: "₹4,66,000",
      order_date: "01/05/2023",
      status: "Completed",
      delivered: "Yes",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "In-progress":
        return "bg-yellow-100 text-yellow-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Details</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Company Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Manager
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Order Value
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Order Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Delivered
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-800">
                  {order.company_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {order.manager}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                  {order.order_value}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {order.order_date}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.delivered === "Yes"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.delivered}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button className="text-blue-500 hover:text-blue-700 transition">
                      <FaRegEdit size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-700 transition">
                      <AiOutlineDelete size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersDetails;
