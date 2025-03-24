"use client"
import FeaturedProductCard from "@/components/shared/cards/featured_card"
import VendorReviewCard from "@/components/shared/cards/VendorReviewCard"
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { Flame, Heart, Loader2, Minus, Plus, RefreshCw } from "lucide-react"
import { useRef, useState } from "react"
import { ProductImageGallery } from "./ProductImageGallery"
import { ReviewForm } from "./ReviewForm"

import { StarRating } from "./StarRating"
import { useQuery } from "@tanstack/react-query"
import ErrorContainer from "@/components/ui/error-container"
import type { ProductReviewDataResponse } from "@/data/productReview"
import NotFound from "@/components/shared/NotFound/NotFound"
import { TextAnimate } from "@/components/magicui/text-animate"
import type { SingleProductDataType } from "./singleProductDataType"
import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"

const fetchProducts = async ({}) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product`)
  if (!response.ok) {
    throw new Error("Network error")
  }
  return response.json()
}
interface props {
  productId: string
}

const ProductDetails = ({ productId }: props) => {
  const [quantity, setQuantity] = useState(1)
  const [isWishlist, setIsWishlist] = useState(false)
  const relatedItemsRef = useRef(null)
  const reviewSectionRef = useRef(null)
  const session = useSession()
  const token = session.data?.user?.token

  const {
    data: reviews,
    isLoading: loding,
    isError: dataerror,
  } = useQuery<ProductReviewDataResponse>({
    queryKey: ["allreview"],
    queryFn: async (): Promise<ProductReviewDataResponse> =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/review/product/view/${productId}`, {
        method: "GET",
      }).then((res) => res.json() as Promise<ProductReviewDataResponse>),
  })

  let content
  if (loding) {
    content = (
      <div className="w-full h-[400px] flex justify-center items-center flex-col">
        <Loader2 className="animate-spin opacity-80" />
        <p>Loading your data...</p>
      </div>
    )
  } else if (dataerror) {
    content = <NotFound message="No found your data" />
  } else if (reviews?.message === "no review") {
    content = (
      <div className="text-center py-5">
        <TextAnimate animation="slideUp" by="word">
          No Review available for this Product
        </TextAnimate>
      </div>
    )
  } else {
    content = (
      <div>
        {reviews?.data.map((review, index) => (
          <div key={index} className="border-b-[1px] border-[#C5C5C5] last:border-none">
            <VendorReviewCard
              key={index}
              imageSrc={
                review?.user?.image ||
                "https://images.pexels.com/photos/7668007/pexels-photo-7668007.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              }
              name={review?.user?.fullName}
              date={review.createdAt}
              rating={review.rating}
              review={review.comment}
            />
          </div>
        ))}
      </div>
    )
  }

  const { data: singleProduct, isLoading: productLoading } = useQuery<SingleProductDataType>({
    queryKey: ["singleproduct", productId],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Failed to fetch product")
      return res.json() as Promise<SingleProductDataType>
    },
  })

  // Transform API photos to the format expected by ProductImageGallery
  const productImages =
    singleProduct?.data?.photos?.map((photo) => ({
      src: photo,
      alt: singleProduct.data.title || "Product image",
    })) || []

  const mainImage =
    productImages.length > 0
      ? productImages[0]
      : {
          src: "https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-autumn-camping.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          alt: "Product main image",
        }

  const { scrollYProgress: relatedItemsScrollY } = useScroll({
    target: relatedItemsRef,
    offset: ["0 1", "1.33 1"],
  })
  const relatedItemsScale = useTransform(relatedItemsScrollY, [0, 1], [0.8, 1])

  // Scroll progress for Review Section
  const { scrollYProgress: reviewSectionScrollY } = useScroll({
    target: reviewSectionRef,
    offset: ["0 1", ".8 1"],
  })
  const reviewSectionScale = useTransform(reviewSectionScrollY, [0, 1], [0.8, 1])
  const reviewSectionOpacity = useTransform(reviewSectionScrollY, [0, 1], [0.6, 1])

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => (increment ? prev + 1 : Math.max(1, prev - 1)))
  }

  const handleWishlistToggle = () => {
    setIsWishlist((prev) => !prev) // Toggle wishlist state
  }

  //? // Fetch products
  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  })

  const products = data?.data

  if (isLoading || productLoading) {
    return (
      <div className="w-full h-[400px] flex justify-center items-center flex-col">
        <Loader2 className="animate-spin opacity-80" />
        <p>Loading product details...</p>
      </div>
    )
  }

  if (error) {
    return <ErrorContainer message={error.message} />
  }

  return (
    <div>
      <SectionHeading heading={"Our products"} subheading={""} />
      <section className="flex items-center justify-center px-4 pt-10">
        <div className="flex w-full max-w-[1200px] flex-col">
          <div className="flex w-full flex-wrap gap-8">
            <ProductImageGallery thumbnails={productImages} mainImage={mainImage} />
            <div className="flex w-[30%] min-w-[240px] shrink grow flex-col justify-center">
              <div className="flex max-w-full flex-col">
                <div className="flex w-full flex-col">
                  <div className="text-gradient dark:text-gradient-pink text-4xl font-semibold leading-tight">
                    {singleProduct?.data?.title}
                  </div>
                  <div className="mt-2 flex w-full flex-col items-start">
                    <StarRating rating={4} onChange={() => {}} />
                    <div className="mt-2 flex -translate-x-[7px] items-center gap-2 text-base leading-tight text-[#E10E0E]">
                      <div className="my-auto flex items-center self-stretch">
                        <Flame className="h-[15px]" />
                        <div className="my-auto self-stretch font-[16px]">Hot</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-end gap-1 self-start font-medium leading-tight">
                    <div className="self-stretch whitespace-nowrap text-lg text-zinc-900">
                      ${singleProduct?.data?.selllingPrice.toFixed(2)}
                    </div>
                    <div className="self-stretch text-sm text-[#9C9C9C]">
                      <span className="line-through">${singleProduct?.data?.regularPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 w-full font-[16px] leading-[19px] text-[#444444]">
                  {singleProduct?.data?.shortDescription}
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  

                  
                  {singleProduct?.data?.coa && (
                    <div className="flex gap-4 items-center">
                      <span className="text-[#9C9C9C]">COA:</span>
                      <a
                        href={singleProduct?.data?.coaCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View Certificate
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex gap-4">
                  <span className="text-[#9C9C9C]">Type:</span>
                  <div className="flex items-center">
                    <Badge className="capitalize">{singleProduct?.data?.productType}</Badge>
                  </div>
                </div>

                <div className="mt-5 h-[1px] w-full border border-solid border-b-stone-700" />
                <div className="mt-6 flex w-full flex-col">
                  <div className="mt-4 flex w-full items-start gap-4">
                    <div className="flex h-10 w-[163px] items-center gap-2.5 rounded-3xl bg-white px-2.5 shadow-[-4px_-4px_8px_rgba(0,0,0,0.05)] dark:shadow-">
                      <button
                        onClick={() => handleQuantityChange(false)}
                        className="my-auto flex min-h-[41px] w-[41px] items-center gap-2.5 self-stretch rounded-lg px-2 py-2.5"
                        aria-label="Decrease quantity"
                      >
                        <Minus color="#444444" />
                      </button>
                      <div className="my-auto min-h-[41px] w-[41px] self-stretch whitespace-nowrap px-2.5 py-2.5 text-center text-xl leading-tight text-[#444444]">
                        {quantity}
                      </div>
                      <button
                        onClick={() => handleQuantityChange(true)}
                        className="my-auto flex min-h-[41px] w-[41px] items-center gap-2.5 self-stretch rounded-lg px-2 py-2.5"
                        aria-label="Increase quantity"
                      >
                        <Plus color="#444444" />
                      </button>
                    </div>
                    {/* wishlist----------------- */}
                    <button
                      onClick={handleWishlistToggle}
                      className={`flex items-center justify-center gap-2.5 rounded-lg border border-solid bg-white px-2 ${
                        isWishlist ? "border-red-500 text-red-500" : "border-stone-300"
                      } h-[42px] min-h-[41px] w-[43px]`}
                      aria-label="Add to wishlist"
                    >
                      <Heart className="text-[#444444]/20" fill={isWishlist ? "red" : "none"} />
                    </button>
                  </div>
                  <div className="mt-4 flex w-full items-center gap-8 text-base leading-tight">
                    <Button className="min-h-[43px] w-[170px] gap-2.5 self-stretch max-md:px-5">Add to cart</Button>
                    <Button
                      variant={"outline"}
                      className="my-auto min-h-[43px] w-[170px] gap-2.5 self-stretch dark:bg-white dark:text-gradient-pink dark:border-[#6841A5] dark:hover:text-transparent dark:hover:bg-red-300"
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-12 flex h-[42px] w-full items-center gap-2 overflow-hidden rounded-lg border border-solid border-slate-400 dark:border-[#6841A5] max-md:mt-10">
                <div className="my-auto flex min-h-[41px] w-[43px] items-center justify-center gap-2.5 self-stretch rounded-lg px-2 py-2.5">
                  <RefreshCw color="#444444" />
                </div>
                <div className="my-auto self-stretch text-base leading-tight text-black">No return Policy</div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex w-full flex-col items-center text-center ">
            <div className="text-gradient dark:text-gradient-pink text-2xl font-semibold leading-tight max-md:max-w-full">
              Description
            </div>
            <div className="mt-5 text-base leading-5 text-[#444444] max-md:max-w-full">
              {singleProduct?.data?.description}
            </div>

            {/* {singleProduct?.data.tags && singleProduct.data.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <span className="text-[#9C9C9C] mr-2 flex items-center">
                  <Tag className="h-4 w-4 mr-1" /> Tags:
                </span>
                {singleProduct.data.tags.map((tag, index) => {
                  // Parse the tag if it's a JSON string
                  let tagText = tag
                  try {
                    if (typeof tag === "string" && tag.startsWith("[")) {
                      const parsedTags = JSON.parse(tag)
                      tagText = parsedTags[0] || tag
                    }
                  } catch (e) {
                    // If parsing fails, use the original tag
                  }

                  return (
                    <Badge key={index} variant="outline" className="bg-primary/5">
                      {tagText}
                    </Badge>
                  )
                })}
              </div>
            )} */}
          </div>
        </div>
      </section>

      <motion.section
        className="container md:my-[80px]"
        ref={relatedItemsRef}
        style={{
          scale: relatedItemsScale,
        }}
      >
        <h1 className="text-gradient dark:text-gradient-pink text-[28px] font-semibold leading-[33.6px]">
          Explore related Items
        </h1>
        <div className="mt-[24px] grid grid-cols-1 gap-[30px] md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 4).map((product: any) => (
            <FeaturedProductCard key={product._id} product={product} />
          ))}
        </div>
      </motion.section>
      <motion.div
        className="container"
        ref={reviewSectionRef}
        style={{
          scale: reviewSectionScale,
          opacity: reviewSectionOpacity,
        }}
      >
        <h2 className="text-gradient dark:text-gradient-pink mt-0 md:mt-[50px] text-center text-[25px] font-[600]">
          Review
        </h2>
        <div>
          {content}
          <div className="mb-[30px] h-[1px] w-full border-b-[1px] border-[#C5C5C5]" />
        </div>
        <ReviewForm />
      </motion.div>
    </div>
  )
}

export default ProductDetails

