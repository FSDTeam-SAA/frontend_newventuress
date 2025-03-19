import * as z from "zod"

export const productFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string(),
  description: z.string(),
  productType: z.enum(["cbd", "recreational"]),
  stockStatus: z.enum(["in stock", "out of stock"]),
  storeId: z.string().min(1, "Store is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub-category is required"),
  purchasedPrice: z.string().min(1, "Purchase price is required"),
  selllingPrice: z.string().min(1, "Selling price is required"),
  regularPrice: z.string().optional(),
  size: z.string(),
  quantity: z.string(),
  sku: z.string(),
  coa: z.boolean().default(false),
  tags: z.array(z.string()),
  photos: z.array(z.instanceof(File)),
  video: z.instanceof(File).optional(), // Single video file (optional)
})

export type ProductFormValues = z.infer<typeof productFormSchema>

