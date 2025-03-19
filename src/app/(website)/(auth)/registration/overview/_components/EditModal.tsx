"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Pencil } from "lucide-react"
import { useState } from "react"
import EditRegistrationForm from "./Edit-Form"

export default function EditDialog() {
    const [open, setOpen] = useState(false);

    const closeModal = () => {
        setOpen(false); // Closes the modal
    };

    const openModal = () => {
        setOpen(true); // Opens the modal
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={openModal} className="dark:bg-pinkGradient">Edit <Pencil /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="dark:text-black">Edit Your Information</DialogTitle>
                    <DialogDescription>
                         Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <EditRegistrationForm toggle={closeModal} />
            </DialogContent>
        </Dialog>
    )
}
