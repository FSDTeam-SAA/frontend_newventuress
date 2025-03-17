"use client";
// Packages
// import { Flame, Star } from "lucide-react";
import Image from "next/image";

// Local imports
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { Rating } from "@/components/ui/Rating";
// import { useCountdown } from "@/hooks/useCountDown";
import { Product } from "@/types/product";
import { Star } from "lucide-react";
import { Rating } from "@/components/ui/Rating";
import dynamic from "next/dynamic";

const AuctionCountDownTimer = dynamic(
  () => import("@/components/shared/cards/auction-card/countdown-timer"),
  { ssr: false }
);

export default function BiddingCard({ product }: { product: Product }) {

  
  const endDate = new Date(product?.endingDateAndTime);
  const isExpired = new Date() > endDate;

  return (
    <Card className="relative p-[16px] shadow-none">
      <div className="overflow-hidden rounded-[8px]">
        <Image
          height={300}
          width={400}
          src={product?.images?.[0] || "https://images.pexels.com/photos/8330975/pexels-photo-8330975.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
          alt="American Beauty product"
          className="h-[266px] w-full rounded-[8px] object-cover duration-300 hover:scale-105"
        />
        <Button className="absolute -right-[10px] -top-[10px] h-[56px] w-[56px] rounded-full bg-primary p-0 hover:bg-[#2c6130]">
          <Image
            src="/assets/svg/hammer.svg"
            alt="hammer"
            width={24}
            height={24}
          />
        </Button>
      </div>

      <CardContent className="mt-[10px] p-0">
        <Button className="mb-4 w-full">Bid Now</Button>

        <div className="mb-2 flex items-center justify-center gap-1">
          {[...Array(4)].map((_, i) => (
            <Star
              key={i}
              className="h-[16px] w-[16px] fill-[#FF8A00] text-[#FF8A00]"
            />
          ))}
          <Rating productId={product?._id} />
          <Star className="h-[16px] w-[16px] fill-[#CCCCCC] text-[#CCCCCC]" />
        </div>
        {/* <div className="flex items-center justify-center text-[16px] font-normal leading-[19.2px] text-[#E10E0E]">
          <Flame className="mr-1 h-4 w-4" />
          Hot
          <span className="ml-2 text-[#9C9C9C]">8 Views</span>
        </div> */}

        <h2 className="text-gradient dark:text-gradient-pink mb-2 text-center text-[25px] font-semibold leading-[30px]">
          {product?.title}
        </h2>

        <div className="mb-4 flex items-baseline justify-center gap-2">
          <span className="text-xl font-bold">${product?.startingPrice || 0}</span>
          <span className="text-sm text-gray-400 line-through">
            {/* ₿{product.selllingPrice} */}
          </span>
        </div>

     <div className="p-5">
     {!isExpired && <AuctionCountDownTimer endDate={endDate} />}
     </div>
  
      
      </CardContent>
    </Card>
  );
}
