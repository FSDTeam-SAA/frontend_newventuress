"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { MembershipPlan } from "@/types/membership"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { IoCheckmarkCircle } from "react-icons/io5"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z
  .object({
    paymentMethod: z.enum(["credit-card", "paypal", "cash-on-delivery", "bank-transfer"]),

    cardholderName: z.string().optional(),

    cardNumber: z
      .string()
      // .regex(/^\d{16}$/, "Card number must be 16 digits")
      .optional(),

    expDate: z
      .string()
      // .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Expiration date must be MM/YY")
      .optional(),

    cvv: z
      .string()
      // .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "credit-card") {
        return data.cardNumber && data.expDate && data.cvv
      }
      return true
    },
    {
      message: "Card number, expiration date, and CVV are required for credit card payments",
      path: ["cardNumber"], // This will point to the first field in case of error
    },
  )

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  data: MembershipPlan
  userId: string | undefined
}

function PlansPayment({ isOpen, onClose, data, userId }: PaymentModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "paypal",
    },
  })

  const { mutate: paypalPayment, isPending } = useMutation({
    mutationKey: ["paypal-trans-plan"],
    mutationFn: (body: any) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/paypal/create-order`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((res) => res.json()),

    onSuccess: (data) => {
      if (data.status) {
        window.location.href = data.approvalUrl // Redirect user to PayPal checkout page
      } else {
        toast.error("Failed to retrieve PayPal approval URL", {
          position: "top-right",
          richColors: true,
        })
      }
    },

    onError: (err) => {
      toast.error(err.message, {
        position: "top-right",
        richColors: true,
      })
    },
  })

  const { mutate: codPayment, isPending: isCodPending } = useMutation({
    mutationKey: ["cod-payment"],
    mutationFn: (body: { planID: string; userID: string }) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/membership/purchase/cod`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((res) => res.json()),

    onSuccess: (data) => {
      if (data.status) {
        toast.success("Cash on Delivery payment processed successfully", {
          position: "top-right",
          richColors: true,
        })
        onClose()
      } else {
        toast.error(data.message || "Failed to process Cash on Delivery payment", {
          position: "top-right",
          richColors: true,
        })
      }
    },

    onError: (err) => {
      toast.error(err.message || "An error occurred", {
        position: "top-right",
        richColors: true,
      })
    },
  })

  const { mutate: bankTransferPayment, isPending: isBankTransferPending } = useMutation({
    mutationKey: ["bank-transfer-payment"],
    mutationFn: (body: { planID: string; userID: string }) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/membership/purchase/direct-bank`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((res) => res.json()),

     
    onSuccess: (data) => {
      if (data.status) {
        toast.success("Bank Transfer payment processed successfully", {
          position: "top-right",
          richColors: true,
        })
        onClose()
      } else {
        toast.error(data.message || "Failed to process Bank Transfer payment", {
          position: "top-right",
          richColors: true,
        })
      }
    },

    onError: (err) => {
      toast.error(err.message || "An error occurred", {
        position: "top-right",
        richColors: true,
      })
    },
  })

  const isDisabled = isPending || isCodPending || isBankTransferPending

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!userId) {
      toast.error("User ID is required", {
        position: "top-right",
        richColors: true,
      })
      return
    }

    if (values.paymentMethod === "paypal") {
      const paypalData = {
        amount: data.price,
        currency: "USD",
        userId: userId,
        membershipId: data._id,
        paymentMethod: values.paymentMethod,
      }
      paypalPayment(paypalData)
    } else if (values.paymentMethod === "cash-on-delivery") {
      const codData = {
        planID: data._id,
        userID: userId,
      }
      codPayment(codData)
    } else if (values.paymentMethod === "bank-transfer") {
      const bankData = {
        planID: data._id,
        userID: userId,
      }
      bankTransferPayment(bankData)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[96%] lg:min-w-[650px] h-auto p-[12px] lg:p-[40px] bg-[#E6EEF6] dark:border-none rounded-[12px]">
        <div>
          <div className="bg-white rounded-[12px] p-[20px] mb-[30px] lg:mb-[40px]">
            <h3 className="text-[20px] lg:text-[26px] font-semibold text-[#444444]">{data?.planType}</h3>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between ">
                <div className="flex items-center gap-3 text-[16px] font-normal text-[#444444]">
                  <span>
                    <IoCheckmarkCircle size={16} className="text-[#152764] dark:!text-[#6841A5]" />
                  </span>
                  <span>Auction</span>
                </div>
                <span className="text-[#152764] dark:text-gradient-pink text-[15px] font-bold">
                  {data.numberOfAuction}
                </span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-3 text-[16px] font-normal text-[#444444]">
                  <span>
                    <IoCheckmarkCircle size={16} className="text-[#152764] dark:!text-[#6841A5]" />
                  </span>
                  <span>Bids</span>
                </div>
                <span className="text-[#152764] dark:text-gradient-pink text-[15px] font-bold">
                  {data.numberOfBids}
                </span>
              </div>
              {/*  addition----------------- */}
              <div className="flex justify-between">
                <div className="flex items-center gap-3 text-[16px] font-normal text-[#444444]">
                  <span>
                    <IoCheckmarkCircle size={16} className="text-[#152764] dark:!text-[#6841A5]" />
                  </span>
                  <span>Listing</span>
                </div>
                <span className="text-[#152764] dark:text-gradient-pink text-[15px] font-bold">
                  {data.numberOfListing}
                </span>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center gap-3 text-[16px] font-normal text-[#444444]">
                  <span>
                    <IoCheckmarkCircle size={16} className="text-[#152764] dark:!text-[#6841A5]" />
                  </span>
                  <span>Messages</span>
                </div>
                <span className="text-[#152764] dark:text-gradient-pink text-[15px] font-bold">Unlimited</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t-[1px] border-[#000000]">
                <span className=" text-[16px] font-semibold text-[#444444]">Charged</span>
                <span className="text-[#000000] font-medium text-[16px]">&{data.price}</span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                        <div
                          className={`flex items-center justify-between h-[52px] bg-[#ffffff] border-[#152764] rounded-md border p-4 ${
                            field.value === "credit-card" ? "border-[#152764] bg-[#244b7210]" : ""
                          } ${field.value === "credit-card" ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="credit-card"
                              id="credit-card"
                              disabled
                              className="h-[20px] w-[20px] border-[#152764] text-[#152764] fill-[#152764] cursor-not-allowed opacity-50"
                            />
                            <Label htmlFor="credit-card" className="dark:text-gradient-pink opacity-50">
                              Credit Card
                            </Label>
                          </div>
                          <div className="flex space-x-2 items-center opacity-50">
                            <Image src="/assets/img/cVisa.png" width={37} height={11} alt="Visa" className="h-6" />
                            <Image
                              src="/assets/img/mastercard.png"
                              width={39}
                              height={30}
                              alt="Mastercard"
                              className="h-8"
                            />
                          </div>
                        </div>

                        {/* <div>
                          {form.watch("paymentMethod") === "credit-card" && (
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="cardholderName"
                                render={() => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Cardholder Name"
                                        {...form.register("cardholderName")}
                                        className="border-[#D9D9D9] h-[48px] text--[#000000] text-[16px] placeholder:text-[#B0B0B0] placeholder:text-[16px] placeholder:font-normal"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="cardNumber"
                                render={() => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Card Number"
                                        {...form.register("cardNumber")}
                                        className="border-[#D9D9D9] h-[48px] text--[#000000] text-[16px] placeholder:text-[#B0B0B0] placeholder:text-[16px] placeholder:font-normal"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="expDate"
                                  render={() => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          placeholder="MM/YY"
                                          {...form.register("expDate")}
                                          className="border-[#D9D9D9] h-[48px] text--[#000000] text-[16px] placeholder:text-[#B0B0B0] placeholder:text-[16px] placeholder:font-normal"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="cvv"
                                  render={() => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          placeholder="CVV"
                                          {...form.register("cvv")}
                                          className="border-[#D9D9D9] h-[48px] text--[#000000] text-[16px] placeholder:text-[#B0B0B0] placeholder:text-[16px] placeholder:font-normal"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          )}
                        </div> */}
                        <div
                          className={`flex items-center justify-between bg-[#FFFFFF] h-[52px] border-[#152764] rounded-md border p-4 ${
                            field.value === "paypal" ? "border-[#152764] bg-[#244b7210]" : ""
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="paypal"
                              id="paypal"
                              className="h-[20px] w-[20px] border-[#152764] text-[#152764] fill-[#152764]"
                            />
                            <Label htmlFor="paypal" className="dark:text-gradient-pink">
                              PayPal
                            </Label>
                          </div>
                          <Image src="/assets/img/ppLogo.png" width={62} height={15} alt="PayPal" className="h-6" />
                        </div>
                        <div
                          className={`flex items-center justify-between bg-[#FFFFFF] h-[52px] border-[#152764] rounded-md border p-4 ${
                            field.value === "cash-on-delivery" ? "border-[#152764] bg-[#244b7210]" : ""
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="cash-on-delivery"
                              id="cash-on-delivery"
                              className="h-[20px] w-[20px] border-[#152764] text-[#152764] fill-[#152764]"
                            />
                            <Label htmlFor="cash-on-delivery" className="dark:text-gradient-pink">
                              Cash on Delivery
                            </Label>
                          </div>
                        </div>

                        <div
                          className={`flex items-center justify-between bg-[#FFFFFF] h-[52px] border-[#152764] rounded-md border p-4 ${
                            field.value === "bank-transfer" ? "border-[#152764] bg-[#244b7210]" : ""
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="bank-transfer"
                              id="bank-transfer"
                              className="h-[20px] w-[20px] border-[#152764] text-[#152764] fill-[#152764]"
                            />
                            <Label htmlFor="bank-transfer" className="dark:text-gradient-pink">
                              Bank Transfer
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isDisabled}>
                Continue{" "}
                {(isPending || isCodPending || isBankTransferPending) && <Loader2 className="animate-spin ml-2" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PlansPayment

