import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";

const DeliveryManagement = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
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
                }
            ];

            setDeliveries(mockDeliveries);
        } catch (error) {
            console.error('Error fetching deliveries:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateDeliveryStatus = async (id, status) => {
        try {
            // Update local state instead of API call
            setDeliveries(prevDeliveries =>
                prevDeliveries.map(delivery =>
                    delivery.id === id ? { ...delivery, status } : delivery
                )
            );
        } catch (error) {
            console.error('Error updating delivery:', error);
        }
    };

    if (loading) {
        return (
            <div>
                <Sidebar />
                <div className="w-full ml-[290px]">
                    <Header />
                    <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                        <div className="text-xl">Loading deliveries...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Sidebar />
            <div className="w-full ml-[290px]">
                <Header />
                <div className="p-6 bg-gray-50 min-h-screen">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Delivery Management</h2>

                    {/* Deliveries Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Pending Deliveries
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Material
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Weight
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {deliveries.map((delivery) => (
                                        <tr key={delivery._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {delivery._id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {delivery.customerName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {delivery.material}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {delivery.weight}g
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {delivery.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${delivery.delivered
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                    }`}>
                                                    {delivery.delivered ? "Delivered" : "Pending"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {!delivery.delivered && (
                                                    <button
                                                        onClick={() => updateDeliveryStatus(delivery._id, true)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Mark as Delivered
                                                    </button>
                                                )}
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
    );
};

export default DeliveryManagement;