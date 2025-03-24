/* eslint-disable @next/next/no-img-element */
"use client";
// package import
import { Heart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/Rating";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { addToCart } from "@/redux/features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/features/wishlist/wishlistSlice";
import { Product } from "@/types/product";

export default function FeaturedProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.items);

  const isWishlist = wishlist.some((item) => item._id === product._id);

  const handleAddToCart = (e: {
    stopPropagation: () => void;
    preventDefault: () => void;
  }) => {
    e.stopPropagation();
    e.preventDefault();

    dispatch(
      addToCart({
        _id: product._id,
        title: product.title,
        regularPrice: product.regularPrice,
        sellingPrice: product.selllingPrice,
        stockStatus: product.stockStatus,
        image:
          product.photos[0] ||
          "https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-autumn-camping.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        quantity: 1,
      })
    );
  };

  const handleWishlistToggle = (e: {
    stopPropagation: () => void;
    preventDefault: () => void;
  }) => {
    e.stopPropagation();
    e.preventDefault();

    if (isWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(
        addToWishlist({
          _id: product._id,
          title: product.title,
          regularPrice: product.regularPrice,
          sellingPrice: product.selllingPrice,
          image:
            product.photos[0] ||
            "https://images.pexels.com/photos/7667735/pexels-photo-7667735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          stockStatus: product.stockStatus,
        })
      );
    }
  };

  return (
    <Link
      href={`/products/${product._id}`}
      className="relative mx-auto my-auto flex w-full shrink grow cursor-pointer flex-col self-stretch overflow-hidden rounded-[8px] border border-solid border-gray-200 bg-white p-3 transition-shadow duration-300 hover:shadow-feature_card lg:w-[260px]"
    >
      <div className="overflow-hidden rounded-[8px]">
        <Image
          loading="lazy"
          src={
            product?.photos?.[0] ??
            "https://images.pexels.com/photos/7667735/pexels-photo-7667735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          }
          alt="Product image"
          width={300}
          height={100}
          className="z-0 aspect-[1.07] w-full rounded-[8px] object-cover duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.pexels.com/photos/7667735/pexels-photo-7667735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
          }}
        />
      </div>

      {/* ======= add wishlist ========= */}
      <div className="absolute right-[20px] top-5 z-0 flex w-[32px] flex-col">
        <button
          onClick={handleWishlistToggle}
          className={`flex gap-2.5 justify-center items-center px-2 bg-white rounded-full ${
            isWishlist
              ? "border-none text-white bg-primary dark:bg-pinkGradient"
              : "border-blue-500 text-black hover:bg-hover-gradient dark:hover:bg-pinkGradient hover:text-white"
          } min-h-[32px] w-[32px]`}
          aria-label="Add to wishlist"
        >
          <Heart className="group-hover:fill-white hover:border-0 w-4 h-4" />
        </button>
      </div>
      <div className="z-0 mt-2 flex w-full flex-col">
        <div className="flex w-full flex-col">
          <div className="flex w-full items-center justify-between gap-10">
            <div className="my-auto flex items-center gap-2 self-stretch whitespace-nowrap text-xs leading-tight text-[#E10E0E]">
              <div className="my-auto flex items-center gap-1 self-stretch">
                <div
                  className={cn(
                    "my-auto text-[12px] font-normal",
                    product.stockStatus === "In Stock"
                      ? "text-[#2A6C2D]"
                      : "text-red-500"
                  )}
                >
                  {product.stockStatus}
                </div>
              </div>
            </div>
            <div className="my-auto flex items-start gap-1 self-stretch">
              <Rating productId={product._id} />
            </div>
          </div>
          <div className="text-gradient dark:text-gradient-pink mt-2 text-left text-[16px] font-medium leading-[19.2px]">
            {product.title}
          </div>
          <div className="mt-2 flex items-end gap-1 self-start font-medium leading-tight">
            <div className="self-stretch whitespace-nowrap text-[16px] text-base leading-[19.2px] text-[#1A1A1A]">
              ${product.regularPrice}
            </div>
            <div className="self-stretch text-[12px] font-medium leading-[14.4px] text-[#9C9C9C]">
              <span className="line-through">${product.selllingPrice}</span>
            </div>
          </div>
        </div>

        {/* ===========add to cart ===== */}
        <Button
          onClick={handleAddToCart}
          className="mt-[16px] w-full"
          aria-label="Add to cart"
        >
          Add to cart
        </Button>
      </div>
    </Link>
  );
}
