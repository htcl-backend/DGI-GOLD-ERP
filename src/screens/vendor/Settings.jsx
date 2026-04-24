import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../Contexts/AuthContext";
import { HeaderContext } from "../../Contexts/HeaderContext";
import { FaShoppingBag, FaWarehouse, FaTag, FaUsers, FaFileInvoiceDollar, FaBell, FaLock, FaUniversity, FaSave } from "react-icons/fa";

const VendorSettings = () => {
    const navigate = useNavigate();
    const { user, isSuperAdmin } = useAuth();
    const { theme } = useContext(HeaderContext);
    const [activeSection, setActiveSection] = useState("shop");
    const [saveLoading, setSaveLoading] = useState(false);

    // Redirect if not vendor - optimized to prevent unnecessary renders
    useEffect(() => {
        if (!user) {
            navigate("/signin");
            return;
        }
        if (isSuperAdmin) {
            navigate("/superadmin/settings");
        }
    }, []);

    // Shop/Business Settings
    const [shopSettings, setShopSettings] = useState({
        shopName: user?.businessName || "Kumar Gold & Silver House",
        shopAddress: "123, Main Street, Delhi",
        gstin: user?.gstin || "18AABCT1234H1Z0",
        pan: "AAAPA1234A",
        businessType: "Retail",
        workingHoursStart: "10:00",
        workingHoursEnd: "20:00",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dayOff: "Sunday"
    });

    // Inventory Settings
    const [inventorySettings, setInventorySettings] = useState({
        defaultUnit: "grams",
        lowStockAlert: 500,
        defaultGoldPurity: "22K",
        defaultSilverPurity: "925",
        autoDeductStock: true
    });

    // Pricing Settings
    const [pricingSettings, setPricingSettings] = useState({
        makingChargePercent: 15,
        wastagePercent: 2,
        discountAllowedLimit: 10,
        priceRoundingPreference: "nearest 1"
    });

    // Customer Settings
    const [customerSettings, setCustomerSettings] = useState({
        defaultLoyaltyPoints: 1,
        maxCreditLimit: 100000,
        allowCreditSales: true,
        oldGoldExchangeRate: "Per Gram Basis"
    });

    // Invoice/Billing Settings
    const [invoiceSettings, setInvoiceSettings] = useState({
        invoicePrefix: "VND-001",
        invoiceFooterMessage: "Thank you for your business",
        showGSTBreakup: true,
        printFormat: "A4",
        autoSendInvoice: true,
        autoSendChannel: "Email"
    });

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        lowStockAlert: true,
        dailySalesSummary: true,
        newOrderAlert: true,
        rateChangeAlert: true,
        preferredChannel: "Email"
    });

    // Security Settings
    const [securitySettings, setSecuritySettings] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorAuth: false,
        lastLoginDate: "2024-04-09 14:32"
    });

    // Bank/Payment Settings
    const [bankSettings, setBankSettings] = useState({
        bankName: "HDFC Bank",
        accountNumber: "****7890",
        ifscCode: "HDFC0000001",
        upiId: "rajesh@okhdfcbank",
        acceptedPaymentModes: ["Cash", "UPI", "Card", "NEFT"],
        autoGenerateReceipt: true
    });

    // ✅ TODO: API INTEGRATION - Replace this with actual API call to backend
    // API Endpoint: POST /api/vendor/settings/{section}
    const handleSaveSettings = useCallback(async (section) => {
        setSaveLoading(true);
        try {
            // TODO: API - Call backend API instead of timeout
            // const response = await apiClient.post(`/vendor/settings/${section}`, {...settings});
            await new Promise(resolve => setTimeout(resolve, 500)); // Quick local save for now
            console.log(`✅ ${section} settings saved`);
        } catch (error) {
            console.error(`❌ Error saving ${section} settings:`, error);
        } finally {
            setSaveLoading(false);
        }
    }, []);

    const sections = [
        { id: "shop", label: "Shop/Business", icon: FaShoppingBag },
        { id: "inventory", label: "Inventory", icon: FaWarehouse },
        { id: "pricing", label: "Pricing", icon: FaTag },
        { id: "customer", label: "Customer", icon: FaUsers },
        { id: "invoice", label: "Invoice/Billing", icon: FaFileInvoiceDollar },
        { id: "notification", label: "Notifications", icon: FaBell },
        { id: "security", label: "Security", icon: FaLock },
        { id: "bank", label: "Bank/Payment", icon: FaUniversity }
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
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Shop Settings</h1>
                            <p className="text-gray-600 text-sm mt-1">Manage your shop configuration and preferences</p>
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
                                    {/* Shop/Business Settings */}
                                    {activeSection === "shop" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-semibold text-gray-800">Shop/Business Settings</h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
                                                    <input
                                                        type="text"
                                                        value={shopSettings.shopName}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, shopName: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                                                    <select
                                                        value={shopSettings.businessType}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, businessType: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option>Retail</option>
                                                        <option>Wholesale</option>
                                                        <option>Both</option>
                                                    </select>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Shop Address</label>
                                                    <textarea
                                                        value={shopSettings.shopAddress}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, shopAddress: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                        rows="3"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN</label>
                                                    <input type="text" value={shopSettings.gstin} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN</label>
                                                    <input type="text" value={shopSettings.pan} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours Start</label>
                                                    <input
                                                        type="time"
                                                        value={shopSettings.workingHoursStart}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, workingHoursStart: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours End</label>
                                                    <input
                                                        type="time"
                                                        value={shopSettings.workingHoursEnd}
                                                        onChange={(e) => setShopSettings({ ...shopSettings, workingHoursEnd: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            {/* TODO: API - Pass shopSettings to API endpoint */}
                                            <button
                                                onClick={() => handleSaveSettings("shop")}
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
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Unit</label>
                                                    <select
                                                        value={inventorySettings.defaultUnit}
                                                        onChange={(e) => setInventorySettings({ ...inventorySettings, defaultUnit: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option>grams</option>
                                                        <option>kg</option>
                                                        <option>tola</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Alert (grams)</label>
                                                    <input
                                                        type="number"
                                                        value={inventorySettings.lowStockAlert}
                                                        onChange={(e) => setInventorySettings({ ...inventorySettings, lowStockAlert: parseInt(e.target.value) })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Gold Purity</label>
                                                    <select
                                                        value={inventorySettings.defaultGoldPurity}
                                                        onChange={(e) => setInventorySettings({ ...inventorySettings, defaultGoldPurity: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option>22K</option>
                                                        <option>18K</option>
                                                        <option>14K</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Silver Purity</label>
                                                    <select
                                                        value={inventorySettings.defaultSilverPurity}
                                                        onChange={(e) => setInventorySettings({ ...inventorySettings, defaultSilverPurity: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option>925</option>
                                                        <option>999</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={inventorySettings.autoDeductStock}
                                                    onChange={(e) => setInventorySettings({ ...inventorySettings, autoDeductStock: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <p className="font-medium text-gray-900">Auto-Deduct Stock on Sale</p>
                                                    <p className="text-sm text-gray-600">Automatically reduce inventory when sale is made</p>
                                                </div>
                                            </label>
                                            {/* TODO: API - Pass inventorySettings to API endpoint */}
                                            <button
                                                onClick={() => handleSaveSettings("inventory")}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                            >
                                                <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    )}

                                    {/* Pricing Settings */}
                                    {activeSection === "pricing" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-semibold text-gray-800">Pricing Settings</h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Making Charge (%)</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={pricingSettings.makingChargePercent}
                                                        onChange={(e) => setPricingSettings({ ...pricingSettings, makingChargePercent: parseFloat(e.target.value) })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Wastage (%)</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={pricingSettings.wastagePercent}
                                                        onChange={(e) => setPricingSettings({ ...pricingSettings, wastagePercent: parseFloat(e.target.value) })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Allowed Limit (%)</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={pricingSettings.discountAllowedLimit}
                                                        onChange={(e) => setPricingSettings({ ...pricingSettings, discountAllowedLimit: parseFloat(e.target.value) })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Rounding Preference</label>
                                                    <select
                                                        value={pricingSettings.priceRoundingPreference}
                                                        onChange={(e) => setPricingSettings({ ...pricingSettings, priceRoundingPreference: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option>nearest 1</option>
                                                        <option>nearest 5</option>
                                                        <option>nearest 10</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {/* TODO: API - Pass pricingSettings to API endpoint */}
                                            <button
                                                onClick={() => handleSaveSettings("pricing")}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                            >
                                                <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    )}

                                    {/* Customer Settings */}
                                    {activeSection === "customer" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-semibold text-gray-800">Customer Settings</h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Loyalty Points Value</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={customerSettings.defaultLoyaltyPoints}
                                                        onChange={(e) => setCustomerSettings({ ...customerSettings, defaultLoyaltyPoints: parseFloat(e.target.value) })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Credit Limit (₹)</label>
                                                    <input
                                                        type="number"
                                                        value={customerSettings.maxCreditLimit}
                                                        onChange={(e) => setCustomerSettings({ ...customerSettings, maxCreditLimit: parseInt(e.target.value) })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Old Gold/Silver Exchange Rate</label>
                                                    <select
                                                        value={customerSettings.oldGoldExchangeRate}
                                                        onChange={(e) => setCustomerSettings({ ...customerSettings, oldGoldExchangeRate: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option>Per Gram Basis</option>
                                                        <option>Fixed Rate</option>
                                                        <option>Market Rate</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={customerSettings.allowCreditSales}
                                                    onChange={(e) => setCustomerSettings({ ...customerSettings, allowCreditSales: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <p className="font-medium text-gray-900">Allow Credit Sales</p>
                                                    <p className="text-sm text-gray-600">Allow customers to purchase on credit</p>
                                                </div>
                                            </label>
                                            <button
                                                onClick={() => handleSaveSettings("customer")}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                            >
                                                <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    )}

                                    {/* Invoice/Billing Settings */}
                                    {activeSection === "invoice" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-semibold text-gray-800">Invoice/Billing Settings</h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Prefix</label>
                                                    <input
                                                        type="text"
                                                        value={invoiceSettings.invoicePrefix}
                                                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, invoicePrefix: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Print Format</label>
                                                    <select
                                                        value={invoiceSettings.printFormat}
                                                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, printFormat: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option>A4</option>
                                                        <option>Thermal</option>
                                                    </select>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Footer Message</label>
                                                    <textarea
                                                        value={invoiceSettings.invoiceFooterMessage}
                                                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, invoiceFooterMessage: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                        rows="2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Send Invoice Channel</label>
                                                    <select
                                                        value={invoiceSettings.autoSendChannel}
                                                        onChange={(e) => setInvoiceSettings({ ...invoiceSettings, autoSendChannel: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option>Email</option>
                                                        <option>SMS</option>
                                                        <option>WhatsApp</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={invoiceSettings.showGSTBreakup}
                                                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, showGSTBreakup: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <p className="font-medium text-gray-900">Show GST Breakup on Invoice</p>
                                                </div>
                                            </label>
                                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={invoiceSettings.autoSendInvoice}
                                                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, autoSendInvoice: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <p className="font-medium text-gray-900">Auto-Send Invoice to Customer</p>
                                                </div>
                                            </label>
                                            <button
                                                onClick={() => handleSaveSettings("invoice")}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                            >
                                                <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    )}

                                    {/* Notification Settings */}
                                    {activeSection === "notification" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-semibold text-gray-800">Notification Settings</h2>
                                            <div className="space-y-4">
                                                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                    <input
                                                        type="checkbox"
                                                        checked={notificationSettings.lowStockAlert}
                                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, lowStockAlert: e.target.checked })}
                                                        className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                    />
                                                    <div className="ml-3 flex-1">
                                                        <p className="font-medium text-gray-900">Low Stock Alerts</p>
                                                        <p className="text-sm text-gray-600">Notify when inventory runs low</p>
                                                    </div>
                                                </label>
                                                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                    <input
                                                        type="checkbox"
                                                        checked={notificationSettings.dailySalesSummary}
                                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, dailySalesSummary: e.target.checked })}
                                                        className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                    />
                                                    <div className="ml-3 flex-1">
                                                        <p className="font-medium text-gray-900">Daily Sales Summary</p>
                                                        <p className="text-sm text-gray-600">Receive daily sales report</p>
                                                    </div>
                                                </label>
                                                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                    <input
                                                        type="checkbox"
                                                        checked={notificationSettings.newOrderAlert}
                                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, newOrderAlert: e.target.checked })}
                                                        className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                    />
                                                    <div className="ml-3 flex-1">
                                                        <p className="font-medium text-gray-900">New Order Alerts</p>
                                                        <p className="text-sm text-gray-600">Notify for new orders</p>
                                                    </div>
                                                </label>
                                                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                    <input
                                                        type="checkbox"
                                                        checked={notificationSettings.rateChangeAlert}
                                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, rateChangeAlert: e.target.checked })}
                                                        className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                    />
                                                    <div className="ml-3 flex-1">
                                                        <p className="font-medium text-gray-900">Rate Change Alerts</p>
                                                        <p className="text-sm text-gray-600">Notify when rates change significantly</p>
                                                    </div>
                                                </label>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Channel</label>
                                                    <select
                                                        value={notificationSettings.preferredChannel}
                                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, preferredChannel: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option>Email</option>
                                                        <option>SMS</option>
                                                        <option>WhatsApp</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSaveSettings("notification")}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                            >
                                                <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    )}

                                    {/* Security Settings */}
                                    {activeSection === "security" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-semibold text-gray-800">Security Settings</h2>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-4">Last Login: {securitySettings.lastLoginDate}</p>
                                                </div>
                                                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                    <input
                                                        type="checkbox"
                                                        checked={securitySettings.twoFactorAuth}
                                                        onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })}
                                                        className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                    />
                                                    <div className="ml-3 flex-1">
                                                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                                                        <p className="text-sm text-gray-600">Add extra security to your account</p>
                                                    </div>
                                                </label>
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
                                                    <div className="space-y-3">
                                                        <input
                                                            type="password"
                                                            placeholder="Current Password"
                                                            value={securitySettings.currentPassword}
                                                            onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                        />
                                                        <input
                                                            type="password"
                                                            placeholder="New Password"
                                                            value={securitySettings.newPassword}
                                                            onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                        />
                                                        <input
                                                            type="password"
                                                            placeholder="Confirm New Password"
                                                            value={securitySettings.confirmPassword}
                                                            onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSaveSettings("security")}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                            >
                                                <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    )}

                                    {/* Bank/Payment Settings */}
                                    {activeSection === "bank" && (
                                        <div className="space-y-6">
                                            <h2 className="text-xl font-semibold text-gray-800">Bank/Payment Settings</h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                                                    <input type="text" value={bankSettings.bankName} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                                                    <input type="text" value={bankSettings.accountNumber} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                                                    <input type="text" value={bankSettings.ifscCode} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                                                    <input
                                                        type="text"
                                                        value={bankSettings.upiId}
                                                        onChange={(e) => setBankSettings({ ...bankSettings, upiId: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-3">Accepted Payment Modes</label>
                                                <div className="space-y-2">
                                                    {["Cash", "UPI", "Card", "NEFT"].map(mode => (
                                                        <label key={mode} className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={bankSettings.acceptedPaymentModes.includes(mode)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setBankSettings({
                                                                            ...bankSettings,
                                                                            acceptedPaymentModes: [...bankSettings.acceptedPaymentModes, mode]
                                                                        });
                                                                    } else {
                                                                        setBankSettings({
                                                                            ...bankSettings,
                                                                            acceptedPaymentModes: bankSettings.acceptedPaymentModes.filter(m => m !== mode)
                                                                        });
                                                                    }
                                                                }}
                                                                className="w-4 h-4 rounded border-gray-300 text-blue-600"
                                                            />
                                                            <span className="ml-2 text-gray-700">{mode}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={bankSettings.autoGenerateReceipt}
                                                    onChange={(e) => setBankSettings({ ...bankSettings, autoGenerateReceipt: e.target.checked })}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <p className="font-medium text-gray-900">Auto-Generate Payment Receipt</p>
                                                </div>
                                            </label>
                                            <button
                                                onClick={() => handleSaveSettings("bank")}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                            >
                                                <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                            </button>
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

export default VendorSettings;
