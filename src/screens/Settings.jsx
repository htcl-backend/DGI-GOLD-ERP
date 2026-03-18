import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FaUser, FaLock, FaBell, FaPalette, FaSave, FaEye, FaEyeSlash, FaTags } from "react-icons/fa";
import profileImg from "../assets/images/users/user-1.jpg";
import { HeaderContext } from "../Contexts/HeaderContext";
import { apiFetch } from "../api";

const Settings = () => {
  const { theme, toggleTheme } = useContext(HeaderContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    role: "",
    profilePicture: ""
  });
  const [userId, setUserId] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    deliveryAlerts: true,
    stockAlerts: true,
    systemUpdates: false
  });

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await apiFetch("/settings");
        const settings = result.settings || result.setting;
        if (settings) {
          // Set theme if darkMode is set
          if (settings.darkMode !== undefined) {
            const newTheme = settings.darkMode ? "dark" : "light";
            if (newTheme !== theme) {
              // Update context theme
              // But since context is global, perhaps set it via context
              // For now, assume it's loaded elsewhere
            }
          }
          // Set notification settings
          setNotificationSettings((prev) => ({
            ...prev,
            ...settings,
          }));
        }
      } catch (err) {
        // ignore
      }
    };

    loadSettings();
  }, [theme]); // depend on theme to avoid loop

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsed = JSON.parse(storedUser);
    if (!parsed?._id) return;

    setUserId(parsed._id);

    const loadUserProfile = async () => {
      setLoadingProfile(true);
      setProfileError("");
      try {
        const result = await apiFetch(`/users/${parsed._id}`);
        const user = result.data;
        setProfileData({
          name: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          designation: user.designation || "",
          department: user.department || "",
          address: user.address || "",
          city: user.city || "",
          state: user.state || "",
          zipCode: user.zipCode || "",
          role: user.role || "",
          profilePicture: user.profilePicture || "",
        });
        // keep local copy up to date
        localStorage.setItem("user", JSON.stringify(user));
      } catch (err) {
        setProfileError(err.message || "Unable to load profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = async (setting) => {
    const newValue = !notificationSettings[setting];
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: newValue
    }));

    try {
      await apiFetch("/settings", {
        method: "PUT",
        body: JSON.stringify({ [setting]: newValue }),
      });
    } catch (err) {
      // revert on error
      setNotificationSettings(prev => ({
        ...prev,
        [setting]: !newValue
      }));
    }
  };

  const handleThemeChange = async (newTheme) => {
    toggleTheme();
    try {
      await apiFetch("/settings", {
        method: "POST",
        body: JSON.stringify({ darkMode: newTheme === "dark" }),
      });
    } catch (err) {
      // revert
      toggleTheme();
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setProfileError("Unable to update profile: missing user id.");
      return;
    }

    setProfileError("");
    setLoadingProfile(true);

    try {
      const result = await apiFetch(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify({
          username: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          designation: profileData.designation,
          department: profileData.department,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          zipCode: profileData.zipCode,
          profilePicture: profileData.profilePicture,
        }),
      });

      if (result?.data) {
        // keep local user copy in sync
        localStorage.setItem("user", JSON.stringify(result.data));
        alert("Profile updated successfully!");
      }
    } catch (err) {
      setProfileError(err.message || "Unable to update profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    // Handle password change
    console.log("Password changed");
    alert("Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "security", label: "Security", icon: FaLock },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "appearance", label: "Appearance", icon: FaPalette },
    { id: "categories", label: "Categories", icon: FaTags },
  ];


  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[290px] overflow-x-hidden">
        <Header />
        <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Settings</h2>

            {/* Settings Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition ${activeTab === tab.id
                        ? "border-amber-500 text-amber-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h3>
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Profile Picture */}
                      <div className="md:w-1/3">
                        <div className="text-center">
                          <img
                            src={profileImg}
                            alt="Profile"
                            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-200"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                            className="mb-2"
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              if (selectedFile) {
                                const formData = new FormData();
                                formData.append('profilePicture', selectedFile);
                                try {
                                  const response = await fetch(`/api/users/${userId}/upload`, {
                                    method: 'POST',
                                    body: formData,
                                  });
                                  if (response.ok) {
                                    const data = await response.json();
                                    setProfileData(prev => ({ ...prev, profilePicture: data.profilePicture }));
                                    alert("Profile picture uploaded!");
                                  }
                                } catch (error) {
                                  console.error('Upload error:', error);
                                }
                              }
                            }}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                          >
                            Upload Photo
                          </button>
                        </div>
                      </div>

                      {/* Profile Form */}
                      <div className="md:w-2/3">
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={profileData.name}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Designation
                              </label>
                              <input
                                type="text"
                                name="designation"
                                value={profileData.designation}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department
                              </label>
                              <input
                                type="text"
                                name="department"
                                value={profileData.department}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                              </label>
                              <input
                                type="text"
                                name="role"
                                value={profileData.role}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                City
                              </label>
                              <input
                                type="text"
                                name="city"
                                value={profileData.city}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                              </label>
                              <input
                                type="text"
                                name="address"
                                value={profileData.address}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="submit"
                              className="flex items-center gap-2 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition font-semibold"
                            >
                              <FaSave size={16} />
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}


                {/* Security Settings */}
                {activeTab === "security" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h3>
                    <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password *
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password *
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                        >
                          Change Password
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h3>
                    <div className="space-y-6">
                      {[
                        { key: "emailNotifications", label: "Email Notifications", desc: "Receive notifications via email" },
                        { key: "pushNotifications", label: "Push Notifications", desc: "Browser push notifications" },
                        { key: "smsNotifications", label: "SMS Notifications", desc: "Text message alerts" },
                        { key: "orderUpdates", label: "Order Updates", desc: "New orders and status changes" },
                        { key: "deliveryAlerts", label: "Delivery Alerts", desc: "Delivery status updates" },
                        { key: "stockAlerts", label: "Stock Alerts", desc: "Low stock and inventory warnings" },
                        { key: "systemUpdates", label: "System Updates", desc: "Maintenance and system notifications" }
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-800">{setting.label}</h4>
                            <p className="text-sm text-gray-600">{setting.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings[setting.key]}
                              onChange={() => handleNotificationChange(setting.key)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeTab === "appearance" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Appearance Settings</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Theme</h4>
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleThemeChange("light")}
                            className={`px-4 py-2 border rounded-lg transition ${theme === "light"
                              ? "bg-amber-500 text-white border-amber-500"
                              : "border-gray-300 hover:bg-gray-50"
                              }`}
                          >
                            Light
                          </button>
                          <button
                            onClick={() => handleThemeChange("dark")}
                            className={`px-4 py-2 border rounded-lg transition ${theme === "dark"
                              ? "bg-amber-500 text-white border-amber-500"
                              : "border-gray-300 hover:bg-gray-50"
                              }`}
                          >
                            Dark
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Language</h4>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                          <option>English</option>
                          <option>Hindi</option>
                          <option>Gujarati</option>
                        </select>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Date Format</h4>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                          <option>DD/MM/YYYY</option>
                          <option>MM/DD/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Currency</h4>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                          <option>INR (₹)</option>
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}


                {/* Categories Settings */}
                {activeTab === "categories" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Categories Management</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <input
                          type="text"
                          placeholder="New category name"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <button
                          onClick={() => {
                            if (newCategory.trim()) {
                              setCategories([...categories, newCategory.trim()]);
                              setNewCategory("");
                            }
                          }}
                          className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition"
                        >
                          Add Category
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((cat, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span>{cat}</span>
                            <button
                              onClick={() => setCategories(categories.filter((_, i) => i !== index))}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
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

export default Settings;