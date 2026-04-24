    import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import apiService from "../service/apiService";

const VendorStaffManagement = ({ vendorId = "vendor_abc" }) => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        role: "VENDOR_OPERATIONS",
        password: ""
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch staff list
    const fetchStaff = async () => {
        try {
            setLoading(true);
            console.log("🔄 Fetching staff list...");
            const result = await apiService.request(
                `/auth/seek?collection=users&tenantId=${vendorId}&role=VENDOR_OPERATIONS`,
                'GET'
            );

            console.log("📦 Full Staff Response:", result);

            if (result && result.success && result.data) {
                const staffData = Array.isArray(result.data) ? result.data : result.data.data || [];
                setStaff(staffData);
                console.log("✅ Staff loaded:", staffData.length);
            } else {
                console.error("❌ Invalid response structure:", result);
                setStaff([]);
            }
        } catch (error) {
            console.error("🔴 Error fetching staff:", error.message);
            setStaff([]);
            setErrorMessage("Failed to load staff list");
        } finally {
            setLoading(false);
        }
    };

    // Invite new staff
    const handleInviteStaff = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            console.log("📤 Inviting staff:", formData);

            const payload = {
                email: formData.email.trim(),
                name: formData.name.trim(),
                role: formData.role,
                password: formData.password
            };

            // Validate
            if (!payload.email || !payload.name || !payload.password) {
                setErrorMessage("Please fill all fields");
                setLoading(false);
                return;
            }

            const result = await apiService.request(
                `/auth/vendors/${vendorId}/invite-staff`,
                'POST',
                payload
            );

            console.log("📍 API Response:", result);

            if (result && result.success) {
                setSuccessMessage("✅ Staff invited successfully!");
                setFormData({ email: "", name: "", role: "VENDOR_OPERATIONS", password: "" });
                setShowInviteForm(false);

                // Refresh staff list
                setTimeout(() => {
                    fetchStaff();
                    setSuccessMessage("");
                }, 2000);
            } else {
                const errorMsg = result?.error || result?.message || "Failed to invite staff";
                setErrorMessage("❌ " + errorMsg);
            }
        } catch (error) {
            console.error("🔴 Error inviting staff:", error.message);
            setErrorMessage("❌ " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter staff by search term
    const filteredStaff = staff.filter(s =>
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchStaff();
    }, []);

    return (
        <div>
            <div className="flex">
                <Sidebar />
                <div className="w-full ml-[290px]">
                    <Header />
                    <div className="p-6 bg-gray-50 min-h-screen">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-800">Vendor Staff Management</h2>
                            <button
                                onClick={() => setShowInviteForm(!showInviteForm)}
                                className={`px-6 py-2 rounded-lg font-medium transition ${showInviteForm
                                    ? "bg-gray-500 text-white hover:bg-gray-600"
                                    : "bg-amber-500 text-white hover:bg-amber-600"
                                    }`}
                            >
                                {showInviteForm ? "Cancel" : "+ Invite Staff"}
                            </button>
                        </div>

                        {/* Success/Error Messages */}
                        {successMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                                {successMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                                {errorMessage}
                            </div>
                        )}

                        {/* Invite Form */}
                        {showInviteForm && (
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Invite New Staff</h3>
                                <form onSubmit={handleInviteStaff} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="staff@example.com"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Staff Name"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Role
                                            </label>
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            >
                                                <option value="VENDOR_OPERATIONS">Vendor Operations</option>
                                                <option value="VENDOR_MANAGER">Vendor Manager</option>
                                                <option value="VENDOR_ACCOUNTANT">Vendor Accountant</option>
                                                <option value="VENDOR_SUPPORT">Vendor Support</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Password *
                                            </label>
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder="Temporary Password"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition font-medium disabled:bg-gray-400"
                                    >
                                        {loading ? "Sending Invitation..." : "Send Invitation"}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Staff List */}
                        <div className="bg-white rounded-lg shadow-md">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Staff Members ({staff.length})
                                </h3>
                                <input
                                    type="text"
                                    placeholder="Search by email, name, or role..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            {loading && !staff.length ? (
                                <div className="p-6 text-center text-gray-500">Loading staff...</div>
                            ) : filteredStaff.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Role
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Joined Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredStaff.map((member) => (
                                                <tr key={member.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm font-medium text-amber-600">
                                                        {member.email}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {member.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                            {member.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${member.isActive
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                            }`}>
                                                            {member.isActive ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {member.createdAt ? new Date(member.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-6 text-center text-gray-500">
                                    No staff members found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorStaffManagement;
