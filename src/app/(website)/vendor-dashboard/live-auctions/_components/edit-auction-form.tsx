"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import { InputWithTags } from "@/components/ui/input-with-tags"
import { Checkbox } from "@/components/ui/checkbox"
import ProductGallery from "@/components/shared/imageUpload/ProductGallery"
import { useSession } from "next-auth/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { AuctionDataType } from "@/types/vendorAuction"
import { useQueryClient } from "@tanstack/react-query"
import { ClientDateTimePicker } from "@/components/dateTime/client-date-time-picker"

// Same form schema as AddAuctionForm
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string(),
  description: z.string(),
  industry: z.string().min(1, "Industry is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  openingPrice: z.string().min(1, "Opening price is required"),
  reservePrice: z.string().optional(),
  buyNowPrice: z.string().optional(),
  startingDateAndTime: z.coerce.date().optional(),
  endingDateAndTime: z.coerce.date().optional(),
  quantity: z.string().min(1, "Quantity is required"),
  tags: z.array(z.string()).optional(),
  thc: z.string().optional(),
  cbd: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  makeAnOfferCheck: z.boolean().default(false),
  makeAnOfferValue: z.string().optional(),
  hasCOA: z.boolean().default(false),
  images: z.array(z.any()).optional(),
  coaImage: z.any().optional(),
  auctionType: z.string().min(1, "Auction type is required"),
  productCondition: z.string().min(1, "Product condition is required"),
  bidIncrement: z.string().min(1, "Bid increment is required"),
  productPolicy: z.string().optional(),
})

interface EditAuctionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  auction: AuctionDataType | null
}

