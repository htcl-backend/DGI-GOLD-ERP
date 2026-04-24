import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useAuth } from '../../Contexts/AuthContext';
import { FaUsers, FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

const VendorStaff = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('list');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [staffList, setStaffList] = useState([
        {
            id: 1,
            name: 'Rajesh Kumar',
            email: 'rajesh@vendor.com',
            role: 'VENDOR_OPERATIONS',
            status: 'active',
            joinDate: '2024-01-15',
            permissions: ['Product Management', 'Inventory'],
        },
        {
            id: 2,
            name: 'Priya Sharma',
            email: 'priya@vendor.com',
            role: 'VENDOR_FINANCE',
            status: 'active',
            joinDate: '2024-02-20',
            permissions: ['Wallet Management', 'Reports', 'Analytics'],
        },
        {
            id: 3,
            name: 'Amit Singh',
            email: 'amit@vendor.com',
            role: 'VENDOR_SUPPORT',
            status: 'active',
            joinDate: '2024-03-10',
            permissions: ['Customer Support', 'Orders'],
        },
    ]);

    const [newStaff, setNewStaff] = useState({
        name: '',
        email: '',
        role: 'VENDOR_OPERATIONS',
    });

    const roleDescriptions = {
        VENDOR_OWNER: 'Full access to all endpoints',
        VENDOR_FINANCE: 'Analytics, Reports, Wallet transactions',
        VENDOR_OPERATIONS: 'Products, Categories, Inventory',
        VENDOR_SUPPORT: 'Customer holdings, transactions',
        VENDOR_STAFF: 'Limited based on assigned role',
    };

    const handleInviteStaff = () => {
        if (!newStaff.name || !newStaff.email) {
            alert('Please fill all fields');
            return;
        }

        const staff = {
            id: staffList.length + 1,
            ...newStaff,
            status: 'pending',
            joinDate: new Date().toISOString().split('T')[0],
            permissions: getRolePermissions(newStaff.role),
        };

        setStaffList([...staffList, staff]);
        setNewStaff({ name: '', email: '', role: 'VENDOR_OPERATIONS' });
        setShowInviteModal(false);
        alert('Staff invitation sent!');
    };

    const getRolePermissions = (role) => {
        const permissions = {
            VENDOR_OPERATIONS: ['Product Management', 'Inventory', 'Categories'],
            VENDOR_FINANCE: ['Wallet Management', 'Reports', 'Analytics', 'Transactions'],
            VENDOR_SUPPORT: ['Customer Support', 'Orders', 'Transactions'],
            VENDOR_STAFF: ['Limited Features'],
        };
        return permissions[role] || [];
    };

    const removeStaff = (id) => {
        setStaffList(staffList.filter(staff => staff.id !== id));
    };

    const updateRole = (id, newRole) => {
        setStaffList(
            staffList.map(staff =>
                staff.id === id
                    ? { ...staff, role: newRole, permissions: getRolePermissions(newRole) }
                    : staff
            )
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-4 sm:p-6 lg:p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8 flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaUsers className="text-blue-600" /> Staff Management
                                </h1>
                                <p className="text-gray-600 mt-2">Manage your team and assign roles</p>
                            </div>
                            <button
                                onClick={() => setShowInviteModal(true)}
                                className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
                            >
                                <FaPlus /> Invite Staff
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <StatCard
                                title="Total Staff"
                                value={staffList.length.toString()}
                                icon="👥"
                                color="bg-blue-50"
                            />
                            <StatCard
                                title="Active"
                                value={staffList.filter(s => s.status === 'active').length.toString()}
                                icon="✅"
                                color="bg-green-50"
                            />
                            <StatCard
                                title="Pending Invitations"
                                value={staffList.filter(s => s.status === 'pending').length.toString()}
                                icon="⏳"
                                color="bg-yellow-50"
                            />
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-lg card-shadow mb-8">
                            <div className="border-b border-gray-200 flex">
                                {['list', 'roles', 'activity'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-4 font-medium text-center transition ${activeTab === tab
                                                ? 'text-blue-600 border-b-2 border-blue-600'
                                                : 'text-gray-600 hover:text-gray-800'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                {activeTab === 'list' && (
                                    <div className="space-y-4">
                                        {staffList.map((staff) => (
                                            <div key={staff.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-semibold text-gray-800">{staff.name}</h4>
                                                        <p className="text-sm text-gray-600">{staff.email}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${staff.status === 'active'
                                                                ? 'text-green-700 bg-green-100'
                                                                : 'text-yellow-700 bg-yellow-100'
                                                            }`}>
                                                            {staff.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                                        <select
                                                            value={staff.role}
                                                            onChange={(e) => updateRole(staff.id, e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            {Object.keys(roleDescriptions).map((role) => (
                                                                <option key={role} value={role}>
                                                                    {role}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <p className="text-xs text-gray-500 mt-2">{roleDescriptions[staff.role]}</p>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {staff.permissions.map((perm, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-blue-700 bg-blue-100"
                                                                >
                                                                    {perm}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                                    <p className="text-xs text-gray-500">Joined: {staff.joinDate}</p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => removeStaff(staff.id)}
                                                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition"
                                                        >
                                                            <FaTrash size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'roles' && (
                                    <div className="space-y-4">
                                        {Object.entries(roleDescriptions).map(([role, description]) => (
                                            <div key={role} className="border border-gray-200 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-800 mb-2">{role}</h4>
                                                <p className="text-gray-600 text-sm">{description}</p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Staff with this role: {staffList.filter(s => s.role === role).length}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'activity' && (
                                    <div className="space-y-3">
                                        <div className="text-center py-8 text-gray-500">
                                            <p>Staff activity tracking coming soon</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Invite Staff Member</h3>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={newStaff.name}
                                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                                    placeholder="Enter staff name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={newStaff.email}
                                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                                    placeholder="Enter email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                <select
                                    value={newStaff.role}
                                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Object.keys(roleDescriptions).map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-2">{roleDescriptions[newStaff.role]}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleInviteStaff}
                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Send Invitation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className={`${color} rounded-lg p-6 border border-gray-200`}>
        <div className="flex justify-between items-center">
            <div>
                <p className="text-gray-600 text-sm font-medium">{title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
            </div>
            <span className="text-4xl">{icon}</span>
        </div>
    </div>
);

export default VendorStaff;
