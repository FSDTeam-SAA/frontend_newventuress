"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus } from "lucide-react"

const formSchema = z.object({
  policyTabLabel: z.string(),
  shippingPolicy: z.string(),
  returnPolicy: z.string(),
  cancellationPolicy: z.string(),
  media1: z.any().optional(),
  media2: z.any().optional(),
  customerSupport: z.object({
    phone: z.string(),
    email: z.string().email(),
    address: z.string(),
    country: z.string(),
    province: z.string(),
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function PolicySupportForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerSupport: {},
    },
  })

  function onSubmit(data: FormValues) {
    console.log(data)
  }

  return (
    <div className="bg-white rounded-[24px] p-[32px]">
      <div
        className={
          "bg-primary px-4 py-3 mb- rounded-t-lg text-white text-[32px] leading-[38px] font-semibold h-[78px] flex items-center mb-5"
        }
      >
        Policy & Support
      </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Policy Section */}
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="policyTabLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Policy Tab Label</FormLabel>
                <FormControl>
                  <Input {...field} className="h-[51px] border-[#9C9C9C]"/>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shippingPolicy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Policy</FormLabel>
                <FormControl>
                  <Textarea {...field}  className="resize-none h-[51px] border-[#9C9C9C]"/>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="returnPolicy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Return Policy</FormLabel>
                <FormControl>
                  <Textarea {...field}  className="resize-none h-[51px] border-[#9C9C9C]"/>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cancellationPolicy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancellation policy</FormLabel>
                <FormControl>
                  <Textarea {...field}  className="resize-none h-[51px] border-[#9C9C9C]" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Media Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="media1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Media</FormLabel>
                <FormControl>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <div className="mx-auto w-12 h-12 flex items-center justify-center">
                      <ImagePlus className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Drop your imager here, or browse</p>
                    <p className="text-xs text-gray-400">Jpeg, png are allowed</p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="media2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Media</FormLabel>
                <FormControl>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <div className="mx-auto w-12 h-12 flex items-center justify-center">
                      <ImagePlus className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Drop your imager here, or browse</p>
                    <p className="text-xs text-gray-400">Jpeg, png are allowed</p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Customer Support Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-medium">Customer Support</h2>

          <FormField
            control={form.control}
            name="customerSupport.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" {...field}  className=" h-[51px] border-[#9C9C9C]"/>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerSupport.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field}  className=" h-[51px] border-[#9C9C9C]"/>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerSupport.address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea {...field}  className="resize-none h-[51px] border-[#9C9C9C]" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerSupport.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field}  className=" h-[51px] border-[#9C9C9C]"/>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerSupport.province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Input {...field}  className=" h-[51px] border-[#9C9C9C]"/>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" >
            Submit
          </Button>
        </div>
      </form>
    </Form>
    </div>
  )
}

