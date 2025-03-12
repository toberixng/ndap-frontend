// app/post-signup/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../lib/supabase";

export default function PostSignUpPage() {
  const router = useRouter();

  useEffect(() => {
    const handlePostSignUp = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Error fetching user:", error?.message);
        router.push("/register"); // Redirect back if no user
        return;
      }

      const generateMID = () => {
        const randomNumber = Math.floor(10000 + Math.random() * 90000); // 5-digit number
        return `MID-${randomNumber}`; // e.g., MID-12345
      };

      const mid = generateMID();
      const email = user.email!; // Non-null assertion since user is confirmed

      const { error: insertError } = await supabase
        .from("users")
        .insert({
          id: user.id, // Supabase user ID (UUID)
          username: mid, // MID-XXXXX (numeric)
          email: email,
        });

      if (insertError) {
        console.error("Error storing user data:", insertError.message);
      } else {
        router.push("/dashboard");
      }
    };

    handlePostSignUp();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Setting Up Your Account...</h1>
        <p className="text-center">Please wait while we generate your MID.</p>
      </div>
    </div>
  );
}