"use client";
// Packages
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// local import
import { fadeIn } from "@/components/animations/variant";
import { ButtonArrow } from "@/components/shared/button/ButtonArrow";
import FeaturedProductCard from "@/components/shared/cards/featured_card";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import ProductCardSkeleton from "@/components/shared/skeletons/productCardSkeleton";
import ErrorContainer from "@/components/ui/error-container";
import SkeletonWrapper from "@/components/ui/skeleton-wrapper";
import {  ProductResponse } from "@/types/product";

interface Props {
  token: string | null
}

const OurFeatureSection = ({token} : Props) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

   //? // Fetch products
   const { data, isError, error, isLoading } = useQuery<ProductResponse>({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const response = await fetch(

        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product/featured`, {

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
  if(!token) return;

  if (!token) {
    return (
      <div className="section container py-[80px]">
        <SectionHeading heading="Our Featured Products" subheading="Products" />
        <div className="mt-[40px] flex w-full items-center justify-center">
          <p>Please log in to see the featured products.</p>
        </div>
      </div>
    );
  }
  
  const products = data?.data;
  let content;


  if (isLoading) {
    content = <div className="grid grid-cols-1 gap-[17px] pt-[40px] md:grid-cols-3 md:gap-[27px] lg:grid-cols-4">
      {[1,2,3,4,5,6,7,8].map((n) => (
        <ProductCardSkeleton key={n} />
      ))}
    </div>
  }

  else if (isError) {
    content = <ErrorContainer message={error?.message || "Something went Wrong"} />
  } else if (data && data.data && data.data.length === 0 ) {
    content = <div>NO Product Found</div>
  } else if (data && data.data && data.data.length > 0) {
    content = <motion.div
    variants={fadeIn("up", 0.3)}
    initial="hidden"
    animate={inView ? "show" : "hidden"} // Start animation only when in view
    viewport={{ once: false, amount: 0.3 }}
    className="grid grid-cols-1 gap-[17px] pt-[40px] md:grid-cols-3 md:gap-[27px] lg:grid-cols-4"
  >
     {products?.map((product: any) => (
      <SkeletonWrapper isLoading={false} key={product._id}>
     
        <FeaturedProductCard  product={product} />
      </SkeletonWrapper>
    ))}
  </motion.div>
  }
  console.log("ffdata",products);
  return (
    <motion.div ref={ref} className="section container py-[80px]">
      <SectionHeading heading="Our Featured Products" subheading="Products" />
    

      {content}

      <div className="mt-[40px] flex w-full items-center justify-center">
        <ButtonArrow text="Explore More" size="sm" href="/products" />
      </div>
    </motion.div>
  );
};

export default OurFeatureSection;
