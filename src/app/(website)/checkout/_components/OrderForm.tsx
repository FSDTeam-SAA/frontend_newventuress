"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import OrderSummary from "./OrderSummery"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import * as z from "zod"
import OrderConfirmationModal from "./OrderConfirmationModal"
import OrderTotal from "./OrderTotal"
import { useAppSelector } from "@/redux/store"
import Script from "next/script"
import type { Dropin, Options } from "braintree-web-drop-in"

// Update these to match your backend API endpoints
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"
const CLIENT_TOKEN_ENDPOINT = `${BASE_URL}/api/venmo/client-token`
const PROCESS_PAYMENT_ENDPOINT = `${BASE_URL}/api/venmo/process-payment`

// User and membership IDs - replace with your actual values or fetch them dynamically
const USER_ID = "67b6c411623c23ad35c861ea" // This should come from your auth system
const MEMBERSHIP_ID = "6795c54178167faa8ba7084c" // This might be selected by the user or determined by your app

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  apartment: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone must be at least 5 digits"),
  paymentMethod: z.string().min(1, "Payment type is required"),
  cardholderName: z.string(),
  cardNumber: z.string(),
  expDate: z.string(),
  cvv: z.string(),
  coupon: z.string().optional(),
})

const OrderForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [clientToken, setClientToken] = useState<string | null>(null)
  const [braintreeInstance, setBraintreeInstance] = useState<Dropin | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [venmoContainerVisible, setVenmoContainerVisible] = useState(false)
  const [tokenError, setTokenError] = useState<string | null>(null)

  // Reference to the Braintree container
  const dropinContainerRef = useRef<HTMLDivElement>(null)

  // Track if component is mounted
  const isMounted = useRef(true)

  const cartItems = useAppSelector((state) => state.cart.items)

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.regularPrice * item.quantity, 0)
    const shipping = subtotal > 0 ? 100 : 0
    const tax = subtotal * 0.01
    const total = subtotal + shipping + tax
    return { subtotal, shipping, tax, total }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: "",
      city: "",
      address: "",
      apartment: "",
      email: "",
      phone: "",
      paymentMethod: "creditCard",
      cardholderName: "",
      cardNumber: "",
      expDate: "",
      cvv: "",
      coupon: "",
    },
  })

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
      if (braintreeInstance) {
        braintreeInstance.teardown().catch((err) => {
          console.error("Error tearing down Braintree instance:", err)
        })
      }
    }
  }, [braintreeInstance])

  // Fetch client token when component mounts
  useEffect(() => {
    const fetchClientToken = async () => {
      try {
        setTokenError(null)
        console.log("Fetching client token from:", CLIENT_TOKEN_ENDPOINT)

        const response = await fetch(CLIENT_TOKEN_ENDPOINT)

        if (!response.ok) {
          throw new Error(`Failed to fetch client token: ${response.status}`)
        }

        const data = await response.json()

        if (data.clientToken) {
          console.log("Client token received successfully")
          setClientToken(data.clientToken)
        } else {
          throw new Error("No client token in response")
        }
      } catch (error) {
        console.error("Failed to fetch client token:", error)
        setTokenError(error instanceof Error ? error.message : "Unknown error fetching token")
      }
    }

    fetchClientToken()
  }, [])

  // Initialize Braintree when script is loaded and token is available
  useEffect(() => {
    if (!clientToken || !scriptLoaded || !venmoContainerVisible) return

    const initializeBraintree = async () => {
      if (!window.braintree) {
        console.error("Braintree library not loaded")
        return
      }

      try {
        if (!dropinContainerRef.current) {
          console.error("Dropin container ref not found")
          return
        }

        // Clear container if it has children
        if (dropinContainerRef.current.children.length > 0) {
          dropinContainerRef.current.innerHTML = ""
        }

        // Teardown existing instance if it exists
        if (braintreeInstance) {
          await braintreeInstance.teardown()
          setBraintreeInstance(null)
        }

        // Create new Braintree instance
        window.braintree.dropin.create(
          {
            authorization: clientToken,
            container: dropinContainerRef.current,
            venmo: {
              allowNewBrowserTab: false,
            },
          },
          (error, instance) => {
            if (error) {
              console.error("Error creating Braintree instance:", error)
              return
            }

            if (instance && isMounted.current) {
              setBraintreeInstance(instance)
            }
          },
        )
      } catch (error) {
        console.error("Error initializing Braintree:", error)
      }
    }

    initializeBraintree()
  }, [clientToken, scriptLoaded, venmoContainerVisible, braintreeInstance])

  // Watch for payment method changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "paymentMethod" && value.paymentMethod === "venmo") {
        setVenmoContainerVisible(true)
      } else if (name === "paymentMethod") {
        setVenmoContainerVisible(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      if (values.paymentMethod === "venmo" && braintreeInstance) {
        // Get payment method nonce from Braintree
        const { nonce } = await braintreeInstance.requestPaymentMethod()
        console.log("Payment nonce received:", nonce)

        // Prepare the payload according to your backend API requirements
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: calculateTotals().total,
          userId: USER_ID,
          membershipId: MEMBERSHIP_ID,
          paymentMethod: "venmo",
        }

        console.log("Sending payment data to backend:", paymentData)

        // Process the payment with your backend
        const response = await fetch(PROCESS_PAYMENT_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Payment failed with status: ${response.status}`)
        }

        const result = await response.json()
        console.log("Payment result:", result)

        // Show success modal
        setShowModal(true)
      } else {
        // Handle other payment methods as before
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setShowModal(true)
      }

      console.log("Form values:", values)
    } catch (error) {
      console.error("Payment processing error:", error)
      alert(`Payment failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const { subtotal, shipping, total } = calculateTotals()

  return (
    <section className="w-[95%] mx-auto md:w-full px-[16px] md:px-0 py-[40px] md:py-[60px] lg:py-[80px]">
      {/* Braintree Script */}
      <Script
        src="https://js.braintreegateway.com/web/dropin/1.33.7/js/dropin.min.js"
        onLoad={() => setScriptLoaded(true)}
        strategy="afterInteractive"
      />

      {showModal && <OrderConfirmationModal />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex justify-center gap-[30px] flex-wrap">
            <div className="flex flex-col gap-[30px] w-[570px]">
              <h1 className="text-gradient dark:text-gradient-pink text-xl md:text-2xl lg:text-[32px] font-semibold leading-[24px] md:leading-[32px] lg:leading-[38px]">
                Billing Information
              </h1>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#444444]">
                      Full Name<span className="text-[#E10E0E]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" type="" {...field} className="h-[48px] border border-[#B0B0B0]" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#444444]">
                      Country<span className="text-[#E10E0E]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} className="h-[48px] border border-[#B0B0B0]" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#444444]">
                      Town/City/Region<span className="text-[#E10E0E]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} className="h-[48px] border border-[#B0B0B0]" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#444444]">
                      Address<span className="text-[#E10E0E]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} className="h-[48px] border border-[#B0B0B0]" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apartment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#444444]">Apartment/Floor</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} className="h-[48px] border border-[#B0B0B0]" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#444444]">
                      Email<span className="text-[#E10E0E]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} className="h-[48px] border border-[#B0B0B0]" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#444444]">Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} className="h-[48px] border border-[#B0B0B0]" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2">
                <Checkbox id="save-info" />
                <Label
                  htmlFor="save-info"
                  className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Save this information for faster check-out next time
                </Label>
              </div>
            </div>

            {/* right side content---------------------------- */}

            <div className="w-[570px] ">
              <h1 className="text-gradient dark:text-gradient-pink text-xl md:text-2xl lg:text-[32px] font-semibold leading-[24px] md:leading-[32px] lg:leading-[38px] pb-[32px]">
                Order Summary
              </h1>
              <div>
                {cartItems.map((item, index) => (
                  <div key={index} className={index > 0 ? "mt-4" : ""}>
                    <OrderSummary image={item.image} title={item.title} sellingPrice={item.sellingPrice} />
                  </div>
                ))}
              </div>

              <OrderTotal subtotal={subtotal} total={total} shippingCharge={shipping} />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col gap-3"
                      >
                        {/* creditCard */}
                        <div>
                          <Label
                            htmlFor="creditCard"
                            className={`w-full border cursor-pointer rounded-lg flex items-center justify-between px-4 py-3 ${
                              field.value === "creditCard"
                                ? "bg-[#E6EEF6] border-[#121D42] dark:border-[#6841A5]"
                                : "border-zinc-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                id="creditCard"
                                value="creditCard"
                                className="h-5 w-5 border-[#121D42] dark:border-[#6841A5] text-[#121D42] before:bg-[#121D42] data-[state=checked]:border-[#121D42] data-[state=checked]:text-[#121D42]"
                              />
                              <span
                                className={`text-sm dark:text-gradient-pink ${
                                  field.value === "creditCard" ? "text-gradient dark:text-gradient-pink" : ""
                                }`}
                              >
                                Credit Card
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Image src="/assets/img/cVisa.png" alt="PayPal" height={25} width={40} />
                              <Image src="/assets/img/mastercard.png" alt="PayPal" height={25} width={40} />
                            </div>
                          </Label>

                          {field.value === "creditCard" && (
                            <div className="space-y-3 mt-3">
                              <FormField
                                control={form.control}
                                name="cardholderName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Cardholder Name"
                                        {...field}
                                        className="h-[48px] border border-[#B0B0B0]"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="cardNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Card Number"
                                        {...field}
                                        className="h-[48px] border border-[#B0B0B0]"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <FormField
                                  control={form.control}
                                  name="expDate"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          placeholder="Exp.Date"
                                          {...field}
                                          className="h-[48px] border border-[#B0B0B0]"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="cvv"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          placeholder="CVV"
                                          {...field}
                                          className="h-[48px] border border-[#B0B0B0]"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <Label
                          htmlFor="paypal"
                          className={`w-full border cursor-pointer rounded-lg flex items-center justify-between px-4 py-4 ${
                            field.value === "paypal"
                              ? "bg-[#E6EEF6] border-[#121D42] dark:border-[#6841A5]"
                              : "border-zinc-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              id="paypal"
                              value="paypal"
                              className="h-5 w-5 border-[#121D42] dark:border-[#6841A5] text-[#121D42] before:bg-[#121D42] data-[state=checked]:border-[#121D42] data-[state=checked]:text-[#121D42]"
                            />
                            <span
                              className={`text-sm dark:text-gradient-pink ${
                                field.value === "paypal" ? "text-[#121D42]" : ""
                              }`}
                            >
                              PayPal
                            </span>
                          </div>
                          <Image src="/assets/img/ppLogo.png" alt="PayPal" height={30} width={60} />
                        </Label>

                        {/* venmo  */}
                        <div>
                          <Label
                            htmlFor="venmo"
                            className={`w-full border cursor-pointer rounded-lg flex items-center justify-between px-4 py-3 ${
                              field.value === "venmo"
                                ? "bg-[#E6EEF6] border-[#121D42] dark:border-[#6841A5]"
                                : "border-zinc-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                id="venmo"
                                value="venmo"
                                className="h-5 w-5 border-[#121D42] dark:border-[#6841A5] text-[#121D42] before:bg-[#121D42] data-[state=checked]:border-[#121D42] data-[state=checked]:text-[#121D42]"
                              />
                              <span
                                className={`text-sm dark:text-gradient-pink ${
                                  field.value === "venmo" ? "text-gradient dark:text-gradient-pink" : ""
                                }`}
                              >
                                Venmo
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Image src="/assets/img/venmo.svg" alt="Venmo" height={25} width={40} />
                            </div>
                          </Label>

                          {field.value === "venmo" && (
                            <div className="space-y-3 mt-3 border rounded-md p-4">
                              {tokenError ? (
                                <div className="text-red-500 p-3 text-sm">Error loading Venmo: {tokenError}</div>
                              ) : (
                                <>
                                  {/* Braintree Venmo Drop-in UI Container */}
                                  <div ref={dropinContainerRef} className="min-h-[150px] w-full">
                                    {(!scriptLoaded || !clientToken) && (
                                      <div className="flex justify-center items-center h-[150px]">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* venmo end  */}

                        <Label
                          htmlFor="cashOnDelivery"
                          className={`w-full border cursor-pointer rounded-lg flex items-center justify-between px-4 py-3 ${
                            field.value === "cashOnDelivery" ? "bg-[#E6EEF6] border-[#121D42]" : "border-zinc-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              id="cashOnDelivery"
                              value="cashOnDelivery"
                              className="h-5 w-5 border-[#121D42] text-[#121D42] before:bg-[#121D42] data-[state=checked]:border-[#121D42] data-[state=checked]:text-[#121D42]"
                            />
                            <span
                              className={`text-sm dark:text-gradient-pink ${
                                field.value === "cashOnDelivery" ? "text-[#121D42]" : ""
                              }`}
                            >
                              Cash on delivery
                            </span>
                          </div>
                          <span role="img" aria-label="Cash on delivery" className="text-xl">
                            <Image src="/assets/img/visa.png" alt="PayPal" height={30} width={50} />
                          </span>
                        </Label>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-7">
                <FormField
                  control={form.control}
                  name="coupon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gradient text-[16px] dark:text-gradient-pink">Add Coupon </FormLabel>
                      <span className="text-[#9C9C9C] text-[10px]"> (Add coupon if you want to have discount)</span>
                      <FormControl>
                        <Input placeholder="" type="text" {...field} className="h-[48px] border border-[#B0B0B0]" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button className="relative w-full mt-5" aria-label="Place Order" disabled={isSubmitting}>
                {isSubmitting ? "Processing" : "Place Order"}
                {isSubmitting && <Loader2 className="absolute right-5 top-4 h-6 w-5 animate-spin" />}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default OrderForm

// Add type definition for the Braintree global object
declare global {
  interface Window {
    braintree: {
      dropin: {
        create: (options: Options, callback: (error: Error | null, instance: Dropin | null) => void) => void
      }
    }
  }
}

