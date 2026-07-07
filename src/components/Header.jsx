import React, { useState, useRef, useEffect } from "react";
import { IoNotifications } from "react-icons/io5";
import { FaCaretDown } from "react-icons/fa6";
import defaultProfileImg from "../assets/images/users/user-1.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { useData } from "../Contexts/DataContext";
import { useAuth } from "../Contexts/AuthContext";
import { vendorNavItems } from "./Layout/VendorLayout";
import { superAdminNavItems } from "./Layout/SuperAdminLayout";

// Header component
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // hamburger menu state
  const { notifications } = useData();
  const { user } = useAuth();
  const location = useLocation();
  const unreadCount = notifications.filter(n => !n.read).length;

  const dropdownRef = useRef(null);
  const menuRef = useRef(null); // ref for hamburger menu panel

  const allNavItems = [...vendorNavItems, ...superAdminNavItems];
  const currentNavItem = allNavItems.find(item => location.pathname.startsWith(item.path));
  const pageTitle = currentNavItem ? currentNavItem.label : "Dashboard";

  const profileImage =
    user?.profileImage ||
    user?.profilePhotoUrl ||
    user?.avatar ||
    user?.photoURL ||
    user?.profile_image ||
    user?.image ||
    defaultProfileImg;

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close profile dropdown on outside click / Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setIsMenuOpen(false);
      }
    };

    if (isDropdownOpen || isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDropdownOpen, isMenuOpen]);

  const navigate = useNavigate();

  return (
    <div className="flex-1">
      <div className="relative flex items-center justify-between h-[72px] header-shadow px-4">
        <div className="flex items-center gap-3">
          {/* Hamburger menu - only visible on small/medium screens */}
          <div className="relative lg:hidden" ref={menuRef}>
            <button
              className="p-2 -ml-2 rounded-md hover:bg-gray-100 transition"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#cc7b25ff]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Dropdown panel with sidebar nav items */}
            {isMenuOpen && (
              <div className="absolute left-0 top-[calc(100%+8px)] w-[220px] bg-white shadow-lg rounded-md z-50 max-h-[70vh] overflow-y-auto">
                <ul className="text-gray-800 py-2">
                  {allNavItems.map((item, index) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                      <li
                        key={index}
                        className={`px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 ${
                          isActive ? "text-[#cc7b25ff] bg-orange-50 font-semibold" : ""
                        }`}
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate(item.path);
                        }}
                      >
                        {item.icon && <span className="text-lg">{item.icon}</span>}
                        <span>{item.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <span className="text-2xl font-[700] text-[#cc7b25ff]">{pageTitle}</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <div>
            <ul className="text-gray-800">
              <li
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer relative"
                onClick={() => {
                  navigate("/notifications");
                }}
              >
                <IoNotifications
                  className={`text-[#cc7b25ff] w-8 h-8 transition-transform ${
                    unreadCount > 0 ? "animate-bell-ring" : ""
                  }`}
                />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-2 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-red-600 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  </span>
                )}
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-1 relative" ref={dropdownRef}>
            <img
              src={profileImage}
              alt="Profile"
              className="w-[36px] rounded-full cursor-pointer"
              onClick={toggleDropdown}
            />
            <span>{user?.name || user?.email || "User"}</span>
            <FaCaretDown
              onClick={toggleDropdown}
              className="cursor-pointer text-[#CC7B25FF]"
            />
            {isDropdownOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-[150px] bg-white shadow-md rounded-md z-50">
                <ul className="text-gray-800">
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/vendor/profile");
                    }}
                  >
                    My Account
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      localStorage.removeItem("token");
                      navigate("/signin");
                    }}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;