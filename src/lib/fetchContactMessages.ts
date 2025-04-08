import type { ContactMessage } from "@/app/(website)/vendor-dashboard/help-support/_components/CustomerListColumn"

interface ApiResponse {
  status: boolean
  message: string
  data: ContactMessage[]
}

export async function fetchContactMessages(email: string, token: string): Promise<ApiResponse> {
  if (!email) {
    throw new Error("Email is required to fetch contact messages")
  }

  if (!token) {
    throw new Error("Authentication token is required")
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to fetch contact messages: ${response.statusText}`)
    }

    const data: ApiResponse = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    throw error
  }
}

