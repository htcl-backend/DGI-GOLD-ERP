import React from "react";
import { RxDashboard } from "react-icons/rx";
import OverviewCard from "./OverviewCard";
import { CiShoppingCart } from "react-icons/ci";
import { RiMenuAddFill } from "react-icons/ri";
import { IoMdContact } from "react-icons/io";

const ReportDetails = () => {
  return (
    <div className="px-4 mt-5">
      <div className="flex items-center gap-2">
        <RxDashboard className="text-[#cc7b25ff] text-2xl" />
        <span className="leading-[30px] font-[700] text-[20px]">Overview</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
        <OverviewCard
          text="New"
          number="21"
          growthrate="5.39"
          bgColor="FDF7F2FF"
          icon={<CiShoppingCart />}
        />
        <OverviewCard
          text="Open"
          number="31"
          growthrate="5.39"
          bgColor="EEFCFFFF"
          icon={<RiMenuAddFill />}
        />
        <OverviewCard
          text="All"
          number="298"
          growthrate="6.84"
          bgColor="F0F8FEFF"
          icon={<IoMdContact />}
        />
      </div>
    </div>
  );
};

export default ReportDetails;
