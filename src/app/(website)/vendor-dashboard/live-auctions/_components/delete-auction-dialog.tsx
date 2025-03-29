"use client"
import type React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSession } from "next-auth/react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { AlertTriangle } from "lucide-react"

interface DeleteAuctionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  auctionId: string | null
  auctionTitle?: string
}

const DeleteAuctionDialog: React.FC<DeleteAuctionDialogProps> = ({ open, onOpenChange, auctionId, auctionTitle }) => {
  const session = useSession()
  const token = session.data?.user.token
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!auctionId) throw new Error("Auction ID is missing")

      return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vendor/delete/auction/${auctionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

      toast.success(data.message || "Auction deleted successfully", {
        position: "top-right",
        richColors: true,
      })

      // Invalidate and refetch auctions data
      queryClient.invalidateQueries({ queryKey: ["vendor-auctions"] })

      // Close the dialog
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error("Failed to delete auction: " + error.message, {
        position: "top-right",
        richColors: true,
      })
    },
  })

  const handleDelete = () => {
    mutate()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Auction
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this auction?
            {auctionTitle && <span className="font-medium text-foreground block mt-1">&apos;{auctionTitle}&apos;</span>}
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteAuctionDialog

