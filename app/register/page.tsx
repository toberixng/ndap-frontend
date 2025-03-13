// app/register/page.tsx
"use client";

import { useState } from "react";
import supabase from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const generateMID = () => {
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // 5-digit number
    return `MID-${randomNumber}`; // e.g., MID-12345
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const mid = generateMID();

    // Sign up with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/post-signup`,
        data: { mid }, // Pass MID as user metadata
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!user) {
      setError("No user returned from signup. Please try again.");
      setLoading(false);
      return;
    }

    // Insert user data into users table
    const { error: insertError } = await supabase
      .from("users")
      .insert({
        id: user.id, // Supabase user ID (UUID)
        username: mid, // MID-XXXXX
        email: email,
      });

    if (insertError) {
      setError("Failed to store your MID: " + insertError.message);
      setLoading(false);
    } else {
      alert("Check your email for a confirmation link! After confirmation, you’ll see your unique MID to save.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Register for NDAP</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
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
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">Log in</a>
        </p>
      </div>
    </div>
  );
}

// // app/register/page.tsx
// "use client";

// import { useState } from "react";
// import supabase from "../../lib/supabase";
// import { useRouter } from "next/navigation";

// export default function RegisterPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         emailRedirectTo: `${window.location.origin}/post-signup`,
//       },
//     });

//     if (error) {
//       setError(error.message);
//       setLoading(false);
//     } else {
//       alert("Check your email for a confirmation link! After confirmation, you’ll receive a unique MID to save.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold text-center mb-6">Register for NDAP</h1>
//         <form onSubmit={handleSignUp} className="space-y-4">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-2 border rounded-md"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-2 border rounded-md"
//               required
//             />
//           </div>
//           {error && <p className="text-red-500 text-sm">{error}</p>}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
//           >
//             {loading ? "Signing Up..." : "Sign Up"}
//           </button>
//         </form>
//         <p className="text-center mt-4">
//           Already have an account?{" "}
//           <a href="/login" className="text-blue-500">Log in</a>
//         </p>
//       </div>
//     </div>
//   );
// }




// // app/register/page.tsx
// "use client";

// import { useState } from "react";
// import supabase from "../../lib/supabase";
// import { useRouter } from "next/navigation";

// export default function RegisterPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         emailRedirectTo: `${window.location.origin}/post-signup`, // Redirect after email confirmation
//       },
//     });

//     if (error) {
//       setError(error.message);
//       setLoading(false);
//     } else {
//       alert("Check your email for a confirmation link!");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold text-center mb-6">Register for NDAP</h1>
//         <form onSubmit={handleSignUp} className="space-y-4">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-2 border rounded-md"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-2 border rounded-md"
//               required
//             />
//           </div>
//           {error && <p className="text-red-500 text-sm">{error}</p>}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
//           >
//             {loading ? "Signing Up..." : "Sign Up"}
//           </button>
//         </form>
//         <p className="text-center mt-4">
//           Already have an account?{" "}
//           <a href="/login" className="text-blue-500">Log in</a>
//         </p>
//       </div>
//     </div>
//   );
// }