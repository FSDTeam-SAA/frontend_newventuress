"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputWithTags } from "@/components/ui/input-with-tags"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import ProductGallery from "@/components/shared/imageUpload/ProductGallery"
import { useSession } from "next-auth/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Product } from "@/types/vendorstore"
import { useQueryClient } from "@tanstack/react-query"

// Form schema for product editing
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string(),
  description: z.string(),
  productType: z.string().min(1, "Industry is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  regularPrice: z.string().min(1, "Regular price is required"),
  selllingPrice: z.string().optional(),
  quantity: z.string().min(1, "Quantity is required"),
  tags: z.array(z.string()).optional(),
  thc: z.string().optional(),
  cbd: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  coa: z.boolean().default(false),
  photos: z.array(z.any()).optional(),
  coaCertificate: z.any().optional(),
  buyIndividually: z.boolean().default(false),
  productPolicy: z.string().optional(),
})

interface EditProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({ open, onOpenChange, product }) => {
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [coaCertificate, setCoaCertificate] = useState<File | null>(null)
  const [selectedIndustry, setSelectedIndustry] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [categories, setCategories] = useState<any[]>([])
  const [subCategories, setSubCategories] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [states, setStates] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])

  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      productType: "",
      category: "",
      subCategory: "",
      regularPrice: "",
      selllingPrice: "",
      quantity: "",
      tags: [],
      thc: "",
      cbd: "",
      country: "",
      state: "",
      coa: false,
      photos: [],
      coaCertificate: null,
      buyIndividually: false,
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
      // Only reset category and subcategory if there's no product data
      if (!product) {
        form.setValue("category", "")
        form.setValue("subCategory", "")
        setSelectedCategory("")
      }
    }
  }, [selectedIndustry, refetchCategories, form, product])

  useEffect(() => {
    if (selectedCategory) {
      refetchSubCategories()
      // Only reset subcategory if there's no product data
      if (!product) {
        form.setValue("subCategory", "")
      }
    }
  }, [selectedCategory, refetchSubCategories, form, product])

  // Check if THC and CBD inputs should be disabled
  const shouldDisableThcCbd = () => {
    const categoryName = categories.find((cat) => cat.id === selectedCategory)?.name
    return categoryName === "Accessories" || categoryName === "Apparel"
  }

  // Populate form with product data when it changes
  useEffect(() => {
    if (product) {
      console.log("Setting form values with product data:", product._id)

      // Set selected values first so they trigger the right fetches
      setSelectedIndustry(product.productType || "")
      setSelectedCategory(product.category || "")
      setSelectedCountry(product.country || "")
      setTags(product.tags || [])

      // Set existing images
      if (product.photos && product.photos.length > 0) {
        setExistingImages(product.photos)
      } else {
        setExistingImages([])
      }

      // Then set form values
      form.reset({
        title: product.title || "",
        shortDescription: product.shortDescription || "",
        description: product.description || "",
        productType: product.productType || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        regularPrice: product.regularPrice?.toString() || "",
        selllingPrice: product.selllingPrice?.toString() || "",
        quantity: product.quantity?.toString() || "",
        tags: product.tags || [],
        thc: product.thc?.toString() || "",
        cbd: product.cbd?.toString() || "",
        country: product.country || "",
        state: product.state || "",
        coa: product.coa || false,
        photos: [],
        coaCertificate: null,
        buyIndividually: product.soldMark || false,
        productPolicy: product.productPolicy || "",
      })
    }
  }, [product, form])

  useEffect(() => {
    form.setValue("tags", tags)
    form.trigger("tags")
    form.setValue(
      "photos",
      images.map((image) => image.name),
    )
  }, [tags, form, images])

  const handleImageChange = (newImages: File[]) => {
    setImages(newImages)
  }

  const handleCoaImageChange = (image: File) => {
    setCoaCertificate(image)
  }

  // Add a useEffect to log and debug the existingImages state
  useEffect(() => {
    console.log("Existing images:", existingImages)
  }, [existingImages])

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!product?._id) throw new Error("Product ID is missing")

      return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/edit/${product._id}`, {
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

      toast.success(data.message || "Product updated successfully", {
        position: "top-right",
        richColors: true,
      })

      // Invalidate and refetch products data
      queryClient.invalidateQueries({ queryKey: ["auction_listing"] })

      // Close the dialog
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error("Failed to update product: " + error.message, {
        position: "top-right",
        richColors: true,
      })
    },
  })

  // Update the onSubmit function to properly handle existing images
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!product?._id) {
      toast.error("Product ID is missing", {
        position: "top-right",
        richColors: true,
      })
      return
    }

    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("shortDescription", data.shortDescription)
    formData.append("description", data.description)
    formData.append("productType", data.productType)
    formData.append("category", data.category)
    formData.append("subCategory", data.subCategory || "")
    formData.append("regularPrice", data.regularPrice)
    formData.append("selllingPrice", data.selllingPrice || "")
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

    formData.append("coa", data.coa.toString())
    formData.append("soldMark", data.buyIndividually.toString())
    formData.append("productPolicy", data.productPolicy || "")

    // Append existing images that should be kept
    formData.append("existingPhotos", JSON.stringify(existingImages))
    console.log("Sending existing photos:", existingImages)

    // Append new images if any
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append("photos", image)
      })
    }

    if (data.coa && coaCertificate) {
      formData.append("coaCertificate", coaCertificate)
    }

    mutate(formData)
  }

  useEffect(() => {
    console.log("EditProductDialog mounted with open:", open, "and product:", product?._id)
  }, [open, product])

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Edit Product</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="w-full md:w-[58%] space-y-[16px] mt-[16px]">
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
                        Description
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
                  name="productType"
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
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="regularPrice"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                            Regular Price<span className="text-red-500">*</span>
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

                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="selllingPrice"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="leading-[19.2px] text-[#444444] text-[16px] font-normal">
                            Sale Price
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
                  name="coa"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal text-[#444444]">
                          Certificate of Authenticity (COA)
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">Upload a COA document for this product</p>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("coa") && (
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
                  name="buyIndividually"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal text-[#444444]">Option to Buy Individually</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Allow customers to purchase a single product at a time
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

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
                          placeholder="Enter detailed product policies here"
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
                {isPending ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProductDialog

