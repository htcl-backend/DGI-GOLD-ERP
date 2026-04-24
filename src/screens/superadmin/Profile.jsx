import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../Contexts/AuthContext";
import { FaUser, FaLock, FaBell, FaSave, FaEye, FaEyeSlash, FaUpload, FaShieldAlt, FaGlobe, FaClipboardList, FaPalette } from "react-icons/fa";

const SuperAdminProfile = () => {
    const navigate = useNavigate();
    const { user, isSuperAdmin } = useAuth();

    // Redirect if not super admin
    useEffect(() => {
        if (!isSuperAdmin) {
            navigate("/vendor/profile");
        } else if (!user) {
            navigate("/signin");
        }
    }, [user, isSuperAdmin, navigate]);

    const [activeTab, setActiveTab] = useState("basic");
    const [showPassword, setShowPassword] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const [basicInfo, setBasicInfo] = useState({
        fullName: user?.name || "Vikram Singh",
        email: user?.email || "admin@dgiGold.com",
        phone: user?.phone || "+91-98765-00001",
        username: user?.id || "admin_vikram",
        role: "Super Admin",
        profilePhoto: null,
        profilePhotoUrl: "https://via.placeholder.com/120"
    });

    // Update basicInfo when user data changes
    useEffect(() => {
        if (user) {
            setBasicInfo(prev => ({
                ...prev,
                fullName: user.name || prev.fullName,
                email: user.email || prev.email,
                phone: user.phone || prev.phone,
                username: user.id || prev.username
            }));
        }
    }, [user]);

    const [adminInfo, setAdminInfo] = useState({
        adminLevel: "Super Admin",
        department: "Operations",
        employeeId: "EMP-2024-0001"
    });

    const [accessPermissions, setAccessPermissions] = useState({
        dashboardAccess: true,
        vendorManagement: true,
        kyc: true,
        orderManagement: true,
        reportAccess: true,
        rateManagement: true,
        userManagement: true,
        systemSettings: true
    });

    const [systemSettings, setSystemSettings] = useState({
        defaultGoldRateSource: "MCX",
        defaultSilverRateSource: "MCX",
        rateUpdateFrequency: "Real-time",
        gstSlabSettings: "5% - 12% - 18% - 28%",
        systemCurrency: "INR",
        timezone: "IST (UTC+5:30)"
    });

    const [activityInfo, setActivityInfo] = useState({
        lastLogin: "2024-04-09 09:15",
        lastLoginIP: "192.168.1.100",
        lastLoginDevice: "Windows 11 - Chrome",
        loginHistory: [
            { date: "2024-04-09", time: "09:15", ip: "192.168.1.100", device: "Windows 11 - Chrome" },
            { date: "2024-04-08", time: "14:45", ip: "192.168.1.105", device: "Mac - Safari" },
            { date: "2024-04-07", time: "11:20", ip: "203.0.113.42", device: "iPhone 13 - Safari" }
        ]
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsAlerts: true,
        lowStockAlerts: true,
        rateChangeAlerts: true,
        orderNotifications: true,
        systemAlerts: true,
        vendorAlerts: true
    });

    const handleBasicInfoChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleAdminInfoChange = (e) => {
        const { name, value } = e.target;
        setAdminInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleAccessPermissionChange = (e) => {
        const { name, checked } = e.target;
        setAccessPermissions(prev => ({ ...prev, [name]: checked }));
    };

    const handleSystemSettingsChange = (e) => {
        const { name, value } = e.target;
        setSystemSettings(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setNotificationSettings(prev => ({ ...prev, [name]: checked }));
    };

    const handleSaveProfile = async () => {
        setSaveLoading(true);
        try {
            // API call would go here
            console.log("Saving super admin profile...", {
                basicInfo,
                adminInfo,
                accessPermissions,
                systemSettings,
                notificationSettings
            });
            setEditMode(false);
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setSaveLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        setSaveLoading(true);
        try {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            // API call would go here
            console.log("Updating password...");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            alert("Password updated successfully!");
        } catch (error) {
            console.error("Error updating password:", error);
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-[290px]">
                <Header />
                <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Super Admin Profile</h1>
                                <p className="text-gray-600 text-sm mt-1">Manage admin account and system settings</p>
                            </div>
                            {!editMode && (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-lg shadow-sm p-2 overflow-x-auto">
                            {[
                                { id: "basic", label: "Basic Info", icon: FaUser },
                                { id: "admin", label: "Admin Info", icon: FaShieldAlt },
                                { id: "access", label: "Permissions", icon: FaClipboardList },
                                { id: "system", label: "System", icon: FaGlobe },
                                { id: "activity", label: "Activity", icon: FaGlobe },
                                { id: "security", label: "Security", icon: FaLock },
                                { id: "notifications", label: "Notifications", icon: FaBell },
                                { id: "settings", label: "Settings", icon: FaPalette }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === tab.id
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white rounded-lg shadow-md">
                            {/* BASIC INFO TAB */}
                            {activeTab === "basic" && (
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>

                                    {/* Profile Photo */}
                                    <div className="mb-8">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                                            <div className="flex flex-col items-center">
                                                <img
                                                    src={basicInfo.profilePhotoUrl}
                                                    alt="Profile"
                                                    className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
                                                />
                                                {editMode && (
                                                    <label className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition text-sm flex items-center gap-2">
                                                        <FaUpload className="w-4 h-4" />
                                                        Upload Photo
                                                        <input type="file" className="hidden" />
                                                    </label>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Role Badge</p>
                                                <span className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium text-sm mt-1">
                                                    {basicInfo.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Basic Fields */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                        {[
                                            { label: "Full Name", name: "fullName", readonly: !editMode },
                                            { label: "Email Address", name: "email", readonly: true },
                                            { label: "Phone Number", name: "phone", readonly: !editMode },
                                            { label: "Username / ID", name: "username", readonly: true }
                                        ].map(field => (
                                            <div key={field.name}>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <FaUser className="inline mr-2" />
                                                    {field.label}
                                                </label>
                                                <input
                                                    type="text"
                                                    name={field.name}
                                                    value={basicInfo[field.name]}
                                                    onChange={handleBasicInfoChange}
                                                    readOnly={field.readonly}
                                                    className={`w-full px-4 py-2 border rounded-lg text-sm ${field.readonly
                                                        ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                                                        : "bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 border-gray-300"
                                                        }`}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {editMode && (
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saveLoading}
                                            className="mt-6 w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                                        >
                                            <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ADMIN INFO TAB */}
                            {activeTab === "admin" && (
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Admin Information</h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                                        {[
                                            { label: "Admin Level", name: "adminLevel", readonly: true, type: "select", options: ["Super Admin", "Admin"] },
                                            { label: "Department", name: "department", readonly: !editMode, type: "select", options: ["Operations", "Finance", "Support", "Technical"] },
                                            { label: "Employee ID", name: "employeeId", readonly: true }
                                        ].map(field => (
                                            <div key={field.name} className={field.colSpan === 2 ? "col-span-1 sm:col-span-2" : ""}>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <FaShieldAlt className="inline mr-2" />
                                                    {field.label}
                                                </label>
                                                {field.type === "select" ? (
                                                    <select
                                                        name={field.name}
                                                        value={adminInfo[field.name]}
                                                        onChange={handleAdminInfoChange}
                                                        disabled={field.readonly}
                                                        className={`w-full px-4 py-2 border rounded-lg text-sm ${field.readonly
                                                            ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                                                            : "bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 border-gray-300"
                                                            }`}
                                                    >
                                                        {field.options.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        name={field.name}
                                                        value={adminInfo[field.name]}
                                                        onChange={handleAdminInfoChange}
                                                        readOnly={field.readonly}
                                                        className={`w-full px-4 py-2 border rounded-lg text-sm ${field.readonly
                                                            ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                                                            : "bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 border-gray-300"
                                                            }`}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {editMode && (
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saveLoading}
                                            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                                        >
                                            <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ACCESS & PERMISSIONS TAB */}
                            {activeTab === "access" && (
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Module Access & Permissions</h2>

                                    <div className="space-y-3 mb-6">
                                        {[
                                            { name: "dashboardAccess", label: "Dashboard Access", description: "View main dashboard" },
                                            { name: "vendorManagement", label: "Vendor Management", description: "Add, edit, manage vendors" },
                                            { name: "kyc", label: "KYC Approvals", description: "Approve/reject KYC requests" },
                                            { name: "orderManagement", label: "Order Management", description: "View and manage all orders" },
                                            { name: "reportAccess", label: "Report Access", description: "View and export reports" },
                                            { name: "rateManagement", label: "Rate Management", description: "Set and manage gold/silver rates" },
                                            { name: "userManagement", label: "User Management", description: "Manage admin and vendor accounts" },
                                            { name: "systemSettings", label: "System Settings", description: "Configure system-wide settings" }
                                        ].map(perm => (
                                            <label key={perm.name} className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                                <input
                                                    type="checkbox"
                                                    name={perm.name}
                                                    checked={accessPermissions[perm.name]}
                                                    onChange={handleAccessPermissionChange}
                                                    disabled={!editMode}
                                                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div className="ml-4 flex-1">
                                                    <p className="font-medium text-gray-900">{perm.label}</p>
                                                    <p className="text-sm text-gray-600">{perm.description}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    {editMode && (
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saveLoading}
                                            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                                        >
                                            <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* SYSTEM SETTINGS TAB */}
                            {activeTab === "system" && (
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">System Settings</h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                                        {[
                                            { label: "Default Gold Rate Source", name: "defaultGoldRateSource", readonly: !editMode, type: "select", options: ["MCX", "Manual", "Live API"] },
                                            { label: "Default Silver Rate Source", name: "defaultSilverRateSource", readonly: !editMode, type: "select", options: ["MCX", "Manual", "Live API"] },
                                            { label: "Rate Update Frequency", name: "rateUpdateFrequency", readonly: !editMode, type: "select", options: ["Real-time", "Hourly", "Daily", "Manual"] },
                                            { label: "GST Slab Settings", name: "gstSlabSettings", readonly: !editMode },
                                            { label: "System Currency", name: "systemCurrency", readonly: true },
                                            { label: "Timezone", name: "timezone", readonly: true }
                                        ].map(field => (
                                            <div key={field.name}>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {field.label}
                                                </label>
                                                {field.type === "select" ? (
                                                    <select
                                                        name={field.name}
                                                        value={systemSettings[field.name]}
                                                        onChange={handleSystemSettingsChange}
                                                        disabled={field.readonly}
                                                        className={`w-full px-4 py-2 border rounded-lg text-sm ${field.readonly
                                                            ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                                                            : "bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 border-gray-300"
                                                            }`}
                                                    >
                                                        {field.options.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        name={field.name}
                                                        value={systemSettings[field.name]}
                                                        onChange={handleSystemSettingsChange}
                                                        readOnly={field.readonly}
                                                        className={`w-full px-4 py-2 border rounded-lg text-sm ${field.readonly
                                                            ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                                                            : "bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 border-gray-300"
                                                            }`}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                        <p className="text-sm text-blue-800">
                                            <strong>Note:</strong> System settings changes will affect all vendors and customers immediately.
                                        </p>
                                    </div>

                                    {editMode && (
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saveLoading}
                                            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                                        >
                                            <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ACTIVITY INFO TAB */}
                            {activeTab === "activity" && (
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Activity Information</h2>

                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
                                        <h3 className="font-semibold text-gray-900 mb-4">Last Login Details</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-600 font-medium mb-1">DATE & TIME</p>
                                                <p className="text-lg font-semibold text-gray-900">{activityInfo.lastLogin}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600 font-medium mb-1">IP ADDRESS</p>
                                                <p className="text-lg font-semibold text-gray-900">{activityInfo.lastLoginIP}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600 font-medium mb-1">DEVICE</p>
                                                <p className="text-lg font-semibold text-gray-900">{activityInfo.lastLoginDevice}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="font-semibold text-gray-900 mb-4">Login History</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-100 border-b border-gray-300">
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Time</th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">IP Address</th>
                                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Device</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {activityInfo.loginHistory.map((entry, idx) => (
                                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-900">{entry.date}</td>
                                                        <td className="px-4 py-3 text-gray-900">{entry.time}</td>
                                                        <td className="px-4 py-3 text-gray-900 font-mono text-xs">{entry.ip}</td>
                                                        <td className="px-4 py-3 text-gray-900 text-xs">{entry.device}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* SECURITY TAB */}
                            {activeTab === "security" && (
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>

                                    <div className="max-w-md space-y-4">
                                        {[
                                            { label: "Current Password", name: "currentPassword", type: "password" },
                                            { label: "New Password", name: "newPassword", type: "password" },
                                            { label: "Confirm New Password", name: "confirmPassword", type: "password" }
                                        ].map(field => (
                                            <div key={field.name}>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <FaLock className="inline mr-2" />
                                                    {field.label}
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={field.name === "currentPassword" || showPassword ? "text" : "password"}
                                                        name={field.name}
                                                        value={passwordData[field.name]}
                                                        onChange={handlePasswordChange}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    {field.name !== "currentPassword" && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-2.5 text-gray-600"
                                                        >
                                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handlePasswordUpdate}
                                        disabled={saveLoading}
                                        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 flex items-center gap-2"
                                    >
                                        <FaLock /> {saveLoading ? "Updating..." : "Update Password"}
                                    </button>
                                </div>
                            )}

                            {/* NOTIFICATIONS TAB */}
                            {activeTab === "notifications" && (
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>

                                    <div className="space-y-4">
                                        {[
                                            { name: "emailNotifications", label: "Email Notifications", description: "Receive admin alerts via email" },
                                            { name: "smsAlerts", label: "SMS Alerts", description: "Receive critical alerts via SMS" },
                                            { name: "lowStockAlerts", label: "Low Stock Alerts", description: "Get notified for low inventory across platform" },
                                            { name: "rateChangeAlerts", label: "Rate Change Alerts", description: "Notify when rates change significantly" },
                                            { name: "orderNotifications", label: "Order Notifications", description: "High-value order alerts" },
                                            { name: "systemAlerts", label: "System Alerts", description: "Critical system issues and maintenance alerts" },
                                            { name: "vendorAlerts", label: "Vendor Alerts", description: "Vendor registration and KYC updates" }
                                        ].map(pref => (
                                            <label key={pref.name} className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                                <input
                                                    type="checkbox"
                                                    name={pref.name}
                                                    checked={notificationSettings[pref.name]}
                                                    onChange={handleNotificationChange}
                                                    className="w-5 h-5 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div className="ml-4 flex-1">
                                                    <p className="font-medium text-gray-900">{pref.label}</p>
                                                    <p className="text-sm text-gray-600">{pref.description}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={saveLoading}
                                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center gap-2"
                                    >
                                        <FaSave /> {saveLoading ? "Saving..." : "Save Preferences"}
                                    </button>
                                </div>
                            )}

                            {/* SETTINGS TAB */}
                            {activeTab === "settings" && (
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Settings</h2>

                                    <div className="space-y-6">
                                        {/* Theme Settings */}
                                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
                                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <FaPalette className="text-amber-600" />
                                                Theme
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">Dark Mode</p>
                                                    <p className="text-sm text-gray-600">Switch to dark theme for better visibility in low-light environments</p>
                                                </div>
                                                <button className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium">
                                                    Light
                                                </button>
                                            </div>
                                        </div>

                                        {/* Platform Administration */}
                                        <div className="border border-gray-200 rounded-lg p-6">
                                            <h3 className="font-semibold text-gray-900 mb-4">System Administration</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-gray-900">Admin Status</p>
                                                        <p className="text-sm text-gray-600">Your admin account is fully active</p>
                                                    </div>
                                                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium text-sm">Active</span>
                                                </div>
                                                <div className="border-t border-gray-200 pt-4">
                                                    <p className="font-medium text-gray-900">Session Management</p>
                                                    <p className="text-sm text-gray-600 mb-3">Logout all sessions and re-login to refresh permissions</p>
                                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                                        Clear All Sessions
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminProfile;
