"use client"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resetAuthSlice } from "@/redux/features/authentication/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Loader2 } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminApprovalModal } from "../../../_components/admin-aproval-modal";
import StatusDropdown from "./StatusDropdown";

const SignUpOverview = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading,setLoading] = useState(false)

  // from dropdown 
  const [state, setState] = useState("")  
  console.log("show ",state)

    const authState = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();
   

    // status from dropdown
    const approvalStatus = state as "pending" | "approved" | "one";

    const businessName = authState.businessName;
    const email = authState.email;
    const fullName = authState.fullName;
    const experiences = authState.industry;
    const businessInfos = authState.businessInfo

    useEffect(() => {

      return () => {
        setLoading(false)
      }

    }, [])




    const licenses = businessInfos.flatMap(entry =>
        entry.license.map(lic => ({
          name: lic.name,
          country: entry.country,
          metrcLicense: lic.metrcLicense,
          cannabisLicense: lic.cannabisLicense,
          businessLicense: lic.businessLicense,
          state: entry.state
        }))
      );

      useEffect(() => {
        if (!businessName || !email || !fullName || experiences.length === 0) {
          dispatch(resetAuthSlice());
          redirect("/registration")
        };

        
      }, [businessName, email, fullName, experiences, dispatch]);

  return (
    <>
{/* it will be remove when we will get data from API  */}
<StatusDropdown setState={setState} />

    <div className="w-full border-[#162866] border-[1px] rounded-[20px] p-[20px] mt-[40px]">
        <div className="text-[#444444] font-medium text-[20px] grid grid-cols-2 gap-x-[30px] gap-y-[20px]">
        <h3>Business Name: {businessName}</h3>
        <h3>Email address: {email}</h3>
        <h3>Full Name: {fullName}</h3>
        <h3>Experience: {experiences.filter((item) => item !== "Select All").join(", ")}</h3>
        </div>

        <div className="mt-[20px] grid grid-cols-1 md:grid-cols-2 gap-y-[20px] gap-x-[30px]">
            {licenses.map((item, i) => (
                <div key={i} className="bg-[#E6EEF6] rounded-[12px] p-[20px] text-[#444444] font-medium text-[17px]">
            <div className="flex items-start justify-between">
            <div>
            <h3>Country - {i + 1}: {item.country}</h3>
           {item?.state && item.state.length >= 1 &&  <h3>License Of {item.name}</h3>}
           {item?.metrcLicense.length > 0 && item.metrcLicense.some((license) => license.trim() !== "") && (
  <h3 className="flex items-center gap-x-4 flex-wrap">
    Metrc license No: {item.metrcLicense.join(", ")}
    <CustomBadge status={approvalStatus === "pending" ? "pending" : "approved"}>{approvalStatus === "pending" ? "Pending" : "Auto approved"}</CustomBadge>
  </h3>
)}

           {item?.cannabisLicense.length > 0 && item.cannabisLicense.some((license) => license.trim() !== "") && (
  <h3 className="flex items-center gap-x-4 flex-wrap">
    Cannabis license No: {item.cannabisLicense.join(", ")}
    <CustomBadge status={approvalStatus === "approved" ? "approved" : "pending"}>{approvalStatus === "approved" ? "AUto Approved" : "Peending"}</CustomBadge>
  </h3>
)}

            {item?.businessLicense.length > 0 && item.businessLicense.some((license) => license.trim() !== "") && (
  <h3 className="flex items-center gap-x-4 flex-wrap">Business license No: {item.businessLicense.join(", ")}        <CustomBadge status={approvalStatus === "approved" ? "approved" : approvalStatus === "one" ? "approved" :  "pending"}>{approvalStatus === "approved" ? "Auto Approved" : approvalStatus === "one" ? "Auto Approved" : "Peending"}</CustomBadge></h3>
)}

              </div>

            {/* <Badge >Pending</Badge> */}
              </div>
            
            
            </div>
            ))}
            
        </div>

        

    </div>
    <Button disabled={loading} className="mt-[20px]" onClick={() => {
      setIsModalOpen(true);
    }}>
    <span className="flex items-center gap-x-2">Next {loading ? <Loader2 className="animate-spin h-3 w-3" /> : "→"}</span></Button> <AdminApprovalModal
        isOpen={isModalOpen}
        message={approvalStatus == "pending" ? "Your licenses are “pending” and will require further review. We will send you an email once we approve" : approvalStatus == "one" ? "We were able to verify and approve one or more of your licenses, the remaining pending licenses will require further review. Please check your email to complete your registration." : "We were able to verify and approve your licenses. Please check your email to complete your registration."}
        onClose={() => {
          setIsModalOpen(false);
          setLoading(true)
          router.push("/")
          
        }}
      /></>
  )
}

export default SignUpOverview


interface CustomBadgeProps {
  children: string;
  className?:string;
  status: "approved" | "pending"
}

const CustomBadge = ({children, className, status}: CustomBadgeProps) => {
  return (
    <div  className={cn(className, status === "approved" && "text-[#16A34A] bg-[#F0FDF4]", status == "pending" && "text-[#CA8A04] bg-[#FEFCE8]", "text-[8px]  rounded-full px-2 py-1")}>
     {children}
    </div>
  )
}