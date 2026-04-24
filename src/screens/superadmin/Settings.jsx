import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../Contexts/AuthContext";
import { HeaderContext } from "../../Contexts/HeaderContext";
import { FaCog, FaGlobe, FaPercent, FaUsers, FaWarehouse, FaLock, FaCodeBranch, FaBell, FaUniversity, FaShieldAlt, FaSave } from "react-icons/fa";

const SuperAdminSettings = () => {
    const navigate = useNavigate();
    const { user, isSuperAdmin } = useAuth();
    const { theme } = useContext(HeaderContext);
    const [activeSection, setActiveSection] = useState("general");
    const [saveLoading, setSaveLoading] = useState(false);

    // Redirect if not super admin - optimized to prevent unnecessary renders
    useEffect(() => {
        if (!user) {
            navigate("/signin");
            return;
        }
        if (!isSuperAdmin) {
            navigate("/vendor/dashboard");
        }
    }, []);

    // General Settings
    const [generalSettings, setGeneralSettings] = useState({
        companyName: "DGI GOLD ERP",
        companyLogo: null,
        tagline: "Your Trusted Gold & Silver Trading Partner",
        financialYearStart: "April",
        currency: "INR",
        timezone: "IST (UTC+5:30)",
        dateFormat: "DD-MM-YYYY",
        language: "English"
    });

    // Rate/Market Settings
    const [rateSettings, setRateSettings] = useState({
        goldRateSource: "MCX",
        silverRateSource: "MCX",
        autoUpdateFrequency: "1hr",
        makingChargeDefault: 15,
        wastageDefault: 2,
        gstConfig: "Gold: 3%, Silver: 5%, Making: 5%"
    });

    // Vendor Management Settings
    const [vendorSettings, setVendorSettings] = useState({
        autoApproveVendors: false,
        requiredDocuments: ["GSTIN", "PAN", "Bank Details", "Hallmark License"],
        maxVendorsPerBranch: 50,
        defaultCommissionPercent: 0.5,
        accountExpiryMonths: 12
    });

    // Inventory Settings
    const [inventorySettings, setInventorySettings] = useState({
        lowStockThreshold: 100,
        valuationMethod: "FIFO",
        autoStockAlert: true,
        minPurityStandard: "14K",
        scrapWastagePercent: 2
    });

    // User & Role Settings
    const [userRoleSettings, setUserRoleSettings] = useState({
        roles: ["Admin", "Manager", "Vendor", "Cashier"],
        maxLoginSessions: 3,
        passwordResetPeriod: 90,
        twoFactorAuth: true
    });

    // Branch Settings
    const [branchSettings, setBranchSettings] = useState({
        totalBranches: 5,
        branches: [
            { id: 1, name: "Delhi Main", gst: "07AAACR1234H1Z0" },
            { id: 2, name: "Mumbai Branch", gst: "27AABCU1234H1Z0" }
        ]
    });

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        lowStockAlertThreshold: 100,
        rateChangeAlertPercent: 5,
        emailAlertsEnabled: true,
        smsAlertsEnabled: true,
        alertRecipients: ["admin@dgi.com", "manager@dgi.com"],
        dailyReportAutoSend: true
    });

    // Payment & Bank Settings
    const [paymentSettings, setPaymentSettings] = useState({
        companyBankAccounts: ["HDFC Bank - 123456789", "ICICI Bank - 987654321"],
        acceptedPaymentModes: ["Cash", "UPI", "Card", "NEFT"],
        paymentGateway: "Razorpay",
        vendorSettlementCycle: "Weekly"
    });

    // Tax & Compliance Settings
    const [taxSettings, setTaxSettings] = useState({
        companyGSTIN: "07AAACR1234H1Z0",
        goldHSNCode: "7108",
        silverHSNCode: "7106",
        tdsEnabled: true,
        eInvoiceIntegration: true,
        eWayBillIntegration: true
    });

    // Backup & Security Settings
    const [backupSettings, setBackupSettings] = useState({
        autoBackupFrequency: "Daily",
        backupStorageLocation: "Cloud",
        loginIPWhitelist: ["192.168.1.0/24"],
        sessionTimeout: 30,
        auditLogRetentionDays: 365
    });

    const handleSaveSettings = useCallback(async (section) => {
        setSaveLoading(true);
        try {
            // ✅ TODO: API INTEGRATION - Replace this with actual API call
            // API Endpoint: POST /api/superadmin/settings/{section}
            // const response = await apiClient.post(`/superadmin/settings/${section}`, {...settings});
            await new Promise(resolve => setTimeout(resolve, 500)); // Quick local save for now
            console.log(`✅ ${section} settings saved`);
        } catch (error) {
            console.error(`❌ Error saving ${section} settings:`, error);
        } finally {
            setSaveLoading(false);
        }
    }, []);

    const sections = [
        { id: "general", label: "General Settings", icon: FaCog },
        { id: "rate", label: "Rate/Market", icon: FaPercent },
        { id: "vendor", label: "Vendor Management", icon: FaUsers },
        { id: "inventory", label: "Inventory", icon: FaWarehouse },
        { id: "userrole", label: "User & Roles", icon: FaLock },
        { id: "branch", label: "Branch Settings", icon: FaCodeBranch },
        { id: "notification", label: "Notifications", icon: FaBell },
        { id: "payment", label: "Payment & Bank", icon: FaUniversity },
        { id: "tax", label: "Tax & Compliance", icon: FaShieldAlt }
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-[290px]">
                <Header />
                <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">System Settings</h1>
                            <p className="text-gray-600 text-sm mt-1">Manage platform configuration and settings</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Sidebar Navigation */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
                                    {sections.map(section => {
                                        const Icon = section.icon;
                                        return (
                                            <button
                                                key={section.id}
                                                onClick={() => setActiveSection(section.id)}
                                                className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition flex items-center gap-3 ${activeSection === section.id
                                                    ? "bg-blue-600 text-white"
                                                    : "text-gray-700 hover:bg-gray-100"
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span className="text-sm font-medium">{section.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="lg:col-span-3">
                                <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                                    {/* General Settings */}
                                    {activeSection === "general" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-semibold text-gray-800">General Settings</h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                                    <input
                                                        type="text"
                                                        value={generalSettings.companyName}
                                                        onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                                                    <input
                                                        type="text"
                                                        value={generalSettings.tagline}
                                                        onChange={(e) => setGeneralSettings({ ...generalSettings, tagline: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Financial Year Start</label>
                                                    <select
                                                        value={generalSettings.financialYearStart}
                                                        onChange={(e) => setGeneralSettings({ ...generalSettings, financialYearStart: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option>January</option>
                                                        <option>April</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                                                    <input type="text" value={generalSettings.currency} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                                                    <input type="text" value={generalSettings.timezone} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                                    <select value={generalSettings.language} onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                                                        <option>English</option>
                                                        <option>Hindi</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSaveSettings("general")}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                            >
                                                <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    )}

                                    {/* Rate/Market Settings */}
                                    {activeSection === "rate" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-semibold text-gray-800">Rate/Market Settings</h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gold Rate Source</label>
                                                    <select
                                                        value={rateSettings.goldRateSource}
                                                        onChange={(e) => setRateSettings({ ...rateSettings, goldRateSource: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option>MCX</option>
                                                        <option>Manual</option>
                                                        <option>API</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Silver Rate Source</label>
                                                    <select value={rateSettings.silverRateSource} onChange={(e) => setRateSettings({ ...rateSettings, silverRateSource: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                                                        <option>MCX</option>
                                                        <option>Manual</option>
                                                        <option>API</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Update Frequency</label>
                                                    <select value={rateSettings.autoUpdateFrequency} onChange={(e) => setRateSettings({ ...rateSettings, autoUpdateFrequency: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                                                        <option>1hr</option>
                                                        <option>6hr</option>
                                                        <option>Daily</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Making Charge Default (%)</label>
                                                    <input type="number" value={rateSettings.makingChargeDefault} onChange={(e) => setRateSettings({ ...rateSettings, makingChargeDefault: parseFloat(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Wastage Default (%)</label>
                                                    <input type="number" value={rateSettings.wastageDefault} onChange={(e) => setRateSettings({ ...rateSettings, wastageDefault: parseFloat(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">GST Configuration</label>
                                                    <input type="text" value={rateSettings.gstConfig} onChange={(e) => setRateSettings({ ...rateSettings, gstConfig: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSaveSettings("rate")}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                            >
                                                <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    )}

                                    {/* Vendor Management Settings */}
                                    {activeSection === "vendor" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-semibold text-gray-800">Vendor Management Settings</h2>
                                            <div className="space-y-4">
                                                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                    <input
                                                        type="checkbox"
                                                        checked={vendorSettings.autoApproveVendors}
                                                        onChange={(e) => setVendorSettings({ ...vendorSettings, autoApproveVendors: e.target.checked })}
                                                        className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                    />
                                                    <div className="ml-3 flex-1">
                                                        <p className="font-medium text-gray-900">Auto-Approve New Vendors</p>
                                                        <p className="text-sm text-gray-600">Automatically approve vendor registrations</p>
                                                    </div>
                                                </label>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
                                                    <div className="space-y-2">
                                                        {vendorSettings.requiredDocuments.map((doc, idx) => (
                                                            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                                                                <span className="flex-1">{doc}</span>
                                                                <button className="text-red-600 hover:text-red-700">Remove</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Vendors Per Branch</label>
                                                    <input type="number" value={vendorSettings.maxVendorsPerBranch} onChange={(e) => setVendorSettings({ ...vendorSettings, maxVendorsPerBranch: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Commission (%)</label>
                                                    <input type="number" step="0.01" value={vendorSettings.defaultCommissionPercent} onChange={(e) => setVendorSettings({ ...vendorSettings, defaultCommissionPercent: parseFloat(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSaveSettings("vendor")}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                            >
                                                <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    )}

                                    {/* Inventory Settings */}
                                    {activeSection === "inventory" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-semibold text-gray-800">Inventory Settings</h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold (kg)</label>
                                                    <input type="number" value={inventorySettings.lowStockThreshold} onChange={(e) => setInventorySettings({ ...inventorySettings, lowStockThreshold: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Valuation Method</label>
                                                    <select value={inventorySettings.valuationMethod} onChange={(e) => setInventorySettings({ ...inventorySettings, valuationMethod: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                                                        <option>FIFO</option>
                                                        <option>LIFO</option>
                                                        <option>Weighted Avg</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Purity Standard</label>
                                                    <select value={inventorySettings.minPurityStandard} onChange={(e) => setInventorySettings({ ...inventorySettings, minPurityStandard: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                                                        <option>14K</option>
                                                        <option>18K</option>
                                                        <option>22K</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Scrap/Wastage (%)</label>
                                                    <input type="number" step="0.1" value={inventorySettings.scrapWastagePercent} onChange={(e) => setInventorySettings({ ...inventorySettings, scrapWastagePercent: parseFloat(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                                                </div>
                                            </div>
                                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={inventorySettings.autoStockAlert}
                                                    onChange={(e) => setInventorySettings({ ...inventorySettings, autoStockAlert: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <p className="font-medium text-gray-900">Auto Stock Alert</p>
                                                    <p className="text-sm text-gray-600">Automatic low stock notifications</p>
                                                </div>
                                            </label>
                                            <button
                                                onClick={() => handleSaveSettings("inventory")}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                            >
                                                <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    )}

                                    {/* User & Role Settings */}
                                    {activeSection === "userrole" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-semibold text-gray-800">User & Role Settings</h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Sessions</label>
                                                    <input type="number" value={userRoleSettings.maxLoginSessions} onChange={(e) => setUserRoleSettings({ ...userRoleSettings, maxLoginSessions: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password Reset Period (Days)</label>
                                                    <input type="number" value={userRoleSettings.passwordResetPeriod} onChange={(e) => setUserRoleSettings({ ...userRoleSettings, passwordResetPeriod: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                                                </div>
                                            </div>
                                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={userRoleSettings.twoFactorAuth}
                                                    onChange={(e) => setUserRoleSettings({ ...userRoleSettings, twoFactorAuth: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <p className="font-medium text-gray-900">Force Two-Factor Authentication</p>
                                                    <p className="text-sm text-gray-600">Require 2FA for all users</p>
                                                </div>
                                            </label>
                                            <button
                                                onClick={() => handleSaveSettings("userrole")}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                            >
                                                <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    )}

                                    {/* Branch Settings */}
                                    {activeSection === "branch" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-semibold text-gray-800">Branch Settings</h2>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead className="border-b-2 border-gray-300">
                                                        <tr>
                                                            <th className="text-left py-2 px-4">Branch Name</th>
                                                            <th className="text-left py-2 px-4">GST Registration</th>
                                                            <th className="text-left py-2 px-4">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {branchSettings.branches.map(branch => (
                                                            <tr key={branch.id} className="border-b border-gray-200">
                                                                <td className="py-3 px-4">{branch.name}</td>
                                                                <td className="py-3 px-4">{branch.gst}</td>
                                                                <td className="py-3 px-4">
                                                                    <button className="text-blue-600 hover:text-blue-700 mr-3">Edit</button>
                                                                    <button className="text-red-600 hover:text-red-700">Delete</button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                                Add New Branch
                                            </button>
                                        </div>
                                    )}

                                    {/* Notification Settings */}
                                    {activeSection === "notification" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-semibold text-gray-800">Notification Settings</h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Alert Threshold (kg)</label>
                                                    <input type="number" value={notificationSettings.lowStockAlertThreshold} onChange={(e) => setNotificationSettings({ ...notificationSettings, lowStockAlertThreshold: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate Change Alert (%)</label>
                                                    <input type="number" value={notificationSettings.rateChangeAlertPercent} onChange={(e) => setNotificationSettings({ ...notificationSettings, rateChangeAlertPercent: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                                                </div>
                                            </div>
                                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.emailAlertsEnabled}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, emailAlertsEnabled: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <p className="font-medium text-gray-900">Email Alerts</p>
                                                </div>
                                            </label>
                                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.smsAlertsEnabled}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, smsAlertsEnabled: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <p className="font-medium text-gray-900">SMS Alerts</p>
                                                </div>
                                            </label>
                                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.dailyReportAutoSend}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, dailyReportAutoSend: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <p className="font-medium text-gray-900">Daily Report Auto-Send</p>
                                                </div>
                                            </label>
                                            <button
                                                onClick={() => handleSaveSettings("notification")}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                            >
                                                <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    )}

                                    {/* Payment & Bank Settings */}
                                    {activeSection === "payment" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-semibold text-gray-800">Payment & Bank Settings</h2>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Bank Accounts</label>
                                                    {paymentSettings.companyBankAccounts.map((account, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 p-2 bg-gray-100 rounded mb-2">
                                                            <span className="flex-1">{account}</span>
                                                            <button className="text-red-600 hover:text-red-700">Remove</button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Accepted Payment Modes</label>
                                                    <div className="space-y-2">
                                                        {["Cash", "UPI", "Card", "NEFT"].map(mode => (
                                                            <label key={mode} className="flex items-center">
                                                                <input type="checkbox" checked={paymentSettings.acceptedPaymentModes.includes(mode)} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                                                                <span className="ml-2 text-gray-700">{mode}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Gateway</label>
                                                    <select value={paymentSettings.paymentGateway} onChange={(e) => setPaymentSettings({ ...paymentSettings, paymentGateway: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                                                        <option>Razorpay</option>
                                                        <option>PayU</option>
                                                        <option>Instamojo</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Settlement Cycle</label>
                                                    <select value={paymentSettings.vendorSettlementCycle} onChange={(e) => setPaymentSettings({ ...paymentSettings, vendorSettlementCycle: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                                                        <option>Daily</option>
                                                        <option>Weekly</option>
                                                        <option>Monthly</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSaveSettings("payment")}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                            >
                                                <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    )}

                                    {/* Tax & Compliance Settings */}
                                    {activeSection === "tax" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-semibold text-gray-800">Tax & Compliance Settings</h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Company GSTIN</label>
                                                    <input type="text" value={taxSettings.companyGSTIN} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gold HSN Code</label>
                                                    <input type="text" value={taxSettings.goldHSNCode} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Silver HSN Code</label>
                                                    <input type="text" value={taxSettings.silverHSNCode} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                                                </div>
                                            </div>
                                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={taxSettings.tdsEnabled}
                                                    onChange={(e) => setTaxSettings({ ...taxSettings, tdsEnabled: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <p className="font-medium text-gray-900">TDS Enabled</p>
                                                </div>
                                            </label>
                                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={taxSettings.eInvoiceIntegration}
                                                    onChange={(e) => setTaxSettings({ ...taxSettings, eInvoiceIntegration: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <p className="font-medium text-gray-900">E-Invoice Integration</p>
                                                </div>
                                            </label>
                                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={taxSettings.eWayBillIntegration}
                                                    onChange={(e) => setTaxSettings({ ...taxSettings, eWayBillIntegration: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <p className="font-medium text-gray-900">E-Way Bill Integration</p>
                                                </div>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminSettings;
