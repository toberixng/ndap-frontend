// components/BehavioralAnalysisChart.tsx
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface BehavioralAnalysisChartProps {
  riskLevel: string;
}

export default function BehavioralAnalysisChart({ riskLevel }: BehavioralAnalysisChartProps) {
  const riskValues: { [key: string]: number } = {
    Low: 20,
    Medium: 50,
    High: 80,
  };

  const data = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Risk Level",
        data: [
          riskLevel === "Low" ? riskValues.Low : 0,
          riskLevel === "Medium" ? riskValues.Medium : 0,
          riskLevel === "High" ? riskValues.High : 0,
        ],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
        borderColor: ["#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" as const },
      title: { display: true, text: "Risk Level Distribution" },
    },
  };

  return (
    <div className="h-48">
      <Pie data={data} options={options} />
    </div>
  );
}