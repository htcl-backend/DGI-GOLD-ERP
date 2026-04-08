import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FaUser, FaFileInvoiceDollar, FaClipboardList, FaMapMarkerAlt, FaCogs, FaGift, FaHistory, FaWallet } from "react-icons/fa";
import { useAuth } from "../Contexts/AuthContext";

const Profile = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate("/signin");
        }
    }, [user, navigate]);

    const menuItems = [
        { label: "Update Profile", icon: FaUser, action: () => navigate("/settings") },
        { label: "Nominee Details", icon: FaFileInvoiceDollar, action: () => navigate("/settings") },
        { label: "KYC", icon: FaClipboardList, action: () => navigate("/settings") },
        { label: "Delivery Address", icon: FaMapMarkerAlt, action: () => navigate("/settings") },
        { label: "Account Details", icon: FaCogs, action: () => navigate("/settings") },
        { label: "Billing Information", icon: FaWallet, action: () => navigate("/settings") },
        { label: "History", icon: FaHistory, action: () => navigate("/orders") },
        { label: "Redeem", icon: FaGift, action: () => navigate("/settings") },
    ];

    if (!user) {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 ml-[290px]">
                    <Header />
                    <div className="flex items-center justify-center h-screen bg-gray-50">
                        <div className="text-red-600">Please login to view your profile.</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-[290px]">
                <Header />
                <div className="p-8 min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-semibold text-gray-800">My Profile</h1>
                                <p className="text-sm text-gray-600 mt-1">Account · Portfolio · Settings</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    onClick={() => navigate(-1)}
                                >
                                    ← Back
                                </button>
                            </div>
                        </header>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Profile Card */}
                                <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                        {user?.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <div className="text-center">
                                        <h2 className="text-xl font-semibold text-gray-800">{user?.name || "User"}</h2>
                                        <p className="text-sm text-gray-600">{user?.email}</p>
                                        <p className="text-sm text-gray-600">{user?.phone || "N/A"}</p>
                                        {user?.id && (
                                            <p className="text-xs text-gray-500 mt-2">ID: {user.id}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 flex-wrap justify-center">
                                        <span className={`px-4 py-2 rounded-full text-xs font-semibold text-white ${user?.role === 'VENDOR' || user?.role === 'vendor'
                                            ? 'bg-blue-500'
                                            : 'bg-purple-600'
                                            }`}>
                                            {user?.role === 'VENDOR' || user?.role === 'vendor' ? '💼 Vendor' : '👑 Admin'}
                                        </span>
                                        <span className="px-3 py-2 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                            ✓ Verified
                                        </span>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="lg:col-span-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {menuItems.map((item) => (
                                            <button
                                                key={item.label}
                                                onClick={item.action}
                                                className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition bg-white"
                                            >
                                                <item.icon className="text-blue-500" size={22} />
                                                <span className="text-sm font-medium text-gray-800 text-center">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Holdings Section */}
                            <section className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Holdings</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Gold Card */}
                                    <div className="p-5 rounded-lg border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold text-gray-800">🏆 Gold</h4>
                                            <span className="text-xs text-gray-600">Today's Rate: ₹/g</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Your Holdings</span>
                                                <span className="font-semibold text-gray-800">12 g</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Value Today</span>
                                                <span className="font-semibold text-gray-800">₹0.00</span>
                                            </div>
                                            <div className="flex gap-3 mt-4">
                                                <button className="flex-1 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition font-semibold">
                                                    Buy
                                                </button>
                                                <button className="flex-1 py-2 rounded-lg border border-yellow-500 text-yellow-600 hover:bg-yellow-50 transition font-semibold">
                                                    Sell
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Silver Card */}
                                    <div className="p-5 rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold text-gray-800">💎 Silver</h4>
                                            <span className="text-xs text-gray-600">Today's Rate: ₹/g</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Your Holdings</span>
                                                <span className="font-semibold text-gray-800">14 g</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Value Today</span>
                                                <span className="font-semibold text-gray-800">₹0.00</span>
                                            </div>
                                            <div className="flex gap-3 mt-4">
                                                <button className="flex-1 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800 transition font-semibold">
                                                    Buy
                                                </button>
                                                <button className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-700 hover:bg-slate-50 transition font-semibold">
                                                    Sell
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
