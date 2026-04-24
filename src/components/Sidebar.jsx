import React, { useContext } from "react";
import logo from "../assets/img/logo 2.svg";
import { RxDashboard } from "react-icons/rx";
import { HiNumberedList } from "react-icons/hi2";
import { FaFileAlt, FaWallet, FaUser } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { PiUsersDuotone } from "react-icons/pi";
import { MdOutlineCalendarViewWeek, MdOutlineDeliveryDining } from "react-icons/md";
import { IoNotifications, IoSettings, IoShapesOutline, IoTrainSharp } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { HeaderContext } from "../Contexts/HeaderContext";
import { IoMdPin } from "react-icons/io";
import { vendorNavItems } from "./Layout/VendorLayout";

const Sidebar = () => {
  const { selected, setSelected } = useContext(HeaderContext);

  const handleClick = (status) => {
    setSelected(status);
  };

  // ✅ Always show vendor nav items - super admin role is hidden
  const navItems = vendorNavItems;

  const iconMap = {
    dashboard: <RxDashboard />,
    wallet: <FaWallet />,
    orders: <HiNumberedList />,
    customers: <PiUsersDuotone />,
    products: <AiFillProduct />,
    inventory: <MdOutlineCalendarViewWeek />,
    "buy-gold": <AiFillProduct />,
    "sell-gold": <AiFillProduct />,
    deliveries: <MdOutlineDeliveryDining />,
    kyc: <IoMdPin />,
    profile: <FaUser />,
    notifications: <IoNotifications />,
    settings: <IoSettings />,
    vendors: <IoTrainSharp />,
    reports: <FaFileAlt />,
  };

  return (
    <div className="fixed left-0 top-0 w-[290px] sidebar-shadow h-screen overflow-y-auto z-50 bg-white text-black">
      <div className="flex items-center gap-[12px] relative pl-[15px] pt-[12px]">
        <img src={logo} alt="" className="w-[43px] h-[48px] rounded-[6px]" />
        <span className="text-[#a66002] text-[24px] font-[700]">DGI GOLD</span>
      </div>
      {navItems.map((item) => (
        <NavLink
          key={item.key}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-2 px-6 py-2 mt-4 rounded-xl cursor-pointer ${isActive ? "text-amber-500 bg-[#edcda4]" : "hover:bg-gray-100"}`
          }
          onClick={() => handleClick(item.key)}
        >
          {iconMap[item.key] || <IoShapesOutline />}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
