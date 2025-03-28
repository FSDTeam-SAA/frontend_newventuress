"use client";

// Packages
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Local Imports
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
import { setRegistrationValue } from "@/redux/features/authentication/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormHeader from "./form-header";

// Zod Schema for validation
const formSchema = z
  .object({
    businessName: z.string().nonempty("Business name is required"),
    email: z.string().email("Invalid email address"),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
    agreed: z.boolean().refine((val) => val, {
      message: "Please agree to the terms and privacy policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Error will appear on the `confirmPassword` field
    message: "Passwords must match",
  });

export type UserInformationFormType = z.infer<typeof formSchema>;

export default function UserInformationForm() {
  const [loading, setLoading] = useState<true | false>(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const form = useForm<UserInformationFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: authState.email,
      fullName: authState.fullName,
      password: authState.password,
      confirmPassword: authState.confirmPassword,
      agreed: false,
      businessName: authState["businessName"]
    },
  });

  const { watch } = form;

  const isDisable =
    !watch("email") ||
    !watch("fullName") ||
    !watch("password") ||
    !watch("confirmPassword") ||
    !watch("agreed") ||
    loading;

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = () => {
    setLoading(true);
    router.push(`/registration/experiences`);
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: {
          duration: 1,
        },
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.5,
        },
      }}
      className="py-[20px] md:py-0"
    >
      <FormHeader
        label="Sign Up"
        paragraph="Please enter the following information to continue your registration"
        title="Enter your Business Information"
      />

      <Form {...form}>
        <form
          className="flex flex-col gap-[20px] text-[20px] *:dark:text-black"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* business name Field */}
           <FormField
            name="businessName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input
                    className="p-5 text-[20px] focus:outline-none focus:ring-2"
                    placeholder="Enter your business name"
                    onChange={(e) => {
                      dispatch(
                        setRegistrationValue({
                          businessName: e.target.value,
                        })
                      );
                      field.onChange(e.target.value);
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Email Field */}
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    className="p-5 text-[20px] focus:outline-none focus:ring-2 focus:ring-[#9E9E9E] text-black dark:!text-black"
                    placeholder="Enter your email"
                    onChange={(e) => {
                      dispatch(
                        setRegistrationValue({
                          email: e.target.value,
                        })
                      );
                      field.onChange(e.target.value);
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Full Name Field */}
          <FormField
            name="fullName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    className="p-5 text-[20px] focus:outline-none focus:ring-2 focus:ring-[#9E9E9E] text-black dark:!text-black"
                    placeholder="Enter your full name"
                    onChange={(e) => {
                      dispatch(
                        setRegistrationValue({
                          fullName: e.target.value,
                        })
                      );
                      field.onChange(e.target.value);
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="p-5 text-[20px] focus:outline-none focus:ring-2 focus:ring-[#9E9E9E] text-black dark:!text-black"
                      type={passwordVisibility.password ? "text" : "password"}
                      placeholder="Enter your password"
                      onChange={(e) => {
                        dispatch(
                          setRegistrationValue({
                            password: e.target.value,
                          })
                        );

                        field.onChange(e.target.value);
                      }}
                      value={field.value}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => togglePasswordVisibility("password")}
                    >
                      {!passwordVisibility.password ? (
                        <EyeOffIcon className="h-4 w-4 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="p-5 text-[20px] focus:outline-none focus:ring-2 focus:ring-[#9E9E9E] text-black dark:!text-black"
                      type={
                        passwordVisibility.confirmPassword ? "text" : "password"
                      }
                      placeholder="Confirm your password"
                      onChange={(e) => {
                        dispatch(
                          setRegistrationValue({
                            confirmPassword: e.target.value,
                          })
                        );

                        field.onChange(e.target.value);
                      }}
                      value={field.value}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                    >
                      {!passwordVisibility.confirmPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="agreed"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2 text-[#9E9E9E]">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className=" border-2 border-[#9E9E9E] data-[state=checked]:bg-[#00417E] data-[state=checked]:text-white"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black dark:!text-black"
                  >
                    I agree with the{" "}
                    <Link href="/term-and-conditions" className="text-gradient dark:text-gradient-pink">
                      Term of Condition
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" className="text-gradient dark:text-gradient-pink">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-[40px]">
            <Button disabled={isDisable} size="md" type="submit">
              Next
              {loading ? (
                <Loader2 className="ml-2 animate-spin" />
              ) : (
                <ArrowRight className="ml-2" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
