'use client'

// local import 
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "@/types/user"
import { useSession } from "next-auth/react"

interface ProfileCardProps {
  user: User
  onEdit?: () => void
}

export function ProfileCard({ user, onEdit }: ProfileCardProps) {
  const { data: session } = useSession()
  if (!session) return null
  console.log(session);
  return (
    <Card className="w-full lg:w-[370px] h-[248px] shadow-none mb-[20px] border-[#C5C5C5] border-[1px]">
      <CardContent className="flex flex-col items-center gap-1 pt-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user.avatarUrl} alt={session.user.fullName} />
          <AvatarFallback>{session.user.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-[20px] text-[#000000] font-medium">{session.user.fullName}</h2>
          <p className="text-[#9C9C9C] text-[16px] font-normal leading-[19.2px]">{session?.user?.email}</p>
        </div>
        <button
          className="text-gradient hover:text-primary-green text-[16px] font-semibold dark:text-gradient-pink"
          onClick={onEdit}
        >
          Edit Profile
        </button>
      </CardContent>
    </Card>
  )
}

