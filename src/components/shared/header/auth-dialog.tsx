"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from '@/components/ui/badge';

interface AuthDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-4">
          <DialogTitle className="dark:text-black flex items-center justify-between">
            <h1>
              Authentication Required
            </h1>
            <Badge onClick={() => onOpenChange(false)} className="bg-transparent text-red-600 shadow-none text-xl cursor-pointer">X</Badge>
          </DialogTitle>
          <DialogDescription>To view Auctions, Products, and Membership plans, you need to be a registered user.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mt-4 space-x-3">
            {/* <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button> */}
          <Link href="/login" onClick={() => onOpenChange(false)}>
            <Button>Login</Button>
          </Link>
          <Link href="/registration" onClick={() => onOpenChange(false)}>
            <Button>Register Now</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}

