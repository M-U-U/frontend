// TemperatureChart.jsx (Revisi Final dengan Sumbu Y Stabil)
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Filler, Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Filler, Legend
);

const TemperatureChart = ({ data }) => { 
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 p-3 rounded-xl h-[200px] shadow-lg flex items-center justify-center">
        <p className="text-gray-400">Memuat data atau belum ada data historis yang tersedia.</p>
      </div>
    );
  }

  const chartData = data.slice(0, 20).reverse();

  const labels = chartData.map(d => {
    try {
      return new Date(d.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'N/A';
    }
  });
  
  const tempData = chartData.map(d => parseFloat(d.suhu)).filter(t => !isNaN(t));

  if (tempData.length === 0) {
     return (
        <div className="bg-gray-800 p-3 rounded-xl h-[200px] shadow-lg flex items-center justify-center">
           <p className="text-red-400">Error: Tidak dapat memuat data suhu yang valid untuk Chart.</p>
        </div>
    );
  }

  const chartConfig = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Suhu (°C)',
        data: tempData,
        borderColor: '#00bcd4', 
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(0, 188, 212, 0.4)');
          gradient.addColorStop(1, 'rgba(0, 188, 212, 0.05)');
          return gradient;
        },
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        // --- PENGATURAN STABIL SUMBU Y ---
        min: 10,        // Nilai Minimum (Stabil)
        max: 40,        // Nilai Maksimum (Stabil)
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { 
          color: '#bbb',
          stepSize: 10, // Jarak antar ticks adalah 10 (10, 20, 30, 40)
        },
        // ------------------------------------
      },
      x: {
        grid: { display: false },
        ticks: { color: '#bbb' },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-3 rounded-xl h-[200px] shadow-lg">
      <h2 className="text-xl font-semibold mb-2 text-white">LAST 10 TEMPERATURE</h2>
      <div className="h-[calc(100%-35px)]">
        <Line data={chartConfig} options={options} /> 
      </div>
    </div>
  );
};

export default TemperatureChart;
