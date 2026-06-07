"use client";

import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { useTheme } from "next-themes";
import { Radar } from "react-chartjs-2";
import type { PokemonStat } from "@/lib/pokemon/types";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function StatsRadar({
  stats,
  color,
}: {
  stats: PokemonStat[];
  color: string;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const gridColor = isDark ? "rgba(226,232,240,0.16)" : "rgba(15,23,42,0.1)";
  const labelColor = isDark ? "#cbd5e1" : "#64748b";
  const tooltipColor = isDark ? "rgba(2, 6, 23, 0.96)" : "rgba(15, 23, 42, 0.9)";

  return (
    <Radar
      data={{
        labels: stats.map((stat) => stat.name.replace("special-", "sp. ").toUpperCase()),
        datasets: [
          {
            label: "Base Stats",
            data: stats.map((stat) => stat.value),
            backgroundColor: `${color}66`,
            borderColor: color,
            borderWidth: 2,
            pointBackgroundColor: color,
            pointBorderColor: "#fff",
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: gridColor },
            grid: { color: gridColor },
            pointLabels: {
              color: labelColor,
              font: { size: 10, weight: "bold" },
            },
            ticks: { display: false },
            min: 0,
            max: 255,
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: tooltipColor,
            displayColors: false,
          },
        },
      }}
    />
  );
}
