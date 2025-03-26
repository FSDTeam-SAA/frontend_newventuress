/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, MapPin, AlertCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
// import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSearchStore } from "@/zustand/product/search-store"
import { useUserId } from "@/hooks/use-user-id"
import { getSession } from "next-auth/react"

// Type definitions for our data
interface Location {
  country: string
  state: string
  productCount?: number // For search results
}

interface LocationsResponse {
  status: boolean
  verifiedLocations: Location[]
}

interface ProductCountResponse {
  status: boolean
  productCount: Location[]
}

// API function to fetch locations
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

// API function to fetch product counts by search query
const fetchProductCounts = async (userId: string, query: string): Promise<ProductCountResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/quantity/${userId}?query=${encodeURIComponent(query)}`,
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch product counts: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching product counts:", error)
    throw error
  }
}

function SearchBar(): JSX.Element {
  const router = useRouter()
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedLocationObject, setSelectedLocationObject] = useState<Location | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<Location[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
 // New state for session
  const [session, setSession] = useState<any>(null)
  // Get search store methods
  const { setSearchQuery: setGlobalSearchQuery, setSelectedLocation: setGlobalSelectedLocation } = useSearchStore()

  // Refs for managing focus
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  // Fetch session on component mount
  useEffect(() => {
    const fetchSession = async () => {
      const fetchedSession = await getSession()
      setSession(fetchedSession)
    }

    fetchSession()
  }, [])
  // Get user ID
  const { userId } = useUserId()
  // Remove this line: const userId = session?.user?.id

  // Use Tanstack Query to fetch locations
  const {
    data: locationsData,
    isLoading: isLocationsLoading,
    error: locationsError,
    refetch: refetchLocations,
  } = useQuery({
    queryKey: ["locations", userId],
    queryFn: () => {
      if (!userId) {
        throw new Error("User ID is required")
      }
      return fetchLocations(userId)
    },
    enabled: !!userId, // Only run query when userId is available
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2,
  })

  // Set default selected location when data is loaded
  useEffect(() => {
    if ((locationsData?.verifiedLocations ?? []).length > 0) {
      const firstLocation = locationsData?.verifiedLocations?.[0] ?? null
      if (firstLocation) {
        setSelectedLocation(`${firstLocation.state}, ${firstLocation.country}`)
      }
      setSelectedLocationObject(firstLocation)
    }
  }, [locationsData])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current)
      }
    }
  }, [])

  // Function to handle search with location-specific product counts
  const handleSearch = useCallback(
    async (query: string): Promise<void> => {
      if (!query || !userId) {
        setSearchResults([])
        return
      }

      setIsSearching(true)

      try {
        // Fetch product counts from the API
        const productCountsData = await fetchProductCounts(userId, query)

        if (productCountsData.status && productCountsData.productCount) {
          setSearchResults(productCountsData.productCount)
        } else {
          setSearchResults([])
        }

        // Delay opening the dropdown to prevent interrupting typing
        if (dropdownTimeoutRef.current) {
          clearTimeout(dropdownTimeoutRef.current)
        }

        dropdownTimeoutRef.current = setTimeout(() => {
          setIsDropdownOpen(true)
        }, 300) // Small delay to allow typing to continue
      } catch (error) {
        console.error("Error fetching product counts:", error)
        // Reset search results on error
        setSearchResults([])
        // toast({
        //   title: "Error searching products",
        //   description: "Failed to search for products. Please try again.",
        //   variant: "destructive",
        // })
      } finally {
        setIsSearching(false)
      }
    },
    [userId],
  )

  const toggleSearch = useCallback((): void => {
    setIsSearchVisible((prev) => !prev)
    // Focus the search input when toggling on mobile
    if (!isSearchVisible && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isSearchVisible])

  const handleLocationSelect = useCallback((location: Location): void => {
    setSelectedLocation(`${location.state}, ${location.country}`)
    setSelectedLocationObject(location)
    setIsDropdownOpen(false)

    // Refocus the search input after selection
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const query = e.target.value
      setSearchQuery(query)

      // Only trigger search if query has content
      if (query.length > 0) {
        handleSearch(query)
      } else {
        setSearchResults([])
        setIsDropdownOpen(false)
      }
    },
    [handleSearch],
  )

  // Handle location click to view products
  const handleViewProducts = useCallback(
    (location: Location) => {
      if (!userId || !searchQuery) return

      // Save to global store
      setGlobalSearchQuery(searchQuery)
      setGlobalSelectedLocation(location)

      // Navigate to products page with query parameters
      // Don't encode the parameters here - Next.js router will handle it properly
      router.push(`/products?country=${location.country}&state=${location.state}&query=${searchQuery}`)
    },
    [userId, searchQuery, router, setGlobalSearchQuery, setGlobalSelectedLocation],
  )

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault()

      if (!selectedLocation) {
        alert("Location required")
        // toast({
        //   title: "Location required",
        //   description: "Please select a location before searching",
        //   variant: "destructive",
        // })
        return
      }

      // If we have a selected location object, navigate to products page
      if (selectedLocationObject && userId) {
        handleViewProducts(selectedLocationObject)
      }
    },
    [searchQuery, selectedLocation, selectedLocationObject, userId, handleViewProducts],
  )

  // Handle dropdown open/close without interfering with typing
  const handleDropdownOpenChange = useCallback((open: boolean) => {
    setIsDropdownOpen(open)

    // If dropdown is closing and we have search input focused, maintain focus
    if (!open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 0)
    }
  }, [])

  // Determine which locations to display based on search state
  const locationsToDisplay = searchQuery.length > 0 ? searchResults : locationsData?.verifiedLocations || []

  // Check if we have any error to display
  const hasError = !!locationsError || (!isLocationsLoading && !locationsData)
  // const errorMessage =
  //   locationsError instanceof Error ? locationsError.message : "Failed to load locations. Please try again."

  return (
    <>
      <div className="hidden md:block lg:block">
        {/* {hasError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )} */}

        <form
          className="flex flex-1 gap-2 w-full border-1 border-primary-green outline-0 mb-1 lg:mb-0 "
          onSubmit={handleSearchSubmit}
        >
          <div className="dark:block hidden">

          {/* Store location selector DropdownMenu */}
          <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-1 h-[44px] border-[1px] border-[#0057A8] dark:border-[#6841A5] min-w-[180px] bg-white text-black hover:bg-white hover:text-black dark:bg-white dark:text-black dark:hover:bg-white dark:hover:text-black"
                disabled={isLocationsLoading || hasError}
                type="button"
              >
                <MapPin className="h-4 w-4" />
                {isLocationsLoading ? "Loading locations..." : selectedLocation || "Store Locations"}
                <ChevronDown className="h-4 w-4 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[220px] bg-white text-black dark:block hidden"
              // Prevent dropdown from stealing focus
              onCloseAutoFocus={(e) => {
                e.preventDefault()
                if (searchInputRef.current) {
                  searchInputRef.current.focus()
                }
              }} 
            >
              {isLocationsLoading ? (
                <div className="p-2 text-center">Loading locations...</div>
              ) : hasError ? (
                <div className="p-2 text-center">
                  <div className="text-red-500 mb-2">Failed to load locations</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchLocations()}
                    className="w-full"
                    type="button"
                  >
                    Retry
                  </Button>
                </div>
              ) : locationsToDisplay.length === 0 ? (
                <div className="p-2 text-center">No locations found</div>
              ) : (
                locationsToDisplay.map((location, index) => (
                  <DropdownMenuItem
                    key={`${location.country}-${location.state}-${index}`}
                    onClick={() => {
                      handleLocationSelect(location)
                      // If we have a search query, allow clicking on location to view products
                      if (searchQuery && searchQuery.length > 0) {
                        handleViewProducts(location)
                      }
                    }}
                    className="flex justify-between cursor-pointer hover:bg-black/10"
                  >
                    <span>
                      {location.state}, {location.country}
                    </span>
                    {location.productCount !== undefined && (
                      <span className="ml-2 text-sm bg-primary text-white px-2 py-0.5 rounded-full">
                        {location.productCount}
                      </span>
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          </div>

          <div className="flex-1 relative h-[34px] lg:h-full">
            <div className="flex items-center h-[44px]">
              <Search className="absolute left-2.5 top-2.4 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="pl-8 rounded-[6px] md:h-[44px] lg:h-full border-[1px] border-[#0057A8] dark:border-[#6841A5] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px] leading-[21px] placeholder:text-[#9C9C9C]"
                disabled={isLocationsLoading || hasError}
                // Prevent dropdown from interfering with typing
                onKeyDown={(e) => {
                  e.stopPropagation()
                }}
              />
            </div>
            <Button
              type="submit"
              className="absolute right-0 top-0 lg:mt-[0] h-[44px] lg:h-full rounded-l-none dark:hover:opacity-90"
              disabled={isLocationsLoading || hasError || !selectedLocation || isSearching}
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>
      </div>

      <div className="md:hidden">
        <div className="relative flex items-center w-[130px]">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 z-10 hover:bg-primary dark:hover:bg-pinkGradient hover:text-white"
            onClick={toggleSearch}
            aria-label="Toggle search"
            disabled={isLocationsLoading || hasError}
            type="button"
          >
            <Search size={20} className="text-[#000000]" />
          </Button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isSearchVisible ? "w-64 opacity-100" : "w-0 opacity-0"
            }`}
          >
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="w-full pr-10 border border-[#0057A8] dark:border-[#6841A5]"
              onBlur={() => {
                if (!isSearchVisible) setIsSearchVisible(false)
              }}
              disabled={isLocationsLoading || hasError}
              // Prevent dropdown from interfering with typing
              onKeyDown={(e) => {
                e.stopPropagation()
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchBar

