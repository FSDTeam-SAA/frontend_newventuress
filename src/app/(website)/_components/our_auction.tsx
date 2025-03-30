// Packages
// import dynamic from "next/dynamic";

// Local imports


import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import ProductCardSkeleton from "@/components/shared/skeletons/productCardSkeleton";
import { Button } from "@/components/ui/button";
import ErrorContainer from "@/components/ui/error-container";
import { ProductResponse } from "@/types/product";

import { Product } from "@/types/product";


import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import OurAuctionCard from "./OurAuctionCard";

interface FeaturedCardsProps {
  data: Product[],
  isLoading: boolean,


}
const FeaturedCards = ({ data, isLoading }: FeaturedCardsProps) => {

  let content;

  if (isLoading) {
    content = <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {[1, 2, 3, 4].map((n) => (
        <ProductCardSkeleton key={n} />
      ))}
    </div>
  } else {
    content = <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">


      {/* {data.slice(0, 4).map((items: any) => (
        <OurAuctionCard key={items._id} product={items} />
    ))} */}

      {data?.slice(0, 4).map((auction, index) => (
        <OurAuctionCard key={auction._id} auction={auction} index={index} />
      ))}


    </div>
  }


  return content
};

// const BiddingCard = dynamic(() => import("./bid-card"), {
//   ssr: false,
// });



interface Props {
  token: string | null
}
export default function OurAuction({ token }: Props) {

  const { data, error, isError, isLoading } = useQuery<ProductResponse>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auction/recent`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Network error");
      }
      return response.json();
    },
  });

  if (!token) return null
  const products = data?.data;
  console.log("our auctiondaata", products)

  let content;




  if (isError) {
    content = <div className="container">
      <ErrorContainer message={error?.message || "something went wrong"} />
    </div>;
  } else if (products?.length === 0) {
    content = <ErrorContainer message="NO DATA FOUND " />
  } else if (products && products.length > 0) {
    content = <div className="section container">
      <SectionHeading heading="Our Auctions" subheading="Auctions" />

      <div className="grid h-auto grid-cols-1 gap-[17px] pt-[40px] md:grid-cols-2 lg:gap-[27px]">
        <FeaturedCards data={products} isLoading={isLoading} />

        <div className="space-y-4">
          {/* <BiddingCard product={products[4]} /> */}
          <JoinAsSeller />
        </div>
      </div>
    </div>
  }
  return content
}

const JoinAsSeller = () => {
  return (
    <div className="h-fit space-y-7 rounded-xl bg-white p-6">
      <div>
        <h2 className="text-gradient dark:text-gradient-pink mb-2 text-center text-[22px] font-semibold">
          Partner with Us. Grow Your Business on
        </h2>
        <p
          className="text-gradient dark:text-gradient-pink text-center text-[20px] font-medium"

        >
          Join Our Marketplace Today
        </p>
        <Image
          className="mx-auto mt-2"
          src="/assets/img/Line.png"
          width={80}
          height={80}
          style={{
            width: "auto",
            height: "auto",
          }}
          alt="Picture of the author"
        />
      </div>
      <Button className="s mb-4 w-full py-2">Join As a Sellers</Button>
    </div>
  );
};
