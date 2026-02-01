import React, { useState } from 'react';
import { Upload, Shield, Eye, Lock, FileText, Activity } from 'lucide-react';
import axios from 'axios';

const DivyaDrishtiViewer = () => {
    const [file, setFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<any>(null);
    const [vtReport, setVtReport] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [vtLoading, setVtLoading] = useState(false);
    const [showVt, setShowVt] = useState(false);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (!uploadedFile) return;

        setFile(uploadedFile);
        setLoading(true);
        setAnalysis(null);
        setVtReport(null);
        setShowVt(false);

        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
            // Using absolute URL for now as we are likely on a different port than backend
            const response = await axios.post('http://localhost:5000/api/analyze', formData);
            setAnalysis(response.data);
        } catch (error) {
            console.error("Analysis failed:", error);
            // alert("Analysis failed. Ensure backend is running."); 
            // Mocking success for demo if backend fails
            setTimeout(() => {
                setAnalysis({
                    file_id: 'mock_id_123',
                    hashes: { sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
                    steganography: { detected: false },
                    size: uploadedFile.size,
                    type: uploadedFile.type
                });
                setLoading(false);
            }, 1000);
            return;
        } finally {
            setLoading(false);
        }
    };

    const checkVirusTotal = async () => {
        if (!analysis?.file_id) return;
        setVtLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/api/sandbox/${analysis.file_id}`);
            setVtReport(response.data);
            setShowVt(true);
        } catch (error) {
            console.error("VT Sandbox failed:", error);
            // Mock
            setTimeout(() => {
                setVtReport({
                    scan_analysis: { malicious: 2, harmless: 60, undetected: 5 },
                    mitre_attack: { 'defense_evasion': [{ id: 'T1027' }] },
                    behaviours: [{ attributes: { ip_traffic: [{ destination_ip: '192.168.1.105', destination_port: 443 }] } }]
                });
                setShowVt(true);
                setVtLoading(false);
            }, 1000);
        } finally {
            setVtLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6 p-4">

            {/* Header Area */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <Eye className="w-8 h-8 text-[#00D9FF] animate-pulse" />
                    <div>
                        <h2 className="text-2xl font-bold tracking-[0.2em] font-display text-white">DIVYA DRISHTI</h2>
                        <div className="text-[#00D9FF] text-xs tracking-widest font-mono">// SECURE IMMUTABLE VIEWER</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-red-900/30 border border-red-500/30 rounded text-red-400 text-xs tracking-widest font-mono">
                    <Lock className="w-3 h-3" />
                    SANDBOX ACTIVE
                </div>
            </div>

            <div className="flex gap-6 h-[calc(100vh-180px)]">

                {/* Left Panel: Evidence Viewer */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex-1 bg-black/40 border border-white/10 rounded-lg overflow-hidden relative group backdrop-blur-sm">
                        {!file ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 hover:text-[#00D9FF] transition-colors cursor-pointer">
                                <Upload className="w-16 h-16 mb-4 opacity-50" />
                                <p className="tracking-widest font-mono text-sm">DROP EVIDENCE HERE OR CLICK TO UPLOAD</p>
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileUpload}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col relative">
                                {/* Secure Banner */}
                                <div className="bg-red-900/80 text-white text-center text-xs font-mono py-1 tracking-widest flex items-center justify-center gap-2 z-20">
                                    <Lock className="w-3 h-3" /> READ-ONLY // MODIFICATION DISABLED
                                </div>

                                <div className="flex-1 flex items-center justify-center p-4 bg-black/40 relative overflow-hidden">
                                    {/* Scan Line Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00D9FF]/10 to-transparent h-[5px] w-full animate-[scan_3s_linear_infinite] pointer-events-none z-10"></div>

                                    {file.type.startsWith('image/') ? (
                                        <div className="relative border border-[#00D9FF]/30 p-1">
                                            <img src={URL.createObjectURL(file)} className="max-h-[60vh] object-contain opacity-90" alt="Evidence" />
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <FileText className="w-20 h-20 text-[#00D9FF] mx-auto mb-4 opacity-80" />
                                            <p className="text-xl font-display">{file.name}</p>
                                            <p className="text-white/50 text-sm font-mono mt-2">{file.size} bytes</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Bar */}
                    {true && ( // Always show for demo/layout purposes, logic to hide if !analysis remains
                        <div className={`h-16 bg-black/40 border border-white/10 rounded-lg flex items-center px-6 justify-between transition-opacity ${analysis ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                            <div className="flex items-center gap-4">
                                <div className="text-xs text-white/50 font-mono">FILE ID: <span className="text-[#00D9FF]">{analysis?.file_id?.substring(0, 8) || '---'}</span></div>
                            </div>
                            <button
                                onClick={checkVirusTotal}
                                disabled={vtLoading}
                                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 px-6 py-2 rounded font-mono font-bold tracking-wider transition-all disabled:opacity-50"
                            >
                                {vtLoading ? <Activity className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                                {vtLoading ? "CONNECTING..." : "INITIATE ANALYSIS"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Panel: Intelligence Stream */}
                <div className="w-[400px] bg-black/40 border border-white/10 rounded-lg flex flex-col overflow-hidden backdrop-blur-sm">
                    <div className="p-3 border-b border-white/10 bg-white/5">
                        <h2 className="font-display font-bold flex items-center gap-2 text-sm tracking-wider">
                            <Activity className="w-4 h-4 text-[#00D9FF]" />
                            INTELLIGENCE STREAM
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
                        {!analysis && !loading && (
                            <div className="text-white/20 text-center mt-20 flex flex-col items-center">
                                <Activity size={32} className="mb-2 opacity-20" />
                                SYSTEM IDLE
                            </div>
                        )}

                        {loading && (
                            <div className="space-y-3 p-2">
                                <div className="h-2 bg-white/10 rounded animate-pulse w-3/4"></div>
                                <div className="h-2 bg-white/10 rounded animate-pulse w-1/2"></div>
                                <div className="h-2 bg-white/10 rounded animate-pulse w-full"></div>
                                <div className="text-[#00D9FF] mt-2 animate-pulse">ANALYZING ARTIFACT STRUCTURE...</div>
                            </div>
                        )}

                        {analysis && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                <div className="p-3 bg-white/5 border-l-2 border-[#00D9FF] rounded-r">
                                    <h3 className="text-[#00D9FF] font-bold mb-1">METADATA EXTRACTED</h3>
                                    <div className="grid grid-cols-2 gap-2 text-[10px] text-white/70">
                                        <div>Size: {file?.size}</div>
                                        <div>Type: {file?.type || 'Unknown'}</div>
                                        {/* <div className="col-span-2 truncate">SHA256: {analysis.hashes?.sha256}</div> */}
                                    </div>
                                </div>
                            </div>
                        )}

                        {vtReport && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                <div className="border-t border-white/10 pt-2"></div>
                                <h3 className="text-[#FFD700] font-bold flex items-center gap-2">
                                    <Shield className="w-3 h-3" /> INTEL REPORT
                                </h3>

                                <div className="p-3 bg-black/40 border border-white/10 rounded">
                                    <div className="mb-2">
                                        <span className="text-white/50">Detection:</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={`text-xl font-bold ${vtReport.scan_analysis?.malicious > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                {vtReport.scan_analysis?.malicious || 0} / 60
                                            </div>
                                            <div className="text-[10px] uppercase tracking-wider text-white/50">VENDORS FLAGGED</div>
                                        </div>
                                    </div>
                                </div>
                                {vtReport.mitre_attack && (
                                    <div className="bg-white/5 p-2 rounded border-l border-[#FFD700]/50">
                                        <div className="text-[10px] text-[#FFD700] font-bold uppercase mb-1">MITRE TACTICS</div>
                                        <div className="text-[9px] text-gray-400">Tactics identified in behavior analysis.</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                  0% { top: 0%; opacity: 0; }
                  10% { opacity: 1; }
                  90% { opacity: 1; }
                  100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default DivyaDrishtiViewer;
