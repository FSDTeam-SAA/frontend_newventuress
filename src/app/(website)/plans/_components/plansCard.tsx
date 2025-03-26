"use client";

import { Button } from "@/components/ui/button";
import { MembershipPlan } from "@/types/membership";
import { useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import PlansPayment from "./plansPayment";

interface Props {
  data: MembershipPlan;
  userId: string | undefined
}

function PlansCard({ data , userId}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full border border-[#A3A6AF] rounded-[16px] relative hover:shadow-lg transition-all duration-300">
      {data.planType === "standard" && (
        <div className="bg-primary py-[6px] rounded-tl-[16px] rounded-tr-[16px] absolute w-full dark:bg-pinkGradient">
          <h4 className="text-center text-[11px] text-[#F8ECEC] leading-[13.2px] font-mideum ">
            Most Popular
          </h4>
        </div>
      )}
      <div className="px-6 gap-[40px] pt-[75.5px]">
        <h2 className="text-xl text-gradient dark:text-gradient-pink font-semibold leading-[24px]">
          {data.planType.toUpperCase()}
        </h2>
        <p className="text-base text-[#696767] font-normal leading-[19.2px] mt-2">
          {data.description}
        </p>
        <h4 className="text-[22px] text-[#1A1A1A] font-bold leading-[26.4px] mt-6">
          ${data.price}
        </h4>
        <div className="mt-[24px]">
          <Button onClick={() => setIsOpen(true)} className="w-full  ">
            Purchase Now
          </Button>
          <PlansPayment
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            data={data}
            userId={userId}
          />
        </div>
      </div>
      {/* 2nd div */}
      <div className="px-6 mt-10 pb-[75.5px]">
        {/* item-1 */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>
              <IoCheckmarkCircle size={16} className="text-[#121D42] dark:text-[#845CC4]" />
            </span>
            <p className="text-sm text-[#444444] font-normal leading-[16.8px]">
              Auction
            </p>
          </div>
          <div>
            <p className="text-sm text-gradient dark:text-gradient-pink font-bold leading-[16.8px]">
              {data.numberOfAuction}
            </p>
          </div>
        </div>
        {/* item-2 */}
        <div className="flex justify-between items-center mt-5">
          <div className="flex items-center gap-2">
            <span>
              <IoCheckmarkCircle size={16} className="text-[#121D42] dark:text-[#845CC4]" />
            </span>
            <p className="text-sm text-[#444444] font-normal leading-[16.8px]">
              Bids
            </p>
          </div>
          <div>
            <p className="text-sm text-gradient dark:text-gradient-pink font-bold leading-[16.8px]">
              {data.numberOfBids}
            </p>
          </div>
        </div>
          {/* item-3 */}
        <div className="flex justify-between items-center mt-5">
          <div className="flex items-center gap-2">
            <span>
              <IoCheckmarkCircle size={16} className="text-[#121D42] dark:text-[#845CC4]" />
            </span>
            <p className="text-sm text-[#444444] font-normal leading-[16.8px]">
             Listing
            </p>
          </div>
          <div>
            <p className="text-sm text-gradient dark:text-gradient-pink font-bold leading-[16.8px]">
               {data.numberOfListing}
            </p>
          </div>
        </div>
        {/* item-3 */}
        <div className="flex justify-between items-center mt-5">
          <div className="flex items-center gap-2">
            <span>
              <IoCheckmarkCircle size={16} className="text-[#121D42] dark:text-[#845CC4]" />
            </span>
            <p className="text-sm text-[#444444] font-normal leading-[16.8px]">
              Messages
            </p>
          </div>
          <div>
            <p className="text-sm text-gradient dark:text-gradient-pink font-bold leading-[16.8px]">
              Unlimited
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default PlansCard;
