import React, { useState } from "react";
import { IoNotifications } from "react-icons/io5";
import { FaCaretDown } from "react-icons/fa6";
import profileImg from "../assets/images/users/user-1.jpg";
import { useNavigate } from "react-router-dom";
import { useData } from "../Contexts/DataContext";
import { useAuth } from "../Contexts/AuthContext";

// Header component
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibi....
  const { notifications } = useData();
  const { user } = useAuth();
  const unreadCount = notifications.filter(n => !n.read).length;

  // Toggle the dropdown menu when profile is clicke....
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const navigate = useNavigate();
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between h-[72px] header-shadow px-4">
        <span className="text-2xl font-[700] text-[#cc7b25ff]">Dashboard</span>
        {/* Shows Dashboard*/}
        <div className="flex items-center justify-center gap-4">
          <div>
            <ul className="text-gray-800">
              <li
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer relative"
                onClick={() => {
                  navigate("/notifications");
                }}
              >
                <IoNotifications className="text-[#CC7B25FF] w-8 h-8" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-1">
            <img
              src={profileImg}
              alt="Profile"
              className="w-[36px] rounded-full cursor-pointer"
              onClick={toggleDropdown} // Toggle the dropdown when clicked
            />
            <span>{user?.name || user?.email || "User"}</span>
            <FaCaretDown
              onClick={toggleDropdown}
              className="cursor-pointer text-[#CC7B25FF]"
            />
            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-40 w-[150px] bg-white shadow-md rounded-md">
                <ul className="text-gray-800">
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      navigate("/settings");
                    }}
                  >
                    My Account
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      navigate("/signup");
                    }}
                  >
                    Add Account
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
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
