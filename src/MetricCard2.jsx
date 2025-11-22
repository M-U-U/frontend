// MetricCard.jsx
import React from 'react';

const MetricCard2 = ({ title, value, unit, color, icon, description, className = "" }) => {
  // Periksa jika title adalah CURRENT TEMP untuk styling yang lebih besar
  const isLarge = title === "CURRENT TEMP";

  // Tentukan warna border dan text default
  let borderColor = 'border-gray-500';
  let textColor = 'text-white';

  if (color === 'blue') {
    borderColor = 'border-cyan-500';
    textColor = 'text-cyan-400';
  } else if (color === 'red') {
    borderColor = 'border-white';
    textColor = 'text-white'; // Gunakan warna merah yang lebih gelap
  }
  // Default color (jika tidak ada) akan menggunakan 'text-white'

  return (
    // p-2 dan shadow-lg sudah ringkas
    <div className={`bg-gray-800 p-2 rounded-xl shadow-lg border-l-4 ${borderColor} ${className}`}>
      
      {/* Title & Icon */}
      <div className="text-xs uppercase text-gray-400 mb-1 flex items-center"> {/* mb-2 -> mb-1 (lebih rapat) */}
        {icon && <span className="mr-2 text-base">{icon}</span>}
        {title}
      </div>
      
      {/* Value (Menghapus logic unit terpisah) */}
      <div className={`font-bold ${isLarge ? 'text-3xl' : 'text-xl'} ${textColor}`}>
        {value}
        {/* Hapus: {unit && <span className={`text-lg ml-0.5...`}>{unit}</span>} 
          karena unit sudah dimasukkan dalam prop 'value' di test.jsx (sebagai JSX Flexbox) */}
      </div>
      
      {/* Description (Opsional) */}
      {description && <div className="text-xs text-gray-400 mt-1">{description}</div>} {/* text-sm -> text-xs, mt-2 -> mt-1 */}
    </div>
  );
};

export default MetricCard2;