"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { categoryDataResponse } from "@/data/categoryData";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Loader2 } from "lucide-react";

import Link from "next/link";
import { useState } from "react";
import NotFound from "../NotFound/NotFound";

function Categories() {
  const [category, setCategory] = useState("All Categories ");
  const [isDropdownOpen, setDropdownOpen] = useState(false);


  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const { data, isLoading, isError } = useQuery<categoryDataResponse>({
    queryKey: ["allcategory"],
    queryFn: async (): Promise<categoryDataResponse> =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
        method: "GET",

      }).then((res) => res.json() as Promise<categoryDataResponse>),

  });
  console.log("data", data);
  let content;
  if (isLoading) {
    content = (
      <div className="w-full h-[400px] flex justify-center items-center flex-col">
        <Loader2 className="animate-spin opacity-80" />
        <p>Loading your data...</p>
      </div>
    );
  } else if (isError) {
    content = (
      <NotFound message="No found your data" />
    )
  } else if (data && data.data && data.data.length === 0) {
    content = (
      <div className="mt-7">
        <NotFound message="No found your data" />
      </div>
    )
  }
  else {
    content = (

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DropdownMenuContent
          align="start"
          className="w-[180px] rounded-lg p-0 font-medium leading-[24px] text-black mt-[10px] lg:mt-[10px] overflow-hidden bg-white dark:border-none"
        >
        {data?.data.map((item, index) =>
          <motion.div
            key={item.categoryName}
            variants={linkVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, delay: index * 0.05 }} // Stagger effect for links
          >
            <DropdownMenuItem
              className="w-full p-0"
              onClick={() => setCategory(item.categoryName)}
            >
              <Link
                className="w-full text-[20px] p-4 hover:bg-[#E6EEF6] dark:hover:bg-[#482D721A]"
                href={item.slug}
              >
                {item.categoryName}
              </Link>
            </DropdownMenuItem>
          </motion.div>
        )}
        </DropdownMenuContent>
      </div>

    );
  }


  // const categories = [
  //   { name: "Flower", link: "#" },
  //   { name: "Topicals", link: "#" },
  //   { name: "Apparel", link: "#" },
  //   { name: "Concentrates", link: "#" },
  //   { name: "Tinctures", link: "#" },
  //   { name: "Accessories", link: "#" },
  //   { name: "Vape Products", link: "#" },
  //   { name: "Edibles", link: "#" }
  // ];

  // Animation Variants for Dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 }
  };

  // Animation Variants for Links


  return (
    <DropdownMenu
      onOpenChange={isOpen => setDropdownOpen(isOpen)} // Tracks dropdown open state
    >
      <DropdownMenuTrigger asChild className="">
        <Button
          variant="outline"
          className="mb-2 lg:mb-0 w-[160px] lg:w-[178px] text-[14px] lg:text-[16px] h-[35px]  md:h-[44px] text-white hover:text-white gap-2 bg-primary dark:bg-pinkGradient dark:text-white focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-none"
        >
          {category}
          <ChevronDown className="h-4 " />
        </Button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {isDropdownOpen &&
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {content}
          
          </motion.div>}
      </AnimatePresence>
    </DropdownMenu>
  );
}

export default Categories;
