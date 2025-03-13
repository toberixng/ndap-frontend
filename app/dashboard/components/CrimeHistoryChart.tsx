// components/CrimeHistoryChart.tsx
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CrimeHistoryChartProps {
  offenses: { date: string; description: string }[];
}

export default function CrimeHistoryChart({ offenses }: CrimeHistoryChartProps) {
  const data = {
    labels: offenses.map((offense) => offense.date),
    datasets: [
      {
        label: "Offenses",
        data: offenses.map(() => 1), // Static count of 1 per offense
        backgroundColor: "rgba(14, 165, 233, 0.6)", // Blue shade
        borderColor: "rgba(14, 165, 233, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Crime History Timeline", font: { size: 14 } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 }, title: { display: true, text: "Count" } },
      x: { title: { display: true, text: "Date" } },
    },
  };

  return (
    <div className="h-48">
      <Bar data={data} options={options} />
    </div>
  );
}