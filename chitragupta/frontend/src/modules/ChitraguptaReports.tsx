import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Download, Calendar, User, Hash, Lock, Stamp } from 'lucide-react';

const ChitraguptaReports = () => {
    // Mock Data mimicking a generated report
    const caseData = {
        caseId: "CASE-2026-TRINETRA-001",
        investigator: "Katana Officer",
        date: new Date().toLocaleDateString(),
        status: "EVIDENCE SECURED",
        hash: "SHA-256: 7f83b165...e9a1"
    };

    const artifacts = [
        { type: "SMS Database", count: 1245, status: "Verified", hash: "a1b2...c3d4" },
        { type: "Call Logs", count: 89, status: "Verified", hash: "e5f6...g7h8" },
        { type: "Location History", count: 450, status: "Verified", hash: "i9j0...k1l2" },
        { type: "Threat Scan", count: 3, status: "Flagged (CRITICAL)", hash: "m3n4...o5p6" },
        { type: "Media Files", count: 12, status: "Verified", hash: "q7r8...s9t0" },
    ];

    return (
        <div className="h-full w-full p-8 overflow-y-auto custom-scrollbar text-white bg-[url('/grid_bg.png')] bg-fixed">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block"
                    >
                        <h1 className="text-5xl font-display font-black tracking-widest mb-2">
                            <span className="text-[#00FF41]">CHITRA</span>
                            <span className="text-white">GUPTA</span>
                        </h1>
                        <p className="text-[#00FF41] font-mono spacing-widest text-sm border-t border-[#00FF41]/30 pt-2 uppercase">
                            Automated Integrity Reporting Engine
                        </p>
                    </motion.div>
                </div>

                {/* Report Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden"
                >
                    {/* Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                        <FileText size={400} />
                    </div>

                    {/* Case Details Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 border-b border-white/10 pb-8">
                        <div>
                            <div className="text-xs text-gray-500 font-mono mb-1">CASE ID</div>
                            <div className="text-[#00FF41] font-bold font-mono text-lg">{caseData.caseId}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 font-mono mb-1">INVESTIGATOR</div>
                            <div className="flex items-center gap-2 text-white font-bold">
                                <User size={14} className="text-[#FFD700]" /> {caseData.investigator}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 font-mono mb-1">DATE GENERATED</div>
                            <div className="flex items-center gap-2 text-white font-bold">
                                <Calendar size={14} className="text-[#00D9FF]" /> {caseData.date}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 font-mono mb-1">INTEGRITY STATUS</div>
                            <div className="flex items-center gap-2 text-[#00FF41] font-bold animate-pulse">
                                <ShieldCheck size={14} /> {caseData.status}
                            </div>
                        </div>
                    </div>

                    {/* Artifacts Table */}
                    <div className="mb-8">
                        <h3 className="text-white font-display font-bold mb-4 flex items-center gap-2">
                            <Lock size={18} className="text-[#FFD700]" />
                            SECURED ARTIFACTS
                        </h3>
                        <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-gray-400 font-mono text-xs uppercase">
                                    <tr>
                                        <th className="p-4">Artifact Type</th>
                                        <th className="p-4">Count</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 font-mono text-right">Integrity Hash</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {artifacts.map((a, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-semibold text-white">{a.type}</td>
                                            <td className="p-4 text-gray-300">{a.count}</td>
                                            <td className={`p-4 font-mono font-bold ${a.status.includes("CRITICAL") ? "text-red-500" : "text-[#00FF41]"}`}>
                                                {a.status}
                                            </td>
                                            <td className="p-4 text-right font-mono text-xs text-gray-500">{a.hash}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="flex justify-between items-center pt-4">
                        <div className="text-xs text-gray-600 font-mono max-w-md">
                            <Hash size={12} className="inline mr-1" />
                            MASTER_HASH: {caseData.hash}
                            <br />
                            Digitally signed by Trinetra Forensic Suite v1.0
                        </div>

                        <button className="bg-[#00FF41] hover:bg-[#00FF41]/90 text-black font-bold py-3 px-8 rounded flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] transition-all transform hover:-translate-y-1">
                            <Download size={20} />
                            EXPORT PDF REPORT
                        </button>
                    </div>

                </motion.div>

                {/* Official Stamp */}
                <div className="flex justify-center opacity-30">
                    <div className="border-4 border-[#FFD700] text-[#FFD700] p-4 rounded-lg transform -rotate-12 font-black text-2xl tracking-widest flex items-center gap-4">
                        <Stamp size={32} />
                        OFFICIALLY VERIFIED
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ChitraguptaReports;
