"use client"
import type React from "react"

import SectionHeading from "@/components/shared/SectionHeading/SectionHeading"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRef, useState } from "react"
import { CountdownTimer } from "./CountdownTimer"
import { ProductImageGallery } from "./ProductImageGallery"
import { ReviewSection } from "./review-section"

import { motion, useScroll, useTransform } from "framer-motion"

import { AuctionDetailsSkeleton } from "@/components/shared/acutindetailsSkeletion/AcuctionDetailsSkeletion"
import NotFound from "@/components/shared/NotFound/NotFound"
import ErrorContainer from "@/components/ui/error-container"
import type { AuctionResponse } from "@/types/auctiondetails"
import type { BidsResponse } from "@/types/bids"
import { useQuery } from "@tanstack/react-query"
import { Heart } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

const AuctionDetails = ({ auctionId }: { auctionId: string }) => {
  const session = useSession()
  const userid = session.data?.user.id

  const [isWishlist, setIsWishlist] = useState(false)
  const [islive] = useState(true)
  const [biddingPrice, setBiddingPrice] = useState<number | string>("")

  // animation
  const bidsRef = useRef(null)
  const reviewsRef = useRef(null)

  // Scroll progress for Related Items Section
  const { scrollYProgress: relatedItemsScrollY } = useScroll({
    target: bidsRef,
    offset: ["0 1", "1.33 1"],
  })
  const bidsItemsScale = useTransform(relatedItemsScrollY, [0, 1], [0.8, 1])

  // Scroll progress for Review Section
  const { scrollYProgress: reviewSectionScrollY } = useScroll({
    target: reviewsRef,
    offset: ["0 1", ".8 1"],
  })
  const reviewSectionScale = useTransform(reviewSectionScrollY, [0, 1], [0.8, 1])
  const reviewSectionOpacity = useTransform(reviewSectionScrollY, [0, 1], [0.8, 1])

  const handleWishlistToggle = () => {
    setIsWishlist((prev) => !prev) // Toggle wishlist state
  }

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBiddingPrice(value === "" ? "" : Number(value))
  }

  const handleBidClick = async () => {
    if (typeof biddingPrice !== "number" || biddingPrice <= 0) {
      toast("Please enter a valid bidding price.")
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/bid/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userid,
          auctionID: auctionId,
          bidValue: biddingPrice,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast(result.message || "Failed to place bid")
        return
      }

      toast(result.message || "Bid placed successfully")
    } catch (error) {
      console.error("Error placing bid:", error)
      toast("An error occurred while placing your bid")
    }
  }

  const { data, isError, isLoading, error } = useQuery<AuctionResponse>({
    queryKey: ["auctiondetails", auctionId],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auction/${auctionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
  })

  let content
  if (isLoading) {
    content = (
      <div className="container">
        <AuctionDetailsSkeleton />
      </div>
    )
  } else if (isError) {
    content = (
      <div className="container">
        <ErrorContainer message={error?.message || "Something went wrong"} />
      </div>
    )
  } else if (data && data?.data && data?.data?.length === 0) {
    content = (
      <div className="container">
        <NotFound message="Oops! No data available. Modify your filters or check your internet connection." />
      </div>
    )
  } else if (data && data?.data) {
    content = (
      <div>
        <div className="flex flex-wrap gap-8 w-full">
          <ProductImageGallery thumbnails={data?.data.images} mainImage={data?.data.images} />
          <div className="flex flex-col grow shrink justify-center min-w-[240px] w-[30%]">
            <div className="flex flex-col max-w-full">
              <div className="flex flex-col w-full">
                <div className="text-4xl font-semibold leading-tight text-gradient dark:text-gradient-pink">
                  {data?.data.title}
                </div>
              </div>
              <div className="mt-4 w-full text-[#444444] font-[16px] leading-[19px]">{data?.data.shortDescription}</div>
              {islive && (
                <div className="pt-5 pb-3 w-full">
                  <CountdownTimer startingTime={data?.data.startingDateAndTime} endingTime={data?.data.endingDateAndTime} />
                </div>
              )}
              <div className="flex gap-4 mt-3">
                <span className="text-[#9C9C9C]">Store:</span>
                <div className="flex space-x-2 items-center">
                  <Avatar className="w-[20px] h-[20px]">
                    <AvatarImage src={data?.data.storeLogo} alt="store name" />
                  </Avatar>
                  <div className="text-gradient dark:text-gradient-pink">{data?.data.storeName}</div>
                </div>
              </div>
              <div className="mt-5 w-full border border-solid border-b-stone-700 h-[1px]" />

              {/* Bidding input */}
              {islive && (
                <div className="flex flex-col max-w-[400px] pt-[25px]">
                  <label htmlFor="bidInput" className="text-base leading-tight text-neutral-700">
                    Your Bid Price
                  </label>
                  <div className="flex justify-between mt-2 w-full h-11 whitespace-nowrap rounded-md border border-solid border-neutral-400">
                    <label
                      htmlFor="bidInput"
                      className="gap-3 self-stretch px-4 font-semibold bg-[#E6EEF6] dark:bg-[#482D721A] rounded-lg h-[42px] w-[42px] flex items-center justify-center text-gradient dark:text-gradient-pink"
                    >
                      $
                    </label>
                    <input
                      id="bidInput"
                      type="number"
                      onChange={handleBidChange}
                      className="appearance-none [&::-webkit-inner-spin-button]:appearance-none dark:bg-white [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance:textfield] flex-1 shrink gap-2 self-stretch py-2 pr-5 pl-4 pb-2 my-auto text-base leading-snug rounded-lg min-w-[240px] text-black outline-none focus:outline-none focus:ring-0 focus:border-none"
                      aria-label="Bid amount in dollars"
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-col mt-6 w-full">
                {/* wishlist and bid */}
                <div className="flex gap-[40px] items-center justify-between mt-2 w-full">
                  {/* wishlist */}
                  <button
                    onClick={handleWishlistToggle}
                    className={`flex gap-2.5 justify-center items-center px-2 bg-white rounded-lg border border-solid ${
                      isWishlist ? "border-red-500 text-red-500" : "border-stone-300"
                    } h-[42px] min-h-[41px] w-[43px]`}
                    aria-label="Add to wishlist"
                  >
                    <Heart fill={isWishlist ? "red" : "none"} className="dark:text-black" />
                  </button>
                  {islive ? (
                    <Button
                      className="max-w-[320px] px-6 rounded-lg h-[43px] flex justify-center items-center w-full"
                      onClick={handleBidClick}
                    >
                      Bid Now
                    </Button>
                  ) : (
                    <button className="max-w-[320px] text-white bg-[#C5C5C5] px-6 rounded-lg h-[43px] flex justify-center items-center w-full">
                      Expired
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-10 w-full text-center max-md:max-w-full">
          <div className="text-2xl font-semibold leading-tight text-gradient dark:text-gradient-pink max-md:max-w-full">
            Description
          </div>
          <div className="mt-5 text-base leading-5 text-neutral-700 max-md:max-w-full">{data?.data.description}</div>
        </div>
      </div>
    )
  }

  const {
    data: bidData,
    isError: bidError,
    isLoading: isBidLoading,
  } = useQuery<BidsResponse>({
    queryKey: ["bids", auctionId],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/auction/${auctionId}`, {
        method: "GET",
      }).then((res) => res.json()),
  })

  let bidContent
  if (isBidLoading) {
    bidContent = <div className="container">Loading bids...</div>
  } else if (bidError) {
    bidContent = (
      <div className="container">
        <ErrorContainer message="Failed to load bids" />
      </div>
    )
  } else if (bidData && bidData?.data && bidData?.data.length === 0) {
    bidContent = (
      <div className="container">
        <NotFound message="No bids have been placed on this auction yet." />
      </div>
    )
  } else if (bidData && bidData?.data) {
    bidContent = (
      <div>
        <div className="container mt-[50px]">
          <h2 className="text-gradient dark:text-gradient-pink text-center text-[25px] font-[600]">Bids</h2>
          <div className="mb-[20px]">
            <h3 className="text-gradient dark:text-gradient-pink text-[20px] font-[600]">
              Total Bids Placed: {bidData.data.length}
            </h3>
            {!islive && (
              <>
                <p className="text-[#3D3D3D] text-[16px] font-[400]">Auction has expired</p>
                {bidData.data.length > 0 && (
                  <p className="text-[#3D3D3D] text-[16px] font-[400]">
                    Highest bidder was: {bidData.data[0].userName}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="border border-[#C5C5C5] rounded-lg overflow-hidden text-center">
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow className="bg-[#E6E6E6]">
                  <TableHead className="border-r-[1px] border-black text-center w-1/4 text-[#444444]">
                    Bidder Name
                  </TableHead>
                  <TableHead className="border-r-[1px] border-black text-center w-1/4 text-[#444444]">
                    Bidder Time
                  </TableHead>
                  <TableHead className="border-r-[1px] border-black text-center w-1/4 text-[#444444]">Bid</TableHead>
                  <TableHead className="text-center w-1/4 text-[#444444]">Auto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-[#444444]">
                {bidData.data.map((bid, index) => (
                  <TableRow key={index}>
                    <TableCell className="border-r-[1px] border-black w-1/4">{bid.userName}</TableCell>
                    <TableCell className="border-r-[1px] border-black w-1/4">
                      {new Date(bid.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="border-r-[1px] border-black w-1/4">${bid.bidValue}</TableCell>
                    <TableCell className="">{""}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Reviews section */}
          {data?.data && (
            <ReviewSection
              productId={auctionId}
              storeId={"65a1f5bfcf1a4c3d9f8e5a32"}
              reviewSectionScale={reviewSectionScale}
              reviewSectionOpacity={reviewSectionOpacity}
              reviewsRef={reviewsRef}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <SectionHeading heading={"Our products"} subheading={""} />
      <section className="flex justify-center items-center pt-10 px-4">
        <div className="flex flex-col w-full max-w-[1200px]">
          <motion.div
            ref={bidsRef}
            style={{
              scale: bidsItemsScale,
            }}
          >
            {content}
          </motion.div>
        </div>
      </section>
      {bidContent}
    </div>
  )
}

export default AuctionDetails

