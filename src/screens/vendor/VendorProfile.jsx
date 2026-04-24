import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useAuth } from '../../Contexts/AuthContext';
import { FaUser, FaLock, FaEdit, FaSave, FaTimes, FaSpinner, FaGoogle, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import apiService from '../service/apiService';

const VendorProfile = () => {
    const { user, updateProfile, logout, changePassword } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // Profile form
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        businessName: user?.businessName || '',
        businessType: user?.businessType || '',
        address: user?.address || '',
        city: user?.city || '',
        state: user?.state || '',
        pincode: user?.pincode || '',
    });

    // Password change form
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // 🔄 Load vendor profile on mount
    useEffect(() => {
        if (user) {
            fetchVendorProfile();
        }
    }, [user]);

    const fetchVendorProfile = async () => {
        try {
            setProfileLoading(true);
            console.log('🔄 Fetching vendor profile...');

            // ✅ GET /vendor/profile
            const result = await apiService.vendor.getProfile();
            console.log('📦 Profile Response:', result);

            if (result.success) {
                const vendorData = result.data?.data || result.data;
                setProfileData({
                    name: vendorData.name || user?.name || '',
                    email: vendorData.email || user?.email || '',
                    phone: vendorData.phone || user?.phone || '',
                    businessName: vendorData.businessName || '',
                    businessType: vendorData.businessType || '',
                    address: vendorData.address || '',
                    city: vendorData.city || '',
                    state: vendorData.state || '',
                    pincode: vendorData.pincode || '',
                });
                toast.success('✅ Profile loaded');
            }
        } catch (error) {
            console.error('🔴 Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setProfileLoading(false);
        }
    };

    // ✅ Update vendor profile (PATCH /vendor/profile)
    const handleUpdateProfile = async () => {
        if (!profileData.name || !profileData.email) {
            toast.error('Name and email are required');
            return;
        }

        try {
            setLoading(true);
            console.log('📤 Updating profile:', profileData);

            const result = await apiService.vendor.updateProfile(profileData);
            console.log('📍 Update Profile Response:', result);

            if (result.success) {
                toast.success('✅ Profile updated successfully');
                setIsEditingProfile(false);
                // Update auth context
                await updateProfile(profileData);
            } else {
                toast.error(result.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('🔴 Error updating profile:', error);
            toast.error('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Change password (POST /vendor/change-password)
    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error('All password fields are required');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }

        try {
            setLoading(true);
            console.log('🔐 Changing password...');

            const result = await apiService.vendor.changePassword({
                oldPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            console.log('📍 Change Password Response:', result);

            if (result.success) {
                toast.success('✅ Password changed successfully');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setActiveTab('profile');
            } else {
                toast.error(result.error || 'Failed to change password');
            }
        } catch (error) {
            console.error('🔴 Error changing password:', error);
            toast.error('Error changing password');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Refresh token (POST /vendor/refresh-token)
    const handleRefreshToken = async () => {
        try {
            setLoading(true);
            console.log('🔄 Refreshing token...');

            const result = await apiService.vendor.refreshToken();
            console.log('📍 Refresh Token Response:', result);

            if (result.success) {
                const newToken = result.data?.data?.token || result.data?.token;
                if (newToken) {
                    localStorage.setItem('token', newToken);
                    toast.success('✅ Token refreshed');
                }
            } else {
                toast.error('Failed to refresh token');
            }
        } catch (error) {
            console.error('🔴 Error refreshing token:', error);
            toast.error('Error refreshing token');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Logout from all devices (POST /vendor/logout-all)
    const handleLogoutAll = async () => {
        if (!window.confirm('This will logout from all devices. Continue?')) {
            return;
        }

        try {
            setLoading(true);
            console.log('🚪 Logging out from all devices...');

            const result = await apiService.vendor.logoutAll();
            console.log('📍 Logout All Response:', result);

            if (result.success) {
                toast.success('✅ Logged out from all devices');
                await logout();
            } else {
                toast.error('Failed to logout');
            }
        } catch (error) {
            console.error('🔴 Error logging out:', error);
            toast.error('Error logging out');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Google login (POST /vendor/google-login)
    const handleGoogleLogin = async (credential) => {
        try {
            setLoading(true);
            console.log('🔐 Processing Google login...');

            const vendorId = localStorage.getItem('vendorId') || localStorage.getItem('tenantId');
            const result = await apiService.vendor.googleLogin({
                credential: credential,
                vendorId: vendorId,
            });
            console.log('📍 Google Login Response:', result);

            if (result.success) {
                toast.success('✅ Google authentication linked');
            } else {
                toast.error(result.error || 'Failed to link Google account');
            }
        } catch (error) {
            console.error('🔴 Error with Google login:', error);
            toast.error('Error linking Google account');
        } finally {
            setLoading(false);
        }
    };

    if (profileLoading) {
        return (
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 ml-[290px]">
                    <Header />
                    <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                        <div className="text-center">
                            <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
                            <p className="text-gray-600">Loading profile...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-4 sm:p-6 lg:p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                <FaUser className="text-blue-600" /> Vendor Profile
                            </h1>
                            <p className="text-gray-600 mt-2">Manage your account information and security</p>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-lg card-shadow">
                            <div className="border-b border-gray-200 flex">
                                {['profile', 'password', 'security'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-4 font-medium text-center transition ${activeTab === tab
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-600 hover:text-gray-800'
                                            }`}
                                    >
                                        {tab === 'profile' && '👤 Profile'}
                                        {tab === 'password' && '🔐 Password'}
                                        {tab === 'security' && '🔒 Security'}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                {/* ===== PROFILE TAB ===== */}
                                {activeTab === 'profile' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                                            {!isEditingProfile && (
                                                <button
                                                    onClick={() => setIsEditingProfile(true)}
                                                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                                >
                                                    <FaEdit /> Edit Profile
                                                </button>
                                            )}
                                        </div>

                                        {isEditingProfile ? (
                                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                                        <input
                                                            type="text"
                                                            value={profileData.name}
                                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                                        <input
                                                            type="email"
                                                            value={profileData.email}
                                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                                        <input
                                                            type="tel"
                                                            value={profileData.phone}
                                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                                                        <input
                                                            type="text"
                                                            value={profileData.businessName}
                                                            onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                                                        <input
                                                            type="text"
                                                            value={profileData.businessType}
                                                            onChange={(e) => setProfileData({ ...profileData, businessType: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                                    <input
                                                        type="text"
                                                        value={profileData.address}
                                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                                        <input
                                                            type="text"
                                                            value={profileData.city}
                                                            onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                                        <input
                                                            type="text"
                                                            value={profileData.state}
                                                            onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                                                        <input
                                                            type="text"
                                                            value={profileData.pincode}
                                                            onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 transition"
                                                    >
                                                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                                        {loading ? 'Saving...' : 'Save Changes'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsEditingProfile(false)}
                                                        className="flex items-center gap-2 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                                                    >
                                                        <FaTimes /> Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {[
                                                    { label: 'Full Name', value: profileData.name },
                                                    { label: 'Email', value: profileData.email },
                                                    { label: 'Phone', value: profileData.phone },
                                                    { label: 'Business Name', value: profileData.businessName },
                                                    { label: 'Business Type', value: profileData.businessType },
                                                    { label: 'City', value: profileData.city },
                                                    { label: 'State', value: profileData.state },
                                                    { label: 'Pincode', value: profileData.pincode },
                                                ].map((item) => (
                                                    <div key={item.label} className="bg-gray-50 p-4 rounded-lg">
                                                        <p className="text-sm text-gray-600">{item.label}</p>
                                                        <p className="text-lg font-semibold text-gray-800 mt-1">{item.value || 'N/A'}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ===== PASSWORD TAB ===== */}
                                {activeTab === 'password' && (
                                    <div className="space-y-6 max-w-md">
                                        <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
                                        <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password *</label>
                                                    <input
                                                        type="password"
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
                                                    <input
                                                        type="password"
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password *</label>
                                                    <input
                                                        type="password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                                                    ✓ Password must be at least 6 characters
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
                                                >
                                                    {loading ? <FaSpinner className="animate-spin" /> : <FaLock />}
                                                    {loading ? 'Changing...' : 'Change Password'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* ===== SECURITY TAB ===== */}
                                {activeTab === 'security' && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-semibold text-gray-800">Security Settings</h2>

                                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Management</h3>
                                            <p className="text-sm text-gray-600 mb-4">Logout from all devices to end all active sessions</p>
                                            <button
                                                onClick={handleLogoutAll}
                                                disabled={loading}
                                                className="w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
                                            >
                                                {loading ? <FaSpinner className="animate-spin" /> : <FaSignOutAlt />}
                                                {loading ? 'Processing...' : 'Logout From All Devices'}
                                            </button>
                                        </div>

                                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Token Management</h3>
                                            <p className="text-sm text-gray-600 mb-4">Refresh your authentication token</p>
                                            <button
                                                onClick={handleRefreshToken}
                                                disabled={loading}
                                                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
                                            >
                                                {loading ? 'Refreshing...' : '🔄 Refresh Token'}
                                            </button>
                                        </div>

                                        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Authentication</h3>
                                            <p className="text-sm text-gray-600 mb-4">Link your Google account for easier login</p>
                                            <button
                                                onClick={() => handleGoogleLogin('demo-credential')}
                                                disabled={loading}
                                                className="w-full bg-white border-2 border-purple-500 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 disabled:opacity-50 transition flex items-center justify-center gap-2"
                                            >
                                                {loading ? <FaSpinner className="animate-spin" /> : <FaGoogle />}
                                                {loading ? 'Processing...' : 'Link Google Account'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorProfile;
