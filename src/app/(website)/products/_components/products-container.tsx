"use client"

import { useQuery } from "@tanstack/react-query"
import { CircleAlert, CircleOff, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useSearchStore } from "@/zustand/product/search-store"

import FeaturedProductCard from "@/components/shared/cards/featured_card"
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading"
import ProductCardSkeleton from "@/components/shared/skeletons/productCardSkeleton"
import PacificPagination from "@/components/ui/PacificPagination"
import { TextEffect } from "@/components/ui/text-effect"
import type { ProductResponse } from "@/types/product"
import ProductsSort from "./products-sort"
import SidebarFilters from "./SidebarFilters"
// import { useAuth } from "@/hooks/use-auth"
import { useUserId } from "@/hooks/use-user-id"

interface Props {
  token: string
}

const ProductsContainer = ({ token }: Props) => {
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([])

  // Get search store state
  const { searchQuery, selectedLocation, setSearchQuery, setSelectedLocation } = useSearchStore()
  // const { userId: authUserId } = useAuth()

  // Get URL parameters
  const countryParam = searchParams.get("country")
  const stateParam = searchParams.get("state")
  const queryParam = searchParams.get("query")

  // Sync URL parameters with store state on initial load
  useEffect(() => {
    if (countryParam && stateParam) {
      setSelectedLocation({
        country: countryParam,
        state: stateParam,
      })
    }

    if (queryParam) {
      setSearchQuery(queryParam)
    }
  }, [countryParam, stateParam, queryParam, setSelectedLocation, setSearchQuery])

  // Handle filter change
  const onFilterChange = (filters: {
    priceRange: [number, number]
    categories: string[]
    availability: string[]
  }) => {
    setPriceRange(filters.priceRange)
    setSelectedCategories(filters.categories)
    setSelectedAvailability(filters.availability)
  }

  // Get user ID
  const { userId } = useUserId()

  // Fetch products based on location, search query and filters
  const { data, isError, error, isLoading } = useQuery<ProductResponse>({
    queryKey: [
      "products",
      priceRange,
      selectedCategories,
      selectedAvailability,
      currentPage,
      selectedLocation?.country,
      selectedLocation?.state,
      searchQuery,
      userId,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
        page: currentPage.toString(),
      })

      if (selectedCategories.length > 0) {
        params.append("categories", selectedCategories.join(","))
      }

      if (selectedAvailability.length > 0) {
        params.append("availability", selectedAvailability.join(","))
      }

      // Use the location-specific API endpoint if we have location and query
      let endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/filter`

      // Construct the URL with parameters
      if (selectedLocation && searchQuery && userId) {
        // For the location-specific endpoint, userID is part of the path
        endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/all/location/${userId}`

        // Add query parameters
        params.append("country", selectedLocation.country)
        params.append("state", selectedLocation.state)
        params.append("query", searchQuery)
      }

      const response = await fetch(`${endpoint}?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Network error")
      }
      return response.json()
    },
    enabled: !!token && !!userId, // Only run query when token and userId are available
  })

  // Update the products extraction to match the API response format
  const products = data?.products || data?.data

  // Display location and search information
  const locationInfo = selectedLocation ? `${selectedLocation.state}, ${selectedLocation.country}` : null

  const searchInfo = searchQuery ? `Results for "${searchQuery}"` : null

  let content

  if (isLoading) {
    content = (
      <div className="mt-[52px] grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <ProductCardSkeleton key={n} />
        ))}
      </div>
    )
  }

  if (isError) {
    content = (
      <div className="mt-[52px] flex flex-col gap-2 justify-center items-center min-h-[40vh] font-inter">
        <CircleOff className="h-7 w-7 text-red-600" />
        <div className="max-w-[400px] text-center text-14px text-tourHub-gray">
          <TextEffect per="char" preset="fade" variants={{}} className="" onAnimationComplete={() => {}}>
            {error?.message || "something went wrong. Please try again"}
          </TextEffect>
        </div>
      </div>
    )
  } else if (products?.length === 0) {
    content = (
      <div className="mt-[52px] w-full flex flex-col gap-2 justify-center items-center min-h-[40vh] font-inter">
        <CircleAlert className="h-5 w-5" />
        <p className="max-w-[400px] text-center text-14px text-tourHub-gray">
          <TextEffect per="char" preset="fade" variants={{}} className="" onAnimationComplete={() => {}}>
            No data available for the selected criteria. Please try different filters or check your connection!
          </TextEffect>
        </p>
      </div>
    )
  } else if (products && products?.length > 0) {
    content = (
      <div className="mt-[52px] grid grid-cols-1 gap-4 md:grid-cols-3">
        {products?.map((item: any) => (
          <FeaturedProductCard key={item._id} product={item} />
        ))}
      </div>
    )
  }

  return (
    <div className="section container lg:mb-[150px]">
      <SectionHeading heading="Products" subheading={searchInfo || ""} />

      {/* Location information */}
      {locationInfo && (
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{locationInfo}</span>
        </div>
      )}

      {/* product sort  */}
      <div className="container mt-[40px] flex h-[50px] items-center justify-end rounded-[8px] bg-[#F9FAFD] p-[8px] shadow-[0px_4px_4px_0px_#00000026]">
        <div>
          <ProductsSort />
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4">
          <SidebarFilters onFilterChange={onFilterChange} priceRange={priceRange} />
        </div>

        {/* Products Grid */}
        <div className="flex-1">{content}</div>
      </div>

      {/* Pagination */}
      {!isLoading && !isError && products && products.length > 0 && (
        <div className="mt-[40px]">
          <PacificPagination
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
            totalPages={20} // Assuming 9 items per page
          />
        </div>
      )}
    </div>
  )
}

export default ProductsContainer

