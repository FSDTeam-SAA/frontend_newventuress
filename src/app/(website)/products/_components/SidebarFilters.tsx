/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import ServerLocationSelector from "./ServerLocationSelector"

interface Category {
  _id: string
  categoryName: string
  image: string
  slug: string
  industry?: string
  subCategory?: string
  shortDescription?: string
}

interface CategoryResponse {
  status: boolean
  message: string
  data: Category[]
  meta: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

interface FilterState {
  priceRange: [number, number]
  categories: string[] // Now storing category IDs
  availability: string[]
}

interface SidebarFiltersProps {
  onFilterChange: (filters: FilterState) => void
  priceRange: [number, number]
}

export default function SidebarFilters({ onFilterChange, priceRange }: SidebarFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([])

  // Fetch categories from API
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery<CategoryResponse>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`)
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      return response.json()
    },
  })

  // Handle slider changes for price
  const handlePriceChange = (value: number[]) => {
    if (value[0] <= value[1]) {
      onFilterChange({
        priceRange: value as [number, number],
        categories: selectedCategories,
        availability: selectedAvailability,
      })
    }
  }

  // Handle input field changes for price
  const handleInputChange = (index: number, newValue: number) => {
    const updatedRange = [...priceRange]
    updatedRange[index] = newValue
    if (updatedRange[0] <= updatedRange[1]) {
      onFilterChange({
        priceRange: updatedRange as [number, number],
        categories: selectedCategories,
        availability: selectedAvailability,
      })
    }
  }

  // Handle category selection (now using category ID)
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const updated = prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]

      onFilterChange({
        priceRange,
        categories: updated,
        availability: selectedAvailability,
      })

      return updated
    })
  }

  return (
    <aside className="w-[290px] space-y-4 mt-[52px]">
      {/* Store Location - Using the improved ServerLocationSelector */}
      <div className="rounded-lg bg-[#E6EEF6] dark:bg-[#482D721A] p-4">
        <h2 className="text-[28px] font-bold text-gradient dark:text-gradient-pink mb-4">My Store Location</h2>
        <div className="w-full">
          <ServerLocationSelector />
        </div>
      </div>

      {/* Price Filter */}
      <div className="rounded-lg bg-[#E6EEF6] dark:bg-[#482D721A] p-4">
        <h2 className="text-[28px] font-bold text-gradient dark:text-gradient-pink mb-4">Filter by Price</h2>
        <Slider
          value={priceRange}
          max={1000}
          min={0}
          step={1}
          minStepsBetweenThumbs={5}
          onValueChange={handlePriceChange}
          className="my-4"
        />
        <div className="flex gap-4 items-center">
          <div className="space-y-1.5">
            <Label className="text-[11px] text-[#9C9C9C]">Starting Price</Label>
            <Input
              type="number"
              value={priceRange[0]}
              onChange={(e) => handleInputChange(0, +e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-[#9C9C9C]">Ending Price</Label>
            <Input
              type="number"
              value={priceRange[1]}
              onChange={(e) => handleInputChange(1, +e.target.value)}
              className="h-9"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-lg bg-[#E6EEF6] dark:bg-[#482D721A] p-4">
        <h2 className="text-[28px] leading-[30px] font-bold text-gradient dark:text-gradient-pink mb-4">Categories</h2>
        <div className="space-y-3">
          {isCategoriesLoading ? (
            <div className="text-sm text-gray-500">Loading categories...</div>
          ) : categoriesData && categoriesData.data && categoriesData.data.length > 0 ? (
            categoriesData.data.map((category) => (
              <div key={category._id} className="flex items-center space-x-2">
                <Checkbox
                  id={category._id}
                  checked={selectedCategories.includes(category._id)}
                  onCheckedChange={() => handleCategoryChange(category._id)}
                />
                <Label htmlFor={category._id} className="text-[#434851]">
                  {category.categoryName}
                </Label>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No categories available</div>
          )}
        </div>
      </div>
    </aside>
  )
}

