import React from "react";
import { IoIosArrowUp } from "react-icons/io";

const OverviewCard = ({ icon: Icon, title, value, bgColor = "bg-orange-500", change, onClick, text, number, growthrate }) => {
  // Handle backward compatibility for ReportDetails component
  const displayTitle = title || text;
  const displayValue = value || number;
  const displayChange = change || growthrate;

  return (
    <div
      className="bg-white rounded-lg card-shadow p-4 sm:p-5 lg:p-6 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow h-full"
      onClick={onClick}
    >
      <div className="flex flex-col gap-2 sm:gap-3">
        <span className="text-xs sm:text-sm lg:text-[14px] font-medium text-gray-600 line-clamp-2">{displayTitle}</span>
        <div>
          <span className="text-lg sm:text-2xl lg:text-[28px] font-bold text-gray-800 break-words">{displayValue}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2 sm:mt-3 flex-wrap">
        <IoIosArrowUp className="text-orange-500 text-xs sm:text-sm flex-shrink-0" />
        <span className="text-xs sm:text-xs lg:text-xs text-orange-500 font-medium line-clamp-1">{displayChange}</span>
        <span className="text-xs text-gray-500 hidden sm:inline">from last month</span>
      </div>
    </div>
  );
};

export default OverviewCard;
