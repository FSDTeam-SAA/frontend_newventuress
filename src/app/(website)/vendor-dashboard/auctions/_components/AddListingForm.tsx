"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import ProductGallery from "@/components/shared/imageUpload/ProductGallery";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputWithTags } from "@/components/ui/input-with-tags";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  productFormSchema,
  type ProductFormValues,
} from "./product-form-schema";

interface Props {
  setShowAddAuction: Dispatch<SetStateAction<boolean>>;
}

export function AddListingForm({setShowAddAuction}: Props) {
  const [images, setImages] = useState<File[]>([]);
  const [formValues, setFormValues] = useState({ /* your form values here */ });
  const [tags, setTags] = React.useState<string[]>([]);

  const {mutate: createProduct, isPending} = useMutation({
    mutationKey: ["auction_listing_create"],
    mutationFn: (body: FormData) => fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product`, {
      method: "POST",
      body: body
    }).then((res) => res.json()),
    onSuccess: (data) => {
      if(!data.status) {
        toast.error(data.message, {
          position: "top-right",
          richColors: true
        });
        return;
      }

      // handle success
      toast.success(data.message, {
        position: "top-right",
        richColors: true
      });

      form.reset();
      setTags([]);
      setImages([])
      setShowAddAuction(false)

    }
  })


  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      productType: "cbd",
      stockStatus: "in stock",
      storeId: "6795fbc52288a452214d2371",
      category: "6794b3a0bf6abc36ff944cec",
      subCategory: "6794c42e9bf73edbb82f688a",
      purchasedPrice: "",
      selllingPrice: "",
      discountPrice: "",
      size: "",
      quantity: "",
      sku: "",
      coa: false,
      tags: [],
      photos: [],
    },
  });

  
  useEffect(() => {
    form.setValue("tags", tags); // Update the 'tags' field in the form
    form.trigger("tags");
    
    
  }, [tags, form,images, form.trigger]);
  const onSubmit = (data: ProductFormValues) => {
    const formData = new FormData();
  
    // Append images to the formData
    images.forEach((image) => {
      formData.append("photos", image ); // Append each image file
    });
  
    // Append other fields using 'data' from the form
    tags.forEach((tag) => {
      formData.append("tags", tag)
    })
    
    formData.append("title", data.title);
    formData.append("shortDescription", data.shortDescription);
    formData.append("description", data.description);
    formData.append("productType", data.productType);
    formData.append("stockStatus", data.stockStatus);
    formData.append("storeId", data.storeId);
    formData.append("category", data.category);
    formData.append("subCategory", data.subCategory);
    formData.append("purchasedPrice", data.purchasedPrice);
    formData.append("selllingPrice", data.selllingPrice);
    formData.append("discountPrice", data.discountPrice || ""); // Use empty string if no discount price
    formData.append("size", data.size);
    formData.append("quantity", data.quantity);
    formData.append("sku", data.sku);
    formData.append("coa", data.coa.toString()); // COA is a boolean, so convert to string
    
    // Log formData to inspect it if needed
    createProduct(formData)
  
    // After creating the formData, you can submit it using fetch or axios:
   
  };

  
  const handleImageChange = (images: File[]) => {
    setImages(images);
    setFormValues({ ...formValues, images }); // Update the form values
   

  };

  return (
    <section className="pb-[60px]">
      <div className="bg-white rounded-[24px] p-[32px]  ">
        <div
          className={
            "bg-primary px-4 py-3 mb- rounded-t-3xl text-white text-[32px] leading-[38px] font-semibold h-[78px] flex items-center dark:bg-pinkGradient"
          }
        >
          Add New Product
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-4">
              <div className="w-[58%] space-y-[16px] mt-[16px]">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base text-[#444444] font-normal">
                        Title <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="h-[51px] border-[1px] border-[#B0B0B0] dark:border-[#B0B0B0] dark:!text-black " />
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
                      <FormLabel className="text-base text-[#444444] font-normal ">Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type Description here"
                          {...field}
                          className=" border-[1px] border-[#B0B0B0] dark:border-[#B0B0B0] dark:!text-black"
                          rows={3}
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
                      <FormLabel className="text-base text-[#444444] font-normal">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type Description here"
                          {...field}
                          className=" border-[1px] border-[#B0B0B0] dark:border-[#B0B0B0] dark:!text-black"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) =>
                      <FormItem>
                        <FormLabel className="leading-[19.2px] text-base text-[#444444] font-normal">
                          Industry Type<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {["cbd", "recreational"].map(type =>
                              <div
                                key={type}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={type}
                                  checked={field.value === type}
                                  onCheckedChange={checked => {
                                    if (checked) {
                                      field.onChange(type); // Ensures only one checkbox is selected at a time
                                    } else {
                                      field.onChange(""); // Clears the selection
                                    }
                                  }}
                                  className="h-4 w-4 border-[#C5C5C5]"
                                />
                                <Label
                                  htmlFor={type}
                                  className="leading-[19.2px] text-base text-[#444444] font-normal"
                                >
                                  {type === "cbd" ? "RECREATIONAL CANNABIS" : "HEMP/CBD" }
                                </Label>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>}
                  />

                  <FormField
                    control={form.control}
                    name="stockStatus"
                    render={({ field }) =>
                      <FormItem>
                        <FormLabel className="leading-[19.2px] text-base text-[#444444] font-normal">
                          Stock Status <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {["in stock", "out of stock"].map(type =>
                              <div
                                key={type}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={type}
                                  checked={field.value === type}
                                  onCheckedChange={checked => {
                                    if (checked) {
                                      field.onChange(type); // Ensures only one checkbox is selected at a time
                                    } else {
                                      field.onChange(""); // Clears the selection
                                    }
                                  }}
                                  className="h-4 w-4 border-[#C5C5C5]"
                                />
                                <Label
                                  htmlFor={type}
                                  className="leading-[19.2px] text-base text-[#444444] font-normal"
                                >
                                  {type}
                                </Label>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>}
                  />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="storeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base text-[#444444] font-normal">
                          Store <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className="h-[51px] border-[1px] border-[#B0B0B0] dark:border-[#B0B0B0]">
                            <SelectTrigger className="dark:text-[#444444]">
                              <SelectValue placeholder="Select store" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="dark:bg-white dark:border-none">
                            <SelectItem value="6795fbc52288a452214d2371">Store 1</SelectItem>
                            <SelectItem value="6795fbc52288a452214d2371">Store 2</SelectItem>
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
                        <FormLabel className="text-base text-[#444444] font-normal">
                          Category <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className="h-[51px] border-[1px] border-[#B0B0B0] dark:border-[#B0B0B0]">
                            <SelectTrigger className="dark:text-[#444444]">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="dark:bg-white dark:border-none">
                            <SelectItem value="6794b3a0bf6abc36ff944cec">Category 1</SelectItem>
                            <SelectItem value="6794b3a0bf6abc36ff944cec">Category 2</SelectItem>
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
                        <FormLabel className="text-base text-[#444444] font-normal">
                          Sub-Category <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className="h-[51px] border-[1px] border-[#B0B0B0] dark:border-[#B0B0B0]">
                            <SelectTrigger className="dark:text-[#444444]">
                              <SelectValue placeholder="Select sub-category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="dark:bg-white dark:border-none">
                            <SelectItem value="6794c42e9bf73edbb82f688a">Sub-category 1</SelectItem>
                            <SelectItem value="6794c42e9bf73edbb82f688a">Sub-category 2</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="purchasedPrice"
                    render={({ field }) => (
                      <FormItem className="flex flex-col ">
                        <FormLabel className=" leading-tight text-[#444444] text-[16px] font-normal ">
                          Purchased Price
                        </FormLabel>
                        <div className="flex justify-between mt-2 w-full whitespace-nowrap rounded-md border border-solid border-neutral-400 h-[51px] dark:border-[#B0B0B0]">
                          <div className="gap-3 self-stretch dark:bg-[#482D721A] px-4 text-sm font-semibold leading-tight text-[#0057A8] dark:!text-[#6841A5] bg-gray-200 rounded-l-lg h-[49px] w-[42px] flex items-center justify-center">
                            $
                          </div>
                          <FormControl>
                            <Input
                              placeholder="0.00"
                              type="number"
                              className="flex-1 shrink gap-2 self-stretch py-3 pr-5 pl-4 my-auto text-base leading-snug rounded-lg  border-none h-[50px] "
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="selllingPrice"
                    render={({ field }) => (
                      <FormItem className="flex flex-col ">
                        <FormLabel className=" leading-tight text-[#444444] text-[16px] font-normal">
                          Selling Price
                        </FormLabel>
                        <div className="flex justify-between mt-2 w-full whitespace-nowrap rounded-md border border-solid border-neutral-400 h-[51px] dark:border-[#B0B0B0]">
                          <div className="gap-3 self-stretch px-4 text-sm font-semibold leading-tight text-[#0057A8] dark:!text-[#6841A5] bg-gray-200 dark:bg-[#482D721A] rounded-l-lg h-[49px] w-[42px] flex items-center justify-center">
                            $
                          </div>
                          <FormControl>
                            <Input
                              placeholder="0.00"
                              type="number"
                              className="flex-1 shrink gap-2 self-stretch py-3 pr-5 pl-4 my-auto text-base leading-snug rounded-lg  border-none h-[50px] "
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discountPrice"
                    render={({ field }) => (
                      <FormItem className="flex flex-col ">
                        <FormLabel className=" leading-tight text-[#444444] text-[16px] font-normal">
                          Discount Price
                        </FormLabel>
                        <div className="flex justify-between mt-2 w-full whitespace-nowrap rounded-md border border-solid border-neutral-400 h-[51px] dark:border-[#B0B0B0]">
                          <div className="gap-3 self-stretch px-4 text-sm font-semibold leading-tight text-[#0057A8] dark:!text-[#6841A5] dark:bg-[#482D721A] bg-gray-200 rounded-l-lg h-[49px] w-[42px] flex items-center justify-center">
                            $
                          </div>
                          <FormControl>
                            <Input
                              placeholder="0.00"
                              type="number"
                              className="flex-1 shrink gap-2 self-stretch py-3 pr-5 pl-4 my-auto text-base leading-snug rounded-lg  border-none h-[50px]"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base text-[#444444] font-normal">Size (KG)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="h-[51px] border-[#B0B0B0] dark:border-[#B0B0B0] dark:!text-[#444444]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base text-[#444444] font-normal">Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="h-[51px] border-[#B0B0B0] dark:border-[#B0B0B0] dark:!text-[#444444]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base text-[#444444] font-normal">SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="Fox-0389" {...field} className="h-[51px] border-[#B0B0B0] dark:border-[#B0B0B0]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="coa"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center  space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base text-[#444444] font-normal">COA (Certificate Of Authenticity)</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />


                <div className="mt-3">
                  <InputWithTags
                    className="dark:border-[#B0B0B0]"
                    placeholder="Add Tags"
                    limit={10}
                    tags={tags} // Pass tags
                    setTags={setTags} // Pass setTags
                  />
                </div>
              </div>

              <div className="w-[600px] h-full mt-[16px] border border-[#9C9C9C] dark:border-[#B0B0B0] rounded-lg  ">
                <ProductGallery onImageChange={handleImageChange} files={images}  />
              </div>
            </div>
            <div className="flex justify-end ">
              <Button type="submit" className="py-[12px] px-[24px]" disabled={isPending}>
                Create {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
