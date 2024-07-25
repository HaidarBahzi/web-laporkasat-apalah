"use client";

import Wave from "react-wavify";
import Link from "next/link";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function VerticalBarChart({
  dataChartUnconfirm,
  dataChartConfirm,
  dataChartProgress,
  dataChartReject,
  dataChartDone,
  icon,
  title,
  color,
}: {
  dataChartUnconfirm: number[];
  dataChartConfirm: number[];
  dataChartProgress: number[];
  dataChartReject: number[];
  dataChartDone: number[];
  icon: React.ReactNode;
  title: string;
  color: string;
}) {
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ags",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Laporan Belum Dikonfirmasi",
        backgroundColor: "rgb(255, 255, 102)",
        data: dataChartUnconfirm,
        fill: false,
      },
      {
        label: "Laporan Sudah Dikonfirmasi",
        backgroundColor: "rgb(102, 255, 102)",
        data: dataChartConfirm,
        fill: false,
      },
      {
        label: "Laporan Sedang Ditindak",
        backgroundColor: "rgb(102, 178, 255)",
        data: dataChartProgress,
        fill: false,
      },
      {
        label: "Laporan Ditolak",
        backgroundColor: "rgb(255, 102, 102)",
        data: dataChartReject,
        fill: false,
      },
      {
        label: "Laporan Selesai",
        backgroundColor: "rgb(0, 153, 76)",
        data: dataChartDone,
        fill: false,
      },
    ],
  };

  const options = {
    indexAxis: "x" as const,
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        position: "left" as const,
        text: "Jumlah",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          font: {
            style: "normal" as const,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            style: "normal" as const,
          },
          precision: 0,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-fit w-full bg-white rounded shadow">
      <div
        className={`${color} rounded flex items-center gap-2.5 rounded-b-none px-5 py-3.5 text-white font-semibold`}
      >
        <i className="text-xl">{icon}</i> {title}
      </div>

      <div className="p-5">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export function StatsMenu({
  link,
  color,
  icon,
  count,
  title,
}: {
  link: string;
  color: string;
  icon: React.ReactNode;
  count: number;
  title: string;
}) {
  return (
    <Link href={link} className="w-80 h-32 bg-white shadow-lg rounded relative">
      <Wave
        fill={color}
        paused={false}
        className="absolute inset-0 z-0 opacity-25"
        options={{
          height: 20,
          amplitude: 25,
          speed: 0.2,
          points: 3,
        }}
      />

      <div className="absolute inset-0 px-4 py-2 z-10 flex items-center justify-center gap-5">
        <i className="text-5xl" style={{ color: color }}>
          {icon}
        </i>

        <div className="form-control">
          <label className="font-semibold">{count}</label>
          <label className="text-sm">{title}</label>
        </div>
      </div>
    </Link>
  );
}
