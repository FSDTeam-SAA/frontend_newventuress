"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export function useUserId() {
  const { data: session, status } = useSession()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      setUserId(session.user.id)
    }
  }, [session, status])

  return { userId, isLoading: status === "loading" }
}

