"use client";
// Packages
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { blurDataUrl } from "@/data/blur-data-url";
import { cn } from "@/lib/utils";

const AuctionCountDownTimer = dynamic(
  () => import("@/components/shared/cards/auction-card/countdown-timer"),
  { ssr: false }
);

interface Auction {
    _id: string;
    title: string;
    shortDescription?: string;
    productType?: string;
    startingPrice?: number; // Changed to optional
    startingDateAndTime: string;
    endingDateAndTime: Date;
    sku: string;
    stockQuantity: number;
    tags?: string[];
    images: string[];
  }

interface Props {
  auction: Auction;
  index: number;
}

export default function OurAuctionCard({ auction, index }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);

  const handleWishlistToggle = () => {
    setIsWishlist((prev) => !prev);
  };

  const endDate = new Date(auction.endingDateAndTime);
  const isExpired = new Date() > endDate;
  console.log("isExpired", isExpired);
  console.log('endDate', endDate);
  console.log(auction)

  return (
    <div className="flex relative flex-col grow shrink self-stretch p-3 my-auto mx-auto bg-white rounded-[8px] border border-gray-200 border-solid w-full md:h-auto hover:shadow-feature_card transition-shadow duration-300 h-[389px]">
      <motion.div
        className={cn(
          "rounded-[8px] overflow-hidden relative w-full",
          isExpired ? "h-[234px]" : "h-[155px]"
        )}
        initial={{ opacity: 0.8 }}
        animate={{
          opacity: imgLoaded ? 1 : 0.8,
          transition: { duration: 0.5, ease: "linear", delay: index * 0.1 },
        }}
      >
        <Link href={`/auction/${auction._id}`}>
          <Image
            loading="lazy"
            src={auction?.images?.[0] || "https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-autumn-camping.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
            alt={auction?.title}
            fill
            className="object-cover z-0 rounded-[8px] aspect-[1.07] hover:scale-105 duration-300"
            placeholder="blur"
            blurDataURL={blurDataUrl}
            onLoad={() => setImgLoaded(true)}
          />
        </Link>
      </motion.div>
      {imgLoaded && (
        <motion.div
          initial={{ opacity: 0.5, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.4, ease: "circIn" } }}
          className="absolute -top-[10px] -right-[10px] rounded-full w-[48px] h-[48px] p-0 bg-gradient-to-r from-[#121D42] via-[#152764] to-[#4857BD] hover:bg-[#121D42] flex justify-center items-center dark:bg-pinkGradient"
        >
          <Image src="/assets/svg/hammer.svg" alt="hammer" width={20} height={20} />
        </motion.div>
      )}
      <div className="flex absolute top-5 z-0 flex-col w-[32px] left-[22px]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleWishlistToggle();
          }}
          className={`flex gap-2.5 justify-center items-center px-2 bg-white rounded-full ${
            isWishlist ? "border-none text-white bg-primary" : "text-black hover:bg-hover-gradient dark:hover:bg-pinkGradient dark:hover:text-white"
          } min-h-[32px] w-[32px]`}
          aria-label="Add to wishlist"
        >
          <Heart className="group-hover:fill-white hover:border-0 w-4 h-4"  />
        </button>
      </div>
      <div className="flex z-0 flex-col mt-2 w-full">
        <div className="flex flex-col w-full">
          <div className="flex gap-10 justify-between items-center w-full">
            <p className="text-xs font-medium leading-[14px] text-[#9C9C9C]">8 Views</p>
          </div>
          <div className="mt-2 text-[16px] text-base font-medium leading-[19.2px] text-gradient dark:text-gradient-pink">
            {auction.title}
          </div>
          <div className="flex gap-1 items-end self-start mt-2 font-medium leading-tight">
            <div className="self-stretch text-base text-[16px] leading-[19.2px] text-[#1A1A1A]">
              ${auction.startingPrice || 0}
            </div>
          </div>
        </div>
        {!isExpired && <AuctionCountDownTimer endDate={endDate} />}
        <Button
          aria-label="Bid Now"
          disabled={isExpired}
          size="md"
          className={`mt-2 ${
            isExpired
              ? "bg-[#C5C5C5] text-base font-medium leading-[19px] text-white"
              : "bg-gradient-to-br from-[#121D42] via-[#152764] to-[#4857BD] text-base font-medium leading-[19px] text-white"
          }`}
        >
          {isExpired ? "Expired" : "Bid Now"}
        </Button>
      </div>
    </div>
  );
}
