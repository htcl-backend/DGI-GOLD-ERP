import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaFileInvoiceDollar, FaClipboardList, FaMapMarkerAlt, FaCogs, FaGift, FaHistory, FaWallet } from "react-icons/fa";
import { apiFetch } from "../api";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/signin");
            return;
        }

        const parsed = JSON.parse(storedUser);
        if (!parsed?._id) {
            navigate("/signin");
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            setError("");
            try {
                const result = await apiFetch(`/users/${parsed._id}`);
                setUser(result.data);
                localStorage.setItem("user", JSON.stringify(result.data));
            } catch (err) {
                setError(err.message || "Unable to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-gray-600">Loading profile…</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#fff9ea] to-[#f3eee7] px-6 py-10">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-semibold text-[#4b3816]">My Profile</h1>
                        <p className="text-sm text-[#6b5a44] mt-1">Account · Portfolio · Settings</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                            onClick={() => navigate("/dashboard")}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center gap-4 p-6 bg-[#fef7e9] rounded-2xl">
                            <div className="w-20 h-20 rounded-full bg-amber-200 flex items-center justify-center text-3xl text-white">
                                {user?.username?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-[#4b3816]">{user?.username || "User"}</h2>
                                <p className="text-sm text-[#6b5a44]">{user?.email}</p>
                                <p className="text-sm text-[#6b5a44]">{user?.phone}</p>
                                {user?._id && (
                                    <p className="text-xs text-[#a07a57] mt-2">ID: {user._id}</p>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={item.action}
                                        className="flex flex-col items-center justify-center gap-2 p-4 border border-amber-200 rounded-xl hover:shadow-md transition bg-white"
                                    >
                                        <item.icon className="text-amber-500" size={22} />
                                        <span className="text-sm font-medium text-[#4b3816]">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <section className="mt-8">
                        <h3 className="text-lg font-semibold text-[#4b3816] mb-4">Your Holdings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl border border-amber-200 bg-white">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-[#4b3816]">Gold</h4>
                                    <span className="text-xs text-[#a07a57]">Today’s Rate: ₹/g</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[#6b5a44]">Your Holdings</span>
                                        <span className="font-semibold text-[#4b3816]">12 g</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[#6b5a44]">Value Today</span>
                                        <span className="font-semibold text-[#4b3816]">₹0.00</span>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button className="flex-1 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition">
                                            Buy
                                        </button>
                                        <button className="flex-1 py-2 rounded-lg border border-amber-500 text-amber-600 hover:bg-amber-50 transition">
                                            Sell
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-[#4b3816]">Silver</h4>
                                    <span className="text-xs text-[#a07a57]">Today’s Rate: ₹/g</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[#6b5a44]">Your Holdings</span>
                                        <span className="font-semibold text-[#4b3816]">14 g</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[#6b5a44]">Value Today</span>
                                        <span className="font-semibold text-[#4b3816]">₹0.00</span>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button className="flex-1 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800 transition">
                                            Buy
                                        </button>
                                        <button className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-700 hover:bg-slate-50 transition">
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
    );
};

export default Profile;
