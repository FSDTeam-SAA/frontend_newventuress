'use client'
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a skeleton component in your UI folder
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import * as React from "react";
import { Mail, MapPin, MoveRight, Phone } from "lucide-react";

// Your existing Card component
const VendorStoreskeleton = ({ storeDetails, vendor, billingDetails }: any) => {
  if (!storeDetails || !vendor || !billingDetails) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-[500px]">
        <CardContent className="p-6 space-y-4">
          {/* Store Logo */}
          <Skeleton className="w-[130px] h-[130px] rounded-lg mb-4" />

          {/* Store Information */}
          <div>
            <Skeleton className="w-[200px] h-6 mb-2" />
            <Skeleton className="w-[300px] h-4 mb-4" />

            {/* Ratings & Followers */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-[12px] h-[12px] rounded-full" />
              <Skeleton className="w-[12px] h-[12px] rounded-full" />
              <Skeleton className="w-[12px] h-[12px] rounded-full" />
              <Skeleton className="w-[12px] h-[12px] rounded-full" />
              <Skeleton className="w-[12px] h-[12px] rounded-full" />
            </div>

            {/* Store Contact Details */}
            <div className="space-y-3 text-sm">
              <Skeleton className="w-[250px] h-4 mb-2" />
              <Skeleton className="w-[250px] h-4 mb-2" />
              <Skeleton className="w-[250px] h-4 mb-2" />
            </div>
          </div>
        </CardContent>

        {/* Visit Store Button */}
        <CardFooter className="p-6 pt-0">
          <Skeleton className="w-[150px] h-10" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-[500px]">
      <CardContent className="p-6 space-y-4">
        {/* Store Logo */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-[130px] h-[130px] rounded-lg flex items-center justify-center">
            <Image
              src={storeDetails.storeLogo || "https://media.istockphoto.com/id/597643860/photo/hemp-leaves.jpg?b=1&s=612x612&w=0&k=20&c=KQq9VxVqVzAvY5bAx7mSR0XWJIjniD3HAbgsZd40GX0="}
              alt={"not found image"}
              className="w-full h-full"
              loading="lazy"
              width={130}
              height={130}
            />
          </div>
        </div>

        {/* Store Information */}
        <div>
          <h2 className="text-lg md:text-[32px] font-medium mb-1 text-black">
            {storeDetails.storeName || "Unknown Store"}
          </h2>
          <p className="text-gray-600">{storeDetails.storeShortDescription || "No description available"}</p>

          {/* Ratings & Followers */}
          <div className="flex items-center gap-2 mb-4">
            {/* Rating stars */}
            <div className="flex">
              {[1, 2, 3, 4].map((star) => (
                <Image
                  key={star}
                  loading="lazy"
                  src="/assets/svg/star-fill.svg"
                  alt="star fill"
                  height={12}
                  width={12}
                  className="object-contain shrink-0 w-3 aspect-square fill-amber-500"
                />
              ))}
              <Image
                loading="lazy"
                src="/assets/svg/star-outline.svg"
                alt="star outline"
                height={12}
                width={12}
                className="object-contain shrink-0 w-3 aspect-square fill-stone-300"
              />
            </div>
            <span className="ml-1 text-sm text-gray-600">({vendor.rating || "No rating"})</span>
          </div>

          {/* Store Contact Details */}
          <div className="space-y-3 text-sm">
            {/* Address */}
            {billingDetails.address && (
              <div className="flex items-start gap-3 md:text-xl">
                <MapPin className="w-5 h-5 text-[#0057A8] shrink-0 mt-0.5" />
                <span className="text-gray-700">{billingDetails.address}</span>
              </div>
            )}
            {/* Phone */}
            {vendor?.customerSupport?.[0]?.phone && (
              <div className="flex items-center gap-3 md:text-xl">
                <Phone className="w-5 h-5 text-[#0057A8]" />
                <span className="text-gray-700">{vendor.customerSupport[0].phone}</span>
              </div>
            )}
            {/* Email */}
            {storeDetails.storeEmail && (
              <div className="flex items-center gap-3 md:text-xl">
                <Mail className="w-5 h-5 text-[#0057A8]" />
                <span className="text-gray-700">{storeDetails.storeEmail}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Visit Store Button */}
      <CardFooter className="p-6 pt-0">
        <Link href={`vendor-store/${vendor._id}`}>
          <Button
            className="text-sm bg-primary hover:bg-primary-hover text-white font-medium hover:gap-4 transition-all"
          >
            Visit Store
            <MoveRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VendorStoreskeleton;
