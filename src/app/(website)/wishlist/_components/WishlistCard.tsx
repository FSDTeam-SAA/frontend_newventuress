import { useDispatch, useSelector } from "react-redux";
import { Check, Heart } from "lucide-react";
import Image from "next/image";
import { RootState } from "@/redux/store";
import { addToWishlist, removeFromWishlist } from "@/redux/features/wishlist/wishlistSlice";
import { StarRating } from "../../cart/_components/star-rating";
import { addToCart } from "@/redux/features/cart/cartSlice";

interface WishlistItem {
  _id: string;
  title: string;
  regularPrice: number;
  sellingPrice: number;
  stockStatus: string;
  image: string;
}

interface CartItemProps {
  item: WishlistItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  icon?: React.ElementType;
}

export function WishlistCard({ item }: CartItemProps) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart.items);  // Accessing the cart items
  const isWishlist = wishlist.some((wishlistItem) => wishlistItem._id === item._id);
  const isInCart = cart.some((cartItem) => cartItem._id === item._id); // Check if item is in the cart

  const handleWishlistToggle = () => {
    if (isWishlist) {
      dispatch(removeFromWishlist(item._id));
    } else {
      dispatch(addToWishlist({
        _id: item._id,
        title: item.title,
        image: item.image,
        regularPrice: item.regularPrice,
        sellingPrice: item.sellingPrice,
        stockStatus: item.stockStatus,
      }));
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      _id: item._id,
      title: item.title,
      regularPrice: item.regularPrice,
      sellingPrice: item.sellingPrice,
      stockStatus: item.stockStatus,
      image: item.image,
      quantity: 1,  // You can set the quantity here based on your requirements
    }));
  };

  return (
    <div className="flex flex-col gap-[16px] rounded-lg p-[12px] border border-gray-200">
      <div className="sm:flex gap-4 ">
        <div className="relative h-[181px] lg:h-[127px] w-full md:w-[294px] lg:w-[194px] rounded-[8px]">
          <Image src={item?.image} alt="img" fill className="rounded-lg object-cover h-full w-full" />
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
            <Heart className={`w-4 h-4 ${isWishlist ? "!text-white fill-white" : "text-black"}`} />
          </button>
        </div>
        <div className="flex-1 space-y-1 pt-2 flex flex-col justify-evenly">
          <div className="flex items-start justify-between">
            <div>
              <StarRating className="w-[14px] h-[14px] pb-[5px] -ml-1" rating={4} />
              <p className={`text-xs font-normal leading-[14px] pb-[4px] ${item.stockStatus === "Out of Stoke" ? "text-[#E10E0E]" : "text-[#2A6C2D]"}`}>
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
                ${item.regularPrice.toLocaleString()}
              </div>
              <div className="text-sm font-medium leading-[14px] text-[#9C9C9C] line-through">
                ${item.sellingPrice.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 mt-[8px]">
            <div>
              {/* Empty div (you can implement quantity controls here if needed) */}
            </div>
            <button
              onClick={handleAddToCart}
              className={`text-base font-bold leading-[19px] text-[#00417E] dark:text-gradient-pink ${
                isInCart ? "bg-primary dark:bg-pinkGradient text-white cursor-not-allowed p-1 rounded-sm" : ""
              }`}
              disabled={isInCart} // Disable the button if the item is in the cart
            >
              {isInCart ? "Allready Added" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
