"use client";
import { Card, CardContent } from "@/components/ui/card";
// import { UserProfile } from "@/types/user";
import { useRouter } from "next/navigation";

// interface UserProfileCardProps {
//   user: UserProfile;
// }
const UserDetailsCard = ({ user }: any) => {
  const router = useRouter();
  const {  profession, email, industry } = user;
  // const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;

  return (
    <Card className="w-full lg:w-[470px] lg:h-[248px] mx-auto shadow-none mb-[10px] border-[#C5C5C5] border-[1px]">
      <CardContent className="p-6">
        <div className="grid gap-4 md:gap-1 dark:text-black">
          {/* <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] items-center gap-2 ">
            <div className="font-medium text-[16px]">Address</div>
            <div className="flex items-center gap-2 text-[16px] font-normal md:text-base">
              <span>:{fullAddress}</span>
            </div>
          </div> */}

          <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] items-center gap-2 ">
            <div className="font-medium text-[16px]">Profession</div>

          <div className="flex items-center gap-2 text-sm md:text-base">
            <span>
              {(profession ?? []) // If profession is null/undefined, use an empty array
                .map((e: any) => e.charAt(0).toUpperCase() + e.slice(1))
                .join(', ')}
            </span>

          </div>


          </div>

          {/* <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] items-center gap-2">
            <div className="font-medium text-[16px]">DOB</div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span>:{dob}</span>
            </div>
          </div> */}

          <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] items-center gap-2">
            <div className="font-medium text-[16px]">Email</div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span>{email}</span>
            </div>
          </div>

          {/* <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] items-center gap-2">
            <div className="font-medium text-[16px]">Phone</div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span>:{phone}</span>
            </div>
          </div> */}
           <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] items-center gap-2">
            <div className="font-medium text-[16px]">Industry</div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <span>{industry.join(', ')}</span>
            </div>
          </div> 
        </div>

        <button
          className="text-[16px] mt-2 font-medium text-gradient hover:text-primary-green dark:text-gradient-pink"
          onClick={() => router.push("/account/settings")}
        >
          Edit Info
        </button>
      </CardContent>
    </Card>
  );
};

export default UserDetailsCard;
