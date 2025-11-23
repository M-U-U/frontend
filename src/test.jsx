// File: src/test.jsx (Revisi Final & Peningkatan Keamanan)

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import MetricCard2 from './MetricCard2'; 
import TemperatureChart2 from './TemperatureChart2';
import DataHistoris2 from './DataHistoris2';

const Test = () => {
    const SERVER_URL = 'http://192.168.1.9:5000';

    // State untuk menyimpan data
    // Menggunakan string '...' sebagai nilai awal yang lebih aman dan eksplisit.
    const [suhu, setSuhu] = useState('...'); 
    const [historisData, setHistorisData] = useState([]); 
    const [statusKoneksi, setStatusKoneksi] = useState('Menghubungkan...'); 
    const [dbError, setDbError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // --- FUNGSI LOGIC PENGAMBILAN DATA HISTORIS (MySQL via Flask) ---
    const fetchHistoricalData = async () => {
        setIsLoading(true); // Mulai loading
        setDbError(null);   // Bersihkan error
        try {
            const response = await axios.get(`${SERVER_URL}/api/data/historis`);
            const data = response.data; // Ambil data
            
            // 1. Balik data: terbaru di index 0
            const Data = data;
            setHistorisData(Data); 
            
            // 2. Set Suhu Awal (Current Temp)
            if (Data.length > 0) {
                const latestTemp = parseFloat(Data[0].suhu);
                if (!isNaN(latestTemp)) {
                    setSuhu(latestTemp); // Mengisi Current Temp
                }
            }
        } catch (error) {
            console.error('Gagal mengambil data historis:', error);
            // ... penanganan error lainnya ...
        } finally {
            setIsLoading(false); // Selesai loading
        }
    };

    // --- FUNGSI PENENTU STATUS SUHU ---
    const getTemperatureStatus = (temp) => {
        // ... (Logika sama, sudah bagus)
        const t = typeof temp === 'number' ? temp : parseFloat(temp);
        
        if (isNaN(t) || t === '...') {
            return { label: '...', color: 'text-gray-400', border: 'border-gray-500', description: 'Menunggu Data Suhu.' };
        }
        // Logika kriteria suhu lainnya...
        if (t > 35) {
            return { label: 'KRITIS', color: 'text-red-500', border: 'border-red-500', description: 'WARNING: Suhu di atas 35°C!' };
        }
        if (t > 30) {
            return { label: 'PANAS', color: 'text-yellow-500', border: 'border-yellow-500', description: 'Suhu 30°C - 35°C.' };
        }
        if (t >= 25) { 
            return { label: 'NORMAL', color: 'text-green-400', border: 'border-green-500', description: 'Suhu 25°C - 30°C.' };
        }
        if (t < 25) { 
            return { label: 'DINGIN', color: 'text-cyan-400', border: 'border-cyan-500', description: 'Suhu di bawah 25°C.' };
        }
    };


    useEffect(() => {
        fetchHistoricalData(); 
        const socket = io(SERVER_URL);
    
        socket.on('connect', () => { setStatusKoneksi('✅ Terhubung'); });

        socket.on('suhu_update', (data) => {
            const newSuhu = parseFloat(data.suhu);
            if (!isNaN(newSuhu)) {
                setSuhu(newSuhu);
                setHistorisData(prevData => [data, ...prevData]);
            }
        });

        socket.on('disconnect', () => { setStatusKoneksi('❌ Koneksi terputus.'); });
        
        return () => { socket.disconnect(); };
    }, []);

    // Perhitungan MAX/MIN
    const validTemps = historisData
        .map(d => parseFloat(d.suhu))
        .filter(t => !isNaN(t));

    const maxTemp = validTemps.length > 0 ? Math.max(...validTemps).toFixed(1) : '...';
    const minTemp = validTemps.length > 0 ? Math.min(...validTemps).toFixed(1) : '...';
    
    const currentTempStatus = getTemperatureStatus(suhu);

    const logLimit = 100;
    const latestLogs = historisData.slice(0, logLimit);
    
    // --- RENDER UI ---
    return (
        <div className="min-h-screen bg-gray-900">
            <div className="max-w-4xl mx-auto p-2 w-full flex flex-col grow space-y-3 overflow-hidden" >
                
                <h1 className="text-2xl font-bold text-white border-b border-gray-700 pb-1">
                    DASHBOARD SUHU
                </h1>

                {/* Grid 3 Kolom untuk Metrik Utama */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 ">
                    
                    {/* 1. CURRENT TEMP */}
                    <MetricCard2
                        title="CURRENT TEMP"
                        value={
                            <div className="flex items-baseline justify-center text-3xl"> 
                                <span className="text-cyan-400 font-bold">
                                    {typeof suhu === 'number' ? suhu.toFixed(1) : suhu}°C
                                </span>
                            </div>
                        }
                        color="blue"
                        icon="🌡️"
                        className="w-full md:max-w-[250px]"
                    />
                    
                    {/* 2. Kartu Status (Dynamic Color & Suhu Based) */}
                    <div className={`bg-gray-800 p-2 rounded-xl shadow-lg border-l-4 ${currentTempStatus.border} w-full max-w-[250px] mx-auto`}>
                        <div className="text-center text-xs uppercase text-gray-400 mb-0.5 ">
                            STATUS SUHU
                        </div>
                        <div className="text-center font-bold text-2xl">
                            <span className={currentTempStatus.color}>
                                {currentTempStatus.label}
                            </span>
                        </div>
                        <div className="text-xs text-center text-gray-400 mt-0.5"> 
                            {currentTempStatus.description} ({statusKoneksi})
                        </div>
                    </div>

                    {/* 3. DAILY HI/LO */}
                    <MetricCard2
                        title="DAILY HI/LO"
                        value={
                            <div className="text-white text-xl font-bold">
                                MAX :<span className="text-green-400"> {maxTemp}°C</span>
                                <br />
                                MIN&nbsp; :<span className="text-cyan-400"> {minTemp}°C</span>
                            </div>
                        }
                        color="red"
                        className="w-full md:max-w-[250px] ml-auto"
                    />
                </div>

                {/* Baris 2 & 3: Meneruskan data historis */}
                <TemperatureChart2 data={historisData} />
                <DataHistoris2 data={historisData} />
            </div>
        </div>
    );
};

export default Test;
