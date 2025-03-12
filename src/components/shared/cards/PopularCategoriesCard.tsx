"use client";
// local import
import Image from "next/image";

// package import
import { fadeIn } from "@/components/animations/variant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import ProductCardSkeleton from "../skeletons/productCardSkeleton";
import ErrorContainer from "@/components/ui/error-container";
import SectionHeading from "../SectionHeading/SectionHeading";
// category type ////

interface Props {
  token: string | null
}


const PopularCategoriesCard = ({token}:Props) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  console.log(token);

   //? // Fetch products
   const { data, isError, error, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/popular`, {
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
  

  console.log(data?.data);
  const categories = data?.data;

  let content;


  if (isLoading) {
    content = <div className="grid grid-cols-1 gap-[17px] pt-[40px] md:grid-cols-3 md:gap-[27px] lg:grid-cols-4">
      {[1,2,3,4].map((n) => (
        <ProductCardSkeleton key={n} />
      ))}
    </div>
  }else if(isError) {
    content = <ErrorContainer message={error.message} />
  } else if(!data) {
    content = <div className="text-center text-2xl font-black text-gray-400 ">NO Product Found!</div>
  }else if(data) {
    content =  
     <div className="container mx-auto pt-[20px] md:pt-[30px] mb-[40px] lg:mb-[85px]">
     <SectionHeading
          subheading="Popular categories"
          heading="Shop By Popular categories"
        />
      <motion.div
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        animate={inView ? "show" : "hidden"} // Start animation only when in view
        viewport={{ once: false, amount: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[13px] justify-items-center"
        ref={ref}
      >
       
        {categories.map((category:any, i:any) => (
          <Card
            key={category._id}
            className="overflow-hidden w-full  lg:w-[270px] shadow-none bg-white border-0"
          >
            <CardContent className=" p-[12px] space-y-2">
              <motion.div
                initial={{
                  opacity: 0,
                  filter: "blur(1px)",
                }}
                animate={{
                  opacity: inView ? 1 : 0,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.5,
                    delay: i * 0.2,
                  },
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: 0.5,
                  },
                }}
                className="aspect-square relative"
              >
                <Image
                  src={category.image || "https://images.pexels.com/photos/8330975/pexels-photo-8330975.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                  alt={category.categoryName}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover w-[246px] h-[204px] rounded-md"
                />
              </motion.div>
              <CardButtons />
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  }

  return (
  data && content
  );
};

export default PopularCategoriesCard;

// here are two button used for the same action. Please make sure two button are responsible for one work
const CardButtons = () => {
  return (
    <>
      <Button className="w-full ">Flowers</Button>
    </>
  );
};
