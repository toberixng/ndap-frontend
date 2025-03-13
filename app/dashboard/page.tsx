// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../lib/supabase";

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null); // Adjust type as needed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("You must be logged in to view this page.");
        router.push("/login");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("users")
        .select("username, mock_data")
        .eq("id", user.id)
        .single();

      if (fetchError || !data) {
        setError("Failed to load your data: " + (fetchError?.message || "No data found"));
      } else {
        setUserData(data);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError("Error signing out: " + error.message);
    } else {
      router.push("/");
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!userData) {
    return null; // Shouldn't happen with proper error handling
  }

  const { username: mid, mock_data: mockData } = userData;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your NDAP Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
        <div className="space-y-6">
          <div className="text-center">
            <p>
              Your Unique MID: <span className="font-bold text-xl">{mid}</span>
            </p>
            <p className="text-sm text-gray-600">
              Use this MID to log in and access your data.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Personal Information</h2>
            <p>Full Name: {mockData.personalInformation.fullName}</p>
            <p>Date of Birth: {mockData.personalInformation.dateOfBirth}</p>
            <p>Gender: {mockData.personalInformation.gender}</p>
            <p>
              Place of Birth: {mockData.personalInformation.placeOfBirth.state}, {mockData.personalInformation.placeOfBirth.lga}
            </p>
            <p>Nationality: {mockData.personalInformation.nationality}</p>
            <p>Marital Status: {mockData.personalInformation.maritalStatus}</p>

            <h2 className="text-2xl font-semibold">Contact & Address Information</h2>
            {mockData.contactAndAddressInformation.residentialAddresses.map((addr: any, i: number) => (
              <p key={i}>
                Address {i + 1}: {addr.address}, {addr.state}, {addr.lga}
              </p>
            ))}
            <p>Phone Numbers: {mockData.contactAndAddressInformation.phoneNumbers.join(", ")}</p>
            {mockData.contactAndAddressInformation.emailAddress && (
              <p>Email: {mockData.contactAndAddressInformation.emailAddress}</p>
            )}

            <h2 className="text-2xl font-semibold">Government & Identification</h2>
            <p>NIN: {mockData.governmentAndIdentificationInformation.nin}</p>
            <p>BVN: {mockData.governmentAndIdentificationInformation.bvn}</p>
            <p>Voter’s Card: {mockData.governmentAndIdentificationInformation.votersCardNumber}</p>
            <p>Passport: {mockData.governmentAndIdentificationInformation.passportNumber}</p>
            <p>Driver’s License: {mockData.governmentAndIdentificationInformation.driversLicenseNumber}</p>
            <p>TIN: {mockData.governmentAndIdentificationInformation.taxIdentificationNumber}</p>

            <h2 className="text-2xl font-semibold">Crime History</h2>
            <p>Has Criminal Record: {mockData.crimeHistory.hasCriminalRecord ? "Yes" : "No"}</p>
            {mockData.crimeHistory.offenses && (
              <ul className="list-disc pl-5">
                {mockData.crimeHistory.offenses.map((offense: any, i: number) => (
                  <li key={i}>
                    {offense.date}: {offense.description}
                  </li>
                ))}
              </ul>
            )}

            <h2 className="text-2xl font-semibold">Behavioral Analysis</h2>
            <p>Risk Level: {mockData.behavioralAnalysis.riskLevel}</p>
            <p>Traits: {mockData.behavioralAnalysis.traits.join(", ")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}