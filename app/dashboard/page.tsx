// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../lib/supabase";
import Header from "./components/Header";
import Card from "./components/Card";
import Section from "./components/Section";
import CrimeHistoryChart from "./components/CrimeHistoryChart";
import BehavioralAnalysisChart from "./components/BehavioralAnalysisChart";

type PackageKey = "personal" | "contact" | "government";
interface Package {
  name: string;
  price: number;
  fields: string[];
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<{ [key: string]: string }>({});
  const [showPaymentPopup, setShowPaymentPopup] = useState<PackageKey | null>(null);
  const [cardDetails, setCardDetails] = useState({ number: "", cvv: "", expiry: "" });
  const [updateStatus, setUpdateStatus] = useState<{ [key: string]: string }>({});
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
        .select("username, mock_data, edit_approvals")
        .eq("id", user.id)
        .single();

      if (fetchError || !data) {
        setError("Failed to load your data: " + (fetchError?.message || "No data found"));
      } else {
        setUserData(data);
        setEditedData(data.mock_data);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const packages: Record<PackageKey, Package> = {
    personal: { name: "Personal Information", price: 5000, fields: ["personalInformation"] },
    contact: { name: "Contact & Address", price: 7000, fields: ["contactAndAddressInformation"] },
    government: { name: "Government & IDs", price: 10000, fields: ["governmentAndIdentificationInformation"] },
  };

  const validCard = {
    number: "1234-5678-9012-3456",
    cvv: "123",
    expiry: "12/25",
  };

  const initiatePayment = (packageKey: PackageKey) => {
    setShowPaymentPopup(packageKey);
  };

  const handlePaymentSubmit = async (packageKey: PackageKey) => {
    const { number, cvv, expiry } = cardDetails;
    if (number === validCard.number && cvv === validCard.cvv && expiry === validCard.expiry) {
      setPaymentStatus((prev) => ({ ...prev, [packageKey]: "Data sent for approval" }));
      setShowPaymentPopup(null);
      setCardDetails({ number: "", cvv: "", expiry: "" });

      setTimeout(async () => {
        const { error } = await supabase
          .from("users")
          .update({ edit_approvals: { ...userData.edit_approvals, [packageKey]: true } })
          .eq("id", (await supabase.auth.getUser()).data.user!.id);
        if (error) {
          setError(error.message ? "Approval failed: " + error.message : "Approval failed.");
          setPaymentStatus((prev) => ({ ...prev, [packageKey]: "Failed" }));
        } else {
          setPaymentStatus((prev) => ({ ...prev, [packageKey]: "" }));
          setUpdateStatus((prev) => ({ ...prev, [packageKey]: "Data updated" }));
          setUserData((prev: any) => ({
            ...prev,
            edit_approvals: { ...prev.edit_approvals, [packageKey]: true },
          }));
          setTimeout(() => setUpdateStatus((prev) => ({ ...prev, [packageKey]: "" })), 3000);
          setEditMode(packageKey);
        }
      }, 5000);
    } else {
      setError("Invalid card details. Please use: 1234-5678-9012-3456, CVV 123, Expiry 12/25.");
      setShowPaymentPopup(null);
      setCardDetails({ number: "", cvv: "", expiry: "" });
    }
  };

  const handleEditAttempt = (packageKey: PackageKey) => {
    if (userData.edit_approvals?.[packageKey]) {
      setEditMode(packageKey);
    } else {
      initiatePayment(packageKey);
    }
  };

  const handleEditChange = (section: string, field: string, value: any) => {
    setEditedData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const saveEdits = async (packageKey: PackageKey) => {
    const updatedFields = packages[packageKey].fields.reduce((acc: any, section: string) => {
      acc[section] = editedData[section];
      return acc;
    }, {});
    const { error } = await supabase
      .from("users")
      .update({ mock_data: { ...userData.mock_data, ...updatedFields } })
      .eq("id", (await supabase.auth.getUser()).data.user!.id);
    if (error) {
      setError(error.message ? "Failed to save edits: " + error.message : "Failed to save edits.");
    } else {
      setUserData((prev: any) => ({ ...prev, mock_data: { ...prev.mock_data, ...updatedFields } }));
      setEditMode(null);
      setUpdateStatus((prev) => ({ ...prev, [packageKey]: "Data updated" }));
      setTimeout(() => setUpdateStatus((prev) => ({ ...prev, [packageKey]: "" })), 3000);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message ? "Error signing out: " + error.message : "Error signing out.");
    else router.push("/");
  };

  if (loading) return (
    <div className="text-center p-6 animate-pulse">
      <p className="text-gray-600 text-lg">Loading your dashboard...</p>
    </div>
  );
  if (error) return (
    <div className="text-center p-6 text-red-600">
      {error}
      <button
        onClick={() => setError(null)}
        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
      >
        Clear Error
      </button>
    </div>
  );
  if (!userData) return null;

  const { username: mid, mock_data: mockData, edit_approvals: approvals } = userData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <Header
          title="Your NDAP Dashboard"
          dateRange="Mar 1 - Mar 12, 2025"
          profileImage="https://randomuser.me/api/portraits/men/1.jpg"
        />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Your Unique MID">
            <p className="text-2xl font-bold text-green-600">{mid}</p>
            <p className="text-sm text-gray-500 mt-1">Use this MID to access your data.</p>
          </Card>
          <Card title="Crime History">
            <p className="text-gray-700">
              Has Criminal Record: {mockData.crimeHistory.hasCriminalRecord ? "Yes" : "No"}
            </p>
            {mockData.crimeHistory.offenses && (
              <div className="mt-4">
                <CrimeHistoryChart offenses={mockData.crimeHistory.offenses} />
              </div>
            )}
          </Card>
          <Card title="Behavioral Analysis">
            <p className="text-gray-700">Risk Level: {mockData.behavioralAnalysis.riskLevel}</p>
            <p className="text-gray-700">Traits: {mockData.behavioralAnalysis.traits.join(", ")}</p>
            <div className="mt-4">
              <BehavioralAnalysisChart riskLevel={mockData.behavioralAnalysis.riskLevel} />
            </div>
          </Card>
        </div>
        <div className="mt-6 space-y-6">
          <Section
            title="Personal Information"
            packageKey="personal"
            data={mockData.personalInformation}
            editMode={editMode}
            setEditMode={setEditMode}
            editedData={editedData.personalInformation}
            handleEditChange={handleEditChange}
            paymentStatus={paymentStatus.personal}
            updateStatus={updateStatus.personal}
            initiatePayment={handleEditAttempt}
            saveEdits={saveEdits}
            isApproved={approvals?.personal}
          />
          <Section
            title="Contact & Address Information"
            packageKey="contact"
            data={mockData.contactAndAddressInformation}
            editMode={editMode}
            setEditMode={setEditMode}
            editedData={editedData.contactAndAddressInformation}
            handleEditChange={handleEditChange}
            paymentStatus={paymentStatus.contact}
            updateStatus={updateStatus.contact}
            initiatePayment={handleEditAttempt}
            saveEdits={saveEdits}
            isApproved={approvals?.contact}
          />
          <Section
            title="Government & Identification"
            packageKey="government"
            data={mockData.governmentAndIdentificationInformation}
            editMode={editMode}
            setEditMode={setEditMode}
            editedData={editedData.governmentAndIdentificationInformation}
            handleEditChange={handleEditChange}
            paymentStatus={paymentStatus.government}
            updateStatus={updateStatus.government}
            initiatePayment={handleEditAttempt}
            saveEdits={saveEdits}
            isApproved={approvals?.government}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSignOut}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Payment Popup */}
      {showPaymentPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 scale-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Enter Payment Details</h2>
            <p className="mb-4 text-gray-600">Amount: ₦{packages[showPaymentPopup].price}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Card Number:</label>
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  placeholder="1234-5678-9012-3456"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">CVV:</label>
                <input
                  type="text"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  placeholder="123"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Expiry (MM/YY):</label>
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  placeholder="12/25"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => handlePaymentSubmit(showPaymentPopup)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105"
              >
                Submit Payment
              </button>
              <button
                onClick={() => setShowPaymentPopup(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-transform transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}