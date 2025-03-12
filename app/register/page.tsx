// app/register/page.tsx
"use client"; // Required for Clerk's client-side components

import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Register for NDAP</h1>
        <SignUp 
          routing="path"
          path="/register"
          signInUrl="/login"
          afterSignUpUrl="/post-signup" // Redirect to post-signup page for MID generation
        />
      </div>
    </div>
  );
}