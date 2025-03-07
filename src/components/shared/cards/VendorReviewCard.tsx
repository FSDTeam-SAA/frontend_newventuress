import Image from "next/image";
import React from "react";
import { LuBox } from "react-icons/lu";
import { StarRating } from "../clientReview/StarRating";
import moment from "moment";

interface CustomerReviewsCardProps {
  imageSrc: string; // Path to the image
  name: string; // Customer name
  date: string; // Review date
  review: string; // Review text
  storeName?: string; // Store name
  rating: number; // rating number
}

const VendorReviewCard: React.FC<CustomerReviewsCardProps> = ({
  imageSrc,
  name,
  date,
  review,
  storeName,
  rating, 
}) => {
  return (
    <div className=" mt-5 pb-6 ">
      <div className="flex items-center gap-x-[8px] lg:gap-x-[12px] ">
        <div className="w-[52px] h-[52px] lg:h-[80px] lg:w-[80px] rounded-full overflow-hidden">
          <Image
            src={imageSrc}
            alt="Customer Image"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div>
            <div className="flex">
              <h2 className="text-[20px] lg:text-[25px] text-[#3D3D3D] font-semibold leading-[24px] lg:leading-[30px]">
                {name} .
              </h2>
              <p className="text-[12px] lg:text-base text-[#B0B0B0] font-normal leading-[] lg:leading-[19.2px] pt-[11px] ml-[6px]">
                {moment(date).format("YYYY-MM-DD")}
              </p>
            </div>
          </div>
          <div className="flex gap-x-1 mt-2 lg:mt-4">
            <StarRating rating={rating} className="w-[20px] h-[20px]" />
            <p className="text-base text-[#3D3D3D] font-medium leading-[19.2px]">
              ({rating}.0)
            </p>
          </div>
        </div>
      </div>
      <p className="text-base text-[#444444] font-normal leading-[19.2px] mt-5">
        {review}
      </p>
      {storeName && (
        <div className="flex items-center gap-x-[6px] mt-5">
        <span>
          <LuBox className="text-xl text-[#2A6C2D]" />
        </span>
        <p className="text-base text-[#2A6C2D] font-medium leading-[19.2px]">
          {storeName}
        </p>
      </div>
      )}
      
    </div>
  );
};

export default VendorReviewCard;
