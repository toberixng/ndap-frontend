// app/post-signup/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../lib/supabase";

export default function PostSignUpPage() {
  const [mid, setMid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndMID = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("No user found. Please register again.");
        return;
      }

      // Fetch MID from users table
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("username")
        .eq("id", user.id)
        .single();

      if (fetchError || !data) {
        setError("Failed to retrieve your MID: " + (fetchError?.message || "No data found"));
      } else {
        setMid(data.username); // Display the stored MID
      }
    };

    fetchUserAndMID();
  }, []);

  const handleProceed = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Your Account is Ready!</h1>
        {mid ? (
          <div className="text-center space-y-4">
            <p>
              Your unique MID is: <span className="font-bold text-xl">{mid}</span>
            </p>
            <p className="text-sm text-gray-600">
              Please save this MID securely. You’ll need it to log in and access your data later.
            </p>
            <button
              onClick={handleProceed}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Proceed to Dashboard
            </button>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <p className="text-center">Fetching your MID...</p>
        )}
      </div>
    </div>
  );
}


// // app/post-signup/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import supabase from "../../lib/supabase";

// export default function PostSignUpPage() {
//   const [mid, setMid] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const handlePostSignUp = async () => {
//       const { data: { user }, error: authError } = await supabase.auth.getUser();

//       if (authError || !user) {
//         setError("No user found. Please register again.");
//         return;
//       }

//       const generateMID = () => {
//         const randomNumber = Math.floor(10000 + Math.random() * 90000); // 5-digit number
//         return `MID-${randomNumber}`; // e.g., MID-12345
//       };

//       const newMid = generateMID();
//       const email = user.email!;

//       const { error: insertError } = await supabase
//         .from("users")
//         .insert({
//           id: user.id, // Supabase user ID (UUID)
//           username: newMid, // MID-XXXXX (numeric)
//           email: email,
//         });

//       if (insertError) {
//         setError("Error storing your MID: " + insertError.message);
//       } else {
//         setMid(newMid); // Display MID to user
//       }
//     };

//     handlePostSignUp();
//   }, []);

//   const handleProceed = () => {
//     router.push("/dashboard");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold text-center mb-6">Your Account is Ready!</h1>
//         {mid ? (
//           <div className="text-center space-y-4">
//             <p>
//               Your unique MID is: <span className="font-bold text-xl">{mid}</span>
//             </p>
//             <p className="text-sm text-gray-600">
//               Please save this MID securely. You’ll need it to log in and access your data later.
//             </p>
//             <button
//               onClick={handleProceed}
//               className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
//             >
//               Proceed to Dashboard
//             </button>
//           </div>
//         ) : error ? (
//           <p className="text-red-500 text-center">{error}</p>
//         ) : (
//           <p className="text-center">Generating your MID...</p>
//         )}
//       </div>
//     </div>
//   );
// }



// // app/post-signup/page.tsx
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import supabase from "../../lib/supabase";

// export default function PostSignUpPage() {
//   const router = useRouter();

//   useEffect(() => {
//     const handlePostSignUp = async () => {
//       const { data: { user }, error } = await supabase.auth.getUser();

//       if (error || !user) {
//         console.error("Error fetching user:", error?.message);
//         router.push("/register"); // Redirect back if no user
//         return;
//       }

//       const generateMID = () => {
//         const randomNumber = Math.floor(10000 + Math.random() * 90000); // 5-digit number
//         return `MID-${randomNumber}`; // e.g., MID-12345
//       };

//       const mid = generateMID();
//       const email = user.email!; // Non-null assertion since user is confirmed

//       const { error: insertError } = await supabase
//         .from("users")
//         .insert({
//           id: user.id, // Supabase user ID (UUID)
//           username: mid, // MID-XXXXX (numeric)
//           email: email,
//         });

//       if (insertError) {
//         console.error("Error storing user data:", insertError.message);
//       } else {
//         router.push("/dashboard");
//       }
//     };

//     handlePostSignUp();
//   }, [router]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold text-center mb-6">Setting Up Your Account...</h1>
//         <p className="text-center">Please wait while we generate your MID.</p>
//       </div>
//     </div>
//   );
// }