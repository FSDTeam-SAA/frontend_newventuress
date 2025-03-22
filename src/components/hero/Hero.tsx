"use client"

import { blurDataUrl } from "@/data/blur-data-url";
import { useApplicationAs } from "@/hooks/useApplicationAs";
import Image from "next/image";
import { useEffect, useState } from "react";
import Anim from "../animations/anim";

const allImages = [
  {
    id: 1,
    img: "https://res.cloudinary.com/drdztqgcx/image/upload/v1741322809/hero1_nmouwb.png",
    accept: "HEMP/CBD"
  },
  {
    id: 2,
    img: "https://res.cloudinary.com/drdztqgcx/image/upload/v1741322903/hero2_ivrerr.png",
    accept: "HEMP/CBD"
  },
  {
    id: 3,
    img: "https://res.cloudinary.com/drdztqgcx/image/upload/v1741322942/hero3_jfdpad.png",
    accept: "HEMP/CBD"
  },
  {
    id: 4,
    img: "https://res.cloudinary.com/drdztqgcx/image/upload/v1741323091/CannabisX3-1.2e16d0ba.fill-1524x683_1_g26j3l.jpg",
    accept: "RECREATIONAL"
  },
  {
    id: 5,
    img: "https://res.cloudinary.com/drdztqgcx/image/upload/v1741323149/images_3_pwymmv.jpg",
    accept: "RECREATIONAL"
  },
  {
    id: 6,
    img: "https://res.cloudinary.com/drdztqgcx/image/upload/v1741323173/closeup_small_paperbag_marijuana_leave_on_it-1212246649_pbdfud.webp",
    accept: "RECREATIONAL"
  },
]

const Hero = () => {
  const [images, setImages] = useState<{ id: number; img: string; accept: string }[]>([])
  const {as} = useApplicationAs();

  useEffect(() => {

    setImages(allImages.filter(({accept}) => as === accept))


  }, [as])


  return (
    <>
      <div>
        <section
          className="relative w-full h-[430px] lg:h-[530px] bg-cover bg-center lg:px-20 animate-moveBackground"
          style={{
            backgroundImage: `url(/assets/img/heroBg.png)`,
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative container flex items-center justify-start h-full text-white">
            {as === "HEMP/CBD" && <div className="md:w-[685px]">
              {as == "HEMP/CBD" && (
                <h1 className="text-[32px] leading-[38.4px] lg:text-[56px] lg:leading-[67.2px] font-semibold mb-4 ">
                SHARE THE <br />
                BALANCE
              </h1>
              )}
              <p className="text-[16px] md:text-[18px] mb-8">
                
              We connect buyers, sellers and distributors across Canada, Colombia, Germany, United Kingdom Luxembourg, Mexico, Spain, Thailand, U.S. and more in a global free-for-all. Hustle or get left behind. Cannabis? Yeah, we do that too.
              </p>
            </div>}

           {as === "RECREATIONAL" &&  <div className="md:w-[685px]">
  
  <h1 className="text-[32px] leading-[38.4px] lg:text-[56px] lg:leading-[67.2px] font-semibold mb-4">
    EMBRACE <br />
    WELLNESS
  </h1>
<p className="text-[16px] md:text-[18px] mb-8">
We connect buyers, sellers and distributors across Canada, Colombia, Germany, United Kingdom Luxembourg, Mexico, Spain, Thailand, U.S. and more in a global free-for-all. Hustle or get left behind. Cannabis? Yeah, we do that too.
</p>
</div>}

          </div>
        </section>

        {/* Three images */}
        <Anim variant="zoomIn">
          <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-[24px] mx-auto max-w-[1200px] mt-[-50px] lg:mt-[-100px] z-50 justify-items-center py-2 px-4">
            {images.map(({img, id}) => (
              <div
                key={id}
                className=" h-[120px] w-[103px] md:w-[245px] md:h-[250px] lg:h-[300px] lg:w-[370px] rounded-[16px] relative"
              >
                <Image
                  src={img}
                  alt={`SHRED Product ${id + 1}`}
                  className="rounded-[16px]"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={blurDataUrl}
                />
              </div>
            ))}
          </div>
        </Anim>
      </div>
    </>
  );
};

export default Hero;
