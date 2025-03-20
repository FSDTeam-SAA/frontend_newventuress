"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight } from 'lucide-react'
import { useState, useEffect } from "react"

interface ProfileData {
  completionPercentage: number
  domain: string
}

export default function ProfileCompletion() {
  const [profileData, setProfileData] = useState<ProfileData>({
    completionPercentage: 0,
    domain: "Pacific Rim Fuision"
  })

  // Simulate loading profile data
  useEffect(() => {
    // This would typically be an API call
    const loadProfileData = () => {
      setProfileData({
        completionPercentage: 70,
        domain: "Pacific Rim Fuision"
      })
    }

    loadProfileData()
  }, [])

  return (
  <div className="w-full h-[173px] bg-white rounded-[12px] p-[24px] my-[30px]">
      <div className="w-full max-w-2xl   space-y-2">
      <h1 className="text-[22px] font-semibold  text-gradient text-transparent dark:text-gradient-pink ">
        Welcome to the {profileData.domain}
      </h1>
      
      <div className="flex items-center">
       
        <Progress 
          value={profileData.completionPercentage} 
          className="h-2 w-[270px] bg-[#C5C5C5] [&>div]:bg-[#0057A8] dark:[&>div]:bg-pinkGradient"
        /> 
         <div className="flex justify-between text-[12px] ml-5">
        <span className="text-[12px] text-[#444444] font-normal">Profile complete {profileData.completionPercentage}%</span>
      </div>
      </div>

      <Button 
        className=" bg-primary hover:bg-blue-800 text-white w-fit"
        onClick={() => console.log("Navigating to profile...")}
      >
        Go To Customer Profile
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
  )
}

