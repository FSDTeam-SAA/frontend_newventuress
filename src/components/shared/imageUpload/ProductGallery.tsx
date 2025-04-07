"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"

interface ProductGalleryProps {
  onImageChange: (images: File[]) => void;
  existingImages?: string[];
}

export default function ProductGallery({ onImageChange, existingImages = [] }: ProductGalleryProps) {
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (existingImages.length > 0) {
      console.log("Existing images loaded:", existingImages)
    }
  }, [existingImages])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    const imageFiles = droppedFiles.filter(
      (file) => file.type.startsWith("image/jpeg") || file.type.startsWith("image/png")
    )
    setFiles((prev) => [...prev, ...imageFiles])
    onImageChange([...files, ...imageFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const imageFiles = selectedFiles.filter(
        (file) => file.type.startsWith("image/jpeg") || file.type.startsWith("image/png")
      )
      setFiles((prev) => [...prev, ...imageFiles])
      onImageChange([...files, ...imageFiles])
    }
  }

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePlusClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-base text-[#232321] dark:text-gradient-pink font-medium mb-4">Product Gallery</h2>

      <div
        className="relative border-[1px] border-dashed border-[#919792] dark:border-[#6841A5] rounded-lg p-8 mb-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {files.length > 0 || existingImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {existingImages.map((imageUrl, index) => (
              <div key={`existing-${index}`} className="relative">
                <Image
                  src={imageUrl}
                  alt={`Existing image ${index}`}
                  width={200}
                  height={200}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            ))}
            {files.map((file, index) => {
              const imageUrl = URL.createObjectURL(file)
              return (
                <div key={`uploaded-${index}`} className="relative">
                  <Image
                    src={imageUrl}
                    alt={file.name}
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-sm z-40"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <ImageIcon className="w-12 h-12 text-gray-400" />
            <p className="text-sm text-gray-600">Drop your images here, or browse</p>
            <p className="text-sm text-gray-500">Jpeg, png are allowed</p>
          </div>
        )}
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileSelect}
          multiple
          ref={fileInputRef}
        />
      </div> 

      <div className="flex items-center justify-between mb-4">
        <Button type="button" variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700"></Button>
        <Button type="button" size="icon" onClick={handlePlusClick}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
