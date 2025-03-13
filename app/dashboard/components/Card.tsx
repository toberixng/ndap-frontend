// components/Card.tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
      {children}
    </div>
  );
}