const EditAuctionDialog: React.FC<EditAuctionDialogProps> = ({ open, onOpenChange, auction }) => {
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [coaImage, setCoaImage] = useState<File | null>(null)
  const [selectedIndustry, setSelectedIndustry] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [categories, setCategories] = useState<any[]>([])
  const [subCategories, setSubCategories] = useState<any[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [locations, setLocations] = useState<any[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [states, setStates] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [isClient, setIsClient] = useState(false)

  const queryClient = useQueryClient()

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true)

    // Only initialize dates if they're not already set
    if (!startDate) {
      setStartDate(new Date())
    }
    if (!endDate) {
      setEndDate(new Date())
    }
  }, [startDate, endDate])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      industry: "",
      category: "",
      subCategory: "",
      openingPrice: "",
      reservePrice: "",
      buyNowPrice: "",
      startingDateAndTime: undefined,
      endingDateAndTime: undefined,
      quantity: "",
      tags: [],
      thc: "",
      cbd: "",
      country: "",
      state: "",
      makeAnOfferCheck: false,
      makeAnOfferValue: "",
      hasCOA: false,
      images: [],
      coaImage: null,
      auctionType: "",
      productCondition: "",
      bidIncrement: "",
      productPolicy: "",
    },
  })

  const session = useSession()
  const token = session.data?.user.token
  const userid = session.data?.user.id ?? ""

  // Fetch locations data
  const { data: locationsData } = useQuery({
    queryKey: ["locations", userid],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/store/locations/${userid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    enabled: !!userid && !!token,
  })

  // Process locations data to extract unique countries and states
  useEffect(() => {
    if (locationsData?.verifiedLocations) {
      setLocations(locationsData.verifiedLocations)

      // Extract unique countries
      const uniqueCountries = Array.from(
        new Set(locationsData.verifiedLocations.map((loc: any) => loc.country)),
      ) as string[]
      setCountries(uniqueCountries)
    }
  }, [locationsData])

  // Update states when country changes
  useEffect(() => {
    if (selectedCountry && (selectedCountry === "United States" || selectedCountry === "Canada")) {
      const countryStates = locations.filter((loc: any) => loc.country === selectedCountry).map((loc: any) => loc.state)

      // Remove duplicates
      const uniqueStates = Array.from(new Set(countryStates)) as string[]
      setStates(uniqueStates)
    } else {
      setStates([])
      form.setValue("state", "")
    }
  }, [selectedCountry, locations, form])

  // Fetch categories based on selected industry
  const { data: categoriesData, refetch: refetchCategories } = useQuery({
    queryKey: ["categories", selectedIndustry],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?industry=${selectedIndustry}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    enabled: !!selectedIndustry && !!token,
  })

  // Fetch subcategories based on selected category
  const { data: subCategoriesData, refetch: refetchSubCategories } = useQuery({
    queryKey: ["subcategories", selectedCategory],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subcategories/by-category/${selectedCategory}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    enabled: !!selectedCategory && !!token,
  })

  useEffect(() => {
    if (categoriesData?.data) {
      setCategories(categoriesData.data)
    }
  }, [categoriesData])

  useEffect(() => {
    if (subCategoriesData?.data) {
      setSubCategories(subCategoriesData.data)
    }
  }, [subCategoriesData])

  useEffect(() => {
    if (selectedIndustry) {
      refetchCategories()
      if (!auction) {
        form.setValue("category", "")
        form.setValue("subCategory", "")
        setSelectedCategory("")
      }
    }
  }, [selectedIndustry, refetchCategories, form, auction])

  useEffect(() => {
    if (selectedCategory) {
      refetchSubCategories()
      if (!auction) {
        form.setValue("subCategory", "")
      }
    }
  }, [selectedCategory, refetchSubCategories, form, auction])

  // Check if THC and CBD inputs should be disabled
  const shouldDisableThcCbd = () => {
    const categoryName = categories.find((cat) => cat.id === selectedCategory)?.name
    return categoryName === "Accessories" || categoryName === "Apparel"
  }

  // Populate form with auction data when it changes
  useEffect(() => {
    if (auction && isClient) {
      console.log("Setting form values with auction data:", auction._id)

      // Set dates first to avoid hydration issues
      const startingDate = auction.startingDateAndTime ? new Date(auction.startingDateAndTime) : new Date()
      const endingDate = auction.endingDateAndTime ? new Date(auction.endingDateAndTime) : new Date()

      setStartDate(startingDate)
      setEndDate(endingDate)

      form.reset({
        title: auction.title || "",
        shortDescription: auction.shortDescription || "",
        description: auction.description || "",
        industry: auction.industry || "",
        category: "",
        subCategory: auction.subCategory || "",
        openingPrice: auction.openingPrice?.toString() || "",
        reservePrice: auction.reservePrice?.toString() || "",
        buyNowPrice: auction.buyNowPrice?.toString() || "",
        startingDateAndTime: startingDate,
        endingDateAndTime: endingDate,
        quantity: auction.quantity?.toString() || "",
        tags: auction.tags || [],
        thc: auction.thc?.toString() || "",
        cbd: auction.cbd?.toString() || "",
        country: auction.country || "",
        state: auction.state || "",
        makeAnOfferCheck: auction.makeAnOfferCheck || false,
        makeAnOfferValue: auction.makeAnOfferValue?.toString() || "",
        hasCOA: auction.hasCOA || false,
        images: [],
        coaImage: null,
        auctionType: auction.auctionType || "",
        productCondition: auction.productCondition || "",
        bidIncrement: auction.bidIncrement?.toString() || "",
        productPolicy: auction.productPolicy || "",
      })

      setSelectedIndustry(auction.industry || "")
      setSelectedCategory("")
      setSelectedCountry(auction.country || "")
      setTags(auction.tags || [])

      // Set existing images
      if (auction.images && auction.images.length > 0) {
        setExistingImages(auction.images)
      } else {
        setExistingImages([])
      }
    }
  }, [auction, form, isClient])

  useEffect(() => {
    form.setValue("tags", tags)
    form.trigger("tags")
    form.setValue(
      "images",
      images.map((image) => image.name),
    )
  }, [tags, form, images])

  const handleImageChange = (newImages: File[]) => {
    setImages(newImages)
  }

  const handleCoaImageChange = (image: File) => {
    setCoaImage(image)
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!auction?._id) throw new Error("Auction ID is missing")

      return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vendor/update/auction/${auction._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }).then((res) => res.json())
    },
    onSuccess: (data) => {
      if (data.status === false) {
        toast.error(data.message, {
          position: "top-right",
          richColors: true,
        })
        return
      }

      toast.success(data.message || "Auction updated successfully", {
        position: "top-right",
        richColors: true,
      })

      // Invalidate and refetch auctions data
      queryClient.invalidateQueries({ queryKey: ["vendor-auctions"] })

      // Close the dialog
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error("Failed to update auction: " + error.message, {
        position: "top-right",
        richColors: true,
      })
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!auction?._id) {
      toast.error("Auction ID is missing", {
        position: "top-right",
        richColors: true,
      })
      return
    }

    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("shortDescription", data.shortDescription)
    formData.append("description", data.description)
    formData.append("industry", data.industry)
    formData.append("category", data.category)
    formData.append("subCategory", data.subCategory || "")
    formData.append("openingPrice", data.openingPrice)
    formData.append("reservePrice", data.reservePrice || "")
    formData.append("buyNowPrice", data.buyNowPrice || "")
    formData.append("startingDateAndTime", data.startingDateAndTime?.toString() || "")
    formData.append("endingDateAndTime", data.endingDateAndTime?.toString() || "")
    formData.append("quantity", data.quantity)
    formData.append("tags", JSON.stringify(data.tags))
    formData.append("thc", data.thc || "")
    formData.append("cbd", data.cbd || "")
    formData.append("country", data.country)
    formData.append("vendorID", userid)

    // Only append state if country is US or Canada, otherwise send null
    if (data.country === "United States" || data.country === "Canada") {
      formData.append("state", data.state || "")
    } else {
      formData.append("state", "null")
    }

    formData.append("makeAnOfferCheck", data.makeAnOfferCheck.toString())
    formData.append("makeAnOfferValue", data.makeAnOfferValue || "")
    formData.append("hasCOA", data.hasCOA.toString())

    // Append existing images that should be kept
    formData.append("existingImages", JSON.stringify(existingImages))

    // Append new images if any
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image)
      })
    }

    if (data.hasCOA && coaImage) {
      formData.append("coaImage", coaImage)
    }

    formData.append("auctionType", data.auctionType)
    formData.append("productCondition", data.productCondition)
    formData.append("bidIncreament", data.bidIncrement)
    formData.append("productPolicy", data.productPolicy || "")

    mutate(formData)
  }

  useEffect(() => {
    console.log("EditAuctionDialog mounted with open:", open, "and auction:", auction?._id)
  }, [open, auction])

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Edit Auction</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="w-full md:w-[58%] space-y-[16px] mt-[16px]">
                <FormField
                  control={form.control}
                  name="auctionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                        Auction Type<span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-[51px] border-[#9C9C9C] dark:!text-black">
                            <SelectValue placeholder="Select Auction Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="reverse">Reverse</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                        Title<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          type="text"
                          className="py-6 border-[1px] border-[#B0B0B0] dark:!text-black text-[16px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="leading-[19.2px] text-[#9C9C9C] text-[16px] font-medium">
                        Short Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type Short Description Here"
                          className="py-3 resize-none border-[#9E9E9E] dark:!text-black"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="leading-[19.2px] text-[#9C9C9C] text-[16px] font-medium">
                        Full Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type Full Description Here"
                          className="py-3 resize-none border-[#9E9E9E] dark:!text-black"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                        Product Condition<span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-[51px] border-[#9C9C9C] dark:!text-black">
                            <SelectValue placeholder="Select Product Condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="used">Used</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="leading-[19.2px] text-[#9C9C9C] text-[16px] font-medium">
                        Industry Type<span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedIndustry(value)
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-[51px] border-[#9C9C9C] dark:!text-black">
                            <SelectValue placeholder="Select Industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="recreational">RECREATIONAL CANNABIS</SelectItem>
                          <SelectItem value="cbd">HEMP/CBD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                        Category<span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedCategory(value)
                        }}
                        value={field.value}
                        disabled={!selectedIndustry}
                      >
                        <FormControl>
                          <SelectTrigger className="h-[51px] border-[#9C9C9C] dark:!text-black">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.categoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                        Sub Category<span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategory}>
                        <FormControl>
                          <SelectTrigger className="h-[51px] border-[#9C9C9C] dark:!text-black">
                            <SelectValue placeholder="Select Sub Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subCategories.map((subCategory) => (
                            <SelectItem key={subCategory._id} value={subCategory._id}>
                              {subCategory.subCategoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="openingPrice"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                            Opening Price<span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="flex justify-between mt-2 w-full whitespace-nowrap rounded-md border border-solid border-[#B0B0B0] h-[51px]">
                            <div className="gap-3 self-stretch px-4 dark:!text-[#6841A5] text-sm font-semibold leading-tight text-[#0057A8] dark:bg-[#482D721A] bg-gray-200 rounded-l-lg h-[49px] w-[42px] flex items-center justify-center">
                              $
                            </div>
                            <FormControl>
                              <Input
                                placeholder="0.00"
                                type="number"
                                className="flex-1 shrink gap-2 self-stretch py-3 pr-5 pl-4 my-auto text-base leading-snug rounded-lg min-w-[100px] border-none h-[50px] dark:!text-black"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="reservePrice"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                            Reserve Price
                          </FormLabel>
                          <div className="flex justify-between mt-2 w-full whitespace-nowrap rounded-md border border-solid border-[#B0B0B0] h-[51px]">
                            <div className="gap-3 self-stretch px-4 dark:!text-[#6841A5] text-sm font-semibold leading-tight text-[#0057A8] dark:bg-[#482D721A] bg-gray-200 rounded-l-lg h-[49px] w-[42px] flex items-center justify-center">
                              $
                            </div>
                            <FormControl>
                              <Input
                                placeholder="0.00"
                                type="number"
                                className="flex-1 shrink gap-2 self-stretch py-3 pr-5 pl-4 my-auto text-base leading-snug rounded-lg min-w-[100px] border-none h-[50px] dark:!text-black"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="buyNowPrice"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                            Buy Now Price
                          </FormLabel>
                          <div className="flex justify-between mt-2 w-full whitespace-nowrap rounded-md border border-solid border-[#B0B0B0] h-[51px]">
                            <div className="gap-3 self-stretch px-4 dark:!text-[#6841A5] text-sm font-semibold leading-tight text-[#0057A8] dark:bg-[#482D721A] bg-gray-200 rounded-l-lg h-[49px] w-[42px] flex items-center justify-center">
                              $
                            </div>
                            <FormControl>
                              <Input
                                placeholder="0.00"
                                type="number"
                                className="flex-1 shrink gap-2 self-stretch py-3 pr-5 pl-4 my-auto text-base leading-snug rounded-lg min-w-[100px] border-none h-[50px] dark:!text-black"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="bidIncrement"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                        Bid Increment<span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="flex justify-between mt-2 w-full whitespace-nowrap rounded-md border border-solid border-[#B0B0B0] h-[51px]">
                        <div className="gap-3 self-stretch px-4 dark:!text-[#6841A5] text-sm font-semibold leading-tight text-[#0057A8] dark:bg-[#482D721A] bg-gray-200 rounded-l-lg h-[49px] w-[42px] flex items-center justify-center">
                          $
                        </div>
                        <FormControl>
                          <Input
                            placeholder="0.00"
                            type="number"
                            className="flex-1 shrink gap-2 self-stretch py-3 pr-5 pl-4 my-auto text-base leading-snug rounded-lg min-w-[100px] border-none h-[50px] dark:!text-black"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6 w-auto">
                    <FormField
                      control={form.control}
                      name="startingDateAndTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                            Starting Day & Time<span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <ClientDateTimePicker
                              hourCycle={24}
                              value={startDate}
                              onChange={(date) => {
                                setStartDate(date)
                                field.onChange(date)
                              }}
                              className="border-[#B0B0B0] dark:bg-white dark:hover:text-[#C5C5C5] dark:text-[#444444]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6 w-auto">
                    <FormField
                      control={form.control}
                      name="endingDateAndTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                            Ending Day & Time<span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <ClientDateTimePicker
                              hourCycle={24}
                              value={endDate}
                              onChange={(date) => {
                                setEndDate(date)
                                field.onChange(date)
                              }}
                              className="border-[#B0B0B0] dark:bg-white dark:hover:text-[#C5C5C5] dark:text-[#444444]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                        Quantity<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123"
                          type="number"
                          className="h-[51px] border-[#9C9C9C] dark:!text-black"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!(
                  selectedCategory === "67d1b9ecf2ed66e4a542fe5e" || selectedCategory === "67d1ba16f2ed66e4a542fe7b"
                ) ? (
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="thc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                              THC
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0.0"
                                type="number"
                                step="0.1"
                                className="h-[51px] border-[#9C9C9C] dark:!text-black"
                                disabled={shouldDisableThcCbd()}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="cbd"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                              CBD
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0.0"
                                type="number"
                                step="0.1"
                                className="h-[51px] border-[#9C9C9C] dark:!text-black"
                                disabled={shouldDisableThcCbd()}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ) : null}

                {/* Add country and state fields here */}
                <div>
                  <h3>Select Country:</h3>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                              Country<span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value)
                                setSelectedCountry(value)
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-[51px] border-[#9C9C9C] dark:!text-black">
                                  <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-6">
                      {(selectedCountry === "United States" || selectedCountry === "Canada") && (
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                                State/Province<span className="text-red-500">*</span>
                              </FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-[51px] border-[#9C9C9C] dark:!text-black">
                                    <SelectValue placeholder="Select State" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {states.map((state) => (
                                    <SelectItem key={state} value={state}>
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <InputWithTags placeholder="Add Tags" limit={10} tags={tags} setTags={setTags} />
                </div>

                <FormField
                  control={form.control}
                  name="hasCOA"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal text-[#444444]">
                          Certificate of Autheticity (COA)
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">Upload a COA document for this product</p>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("hasCOA") && (
                  <div className="border border-dashed border-[#9C9C9C] p-4 rounded-md">
                    <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                      Upload COA Document
                    </FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleCoaImageChange(e.target.files[0])
                        }
                      }}
                      className="mt-2"
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="makeAnOfferCheck"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal text-[#444444]">
                          Allow users to make an offer
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Enable this to allow users to make custom offers
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("makeAnOfferCheck") && (
                  <FormField
                    control={form.control}
                    name="makeAnOfferValue"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                          Minimum Offer Value
                        </FormLabel>
                        <div className="flex justify-between mt-2 w-full whitespace-nowrap rounded-md border border-solid border-[#B0B0B0] h-[51px]">
                          <div className="gap-3 self-stretch px-4 dark:!text-[#6841A5] text-sm font-semibold leading-tight text-[#0057A8] dark:bg-[#482D721A] bg-gray-200 rounded-l-lg h-[49px] w-[42px] flex items-center justify-center">
                            $
                          </div>
                          <FormControl>
                            <Input
                              placeholder="0.00"
                              type="number"
                              className="flex-1 shrink gap-2 self-stretch py-3 pr-5 pl-4 my-auto text-base leading-snug rounded-lg min-w-[240px] border-none h-[50px] dark:!text-black"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="productPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="leading-[19.2px] text-[#9C9C9C] text-[16px] font-medium">
                        Product Policy
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type Product Policy Here"
                          className="py-3 resize-none border-[#9E9E9E] dark:!text-black"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full md:w-[600px] h-full mt-[16px] border border-[#B0B0B0] rounded-lg">
                <ProductGallery onImageChange={handleImageChange} existingImages={existingImages} />
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="py-[12px] px-[24px]"
              >
                Cancel
              </Button>
              <Button type="submit" className="py-[12px] px-[24px]" disabled={isPending}>
                {isPending ? "Updating..." : "Update Auction"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditAuctionDialog

