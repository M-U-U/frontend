// DataHistoris.jsx
import React from 'react';

const DataHistoris = ({ data }) => {
    
    // --- FUNGSI BARU UNTUK FORMAT TANGGAL CUSTOM ---
    const formatCustomTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid Time';

    // 1. Ambil bagian Tanggal (DD-MM-YYYY)
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    // 2. Ambil bagian Waktu (HH:MM:SS) secara manual
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Gabungkan menggunakan HYPHEN (-) dan titik dua (:)
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };
    
    // Fungsi penentu status suhu (tetap sama)
    const getStatusLabel = (temp) => {
        const t = parseFloat(temp);
        if (isNaN(t)) return { label: 'N/A', color: 'text-gray-500' };
        if (t > 35) return { label: 'Kritis', color: 'text-red-500' };
        if (t > 30) return { label: 'Panas', color: 'text-yellow-500' };
        if (t >= 25) return { label: 'Normal', color: 'text-green-400' };
        if (t < 25) return { label: 'Dingin', color: 'text-cyan-400' };
        return { label: 'N/A', color: 'text-gray-500' };
    };

    const displayData = data.slice(0, 50);
    
    return (
        <div className="bg-gray-800 p-3 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-2">DATA HISTORIS</h2>
            
            <div className="overflow-x-auto h-[175px]">
                <table className="min-w-full text-left text-sm text-gray-400">
                    <thead className="text-xs uppercase text-gray-500 border-b border-gray-700 sticky top-0 bg-gray-800">
                        <tr>
                            <th scope="col" className="py-3 px-2">WAKTU</th>
                            <th scope="col" className="py-3 px-2">SUHU (°C)</th>
                            <th scope="col" className="py-3 px-2">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(!displayData || displayData.length === 0) ? (
                            <tr className='text-center'>
                                <td colSpan="3" className="py-3 px-2 text-gray-500">
                                    Memuat data historis atau server belum mengirim data.
                                </td>
                            </tr>
                        ) : (
                            displayData.map((d, index) => {
                                const tempValue = parseFloat(d.suhu);
                                const status = getStatusLabel(tempValue);
                                
                                return (
                                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                                        <td className="py-3 px-2 font-medium text-white">
                                            {/* Panggil fungsi baru di sini */}
                                            {formatCustomTimestamp(d.timestamp)} 
                                        </td>
                                        <td className="py-3 px-2">
                                            {isNaN(tempValue) ? 'N/A' : tempValue.toFixed(1) + '°C'}
                                        </td>
                                        <td className={`py-3 px-2 font-semibold ${status.color}`}>
                                            {status.label}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataHistoris;