import React, { useState } from 'react';
import axios from 'axios';
import { Database, Smartphone, Download, Activity, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const IndrajaalExtraction = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [device, setDevice] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [extracting, setExtracting] = useState<string | null>(null);

    const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

    const connectDevice = async () => {
        setLoading(true);
        addLog("Initializing ADB Bridge...");
        try {
            const listRes = await axios.get('http://localhost:5000/api/devices');
            if (listRes.data.length > 0) {
                const serial = listRes.data[0].serial;
                addLog(`Found Device: ${serial}`);

                const connectRes = await axios.post(`http://localhost:5000/api/connect/${serial}`);
                if (connectRes.data.success) {
                    setDevice(connectRes.data.info);
                    addLog("Connection Established Successfully.");
                }
            } else {
                addLog("ERROR: No USB Device Detected. Check Cable/Debugging.");
            }
        } catch (e: any) {
            addLog(`Connection Error: ${e.message}`);
        }
        setLoading(false);
    };

    const extractArtifact = async (type: string, label: string) => {
        if (!device) {
            addLog("ERROR: Connect Device First.");
            return;
        }
        setExtracting(type);
        addLog(`[STARTED] Extracting ${label}... Check Phone for Backup Prompt!`);

        try {
            const res = await axios.post(`http://localhost:5000/api/extract/${type}`);
            if (res.data.success) {
                const count = Array.isArray(res.data.data) ? res.data.data.length : 0;
                addLog(`[SUCCESS] Extracted ${count} ${label} items.`);
            } else {
                addLog(`[FAILED] Extraction failed for ${label}.`);
            }
        } catch (e: any) {
            addLog(`Error extracting ${label}: ${e.response?.data?.error || e.message}`);
        }
        setExtracting(null);
    };

    return (
        <div className="min-h-screen bg-[#050508] p-8 text-white font-mono flex gap-6">

            {/* LEFT PANEL: Controls */}
            <div className="w-1/3 space-y-6">
                <div className="bg-[#101015] border border-[#FFD700]/30 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Database className="text-[#FFD700]" />
                        <h2 className="text-xl font-bold text-[#FFD700]">INDRAJAAL ENGINE</h2>
                    </div>
                    <p className="text-gray-500 text-sm mb-6">
                        Direct connection to Android Debug Bridge (ADB).
                        Extract artifacts safely.
                    </p>

                    <div className="space-y-4">
                        {!device ? (
                            <button
                                onClick={connectDevice}
                                disabled={loading}
                                className="w-full py-4 bg-[#FFD700]/10 border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/20 rounded-lg flex items-center justify-center gap-2 transition-all"
                            >
                                {loading ? <Activity className="animate-spin" /> : <Smartphone />}
                                CONNECT DEVICE
                            </button>
                        ) : (
                            <div className="p-4 bg-[#00FF41]/10 border border-[#00FF41] rounded-lg">
                                <div className="text-[#00FF41] font-bold flex items-center gap-2">
                                    <Smartphone size={16} /> CONNECTED
                                </div>
                                <div className="text-xs text-gray-300 mt-1">
                                    {device.model} ({device.serial})
                                </div>
                                <div className="text-xs text-gray-500">Android {device.android_version}</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`space-y-3 ${!device ? 'opacity-50 pointer-events-none' : ''}`}>
                    <h3 className="text-gray-400 text-sm uppercase tracking-widest pl-1">Target Artifacts</h3>

                    {[
                        { id: 'sms', label: 'SMS Messages', icon: <Terminal size={16} /> },
                        { id: 'calls', label: 'Call Logs', icon: <Terminal size={16} /> },
                        { id: 'location', label: 'Location History', icon: <Terminal size={16} /> },
                        { id: 'media', label: 'Media Files', icon: <Terminal size={16} /> },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => extractArtifact(item.id, item.label)}
                            disabled={!!extracting}
                            className="w-full text-left p-4 bg-[#151520] border border-gray-800 hover:border-[#FFD700] hover:bg-[#FFD700]/5 rounded-lg flex justify-between items-center transition-all group"
                        >
                            <span className="group-hover:text-[#FFD700]">{item.label}</span>
                            {extracting === item.id ? <Activity className="animate-spin text-[#FFD700]" size={16} /> : <Download size={16} className="text-gray-600 group-hover:text-[#FFD700]" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* RIGHT PANEL: Live Logs */}
            <div className="flex-1 bg-[#0A0A0E] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-[#101015]">
                    <span className="text-gray-400 text-xs uppercase tracking-widest flex items-center gap-2">
                        <Terminal size={14} /> LIVE TERMINAL OUTPUT
                    </span>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                    </div>
                </div>
                <div className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar space-y-1">
                    {logs.length === 0 && <div className="text-gray-600 italic">Waiting for connection...</div>}
                    {logs.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[#00FF41] border-l-2 border-[#00FF41]/30 pl-2 py-0.5"
                        >
                            {log}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IndrajaalExtraction;
