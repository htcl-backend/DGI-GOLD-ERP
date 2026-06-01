import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../Contexts/AuthContext";
import { HeaderContext } from "../../Contexts/HeaderContext";
import apiService from "../../screens/service/apiService";
import toast from "react-hot-toast";
import { FaUser, FaLock, FaBell, FaSave, FaEye, FaEyeSlash, FaUpload, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope, FaShoppingBag, FaBuilding, FaPalette } from "react-icons/fa";

const VendorProfile = () => {
    const navigate = useNavigate();
    const { user, isSuperAdmin, updateProfileImage } = useAuth();
    const { theme, toggleTheme } = useContext(HeaderContext);
    const fileInputRef = useRef(null);
    const [imageLoading, setImageLoading] = useState(false);

    // Redirect if not vendor
    useEffect(() => {
        if (isSuperAdmin) {
            navigate("/superadmin/profile");
        } else if (!user) {
            navigate("/signin");
        }
    }, [user, isSuperAdmin, navigate]);

    const [activeTab, setActiveTab] = useState("basic");
    const [showPassword, setShowPassword] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const [basicInfo, setBasicInfo] = useState({
        fullName: user?.name || "Rajesh Kumar",
        email: user?.email || "rajesh@goldshop.com",
        phone: user?.phone || "+91-98765-43210",
        username: user?.id || "rajesh_vendor_01",
        role: "Vendor",
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

    const [businessInfo, setBusinessInfo] = useState({
        shopName: "Kumar Gold & Silver House",
        gstin: "18AABCT1234H1Z0",
        panNumber: "AAAPA1234A",
        businessType: "Retailer",
        shopRegistration: "SR-2024-00123",
        hallmarkLicense: "HM-2023-456789",
        metalTradingPref: "Both",
        defaultPurity: "22K"
    });

    const [locationInfo, setLocationInfo] = useState({
        shopAddress: "123, Main Street",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        googleMapsLink: "https://maps.google.com/?q=Delhi"
    });

    const [bankInfo, setBankInfo] = useState({
        bankName: "HDFC Bank",
        accountNumber: "1234567890123456",
        ifscCode: "HDFC0000001",
        accountHolderName: "Rajesh Kumar",
        upiId: "rajesh@okhdfcbank"
    });

    const [operationalInfo, setOperationalInfo] = useState({
        workingHoursStart: "10:00",
        workingHoursEnd: "20:00",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dayOff: "Sunday"
    });

    const [statusInfo, setStatusInfo] = useState({
        accountStatus: "Active",
        joinedDate: "2023-06-15",
        lastLogin: "2024-04-09 14:32",
        assignedBranch: "New Delhi Main Branch"
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
        orderSaleNotifications: true
    });

    const handleBasicInfoChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleBusinessInfoChange = (e) => {
        const { name, value } = e.target;
        setBusinessInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationInfoChange = (e) => {
        const { name, value } = e.target;
        setLocationInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleBankInfoChange = (e) => {
        const { name, value } = e.target;
        setBankInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleOperationalChange = (e) => {
        const { name, value } = e.target;
        setOperationalInfo(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setNotificationSettings(prev => ({ ...prev, [name]: checked }));
    };

    // Handle profile image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        try {
            setImageLoading(true);

            // Create preview
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result;
                setBasicInfo(prev => ({
                    ...prev,
                    profilePhoto: file,
                    profilePhotoUrl: imageUrl
                }));

                // ✅ Update profile image in AuthContext (syncs with Header)
                updateProfileImage(imageUrl);
            };
            reader.readAsDataURL(file);

            // Upload image to API
            const formData = new FormData();
            formData.append('profileImage', file);

            const result = await apiService.vendor.updateProfileImage(formData);

            if (result.success) {
                toast.success('Profile image uploaded successfully!');
                if (result.data?.profileImage) {
                    updateProfileImage(result.data.profileImage);
                    setBasicInfo(prev => ({
                        ...prev,
                        profilePhotoUrl: result.data.profileImage
                    }));
                }
            } else {
                toast.error(result.error || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Error uploading profile image');
        } finally {
            setImageLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaveLoading(true);
        try {
            const payload = {
                name: basicInfo.fullName,
                phone: basicInfo.phone,
                businessInfo: {
                    shopName: businessInfo.shopName,
                    gstin: businessInfo.gstin,
                    panNumber: businessInfo.panNumber,
                    businessType: businessInfo.businessType,
                    shopRegistration: businessInfo.shopRegistration,
                    hallmarkLicense: businessInfo.hallmarkLicense,
                    metalTradingPref: businessInfo.metalTradingPref,
                    defaultPurity: businessInfo.defaultPurity
                },
                locationInfo: {
                    shopAddress: locationInfo.shopAddress,
                    city: locationInfo.city,
                    state: locationInfo.state,
                    pincode: locationInfo.pincode,
                    googleMapsLink: locationInfo.googleMapsLink
                },
                bankInfo: {
                    bankName: bankInfo.bankName,
                    accountNumber: bankInfo.accountNumber,
                    ifscCode: bankInfo.ifscCode,
                    accountHolderName: bankInfo.accountHolderName,
                    upiId: bankInfo.upiId
                },
                operationalInfo: {
                    workingHoursStart: operationalInfo.workingHoursStart,
                    workingHoursEnd: operationalInfo.workingHoursEnd,
                    workingDays: operationalInfo.workingDays,
                    dayOff: operationalInfo.dayOff
                },
                notificationSettings
            };

            // Call API to update profile
            const result = await apiService.vendor.updateProfile(payload);

            if (result.success) {
                toast.success('Profile updated successfully!');
                setEditMode(false);
            } else {
                toast.error(result.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error('Error updating profile: ' + error.message);
        } finally {
            setSaveLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        setSaveLoading(true);
        try {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                toast.error('Passwords do not match!');
                return;
            }

            if (passwordData.newPassword.length < 6) {
                toast.error('Password must be at least 6 characters');
                return;
            }

            // Call API to update password
            const result = await apiService.vendor.changePassword({
                oldPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            if (result.success) {
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                toast.success('Password updated successfully!');
            } else {
                toast.error(result.error || 'Failed to update password');
            }
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error('Error updating password: ' + error.message);
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
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Vendor Profile</h1>
                                <p className="text-gray-600 text-sm mt-1">Manage your business and personal information</p>
                            </div>
                            {!editMode && (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="px-4 sm:px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-lg shadow-sm p-2">
                            {[
                                { id: "basic", label: "Basic Info", icon: FaUser },
                                { id: "business", label: "Business", icon: FaBuilding },
                                { id: "location", label: "Location", icon: FaMapMarkerAlt },
                                { id: "bank", label: "Bank Details", icon: FaPhone },
                                { id: "operational", label: "Operations", icon: FaClock },
                                { id: "security", label: "Security", icon: FaLock },
                                { id: "notifications", label: "Notifications", icon: FaBell },
                                { id: "settings", label: "Settings", icon: FaPalette }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.id
                                        ? "bg-amber-600 text-white"
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
                                                <div className="relative">
                                                    <img
                                                        src={basicInfo.profilePhotoUrl}
                                                        alt="Profile"
                                                        className="w-24 h-24 rounded-full border-4 border-amber-500 object-cover"
                                                    />
                                                    {imageLoading && (
                                                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                                            <div className="animate-spin h-6 w-6 border-2 border-white rounded-full border-t-transparent"></div>
                                                        </div>
                                                    )}
                                                </div>
                                                {editMode && (
                                                    <button
                                                        onClick={triggerFileInput}
                                                        disabled={imageLoading}
                                                        className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg cursor-pointer hover:bg-amber-700 transition text-sm flex items-center gap-2 disabled:bg-gray-400"
                                                    >
                                                        <FaUpload className="w-4 h-4" />
                                                        {imageLoading ? 'Uploading...' : 'Upload Photo'}
                                                    </button>
                                                )}
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Role Badge</p>
                                                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium text-sm mt-1">
                                                    {basicInfo.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Basic Fields */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                        {[
                                            { label: "Full Name", name: "fullName", icon: FaUser, readonly: !editMode },
                                            { label: "Email Address", name: "email", icon: FaEnvelope, readonly: true },
                                            { label: "Phone Number", name: "phone", icon: FaPhone, readonly: !editMode },
                                            { label: "Username / ID", name: "username", icon: FaUser, readonly: true }
                                        ].map(field => (
                                            <div key={field.name}>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <field.icon className="inline mr-2" />
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
                                                        : "bg-white text-gray-900 focus:ring-2 focus:ring-amber-500 border-gray-300"
                                                        }`}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {editMode && (
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saveLoading}
                                            className="mt-6 w-full sm:w-auto px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                                        >
                                            <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* BUSINESS INFO TAB */}
                            {activeTab === "business" && (
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Business Information</h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                                        {[
                                            { label: "Shop / Business Name", name: "shopName", readonly: !editMode },
                                            { label: "GST Number (GSTIN)", name: "gstin", readonly: true },
                                            { label: "PAN Number", name: "panNumber", readonly: !editMode },
                                            { label: "Business Type", name: "businessType", readonly: !editMode, type: "select", options: ["Retailer", "Wholesaler", "Manufacturer"] },
                                            { label: "Shop Registration Number", name: "shopRegistration", readonly: !editMode },
                                            { label: "Hallmark License Number", name: "hallmarkLicense", readonly: !editMode },
                                            { label: "Metal Trading Preference", name: "metalTradingPref", readonly: !editMode, type: "select", options: ["Gold", "Silver", "Both"] },
                                            { label: "Default Purity Standard", name: "defaultPurity", readonly: !editMode, type: "select", options: ["18K", "22K", "24K", "925 Silver"] }
                                        ].map(field => (
                                            <div key={field.name}>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {field.label}
                                                </label>
                                                {field.type === "select" ? (
                                                    <select
                                                        name={field.name}
                                                        value={businessInfo[field.name]}
                                                        onChange={handleBusinessInfoChange}
                                                        disabled={field.readonly}
                                                        className={`w-full px-4 py-2 border rounded-lg text-sm ${field.readonly
                                                            ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                                                            : "bg-white text-gray-900 focus:ring-2 focus:ring-amber-500 border-gray-300"
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
                                                        value={businessInfo[field.name]}
                                                        onChange={handleBusinessInfoChange}
                                                        readOnly={field.readonly}
                                                        className={`w-full px-4 py-2 border rounded-lg text-sm ${field.readonly
                                                            ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                                                            : "bg-white text-gray-900 focus:ring-2 focus:ring-amber-500 border-gray-300"
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
                                            className="w-full sm:w-auto px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                                        >
                                            <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* LOCATION INFO TAB */}
                            {activeTab === "location" && (
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Location Details</h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                                        {[
                                            { label: "Shop Address (Street)", name: "shopAddress", colSpan: 2, readonly: !editMode },
                                            { label: "City", name: "city", readonly: !editMode },
                                            { label: "State", name: "state", readonly: !editMode },
                                            { label: "Pincode", name: "pincode", readonly: !editMode },
                                            { label: "Google Maps Link", name: "googleMapsLink", colSpan: 2, readonly: !editMode }
                                        ].map(field => (
                                            <div key={field.name} className={field.colSpan === 2 ? "col-span-1 sm:col-span-2" : ""}>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <FaMapMarkerAlt className="inline mr-2" />
                                                    {field.label}
                                                </label>
                                                <input
                                                    type="text"
                                                    name={field.name}
                                                    value={locationInfo[field.name]}
                                                    onChange={handleLocationInfoChange}
                                                    readOnly={field.readonly}
                                                    className={`w-full px-4 py-2 border rounded-lg text-sm ${field.readonly
                                                        ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                                                        : "bg-white text-gray-900 focus:ring-2 focus:ring-amber-500 border-gray-300"
                                                        }`}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {editMode && (
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saveLoading}
                                            className="w-full sm:w-auto px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                                        >
                                            <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* BANK INFO TAB */}
                            {activeTab === "bank" && (
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Bank Details (for Settlements/Payments)</h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                                        {[
                                            { label: "Bank Name", name: "bankName", readonly: !editMode },
                                            { label: "Account Number", name: "accountNumber", readonly: !editMode },
                                            { label: "IFSC Code", name: "ifscCode", readonly: !editMode },
                                            { label: "Account Holder Name", name: "accountHolderName", readonly: !editMode },
                                            { label: "UPI ID", name: "upiId", readonly: !editMode, colSpan: 2 }
                                        ].map(field => (
                                            <div key={field.name} className={field.colSpan === 2 ? "col-span-1 sm:col-span-2" : ""}>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {field.label}
                                                </label>
                                                <input
                                                    type="text"
                                                    name={field.name}
                                                    value={bankInfo[field.name]}
                                                    onChange={handleBankInfoChange}
                                                    readOnly={field.readonly}
                                                    className={`w-full px-4 py-2 border rounded-lg text-sm ${field.readonly
                                                        ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                                                        : "bg-white text-gray-900 focus:ring-2 focus:ring-amber-500 border-gray-300"
                                                        }`}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                        <p className="text-sm text-blue-800">
                                            <strong>Security Note:</strong> Bank details are encrypted and used only for settlement payments.
                                        </p>
                                    </div>

                                    {editMode && (
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saveLoading}
                                            className="w-full sm:w-auto px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                                        >
                                            <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* OPERATIONAL INFO TAB */}
                            {activeTab === "operational" && (
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Operational Information</h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FaClock className="inline mr-2" />
                                                Working Hours Start
                                            </label>
                                            <input
                                                type="time"
                                                name="workingHoursStart"
                                                value={operationalInfo.workingHoursStart}
                                                onChange={handleOperationalChange}
                                                disabled={!editMode}
                                                className={`w-full px-4 py-2 border rounded-lg text-sm ${!editMode
                                                    ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                                                    : "bg-white text-gray-900 focus:ring-2 focus:ring-amber-500 border-gray-300"
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Working Hours End
                                            </label>
                                            <input
                                                type="time"
                                                name="workingHoursEnd"
                                                value={operationalInfo.workingHoursEnd}
                                                onChange={handleOperationalChange}
                                                disabled={!editMode}
                                                className={`w-full px-4 py-2 border rounded-lg text-sm ${!editMode
                                                    ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                                                    : "bg-white text-gray-900 focus:ring-2 focus:ring-amber-500 border-gray-300"
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Working Days</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                                <label key={day} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={operationalInfo.workingDays.includes(day)}
                                                        disabled={!editMode}
                                                        className="w-4 h-4 rounded border-gray-300"
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setOperationalInfo(prev => ({
                                                                    ...prev,
                                                                    workingDays: [...prev.workingDays, day]
                                                                }));
                                                            } else {
                                                                setOperationalInfo(prev => ({
                                                                    ...prev,
                                                                    workingDays: prev.workingDays.filter(d => d !== day)
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                    <span className="text-sm text-gray-700">{day}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                                        <p className="text-sm text-amber-800">
                                            <strong>Status:</strong> Account Status: <span className="font-semibold">{statusInfo.accountStatus}</span> |
                                            Joined: {statusInfo.joinedDate} | Last Login: {statusInfo.lastLogin}
                                        </p>
                                    </div>

                                    {editMode && (
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saveLoading}
                                            className="w-full sm:w-auto px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                                        >
                                            <FaSave /> {saveLoading ? "Saving..." : "Save Changes"}
                                        </button>
                                    )}
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
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
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
                                            { name: "emailNotifications", label: "Email Notifications", description: "Receive updates via email" },
                                            { name: "smsAlerts", label: "SMS Alerts", description: "Receive important alerts via SMS" },
                                            { name: "lowStockAlerts", label: "Low Stock Alerts", description: "Get notified when inventory runs low" },
                                            { name: "rateChangeAlerts", label: "Rate Change Alerts", description: "Notify when gold/silver rates change significantly" },
                                            { name: "orderSaleNotifications", label: "Order & Sale Notifications", description: "Receive notifications for new orders and sales" }
                                        ].map(pref => (
                                            <label key={pref.name} className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                                <input
                                                    type="checkbox"
                                                    name={pref.name}
                                                    checked={notificationSettings[pref.name]}
                                                    onChange={handleNotificationChange}
                                                    className="w-5 h-5 mt-1 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
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
                                        className="mt-6 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:bg-gray-400 flex items-center gap-2"
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
                                                <button
                                                    onClick={() => toggleTheme()}
                                                    className={`px-6 py-2 rounded-lg font-medium transition ${theme === "dark"
                                                        ? "bg-gray-800 text-white"
                                                        : "bg-gray-200 text-gray-900"
                                                        }`}
                                                >
                                                    {theme === "dark" ? "Dark" : "Light"}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Account Settings */}
                                        <div className="border border-gray-200 rounded-lg p-6">
                                            <h3 className="font-semibold text-gray-900 mb-4">Account Settings</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-gray-900">Account Status</p>
                                                        <p className="text-sm text-gray-600">Your account is active and in good standing</p>
                                                    </div>
                                                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium text-sm">Active</span>
                                                </div>
                                                <div className="border-t border-gray-200 pt-4">
                                                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                                                    <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account</p>
                                                    <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">
                                                        Enable 2FA
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

export default VendorProfile;
