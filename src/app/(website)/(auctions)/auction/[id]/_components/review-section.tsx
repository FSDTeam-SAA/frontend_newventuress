"use client"
import type * as React from "react"
import VendorReviewCard from "@/components/shared/cards/VendorReviewCard"
import { ReviewForm } from "./ReviewForm"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"

interface Review {
  _id: string
  user: {
    name?: string
    profilePic?: string
  } | null
  rating: number
  comment: string
  product: string
  store: string
  createdAt: string
  updatedAt: string
}

interface ReviewsResponse {
  status: boolean
  message: string
  data: Review[]
}

interface ReviewSectionProps {
  productId: string
  storeId: string
  reviewSectionScale: any
  reviewSectionOpacity: any
  reviewsRef: React.RefObject<HTMLDivElement>
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  storeId,
  reviewSectionScale,
  reviewSectionOpacity,
  reviewsRef,
}) => {
  const queryClient = useQueryClient()

  const {
    data: reviewsData,
    isLoading,
    isError,
  } = useQuery<ReviewsResponse>({
    queryKey: ["reviews", productId],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/review/product/view/${productId}`).then((res) => res.json()),
  })
  console.log(reviewsData)

  const handleReviewSubmitted = () => {
    // Invalidate and refetch reviews when a new review is submitted
    queryClient.invalidateQueries({ queryKey: ["reviews", productId] })
  }

  return (
    <motion.div
      className="mb-[50px]"
      ref={reviewsRef}
      style={{
        scale: reviewSectionScale,
        opacity: reviewSectionOpacity,
      }}
    >
      <h2 className="text-gradient dark:text-gradient-pink text-center text-[25px] font-[600] mt-[50px]">Reviews</h2>

      {isLoading ? (
        <div className="text-center py-4">Loading reviews...</div>
      ) : isError ? (
        <div className="text-center py-4 text-red-500">Failed to load reviews</div>
      ) : reviewsData?.data?.length === 0 ? (
        <div className="text-center py-4">No reviews yet. Be the first to review!</div>
      ) : (
        <div>
          {reviewsData?.data?.map((review) => (
            <div key={review._id} className="border-b-[1px] border-[#C5C5C5] last:border-none">
              <VendorReviewCard
                imageSrc={review.user?.profilePic || "/assets/img/reviews-card-imag.png.png"}
                name={review.user?.name || "Anonymous User"}
                date={new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                rating={review.rating}
                review={review.comment}
              />
            </div>
          ))}
          <div className="w-full h-[1px] border-b-[1px] border-[#C5C5C5] mb-[30px]" />
        </div>
      )}

      <ReviewForm productId={productId} storeId={storeId} onReviewSubmitted={handleReviewSubmitted} />
    </motion.div>
  )
}

