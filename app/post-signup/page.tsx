// app/post-signup/page.tsx
"use client"; // Required for Clerk's useUser hook

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../lib/supabase";

export default function PostSignUpPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const generateMID = () => {
        const randomString = Math.random().toString(36).substr(2, 5).toUpperCase();
        return `MID-${randomString}`; // e.g., MID-ABC12
      };

      const mid = generateMID();
      const email = user.emailAddresses[0].emailAddress;

      // Store MID and email in Supabase
      const storeUserData = async () => {
        const { error } = await supabase
          .from("users")
          .insert({
            id: user.id, // Clerk user ID (UUID)
            username: mid, // MID-XXXXX
            email: email,
          });

        if (error) {
          console.error("Error storing user data:", error.message);
        } else {
          router.push("/dashboard"); // Redirect to dashboard after success
        }
      };

      storeUserData();
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Setting Up Your Account...
        </h1>
        <p className="text-center">Please wait while we generate your MID.</p>
      </div>
    </div>
  );
}