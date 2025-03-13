// app/login/page.tsx
"use client";

import { useState } from "react";
import supabase from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(""); // Email or MID-XXXXX
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check if identifier is an email or MID-XXXXX
    const isEmail = identifier.includes("@");
    let email = identifier;

    if (!isEmail) {
      // If it's MID-XXXXX, fetch email from users table
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("email")
        .eq("username", identifier)
        .single();

      if (fetchError || !data) {
        setError("Invalid MID or user not found");
        setLoading(false);
        return;
      }
      email = data.email;
    }

    // Attempt login with email and password
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/dashboard"); // Redirect to dashboard after login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Log In to NDAP</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium">
              Email or MID-XXXXX
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
              placeholder="e.g., user@example.com or MID-12345"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500">Register</a>
        </p>
      </div>
    </div>
  );
}