import { useDispatch, useSelector } from "react-redux";
import { Check, Heart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { StarRating } from "../clientReview/StarRating";
import { CartItem } from "@/redux/features/cart/cartSlice";
import { RootState } from "@/redux/store";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/features/wishlist/wishlistSlice";

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const isWishlist = wishlist.some(
    (wishlistItem) => wishlistItem._id === item._id
  );

  const handleWishlistToggle = () => {
    if (isWishlist) {
      dispatch(removeFromWishlist(item._id));
    } else {
      dispatch(
        addToWishlist({
          _id: item._id,
          title: item.title,
          image: item.image,
          regularPrice: item.regularPrice,
          sellingPrice: item.sellingPrice,
          stockStatus: item.stockStatus,
        })
      );
    }
  };

  return (
    <div className="flex flex-col gap-[16px] rounded-lg p-[12px] border border-gray-200">
      <div className="sm:flex gap-4 ">
        <div className="relative h-[181px] lg:h-[127px] w-full md:w-[294px] lg:w-[194px] rounded-[8px]">
          <Image
            src={item?.image}
            alt="img"
            fill
            className="rounded-lg object-cover h-full w-full"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleWishlistToggle();
            }}
            className={`absolute top-2 right-2 flex gap-2.5 justify-center items-center px-2 bg-white rounded-full ${
              isWishlist
                ? " border-none text-white bg-primary dark:bg-pinkGradient  "
                : " border-blue-500 text-black hover:bg-hover-gradient dark:hover:bg-pinkGradient hover:text-white dark:hover:!text-white "
            }  min-h-[32px] w-[32px]`}
            aria-label="Add to wishlist"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlist ? "!text-white fill-white" : "text-black"
              }`}
            />
          </button>
        </div>
        <div className="flex-1 space-y-1 pt-2 flex flex-col justify-evenly">
          <div className="flex items-start justify-between">
            <div>
              <StarRating
                className="w-[14px] h-[14px] pb-[5px] -ml-1"
                rating={4}
                activeColor="fill-amber-500 text-amber-500"
                inactiveColor="fill-stone-300 text-stone-300"
              />
              <p
                className={`text-xs font-normal leading-[14px] pb-[4px] ${
                  item.stockStatus === "Out of Stoke"
                    ? "text-[#E10E0E]"
                    : "text-[#2A6C2D]"
                }`}
              >
                {item.stockStatus}
              </p>
              <h3 className="text-base leading-[19px] font-medium text-gradient dark:text-gradient-pink">
                {item.title}
              </h3>
            </div>
            <div className="flex items-center md:-mt-3 py-1 rounded">
              <span className="text-xs border dark:border-[#0000001f] rounded-xl flex items-center gap-2 px-2 py-1 dark:text-black">
                <Check className="w-3 h-3" />
                In stock
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between pt-[4px]">
            <div className="flex items-center gap-2">
              <div className="text-base leading-[19px] font-medium text-[#1A1A1A]">
                ${item.regularPrice}
              </div>
              <div className="text-sm font-medium leading-[14px] text-[#9C9C9C] line-through">
                ${item.sellingPrice}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 mt-[8px]">
            <div className="w-[163px] h-[32px] flex justify-between items-center px-[24px] bg-white border border-white rounded-[24px]">
              <button
                onClick={() =>
                  onUpdateQuantity(item._id, Math.max(0, item.quantity - 1))
                }
                className="w-8 h-8 text-2xl flex items-center justify-center"
              >
                <Minus className="w-[20px] h-[20px]  text-[#6D6D6D]" />
              </button>
              <span className="text-xl text-[#444444] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                className="w-8 h-8 text-2xl flex items-center justify-center"
              >
                <Plus className="w-[20px] h-[20px] text-[#272323]" />
              </button>
            </div>
            <button
              onClick={() => onRemove(item._id)}
              className="text-base font-normal leading-[19px] text-[#00417E] dark:text-gradient-pink"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
