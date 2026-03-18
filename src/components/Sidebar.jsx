import React, { useContext, useState } from "react";
import logo from "../assets/img/logo 2.svg";
import { RxDashboard } from "react-icons/rx";
import { HiNumberedList } from "react-icons/hi2";
import { FaFileAlt } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { PiUsersDuotone } from "react-icons/pi";
import { MdOutlineCalendarViewWeek, MdOutlineDeliveryDining } from "react-icons/md";
import { LuMessageSquareMore } from "react-icons/lu";
import { IoCode, IoNotifications, IoSettings, IoShapesOutline, IoTrainSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { HeaderContext } from "../Contexts/HeaderContext";
import { IoMdPin } from "react-icons/io";

const Sidebar = () => {
  //  selected state and setSelected function from HeaderContext
  const { selected, setSelected } = useContext(HeaderContext);

  // Local state to handle dropdown menu open/close for All and Reports
  const [menuOpenState, setMenuOpenState] = useState({
    isProduct: false,
    isReportOpen: false,
    isOrder: false,
    isGold: false,
  });

  const handleClick = (status) => {
    setSelected(status); // Update the selected section
  };

  // Function to toggle the dropdown menu state (Products or Reports)
  const toggleMenuState = (selectedState) => {
    setMenuOpenState((prev) => ({
      ...prev,
      [selectedState]: !prev[selectedState], // selected dropdown state
    }));
  };

  return (
    <div className="fixed left-0 top-0 w-[290px] sidebar-shadow h-screen overflow-y-auto z-50 bg-white text-black">
      <div className="flex items-center gap-[12px] relative pl-[15px] pt-[12px]">
        <img src={logo} alt="" className="w-[43px] h-[48px] rounded-[6px]" />
        <span className="text-[#a66002]  text-[24px] font-[700]">DGI GOLD</span>
      </div>
      <div
        className={`flex items-center gap-2 px-6 py-2 mt-4 rounded-xl cursor-pointer ${selected === "dashboard" ? "text-amber-500 bg-[#edcda4]" : ""
          }`}
        onClick={() => handleClick("dashboard")} // Set Dashboard as selected on click
      >
        <RxDashboard />
        <Link to="/dashboard">Dashboard</Link>
      </div>

      <div
        className={`flex items-center gap-2 px-6 py-2 mt-4 rounded-xl cursor-pointer ${selected === "orders" ? "text-amber-500 bg-[#edcda4]" : ""
          }`}
        onClick={() => toggleMenuState("isOrder")} // Toggle Report dropdown on click
      >
        <HiNumberedList size={24} />
        <span>Orders</span>
        <button className="ml-auto text-orange-600">
          {menuOpenState.isOrder ? "" : ""}
          {/* Show notification count if dropdown is closed */}
        </button>
      </div>

      {/* Dropdown for Order List */}
      {menuOpenState.isOrder && (
        <div className="pl-6 mt-2">
          <div
            className={`flex items-center gap-2 px-6 py-2 rounded-xl cursor-pointer ${selected === "OrderDetails" ? "text-amber-500 bg-[#edcda4]" : ""
              }`}
            onClick={() => {
              handleClick("OrderDetails");
            }} // Set Orders as selected
          >
            <HiNumberedList />
            <Link to={"/order-details"}>Order List</Link>
          </div>
        </div>
      )}

      {/* Reports Link with dropdown toggle */}
      <div
        className={`flex items-center gap-2 px-6 py-2 mt-4 rounded-xl cursor-pointer ${selected === "Reports" ? "text-amber-500 bg-[#edcda4]" : ""
          }`}
        onClick={() => toggleMenuState("isReportOpen")} // Toggle Report dropdown
      >
        <FaFileAlt size={24} />
        <span to={"/reports"}>Reports</span>
        <button className="ml-auto text-orange-600">
          {menuOpenState.isReportOpen ? "" : "9+"}{" "}
          {/* Show notification count if dropdown is closed */}
        </button>
      </div>

      {/* Dropdown for Report List */}
      {menuOpenState.isReportOpen && (
        <div className="pl-6 mt-2">
          <div
            className={`flex items-center gap-2 px-6 py-2 rounded-xl cursor-pointer ${selected === "ReportList" ? "text-amber-500 bg-[#edcda4]" : ""
              }`}
            onClick={() => handleClick("ReportList")} // Set ReportList as selected
          >
            <HiNumberedList />
            <Link to="/Reports/Reports-list">Report List</Link>
          </div>
        </div>
      )}

      {/* Products Link with dropdown toggle */}
      <div
        className={`flex items-center gap-2 px-6 py-2 mt-4 rounded-xl cursor-pointer ${selected === "products" ? "text-amber-500 bg-[#edcda4]" : ""
          }`}
        onClick={() => toggleMenuState("isProduct")} // Toggle Product dropdown
      >
        <AiFillProduct size={24} />
        <span className="ml-2">Products</span>
        <button className="ml-auto text-orange-600">
          {menuOpenState.isProduct ? "" : "9+"}{" "}
          {/* Show notification count if dropdown is closed */}
        </button>
      </div>

      {/* Dropdown for Product List, Inventory, and Add Product */}
      {menuOpenState.isProduct && (
        <div className="pl-6 mt-2">
          <div
            className={`flex items-center gap-2 px-6 py-2 rounded-xl cursor-pointer ${selected === "productList" ? "text-amber-500 bg-[#edcda4]" : ""
              }`}
            onClick={() => handleClick("productList")} // Set ProductList as selected
          >
            <HiNumberedList />
            <Link to="/product-list">Product List</Link>
          </div>
          <div
            className={`flex items-center gap-2 px-6 py-2 rounded-xl cursor-pointer ${selected === "inventory" ? "text-amber-500 bg-[#edcda4]" : ""
              }`}
            onClick={() => handleClick("inventory")} // Set Inventory as selected
          >
            <MdOutlineCalendarViewWeek />
            <Link to="/inventory">Inventory</Link>
          </div>
          <div
            className={`flex items-center gap-2 px-6 py-2 rounded-xl cursor-pointer ${selected === "addProduct" ? "text-amber-500 bg-[#edcda4]" : ""
              }`}
            onClick={() => handleClick("addProduct")} // Set AddProduct as selected
          >
            <AiFillProduct />
            <Link to="/add-product">Add Product</Link>
          </div>
        </div>
      )}

      {/* Gold Link with dropdown toggle */}
      <div
        className={`flex items-center gap-2 px-6 py-2 mt-4 rounded-xl cursor-pointer ${selected === "gold" ? "text-amber-500 bg-[#edcda4]" : ""
          }`}
        onClick={() => toggleMenuState("isGold")} // Toggle Gold dropdown
      >
        <AiFillProduct size={24} />
        <span className="ml-2">Gold</span>
        <button className="ml-auto text-orange-600">
          {menuOpenState.isGold ? "" : ""}
        </button>
      </div>

      {/* Dropdown for Buy Gold and Sell Gold */}
      {menuOpenState.isGold && (
        <div className="pl-6 mt-2">
          <div
            className={`flex items-center gap-2 px-6 py-2 rounded-xl cursor-pointer ${selected === "buyGold" ? "text-amber-500 bg-[#edcda4]" : ""
              }`}
            onClick={() => handleClick("buyGold")} // Set BuyGold as selected
          >
            <HiNumberedList />
            <Link to="/buy-gold">Buy Gold</Link>
          </div>
          <div
            className={`flex items-center gap-2 px-6 py-2 rounded-xl cursor-pointer ${selected === "sellGold" ? "text-amber-500 bg-[#edcda4]" : ""
              }`}
            onClick={() => handleClick("sellGold")} // Set SellGold as selected
          >
            <HiNumberedList />
            <Link to="/sell-gold">Sell Gold</Link>
          </div>
        </div>
      )}

      {/* Customer Link */}
      <div
        className={`flex items-center gap-2 px-6 py-2 mt-4 rounded-xl cursor-pointer ${selected === "customer" ? "text-amber-500 bg-[#edcda4]" : ""
          }`}
        onClick={() => handleClick("customer")} // Set Customer as selected
      >
        <PiUsersDuotone />
        <Link to="/customer">Customers</Link>
      </div>

      {/* Delivered Link */}
      <div
        className={`flex items-center gap-2 px-6 py-2 mt-4 rounded-xl cursor-pointer ${selected === "delivered" ? "text-amber-500 bg-[#edcda4]" : ""
          }`}
        onClick={() => handleClick("delivered")} // Set Delivered as selected
      >
        <MdOutlineDeliveryDining />
        <Link to="/delivered">Delivered</Link>
      </div>

      {/* Categories Link */}
      <div
        className={`flex items-center gap-2 px-6 py-2 mt-4 rounded-xl cursor-pointer ${selected === "Categories" ? "text-amber-500 bg-[#edcda4]" : ""
          }`}
        onClick={() => handleClick("Categories")} // Set Categories as selected
      >
        <MdOutlineCalendarViewWeek style={{ transform: "rotate(89deg)" }} />
        <Link to="/categories">Categories</Link>
      </div>

      {/* Delivery Management Link */}
      {/* <div
        className={`flex items-center gap-2 px-6 py-2 mt-4 rounded-xl cursor-pointer ${selected === "delivery-management" ? "text-amber-500 bg-[#edcda4]" : ""
          }`}
        onClick={() => handleClick("delivery-management")}
      >
        <MdOutlineDeliveryDining />
        <Link to="/delivery-management">Delivery Management</Link>
      </div> */}

      {/* Sales Link */}
      <div
        className={`flex items-center gap-2 px-6 py-2 mt-4 rounded-xl cursor-pointer ${selected === "sales" ? "text-amber-500 bg-[#edcda4]" : ""
          }`}
        onClick={() => handleClick("sales")}
      >
        <FaFileAlt />
        <Link to="/sales">Sales / Retail Billing</Link>
      </div>

      {/* Purchase Management Link */}
      <div
        className={`flex items-center gap-2 px-6 py-2 mt-4 rounded-xl cursor-pointer ${selected === "purchase-management" ? "text-amber-500 bg-[#edcda4]" : ""
          }`}
        onClick={() => handleClick("purchase-management")}
      >
        <AiFillProduct />
        <Link to="/purchase-management">Purchase Management</Link>
      </div>

      {/* Accounts Link */}
      <div
        className={`flex items-center gap-2 px-6 py-2 mt-4 rounded-xl cursor-pointer ${selected === "accounts" ? "text-amber-500 bg-[#edcda4]" : ""
          }`}
        onClick={() => handleClick("accounts")}
      >
        <HiNumberedList />
        <Link to="/accounts">Accounts (GST, Invoices, Payments)</Link>
      </div>
      <div
        className={`flex items-center gap-2 px-6 py-2 mt-4 rounded-xl cursor-pointer ${selected === "transactions" ? "text-amber-500 bg-[#edcda4]" : ""
          }`}
        onClick={() => handleClick("transactions")} // Set Transactions as selected
      >
        <IoCode />
        <Link to="/transactions">Transactions</Link>
      </div>

      <div
        className={`flex items-center gap-2 px-6 py-2 mt-4 rounded-xl cursor-pointer ${selected === "notifications" ? "text-amber-500 bg-[#edcda4]" : ""
          }`}
        onClick={() => handleClick("notifications")} // Set Notifications as selected
      >
        <IoNotifications />
        <Link to="/Notifications">Notifications</Link>
      </div>

      {/* Settings Link */}
      <div
        className={`flex items-center gap-2 px-6 py-2 mt-4 rounded-xl cursor-pointer ${selected === "settings" ? "text-amber-500 bg-[#edcda4]" : ""
          }`}
        onClick={() => handleClick("settings")} // Set Settings as selected
      >
        <IoSettings />
        <Link to="/settings">Settings</Link>
      </div>
    </div>
  );
};

export default Sidebar;
