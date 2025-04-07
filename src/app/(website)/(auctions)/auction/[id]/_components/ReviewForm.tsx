"use client"
import * as React from "react"
import { ProvideStarRating } from "./ProvideStarRatting"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface ReviewFormProps {
  productId: string
  storeId: string
  onReviewSubmitted?: () => void
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId, storeId, onReviewSubmitted }) => {
  const [rating, setRating] = React.useState(0)
  const [review, setReview] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const session = useSession()
  const userId = session.data?.user.id

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error("Please provide a rating.")
      return
    }

    if (!review.trim()) {
      toast.error("Please provide a review comment.")
      return
    }

    if (!userId) {
      toast.error("You must be logged in to submit a review.")
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/review/product/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userId,
          rating: rating,
          comment: review,
          productID: productId,
          storeID: storeId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review")
      }

      toast.success("Review submitted successfully!")
      setRating(0)
      setReview("")

      // Call the callback if provided
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error(error instanceof Error ? error.message : "Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg w-full">
      <h2 className="text-lg font-semibold text-gradient dark:text-gradient-pink">Add a review</h2>

      <div className="flex gap-2">
        <label htmlFor="rating" className="text-base text-neutral-700">
          Your rating <span className="text-red-600">*</span>
        </label>
        <span>
          <ProvideStarRating rating={rating} onChange={setRating} />
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="review" className="text-base text-neutral-700">
          Your review <span className="text-red-600">*</span>
        </label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="p-3 border rounded-lg min-h-[120px] border-neutral-300 focus:border-green-600 focus:ring-green-600 dark:bg-white text-[#444444]"
          placeholder="Write your review"
          required
          aria-required="true"
        />
      </div>

      <Button type="submit" className="self-start" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  )
}

