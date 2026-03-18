import React, { useState, useEffect } from "react";
import { IoNotifications } from "react-icons/io5";
import { GoQuestion } from "react-icons/go";
import { FaCaretDown } from "react-icons/fa6";
import profileImg from "../assets/images/users/user-1.jpg";
import { useNavigate } from "react-router-dom";

// Header component
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibi....
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.username || "User");
      } catch (e) { console.error("Failed to parse user from localStorage", e); }
    }
  }, []);

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
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  navigate("/notifications");
                }}
              >
                <IoNotifications className="text-[#CC7B25FF]" />
              </li>
            </ul>
          </div>
          <div>
          </div>
          <div className="flex items-center gap-1">
            <img
              src={profileImg}
              alt="Profile"
              className="w-[36px] rounded-full cursor-pointer"
              onClick={toggleDropdown} // Toggle the dropdown when clicked
            />
            <span>{username}</span>
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
