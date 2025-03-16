"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AuthDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
          <DialogDescription>To view membership plans, you need to be a registered user.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mt-4 space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Link href="/registration" onClick={() => onOpenChange(false)}>
            <Button>Register Now</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}

