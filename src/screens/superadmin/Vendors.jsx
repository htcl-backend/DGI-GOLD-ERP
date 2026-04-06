import React, { useMemo, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useData } from '../../contexts/DataContext';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';

const Vendors = () => {
    const { allVendors, allProducts, allOrders, setVendors, addVendor, updateVendor } = useData();
    const [searchText, setSearchText] = useState('');
    const [kycFilter, setKycFilter] = useState('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        gstin: '',
        assignedProducts: ['gold', 'silver']
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingVendor) {
            // Update existing vendor
            updateVendor(editingVendor.id, formData);
            setEditingVendor(null);
        } else {
            // Add new vendor
            addVendor(formData);
            setShowAddForm(false);
        }
        setFormData({
            name: '',
            email: '',
            phone: '',
            businessName: '',
            gstin: '',
            assignedProducts: ['gold', 'silver']
        });
    };

    const handleEdit = (vendor) => {
        setEditingVendor(vendor);
        setFormData({
            name: vendor.name,
            email: vendor.email,
            phone: vendor.phone,
            businessName: vendor.businessName,
            gstin: vendor.gstin,
            assignedProducts: vendor.assignedProducts
        });
    };

    const handleDelete = (vendorId) => {
        if (window.confirm('Are you sure you want to delete this vendor?')) {
            setVendors(prev => prev.filter(v => v.id !== vendorId));
        }
    };

    const getKycStatusColor = (status) => {
        switch (status) {
            case 'verified': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'rejected': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const kycSummary = useMemo(() => {
        return allVendors.reduce((acc, vendor) => {
            const s = (vendor.kycStatus || 'unknown').toLowerCase();
            if (s === 'verified') acc.verified++;
            else if (s === 'pending') acc.pending++;
            else if (s === 'rejected') acc.rejected++;
            else acc.unknown++;
            return acc;
        }, { verified: 0, pending: 0, rejected: 0, unknown: 0 });
    }, [allVendors]);

    const filteredVendors = useMemo(() => {
        return allVendors
            .filter((vendor) => {
                if (kycFilter !== 'all' && (vendor.kycStatus || '').toLowerCase() !== kycFilter) {
                    return false;
                }
                const q = searchText.trim().toLowerCase();
                if (!q) return true;
                return (
                    vendor.name?.toLowerCase().includes(q) ||
                    vendor.email?.toLowerCase().includes(q) ||
                    vendor.businessName?.toLowerCase().includes(q) ||
                    vendor.gstin?.toLowerCase().includes(q)
                );
            })
            .map((vendor) => {
                const productCount = allProducts.filter((p) => p.vendorId === vendor.id).length;
                const vendorOrders = allOrders.filter((o) => o.vendorId === vendor.id);
                const orderCount = vendorOrders.length;
                const totalRevenue = vendorOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
                return {
                    ...vendor,
                    productCount,
                    orderCount,
                    totalRevenue,
                };
            });
    }, [allVendors, allProducts, allOrders, kycFilter, searchText]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                            <h1 className="text-3xl font-bold text-gray-800">Vendors Management</h1>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 flex items-center gap-2"
                            >
                                <FaPlus /> Add Vendor
                            </button>
                        </div>

                        <div className="mb-4 flex flex-wrap gap-2">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Verified: {kycSummary.verified}</span>
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Pending: {kycSummary.pending}</span>
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Rejected: {kycSummary.rejected}</span>
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">Unknown: {kycSummary.unknown}</span>
                        </div>

                        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Search vendor by name, email, GSTIN, business..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400"
                            />
                            <select
                                value={kycFilter}
                                onChange={(e) => setKycFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                            >
                                <option value="all">All KYC</option>
                                <option value="verified">Verified</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => { setSearchText(''); setKycFilter('all'); }}
                                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* Add/Edit Form */}
                        {(showAddForm || editingVendor) && (
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
                                </h2>
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                        <input
                                            type="text"
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
                                        <input
                                            type="text"
                                            name="gstin"
                                            value={formData.gstin}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            required
                                        />
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <button
                                            type="submit"
                                            className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600"
                                        >
                                            {editingVendor ? 'Update' : 'Add'} Vendor
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddForm(false);
                                                setEditingVendor(null);
                                                setFormData({
                                                    name: '',
                                                    email: '',
                                                    phone: '',
                                                    businessName: '',
                                                    gstin: '',
                                                    assignedProducts: ['gold', 'silver']
                                                });
                                            }}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Vendors Table */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">All Vendors</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GSTIN</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredVendors.map((vendor) => (
                                            <tr key={vendor.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{vendor.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{vendor.email}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{vendor.businessName}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{vendor.gstin || '-'}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycStatusColor(vendor.kycStatus)}`}>
                                                        {vendor.kycStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{vendor.productCount || 0}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{vendor.orderCount || 0}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">₹{(vendor.totalRevenue || 0).toLocaleString('en-IN')}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(vendor)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(vendor.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <FaTrash />
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
};

export default Vendors;
