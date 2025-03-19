'use client'
import { CartItemCard } from "@/components/shared/cards/cart-item";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CartSummary } from "./cart-summary";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import EmptyCart from "./empty-cart";
import { updateQuantity, removeFromCart } from "@/redux/features/cart/cartSlice";

export default function CartPage() {
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track client rendering
  const router = useRouter();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);
console.log('Cart Item ',cartItems)
  useEffect(() => {
    setIsClient(true); // Ensure this runs only on the client
  }, []);

  const updateQuantityHandler = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const removeItemHandler = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.regularPrice * item.quantity,
      0
    );
    const shipping = subtotal > 0 ? 100 : 0;
    const tax = subtotal * 0.01;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  };

  const handleCheckout = () => {
    console.log("Proceeding to checkout...");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push("/checkout");
    }, 3000);
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  // Prevent server-client UI mismatch
  if (!isClient) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  console.log(cartItems);
  return (
    <div className="container section md:border-b-[1px] border-[#C0CFE6]/50 pb-10">
      <div className="mt-[-10px]">
        <SectionHeading heading={"Your Shopping Cart"} subheading={""} />
      </div>

      <div className="max-w-7xl mx-auto lg:grid md:grid-cols-[1fr_500px] gap-8">
        <div className="space-y-6 lg:border-r-[.5px] border-[#C0CFE6]/70 md:pr-8">
          <h2 className="text-xl font-semibold text-gradient dark:text-gradient-pink mb-6">
            Cart Items
          </h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItemCard
                key={item._id}
                item={item}
                onUpdateQuantity={updateQuantityHandler}
                onRemove={removeItemHandler}

              />
            ))}
          </div>
        </div>
        <div className="md:sticky md:top-8 h-fit">
          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            onCheckout={handleCheckout}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
