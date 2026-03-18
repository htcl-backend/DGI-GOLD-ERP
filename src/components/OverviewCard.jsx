import React from "react";
import { IoIosArrowUp } from "react-icons/io";

const OverviewCard = ({ title, value, icon: Icon, bgColor = "bg-orange-500", change, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg card-shadow p-6 flex justify-between items-start cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex flex-col gap-3">
        <span className="text-[14px] font-medium text-gray-600">{title}</span>
        <div>
          <span className="text-[28px] font-bold text-gray-800">{value}</span>
        </div>
        <div className="flex items-center gap-1">
          <IoIosArrowUp className="text-orange-500 text-sm" />
          <span className="text-xs text-orange-500 font-medium">{change}</span>
          <span className="text-xs text-gray-500">from last month</span>
        </div>
      </div>
      <div className={`${bgColor} rounded-lg p-3 flex items-center justify-center`}>
        {Icon && <Icon className="text-white text-2xl" />}
      </div>
    </div>
  );
};

export default OverviewCard;
