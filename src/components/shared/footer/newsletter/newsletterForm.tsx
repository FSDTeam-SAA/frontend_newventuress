"use client";

// Packages
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Local imports
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define validation schema using Zod
const newsletterSchema = z.object({
  email: z.string().email("Invalid email Address. Please enter a valid email."),
});

// Infer the type of the form values from the Zod schema
type NewsletterFormValues = z.infer<typeof newsletterSchema>;

const NewsletterForm = () => {
  // Mutation for submitting the newsletter form
  const { mutate, isPending } = useMutation({
    mutationKey: ["newsletter"], // Unique key for the mutation
    mutationFn: (data: NewsletterFormValues) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/newsletter`, {
        method: "POST",
        headers: {
          "content-type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify(data), // Convert form data to JSON
      }),

      onSuccess: async (data: Response) => {
        const jsonData = await data.json();
        if (!jsonData.status) {
          toast.error(jsonData.message, {
            position: "top-right",
            richColors: true,
          });
          return;
        }
        form.reset();
        toast.success(jsonData.message, {
          position: "top-right",
          richColors: true,
        });
      }

    // onSuccess: () => {
    //   // Show success toast notification
    //   toast.success("You have successfully subscribed to our newsletter! 🎉", {
    //     position: "top-right",
    //     richColors: true,
    //   });

    //   // Reset the form after successful submission
    //   form.reset();
    // },
    // onError: (error) => {
    //   // Show error toast notification
    //   toast.error(error.message);
    // },
  });

  // Initialize the form with react-hook-form and Zod resolver
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema), // Use Zod for validation
    defaultValues: {
      email: "", // Default value for the email field
    },
  });

  // Handle form submission
  const handleSubmit = (data: NewsletterFormValues) => {
    mutate(data); // Trigger the mutation
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)} // Bind form submission handler
        className="gap-2 flex-1 lg:relative w-full"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              {/* Label for accessibility (hidden visually) */}
              <FormLabel className="sr-only">Email Address</FormLabel>
              <Input
                {...field}
                type="email"
                placeholder="Enter Your Email"
                required
                className="placeholder:text-[#B3B3B3] flex-1 bg-white text-black text-center lg:text-left text-sm lg:text-base p-[21px] lg:p-6 border-[1px] border-[#0057A8] dark:border-[#6841A5] focus-visible:ring-0 focus-visible:ring-offset-0 dark:!text-[#000000]"
              />
              {/* Display validation error messages */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isPending} // Disable button while mutation is pending
          type="submit"
          className=" w-[120px] lg:w-[142px] h-[40px] lg:h-[50px] py-[13px] lg:absolute right-0 top-0 text-white mt-3 lg:mt-0"
        >
          {/* Show loading spinner when mutation is pending */}
          Subscribe {isPending && <Loader className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
};

export default NewsletterForm;
