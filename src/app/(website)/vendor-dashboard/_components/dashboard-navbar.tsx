"use client"

// Packages
import { Bell, LogOut, MessageCircleMore, Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"

// Local Imports
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"


export const getCurrentTab = (pathName: string) => {
  // Basic implementation, expand as needed based on actual dashboard structure
  if (pathName.includes("/vendor-dashboard/profile")) {
    return { name: "Profile", icon: null } // Replace null with an actual icon if available
  } else if (pathName.includes("/vendor-dashboard/messages")) {
    return { name: "Messages", icon: null }
  } else if (pathName.includes("/vendor-dashboard/notifications")) {
    return { name: "Notifications", icon: null }
  }
  return { name: "Dashboard", icon: null } // Default tab
}


const DashNav = () => {
  const pathName = usePathname()

  const currentTab = getCurrentTab(pathName)
  return (
    <div
      style={{
        backgroundImage: "url('/assets/img/dashboard_nav_bg.svg')",
      }}
      className="bg-cover bg-center bg-no-repeat w-full h-[94px] bg-white flex items-center px-[38px]"
    >
      <div className="ml-[190px] 2xl:ml-[336px] flex justify-between w-full">
        <div className="flex items-center gap-x-[16px]">
          <div
            className={cn(
              "w-full h-[46px] rounded-[4px] pl-[16px] flex items-center gap-[12px] font-medium text-[18px] leading-[21.4px] transition-colors duration-300 bg-transparent text-[#152764] dark:text-gradient-pink dark:!text-[#6841A5]",
            )}
          >
            {currentTab?.icon} {currentTab?.name}
          </div>
        </div>
        <div className="flex items-center gap-8">
          <SearchButton />
          <DashRightSide />
        </div>
      </div>
    </div>
  )
}

export default DashNav

const SearchButton = () => {
  return (
    <form className="flex flex-1 gap-2 w-full lg:w-[329px] border-1 border-[#152764] outline-0 mb-1 lg:mb-0">
      <div className="flex-1 relative h-[34px] lg:h-full">
        <div className="flex items-center h-[44px]">
          <Search className="absolute left-2.5 top-2.4 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-8 rounded-[6px]  lg:h-full border-[1px] border-[#4857BD] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px] leading-[21px] placeholder:text-gradient dark:!text-black"
          />
        </div>
        <Button className="absolute right-0 top-0 mt-[4px] lg:mt-[0] h-[36px]  lg:h-full rounded-l-none text-sm font-semibold leading-[17px]">
          Search
        </Button>
      </div>
    </form>
  )
}

const DashRightSide = () => {
  const { data: session, status } = useSession()
  const [imageError, setImageError] = useState(false)
console.log(imageError);
  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "VD" // Default fallback for "Vendor"

    const names = name.split(" ")
    if (names.length === 1) return names[0].charAt(0).toUpperCase()
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }

  // Handle loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-end gap-x-[20px]">
        <Skeleton className="h-[35px] w-[35px] rounded-full" />
        <Skeleton className="h-[35px] w-[35px] rounded-full" />
        <div className="flex items-center gap-x-[10px]">
          <Skeleton className="h-[44px] w-[44px] rounded-full" />
          <div className="flex flex-col gap-y-[2px]">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
    )
  }

  // Get user data from session
  const userName = session?.user?.fullName || "Vendor"
  const userImage = session?.user?.image
  const userEmail = session?.user?.email

  return (
    <div className="flex items-center justify-end gap-x-[20px]">
      <Link
        href="/vendor-dashboard/messages"
        className="h-[35px] w-[35px] bg-gradient-to-r dark:bg-pinkGradient from-[#121D42] via-[#152764] to-[#4857BD] hover:from-[#7091FF] hover:via-[#2F4697] hover:to-[#7485FB] transition-all duration-500 ease-in-out text-[#152764] flex justify-center items-center rounded-[24px]"
      >
        <MessageCircleMore className="h-[16px] w-[16px] text-white" />
      </Link>
      <Link
        href="/vendor-dashboard/notifications"
        className="h-[35px] w-[35px] border-[1px] dark:border-[#6841A5] border-[#152764] ] text-[#152764] flex justify-center items-center rounded-[24px] hover:bg-white/20 transition-colors duration-300"
      >
        <Bell className="h-[16px] w-[16px]" />
      </Link>

      {/* Vendor profile info with a dropdown logout button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-x-[10px] cursor-pointer">
            <Avatar className="h-[44px] w-[44px]">
              <AvatarImage
                src={userImage || ""}
                alt={userName}
                onError={() => setImageError(true)}
              />
              <AvatarFallback className="bg-gradient-to-r dark:bg-pinkGradient from-[#121D42] via-[#152764] to-[#4857BD] text-white">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-y-[2px]">
              <h3 className="text-[16px] font-medium leading-[20px] text-gradient dark:text-gradient-pink">
                {userName}
              </h3>
              <p className="text-[12px] leading-[14px] font-normal text-[#B0CBE4]">{userEmail}</p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px] dark:bg-[#1A1A1A] dark:border-[#6841A5]">
          {/* <DropdownMenuItem className="cursor-pointer">
            <Link href="/vendor-dashboard/profile" className="flex items-center w-full">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem> */}
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem
            className="cursor-pointer text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 focus:text-red-600 dark:focus:text-red-300"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

