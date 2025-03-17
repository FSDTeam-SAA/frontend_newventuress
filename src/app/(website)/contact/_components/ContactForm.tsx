"use client";

// Package imports 
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// Local imports
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Define Zod schema for validation
const formSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm: React.FC = () => {
  const session = useSession();
  const token = session.data?.user.token;
  const email = session.data?.user.email;
  const fullName = session.data?.user.fullName;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    form.setValue("fullName", fullName || "");
    form.setValue("email", email || "");
  }, [fullName, email, form]);

  const { mutate } = useMutation<any, unknown, FormData>({
    mutationKey: ["contact"],
   mutationFn: async (formData) => {
  if (!token) {
    toast.error("Authentication error. Please log in again.");
    return;
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    return await res.json();
  } catch (error:any) {
    throw new Error("Something went wrong. Please try again.", error);
  }
},


    onSuccess: (data) => {
      if (!data.status) {
        toast.error(data.message, { position: "top-right", richColors: true });
        return;
      }
      form.reset();
      toast.success(data.message, { position: "top-right", richColors: true });
    },
  });

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("subject", data.subject || "");
    formData.append("message", data.message);
    mutate(formData);
  };

  return (
    <div className="flex flex-col grow p-[20px] max-w-[670px] bg-[#E6EEF6] dark:bg-[#482D721A] rounded-2xl min-h-[648px] max-md:mt-8 max-md:max-w-full gap-[24px]">
      <div className="flex flex-col gap-[8px] w-full max-md:max-w-full">
        <h1 className="text-[25px] lg:text-[32px] font-semibold leading-[38.4px] text-gradient max-md:max-w-full dark:text-gradient-pink">
          We are Here to Help!
        </h1>
        <p className="text-[16px] leading-[19.2px] text-[#444444] max-md:max-w-full">
          For inquiries, partnerships, or additional information, please reach out through our support channel.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 w-full max-md:max-w-full space-y-2">
          <FormField control={form.control} name="fullName" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Full Name*" {...field} className="w-full h-[51px] p-[16px] text-black text-[16px] bg-white border-[#0057A8] dark:border dark:border-[#6841A5] rounded-md placeholder:text-[16px] placeholder:text-[#444444] focus-visible:ring-0 focus-visible:ring-offset-0 dark:!text-[#000000]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input required placeholder="Email Address*" {...field} className="w-full h-[51px] p-[16px]text-black text-[16px] bg-white dark:border dark:border-[#6841A5] border-[#0057A8] rounded-md placeholder:text-[16px] placeholder:text-[#444444] focus-visible:ring-0 focus-visible:ring-offset-0 dark:!text-[#000000]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="subject" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input required placeholder="Subject" {...field} className="w-full h-[51px] p-[16px]text-black dark:border dark:border-[#6841A5] text-[16px] bg-white border-[#0057A8] rounded-md placeholder:text-[16px] placeholder:text-[#444444] focus-visible:ring-0 focus-visible:ring-offset-0 dark:!text-[#000000]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="message" render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea required placeholder="Ask your Queries*" {...field} className="w-full p-[16px]text-black dark:border dark:border-[#6841A5] text-[16px] bg-white border-[#0057A8] rounded-md placeholder:text-[16px] placeholder:text-[#444444] h-[170px] focus-visible:ring-0 focus-visible:ring-offset-0 dark:!text-[#000000]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit" className="submit-btn">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
