"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const MAX_FILE_SIZE = 5000000 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  // phone: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  street: z.string().min(1, "Street address is required"),
  imageSource: z.string().url("Invalid URL").optional().or(z.literal("")),
  image: z
    .any()
    .refine((file) => file instanceof File, "Image is required")
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .png, .webp and .gif formats are supported.",
    )
    .optional(),
})

export default function ProfileSettingsForm() {
  const [image, setImage] = useState<string>("https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-autumn-camping.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      country: "",
      city: "",
      street: "",
      imageSource: "",
      image: undefined,
    },
  })

  useEffect(() => {
    // Set initial image if available (e.g., from user profile)
    form.setValue("image", new File([], "initial-image.png", { type: "image/png" }))
  }, [form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("All form data:", {
        ...values,
        image: values.image instanceof File ? values.image.name : values.imageSource,
      })
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(
              {
                ...values,
                image: values.image instanceof File ? values.image.name : values.imageSource,
              },
              null,
              2,
            )}
          </code>
        </pre>,
      )

      router.push("/account")
    } catch (error) {
      console.error("Form submission error", error)
      toast.error("Failed to submit the form. Please try again.")
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (image) {
        URL.revokeObjectURL(image);
      }
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
      form.setValue("image", file)
      form.setValue("imageSource", "") // Clear the imageSource when a file is uploaded
    }
  }

  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col-reverse lg:flex-row justify-between items-center">
        <div className="w-full lg:max-w-[554px] space-y-[24px] flex-grow">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-normal text-[#000000]">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Cameron Williamson"
                    {...field}
                    className="h-[50px] border-[1px] border-[#C5C5C5] focus-visible:ring-primary-green-hover rounded-[8px] dark:!text-[#000000]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-normal text-[#000000]">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="@cameronwilliamson"
                    className="h-[50px] border-[1px] border-[#C5C5C5] focus-visible:ring-primary-green-hover rounded-[8px] dark:!text-[#000000]"
                    {...field}
                  />
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
                <FormLabel className="text-[16px] font-normal text-[#000000]">Email address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="georgia.young@example.com"
                    className="h-[50px] border-[1px] border-[#C5C5C5] focus-visible:ring-primary-green-hover rounded-[8px] dark:!text-[#000000]"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-normal text-[#000000]">Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(+33)7 75 55 65 33"
                    type="text"
                    className="h-[50px] border-[1px] border-[#C5C5C5] focus-visible:ring-primary-green-hover rounded-[8px] dark:!text-[#000000]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-normal text-[#000000]">Country</FormLabel>
                <FormControl>
                  <Input
                    placeholder="USA"
                    type="text"
                    className="h-[50px] border-[1px] border-[#C5C5C5] focus-visible:ring-primary-green-hover rounded-[8px] dark:!text-[#000000]"
                    {...field}
                  />
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
                <FormLabel className="text-[16px] font-normal text-[#000000]">Town/City</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Arizona"
                    type="text"
                    className="h-[50px] border-[1px] border-[#C5C5C5] focus-visible:ring-primary-green-hover rounded-[8px] dark:!text-[#000000]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-normal text-[#000000]">Street Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="4517 Washington Ave. Manchester, Kentucky 39495"
                    type="text"
                    className="h-[50px] border-[1px] border-[#C5C5C5] focus-visible:ring-primary-green-hover rounded-[8px] dark:!text-[#000000]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save Changes</Button>
        </div>
        <div className="flex flex-col mb-[30px] lg:mb-0 justify-center items-center gap-[16px]">
          <Image
            src={image || "/placeholder.svg"}
            alt="profile"
            height={160}
            width={160}
            className="rounded-full w-[160px] h-[160px]"
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, value, ref, ...field } }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"

                    id="fileInput"
                    value={value ? "" : undefined} // Reset value to allow re-selection of the same file
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleImageChange(e) // Update preview
                        onChange(file) // Update form state
                      }
                    }}
                    ref={ref}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => document.getElementById("fileInput")?.click()}
            className="dark:bg-white dark:text-gradient-pink dark:border dark:border-[#6841A5]"
          >
            Upload Image
          </Button>
        </div>
      </form>
    </Form>
  )
}

