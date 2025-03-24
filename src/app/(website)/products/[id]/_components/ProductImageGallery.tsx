import React, { useState } from "react";
import { ProductImage } from "./types";
import Image from "next/image";

interface ProductImageGalleryProps {
  thumbnails: ProductImage[];
  mainImage: ProductImage;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  thumbnails,
  mainImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<ProductImage>(mainImage);

  return (
    <div className="flex flex-wrap gap-5 items-start w-full md:w-auto md:max-w-full">
      {/* Thumbnails Section */}
      <div className="flex flex-row gap-5 w-full order-2 md:order-1 md:flex-col md:w-[180px] md:h-[186px]">
        {thumbnails.map((image, index) => (
          <Image
            key={index}
            loading="lazy"
            src={image.src || "https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-autumn-camping.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
            alt={image.alt}
            width={100}
            height={100}
            className="object-cover rounded-lg flex-1 h-auto md:w-[180px] md:h-full cursor-pointer border-2 border-transparent hover:border-gray-500"
            onClick={() => setSelectedImage(image)} // Set clicked image as main image
          />
        ))}
      </div>

      {/* Main Image Section */}
      <Image
        loading="lazy"
        src={selectedImage.src || "https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-autumn-camping.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
        alt={selectedImage.alt}
        width={570}
        height={600}
        className="object-cover rounded-lg aspect-[0.95] order-1 md:order-2  duration-500"
      />
    </div>
  );
};
