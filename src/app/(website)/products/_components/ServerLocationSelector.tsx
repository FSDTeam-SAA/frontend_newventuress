"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useSearchStore } from "@/zustand/product/search-store"

interface Location {
  country: string
  state: string
  productCount?: number
}

interface LocationsResponse {
  status: boolean
  verifiedLocations: Location[]
}

const fetchLocations = async (userId: string): Promise<LocationsResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/store/locations/${userId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching locations:", error)
    throw error
  }
}

export default function ServerLocationSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const userId = session?.user?.id
  const { selectedLocation, setSelectedLocation } = useSearchStore()
  const [isOpen, setIsOpen] = useState(false)

  // Sync URL parameters with store state on initial load
  useEffect(() => {
    const syncLocationFromUrl = () => {
      const searchParams = new URLSearchParams(window.location.search)
      const countryParam = searchParams.get("country")
      const stateParam = searchParams.get("state")

      if (
        countryParam &&
        stateParam &&
        (!selectedLocation || selectedLocation.country !== countryParam || selectedLocation.state !== stateParam)
      ) {
        setSelectedLocation({
          country: countryParam,
          state: stateParam,
        })
      }
    }

    // Run on mount and when pathname changes
    syncLocationFromUrl()
  }, [pathname, setSelectedLocation, selectedLocation])

  // Fetch all available locations
  const { data: locationsData, isLoading } = useQuery({
    queryKey: ["locations", userId],
    queryFn: () => {
      if (!userId) {
        throw new Error("User ID is required")
      }
      return fetchLocations(userId)
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })

  // Handle location selection
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location)
    setIsOpen(false)

    // If we're on the products page, update the URL with the new location
    if (pathname === "/products") {
      const searchParams = new URLSearchParams(window.location.search)

      // Don't encode the parameters here - Next.js will handle it
      searchParams.set("country", location.country)
      searchParams.set("state", location.state)

      router.push(`/products?${searchParams.toString()}`)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1 h-[44px] w-full max-w-[240px] border-[1px] border-[#0057A8] dark:border-[#6841A5] bg-white text-black hover:bg-white hover:text-black dark:bg-white dark:text-black dark:hover:bg-white dark:hover:text-black"
          disabled={isLoading}
        >
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate flex-1 text-left">
            {isLoading
              ? "Loading locations..."
              : selectedLocation
                ? `${selectedLocation.state}, ${selectedLocation.country}`
                : "Select Location"}
          </span>
          <ChevronDown className="h-4 w-4 flex-shrink-0 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px] bg-white text-black">
        {isLoading ? (
          <div className="p-2 text-center">Loading locations...</div>
        ) : !locationsData?.verifiedLocations || locationsData.verifiedLocations.length === 0 ? (
          <div className="p-2 text-center">No locations available</div>
        ) : (
          locationsData.verifiedLocations.map((location, index) => (
            <DropdownMenuItem
              key={`${location.country}-${location.state}-${index}`}
              onClick={() => handleLocationSelect(location)}
              className="flex justify-between cursor-pointer hover:bg-black/10"
            >
              <span className="truncate mr-2">
                {location.state}, {location.country}
              </span>
              {location.productCount !== undefined && (
                <span className="ml-auto text-sm bg-primary text-white px-2 py-0.5 rounded-full flex-shrink-0">
                  {location.productCount}
                </span>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

