// components/Section.tsx
type PackageKey = "personal" | "contact" | "government";

interface Package {
  name: string;
  price: number;
  fields: string[];
}

interface SectionProps {
  title: string;
  packageKey: PackageKey;
  data: any;
  editMode: string | null;
  setEditMode: (mode: string | null) => void;
  editedData: any;
  handleEditChange: (section: string, field: string, value: any) => void;
  paymentStatus?: string;
  updateStatus?: string;
  initiatePayment: (packageKey: PackageKey) => void;
  saveEdits: (packageKey: PackageKey) => void;
  isApproved?: boolean;
}

export default function Section({
  title,
  packageKey,
  data,
  editMode,
  setEditMode,
  editedData,
  handleEditChange,
  paymentStatus,
  updateStatus,
  initiatePayment,
  saveEdits,
  isApproved,
}: SectionProps) {
  const packages: Record<PackageKey, Package> = {
    personal: { name: "Personal Information", price: 5000, fields: ["personalInformation"] },
    contact: { name: "Contact & Address", price: 7000, fields: ["contactAndAddressInformation"] },
    government: { name: "Government & IDs", price: 10000, fields: ["governmentAndIdentificationInformation"] },
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
      {editMode === packageKey ? (
        <div className="space-y-4">
          {Object.entries(editedData).map(([key, value]: [string, any]) =>
            key === "residentialAddresses" || key === "phoneNumbers" ? (
              <div key={key} className="space-y-2">
                <label className="block text-gray-700 font-medium">{key}:</label>
                <textarea
                  value={Array.isArray(value) ? value.join(", ") : value}
                  onChange={(e) => handleEditChange(packageKey, key, e.target.value.split(", "))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : key === "placeOfBirth" ? (
              <div key={key} className="space-y-2">
                <label className="block text-gray-700 font-medium">State:</label>
                <input
                  type="text"
                  value={value.state}
                  onChange={(e) => handleEditChange(packageKey, key, { ...value, state: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <label className="block text-gray-700 font-medium mt-2">LGA:</label>
                <input
                  type="text"
                  value={value.lga}
                  onChange={(e) => handleEditChange(packageKey, key, { ...value, lga: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div key={key} className="space-y-2">
                <label className="block text-gray-700 font-medium">{key}:</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleEditChange(packageKey, key, e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )
          )}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => saveEdits(packageKey)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-transform transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
          {updateStatus && <p className="text-green-600 mt-2 animate-fade-in">{updateStatus}</p>}
        </div>
      ) : (
        <>
          {Object.entries(data).map(([key, value]: [string, any]) => (
            <p key={key} className="text-gray-700">
              <span className="font-medium">{key}:</span>{" "}
              {key === "residentialAddresses"
                ? value.map((addr: any) => `${addr.address}, ${addr.state}, ${addr.lga}`).join("; ")
                : key === "phoneNumbers"
                ? value.join(", ")
                : key === "placeOfBirth"
                ? `${value.state}, ${value.lga}`
                : value}
            </p>
          ))}
          <button
            onClick={() => initiatePayment(packageKey)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Edit {title}
          </button>
          {paymentStatus && <p className="mt-2 text-yellow-600 animate-fade-in">{paymentStatus}</p>}
          {updateStatus && <p className="mt-2 text-green-600 animate-fade-in">{updateStatus}</p>}
        </>
      )}
    </div>
  );
}