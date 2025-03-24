"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Loader2 } from "lucide-react"
import { useApplicationAs } from "@/hooks/useApplicationAs"
import Link from "next/link"
import { useState } from "react"
import NotFound from "../NotFound/NotFound"
import { ScrollArea } from "@/components/ui/scroll-area"

// Define the type for the API response
interface CategorySubcategoryResponse {
  data: Record<string, string[]>
}

function Categories() {
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const { as } = useApplicationAs()

  // Get the industry parameter based on application type
  const industry = as === "HEMP/CBD" ? "cbd" : "recreational"

  // Animation Variants for Dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 },
  }

  // Animation Variants for Categories
  const categoryVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  // Fetch categories and subcategories
  const { data, isLoading, isError } = useQuery<CategorySubcategoryResponse>({
    queryKey: ["categorySubcategory", industry],
    queryFn: async (): Promise<CategorySubcategoryResponse> =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/all/category-subcategory/${industry}`, {
        method: "GET",
      }).then((res) => res.json() as Promise<CategorySubcategoryResponse>),
  })

  let content
  if (isLoading) {
    content = (
      <div className="w-full h-[400px] flex justify-center items-center flex-col">
        <Loader2 className="animate-spin opacity-80" />
        <p>Loading your data...</p>
      </div>
    )
  } else if (isError) {
    content = <h1 className="text-2xl font-black bg-white p-3 text-center">No categories found!</h1>
  } else if (!data || Object.keys(data.data).length === 0) {
    content = (
      <div className="mt-7">
        <NotFound message="No data found" />
      </div>
    )
  } else {
    // Get all categories
    const categories = Object.keys(data.data)

    // Calculate how many categories to show per column (aim for 3-4 columns)
    const categoriesPerColumn = Math.ceil(categories.length / 3)

    // Split categories into columns
    const columns = []
    for (let i = 0; i < categories.length; i += categoriesPerColumn) {
      columns.push(categories.slice(i, i + categoriesPerColumn))
    }

    content = (
      <div className="bg-white p-6 rounded-lg shadow-sm w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {columns.map((columnCategories, colIndex) => (
            <div key={`column-${colIndex}`} className="space-y-6">
              {columnCategories.map((category, catIndex) => (
                <motion.div
                  key={`${category}-${catIndex}`}
                  variants={categoryVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2, delay: (colIndex * categoriesPerColumn + catIndex) * 0.05 }}
                  className="space-y-2"
                >
                  <h3 className="font-bold text-lg">{category}</h3>
                  <ul className="space-y-1">
                    {data.data[category].map((subcategory, subIndex) => (
                      <li key={`${subcategory}-${subIndex}`}>
                        <Link
                          href={`/category/${category.toLowerCase().replace(/\s+/g, "-")}/${subcategory.toLowerCase().replace(/\s+/g, "-")}`}
                          className="text-gray-700 hover:text-primary hover:underline block py-1"
                        >
                          {subcategory}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
       
      </div>
    )
  }

  return (
    <DropdownMenu onOpenChange={(isOpen) => setDropdownOpen(isOpen)}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="mb-2 lg:mb-0 w-[160px] lg:w-[178px] text-[14px] lg:text-[16px] h-[35px] md:h-[44px] text-white hover:text-white gap-2 bg-primary dark:bg-pinkGradient dark:text-white focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-none"
        >
          Shop By Category
          <ChevronDown className="h-4" />
        </Button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <DropdownMenuContent
              align="start"
              className="w-auto rounded-lg p-0 font-medium leading-[24px] text-black mt-[10px] lg:mt-[10px] overflow-hidden bg-white dark:border-none"
              style={{ width: "min(90vw, 800px)" }}
            >
              <ScrollArea className="h-[80vh] max-h-[700px]">{content}</ScrollArea>
              {!isError && ( <div className=" border-t flex items-center justify-center py-6">
                <Link href="#" className="font-medium hover:underline">
                  List of All Store Vendors
                </Link>
              </div>)}
            </DropdownMenuContent>
          </motion.div>
        )}
      </AnimatePresence>
    </DropdownMenu>
  )
}

export default Categories

