// import { useQuery } from "@tanstack/react-query";
'use client'
import { useSession } from "next-auth/react";
import UserDetailsCard from "./UserDetailsCard"
export interface userDetails {
  _id: string;
  email: string;
  fullName: string;
  industry: string[];
  profession: string[];
  role: string;
  updatedAt: Date;
  __v: number;
}



const UserDetailsInfo = () => {
  // Get user session
  const session = useSession();
  // console.log(session)
 
  const sampleUser = {
    // address: {
    //   street: session.data?.user.address.street,
    //   city: session.data?.user.address.city,
    //   state: "",
    //   zip: ""
    // },
    fullName: session.data?.user.fullName,
    industry: session.data?.user.industry,
    profession: session.data?.user.profession,
    dob: "N/A",
    email: session.data?.user.email,
    phone: "N/A",
  }
  // Fetch FAQs using React Query
  // const { isLoading, data, isError, error } = useQuery<userDetails[]>({
  //   queryKey: ["faqs"], // Unique key for caching
  //   queryFn: async () => {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/all`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch FAQs"); // Throw error if response is not OK
  //     }
  //     const resData = await response.json();
  //     return resData.data; // Return the data from the API
  //   },
  // });
  return (
    <div>
      <div className="   flex items-start justify-center">
        <UserDetailsCard user={sampleUser} />
      </div>
    </div>
  )
}

export default UserDetailsInfo