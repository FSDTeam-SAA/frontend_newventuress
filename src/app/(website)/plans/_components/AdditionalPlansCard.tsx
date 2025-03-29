"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface SponsoredListingItem {
  _id: string
  planTitle: string
  description: string
  price: number
  numberOfListing: number
  createdAt: string | Date
  updatedAt: string | Date
  __v: number
}

interface Props {
  data: SponsoredListingItem
  userId: string | undefined
}

const formSchema = z.object({
  paymentMethod: z.enum(["paypal", "cash-on-delivery", "bank-transfer"]),
})

const AdditionalPlansCard = ({ data, userId }: Props) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const handlePurchase = () => {
    setIsPaymentModalOpen(true)
  }

  return (
    <>
      <Card className="border border-[#E6E6E6] rounded-[10px] overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="bg-primary dark:bg-pinkGradient p-4 text-white">
          <h3 className="text-xl font-semibold">{data.planTitle}</h3>
        </div>
        <CardContent className="p-6">
          <div className="mb-4">
            <p className="text-3xl font-bold dark:text-black">${data.price}</p>
          </div>

          <div className="space-y-4 mb-6">
            <p className="text-gray-600">{data.description}</p>

            <div className="flex items-center justify-between border-t pt-2 *:dark:text-black">
              <span className="font-medium">Number of Listings:</span>
              <span className="font-bold">{data.numberOfListing}</span>
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90" onClick={handlePurchase} disabled={!userId}>
            Purchase Now
          </Button>
        </CardContent>
      </Card>

      <SponsoredListingPayment
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        data={data}
        userId={userId}
      />
    </>
  )
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  data: SponsoredListingItem
  userId: string | undefined
}

function SponsoredListingPayment({ isOpen, onClose, data, userId }: PaymentModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "paypal",
    },
  })

  const { mutate: paypalPayment, isPending } = useMutation({
    mutationKey: ["paypal-sponsored-listing"],
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
    mutationKey: ["cod-sponsored-listing"],
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
        toast.success("Cash on Delivery payment is being processed.", {
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
    mutationKey: ["bank-transfer-sponsored-listing"],
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
        toast.success("Bank Transfer payment is being processed.", {
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
        sponsoredListingId: data._id,
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
            <h3 className="text-[20px] lg:text-[26px] font-semibold text-[#444444]">{data?.planTitle}</h3>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <div className="flex items-center gap-3 text-[16px] font-normal text-[#444444]">
                  <span className="text-[#152764] dark:!text-[#6841A5]">•</span>
                  <span>Listings</span>
                </div>
                <span className="text-[#152764] dark:text-gradient-pink text-[15px] font-bold">
                  {data.numberOfListing}
                </span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-3 text-[16px] font-normal text-[#444444]">
                  <span className="text-[#152764] dark:!text-[#6841A5]">•</span>
                  <span>Description</span>
                </div>
              </div>
              <p className="text-[14px] text-gray-600">{data.description}</p>
              <div className="flex justify-between font-medium pt-2 border-t-[1px] border-[#000000]">
                <span className="text-[16px] font-semibold text-[#444444]">Charged</span>
                <span className="text-[#000000] font-medium text-[16px]">${data.price}</span>
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

export default AdditionalPlansCard

