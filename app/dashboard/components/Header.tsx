// components/Header.tsx
interface HeaderProps {
  title: string;
  dateRange: string;
  profileImage: string;
}

export default function Header({ title, dateRange, profileImage }: HeaderProps) {
  return (
    <div className="flex justify-between items-center border-b pb-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-500 text-sm mt-1">{dateRange}</p>
      </div>
      <div className="flex items-center space-x-3">
        <img
          src={profileImage}
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-green-500 transition-all duration-300 cursor-pointer"
        />
      </div>
    </div>
  );
}