"use client"

// Packages
import { useQuery } from "@tanstack/react-query"
import { redirect, usePathname } from "next/navigation"

// Local imports
import ErrorContainer from "@/components/ui/error-container"
import SkeletonWrapper from "@/components/ui/skeleton-wrapper"
import AdditionalPlansCard from "./AdditionalPlansCard"

interface Props {
  token: string | undefined
  userId: string | undefined
}

// You may need to update this type in your types/membership.ts file
interface SponsoredListingItem {
  _id: string
  planTitle: string
  description: string
  price: number
  numberOfListing: number
  createdAt: string
  updatedAt: string
  __v: number
}

interface SponsoredListingResponse {
  status: boolean
  message: string
  data: SponsoredListingItem[]
}

const AdditionalPlans = ({ token, userId }: Props) => {
  const pathName = usePathname()

  if (!token) redirect(`/login?callback=${pathName}`)

  const {
    data: resData,
    isLoading,
    isError,
    error,
  } = useQuery<SponsoredListingResponse>({
    queryKey: ["SponsoredListings"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/sponsoredlisting/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  })

  const data = resData?.data

  let content

  if (isLoading) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
        {[1, 2, 3].map((n) => (
          <SkeletonWrapper isLoading={isLoading} key={n}>
            <div className="w-full mx-auto">
              <AdditionalPlansCard
                data={{
                  __v: 0,
                  _id: "324324",
                  planTitle: "Loading...",
                  createdAt: new Date(),
                  description: "Loading description...",
                  numberOfListing: 0,
                  price: 0,
                  updatedAt: new Date(),
                }}
                userId={userId}
              />
            </div>
          </SkeletonWrapper>
        ))}
      </div>
    )
  } else if (isError) {
    content = <ErrorContainer message={error?.message} />
  } else if ((data ?? []).length > 0) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
        {data?.map((item) => (
          <div className="w-full mx-auto" key={item._id}>
            <AdditionalPlansCard data={item} userId={userId} />
          </div>
        ))}
      </div>
    )
  }else{
    content = (
      <div className="flex items-center justify-center h-[300px]">
        <h1 className="text-2xl font-bold text-gray-500">No Additional Membership Plans Found!</h1>
      </div>
    );
  }

  return content
}

export default AdditionalPlans
