import React, { useState, useEffect } from 'react';
import ChakraRadar from './ChakraRadar';
import { Activity, Smartphone } from 'lucide-react';

const SudarshanaDashboard: React.FC = () => {
    const [status, setStatus] = useState<any>({ threat_score: 0, analysis_log: [], device_connected: false });
    // const [socket, setSocket] = useState<WebSocket | null>(null);

    // Extraction State
    const [extractionStatus, setExtractionStatus] = useState<any>({ status: 'idle', message: '' });

    // Poll extraction status
    useEffect(() => {
        let interval: any;
        if (extractionStatus.status === 'running' || extractionStatus.status === 'starting' || extractionStatus.status === 'extracting') {
            interval = setInterval(async () => {
                try {
                    const res = await fetch('http://localhost:8000/api/sudarshana/extraction_status');
                    const data = await res.json();
                    setExtractionStatus(data);
                } catch (e) { console.error(e); }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [extractionStatus.status]);

    const handleExtraction = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/sudarshana/extract_data', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                setExtractionStatus({ status: 'starting', message: 'Initiating...' });
            } else {
                alert("Failed: " + (data.message || "Unknown Error"));
            }
        } catch (e) {
            console.error(e);
            // Fallback if backend is not reachable for demo, but user wants STRICT real data
            alert("Error: Sudarshana Backend Disconnected. Cannot start extraction.");
        }
    };

    // Connect to Sudarshana Backend via WebSocket for Real-Time Analysis
    useEffect(() => {
        let ws: WebSocket;

        const connectWs = () => {
            ws = new WebSocket('ws://localhost:8000/ws/sudarshana');

            ws.onopen = () => {
                console.log('Connected to Sudarshana Threat Net');
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    // Update state with real data from backend
                    setStatus(data);
                } catch (e) {
                    console.error("Failed to parse Sudarshana WS packet", e);
                }
            };

            ws.onerror = (e) => {
                console.warn("Sudarshana WS Error (Backend likely starting...)", e);
            };

            ws.onclose = () => {
                // Simple reconnect logic
                setTimeout(connectWs, 3000);
            };
        };

        connectWs();

        return () => {
            if (ws) ws.close();
        };
    }, []);

    const threatLevel = status.threat_score > 50 ? 'high' : status.threat_score > 10 ? 'medium' : 'low';

    return (
        <div className="h-full w-full p-4 grid grid-cols-12 gap-4 text-white">
            {/* Header */}
            <div className="col-span-12 flex justify-between items-center border-b border-white/10 pb-4 mb-4 relative">
                <h1 className="text-4xl text-[#FFD700] font-display font-bold glow-text">SUDARSHANA <span className="text-sm font-sans text-[#00D9FF] tracking-widest ml-4">THREAT DEFENSE MATRIX</span></h1>

                <div className="flex gap-4 items-center">
                    {/* Extraction Button */}
                    <button
                        onClick={handleExtraction}
                        disabled={extractionStatus.status === 'running' || extractionStatus.status === 'extracting'}
                        className={`bg-amber-600/20 hover:bg-amber-700/40 text-[#FFD700] font-bold py-2 px-6 rounded border border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ${extractionStatus.status === 'running' ? 'animate-pulse cursor-wait' : ''}`}
                    >
                        <Smartphone size={18} />
                        {extractionStatus.status === 'idle' || extractionStatus.status === 'completed' || extractionStatus.status === 'failed' ? 'START FULL EXTRACTION' : extractionStatus.status.toUpperCase()}
                    </button>

                    {/* Status Message Display */}
                    {extractionStatus.status !== 'idle' && (
                        <div className="absolute top-16 right-0 bg-black/80 border border-amber-500/50 p-2 text-xs text-amber-300 rounded z-50">
                            Status: {extractionStatus.message}
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-[#00D9FF] ml-4">
                        <Activity size={18} />
                        <span>System Active</span>
                    </div>
                </div>
            </div>

            {/* Main Radar Area */}
            <div className="col-span-12 lg:col-span-5 flex flex-col items-center justify-start bg-black/20 border border-white/10 rounded-xl h-[500px] max-h-[500px] relative overflow-hidden p-8 pt-16 backdrop-blur-sm">
                <ChakraRadar threatLevel={threatLevel} isScanning={status.device_connected} />
                <div className="absolute bottom-4 left-4 text-xs text-white/50 font-mono">
                    <p>ROTATION_SPEED: {threatLevel === 'high' ? 'MAX' : 'NORM'}</p>
                    <p>TARGET_LOCK: {status.threat_score > 0 ? 'ENGAGED' : 'IDLE'}</p>
                </div>
            </div>

            {/* Right Column: Stats + Feed */}
            <div className="col-span-12 lg:col-span-7 flex flex-col gap-4 h-[500px] max-h-[500px]">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-900/10 p-4 border border-[#00D9FF]/30 rounded-xl">
                        <h3 className="text-[#00D9FF] text-sm mb-1 font-mono">THREAT SCORE</h3>
                        <p className={`text-3xl font-bold ${status.threat_score > 50 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{status.threat_score}</p>
                    </div>
                    <div className="bg-blue-900/10 p-4 border border-[#00D9FF]/30 rounded-xl">
                        <h3 className="text-[#00D9FF] text-sm mb-1 font-mono">EVENTS SCANNED</h3>
                        <p className="text-3xl font-bold text-white">{status.total_scanned || 0}</p>
                    </div>
                    <div className="bg-blue-900/10 p-4 border border-[#00D9FF]/30 rounded-xl">
                        <h3 className="text-[#00D9FF] text-sm mb-1 font-mono">ACTIVE NODES</h3>
                        <p className="text-3xl font-bold text-white">4</p>
                    </div>
                </div>

                {/* Analysis Log */}
                <div className="flex-1 bg-black/20 border border-white/10 rounded-xl p-4 flex flex-col overflow-hidden backdrop-blur-sm">
                    <h3 className="text-[#FFD700] mb-4 flex items-center gap-2 font-display font-bold"><Activity size={16} /> LIVE ANALYSIS LOG</h3>
                    <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 pr-2 custom-scrollbar">
                        {/* Logs will come from backend */}
                        {status.analysis_log?.map((item: any, i: number) => (
                            <div key={`log-${i}`} className={`p-2 border-l-2 ${item.risk === 'CRITICAL' ? 'border-red-600 bg-red-900/20' :
                                item.risk === 'HIGH' ? 'border-orange-500 bg-orange-900/20' :
                                    'border-[#00D9FF] bg-cyan-900/10'
                                }`}>
                                <div className="flex justify-between text-white/90 font-bold">
                                    <span>{item.type}</span>
                                    <span>{item.timestamp}</span>
                                </div>
                                <div className="flex justify-between text-white/70 mt-1">
                                    <span>{item.detail}</span>
                                    <span className={
                                        item.status === 'COMPROMISED' || item.status === 'DETECTED' ? 'text-red-500 animate-pulse' :
                                            item.status === 'SECURE' || item.status === 'CLEAN' ? 'text-green-500' : 'text-blue-400'
                                    }>{item.status}</span>
                                </div>
                            </div>
                        ))}

                        {/* Fallback empty state */}
                        {(!status.analysis_log?.length) && <div className="text-center text-white/30 mt-10">Waiting for Sudarshana Node Response...</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SudarshanaDashboard;
