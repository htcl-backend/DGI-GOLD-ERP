import React, { useMemo, useState } from 'react';
import Sidebar from '../components/SidebarNew';
import Header from '../components/Header';
import { useData } from '../Contexts/DataContext';

const Vendors = () => {
    const { allVendors, allProducts, allOrders } = useData();
    const [searchText, setSearchText] = useState('');
    const [kycFilter, setKycFilter] = useState('all');

    const kycSummary = useMemo(() => {
        return allVendors.reduce(
            (acc, vendor) => {
                const status = (vendor.kycStatus || 'unknown').toLowerCase();
                if (status === 'verified') acc.verified++;
                else if (status === 'pending') acc.pending++;
                else if (status === 'rejected') acc.rejected++;
                else acc.unknown++;
                return acc;
            },
            { verified: 0, pending: 0, rejected: 0, unknown: 0 }
        );
    }, [allVendors]);

    const filteredVendors = useMemo(() => {
        return allVendors
            .filter((vendor) => {
                if (kycFilter !== 'all' && vendor.kycStatus?.toLowerCase() !== kycFilter) {
                    return false;
                }
                const query = searchText.trim().toLowerCase();
                if (!query) return true;
                return (
                    vendor.name?.toLowerCase().includes(query) ||
                    vendor.email?.toLowerCase().includes(query) ||
                    vendor.businessName?.toLowerCase().includes(query) ||
                    vendor.gstin?.toLowerCase().includes(query)
                );
            })
            .map((vendor) => {
                const vendorProducts = allProducts.filter((p) => p.vendorId === vendor.id);
                const vendorOrders = allOrders.filter((o) => o.vendorId === vendor.id);
                const totalOrderValue = vendorOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
                return {
                    ...vendor,
                    productCount: vendorProducts.length,
                    orderCount: vendorOrders.length,
                    totalOrderValue,
                };
            });
    }, [allVendors, allProducts, allOrders, searchText, kycFilter]);

    const handleConnect = (vendor) => {
        window.alert(`Connect action for ${vendor.name || vendor.businessName || vendor.email}`);
    };

    return (
        <div>
            <Sidebar />
            <div className="w-full ml-[290px]">
                <Header />
                <div className="p-6 bg-gray-50 min-h-screen">
                    <h1 className="text-3xl font-bold mb-4">Vendors</h1>

                    <div className="mb-4 flex flex-wrap gap-3">
                        <div className="px-3 py-2 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Verified: {kycSummary.verified}</div>
                        <div className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pending: {kycSummary.pending}</div>
                        <div className="px-3 py-2 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Rejected: {kycSummary.rejected}</div>
                        <div className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">Unknown: {kycSummary.unknown}</div>
                    </div>

                    <div className="mb-4 flex flex-col md:flex-row gap-3 items-start md:items-center">
                        <input
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search vendor by name, email, GSTIN, business..."
                            className="w-full md:w-80 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <select
                            value={kycFilter}
                            onChange={(e) => setKycFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 outline-none"
                        >
                            <option value="all">All KYC</option>
                            <option value="verified">Verified</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <table className="min-w-full text-left text-sm font-light">
                            <thead className="border-b bg-gray-100 font-medium">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Business</th>
                                    <th className="px-4 py-3">GSTIN</th>
                                    <th className="px-4 py-3">KYC Status</th>
                                    <th className="px-4 py-3">Product Count</th>
                                    <th className="px-4 py-3">Orders</th>
                                    <th className="px-4 py-3">Order Value</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVendors.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-5 text-center text-gray-500">
                                            No vendor found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVendors.map((vendor) => (
                                        <tr key={vendor.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">{vendor.name}</td>
                                            <td className="px-4 py-3">{vendor.email}</td>
                                            <td className="px-4 py-3">{vendor.businessName || '-'}</td>
                                            <td className="px-4 py-3">{vendor.gstin || '-'}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${vendor.kycStatus === 'verified'
                                                        ? 'bg-green-100 text-green-700'
                                                        : vendor.kycStatus === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : vendor.kycStatus === 'rejected'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    {vendor.kycStatus || 'unknown'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">{vendor.productCount}</td>
                                            <td className="px-4 py-3">{vendor.orderCount}</td>
                                            <td className="px-4 py-3">₹{vendor.totalOrderValue?.toLocaleString('en-IN') || 0}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleConnect(vendor)}
                                                    className="px-3 py-1 text-xs font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                                >
                                                    Connect
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Vendors;

