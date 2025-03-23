"use client";

import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import UserDetailsCard from "./UserDetailsCard";

interface User {
  fullName: string;
  industry: string[];
  profession: string[];
  dob: string;
  email: string;
  phone: string;
}

const UserDetailsInfo = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  // Force session update after first render
  useEffect(() => {
    const fetchSession = async () => {
      const updatedSession = await getSession();
      if (updatedSession?.user) {
        setUser({
          fullName: updatedSession.user.fullName || "N/A",
          industry: Array.isArray(updatedSession.user.industry)
            ? updatedSession.user.industry
            : [updatedSession.user.industry || "N/A"],
          profession: updatedSession.user.profession || ["N/A"],
          dob: "N/A",
          email: updatedSession.user.email || "N/A",
          phone: "N/A",
        });
      }
    };

    if (!session?.user) {
      fetchSession();
    } else {
      setUser({
        fullName: session.user.fullName || "N/A",
        industry: Array.isArray(session.user.industry)
          ? session.user.industry
          : [session.user.industry || "N/A"],
        profession: session.user.profession || ["N/A"],
        dob: "N/A",
        email: session.user.email || "N/A",
        phone: "N/A",
      });
    }
  }, [session?.user]);

  // Show loading message while session is being fetched
  if (status === "loading") {
    return <p className="text-center text-gray-500">Loading user details...</p>;
  }

  // Ensure we don't show an error too soon
  if (status === "unauthenticated" || !user) {
    return (
      <p className="text-center text-red-500">
        Error: Unable to fetch user details. Please log in.
      </p>
    );
  }

  return (
    <div className="flex justify-center">
      <UserDetailsCard user={user} />
    </div>
  );
};

export default UserDetailsInfo;
