// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import supabase from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(null); // Adjust type as needed
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error && error.message !== "Auth session missing!") {
        console.error("Error fetching user:", error.message);
      }

      setUser(user ?? null); // Set null if no user
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      setUser(null); // Clear user state
      router.push("/"); // Stay on homepage
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl text-blue-500">Welcome to NDAP</h1>
      {user ? (
        <div>
          <p>Hello, {user.email}!</p>
          <button
            onClick={handleSignOut}
            className="mt-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <p>
          Please <a href="/login" className="text-blue-500">log in</a> or{" "}
          <a href="/register" className="text-blue-500">register</a>.
        </p>
      )}
    </div>
  );
}