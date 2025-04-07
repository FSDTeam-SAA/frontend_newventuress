"use server"

import type { LoginFormValues } from "@/app/(website)/(auth)/login/_components/login-form"
import { signIn } from "@/auth" // Import NextAuth's signIn function
import { AuthError } from "next-auth" // Import AuthError for error handling

export interface ServerResType {
  success: boolean
  message: string
  data?: any
}

export async function SignInWithEmailAndPassword(data: LoginFormValues) {
  try {
    // First, try to make the direct API call to get the actual error message
    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })

    const apiData = await apiResponse.json()

    if (!apiResponse.ok || !apiData.status) {
      if (apiData.message === "Wrong password") {
        return {
          success: false,
          message: "The password you entered is incorrect.",
        } as ServerResType
      } else if (apiData.message === "No user found") {
        return {
          success: false,
          message: "Please check your email or Sign Up.",
        } as ServerResType
      } else if (apiData.message === "Access denied. No verified license found.") {
        return {
          success: false,
          message: "Your licence is under verification.",
        } as ServerResType
      }
      // Default fallback for other API errors
      return {
        success: false,
        message: apiData.message || "Authentication failed",
      } as ServerResType
    }

    // If API check passes, proceed with NextAuth sign in
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      return {
        success: false,
        message: "Authentication failed. Please try again.",
      } as ServerResType
    }

    console.log("LOGIN SUCCESS")
    return { success: true, message: "Login successful." } as ServerResType
  } catch (error: any) {
    console.log("SERVER_ACTION_ERROR:", error)

    // Handle specific NextAuth errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid credentials. Please check your email and password.",
          } as ServerResType

        default:
          // Try to extract a more meaningful message if possible
          const errorMessage = error.message || "An unexpected error occurred"
          return {
            success: false,
            message: errorMessage,
          } as ServerResType
      }
    }

    // Handle any other errors
    return {
      success: false,
      message: error.message || "An unexpected error occurred. Please try again later.",
    } as ServerResType
  }
}

