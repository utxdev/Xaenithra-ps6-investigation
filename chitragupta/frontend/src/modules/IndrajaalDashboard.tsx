import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldAlert,
    Activity,
    Database,
    Lock,
    Smartphone,
    Globe,
    FileText,
    Search,
    Eye,
    Server
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrinetraHub = () => {
    const navigate = useNavigate();

    const modules = [
        {
            title: "INDRAJAAL",
            subtitle: "Unified Forensics Extraction",
            icon: <Database size={32} />,
            color: "text-[#FFD700]",
            border: "border-[#FFD700]/30",
            bg: "bg-[#FFD700]/5",
            path: "/", // Stays on home or could be a specific sub-route if needed. For now, this is the dashboard itself, maybe link to a 'manage' view if existed.
            description: "ADB Bridge & Artifact Extraction Engine"
        },
        {
            title: "SUDARSHANA",
            subtitle: "Threat Defense Matrix",
            icon: <ShieldAlert size={32} />,
            color: "text-[#FF3333]",
            border: "border-[#FF3333]/30",
            bg: "bg-[#FF3333]/5",
            path: "/threats",
            description: "Real-time Malware Analysis & risk Scoring"
        },
        {
            title: "KAAL CHAKRA",
            subtitle: "Timeline Reconstruction",
            icon: <Activity size={32} />,
            color: "text-[#00D9FF]",
            border: "border-[#00D9FF]/30",
            bg: "bg-[#00D9FF]/5",
            path: "/timeline",
            description: "Chronological Event Mapping (SMS/Calls/GPS)"
        },
        {
            title: "CHITRAGUPTA",
            subtitle: "Automated Reporting",
            icon: <FileText size={32} />,
            color: "text-[#00FF41]",
            border: "border-[#00FF41]/30",
            bg: "bg-[#00FF41]/5",
            path: "/reports",
            description: "Case File Generation & Export"
        },
        {
            title: "DIVYA DRISHTI",
            subtitle: "Evidence Viewer",
            icon: <Eye size={32} />,
            color: "text-[#A855F7]",
            border: "border-[#A855F7]/30",
            bg: "bg-[#A855F7]/5",
            path: "/viewer",
            description: "Deep content inspection & Media analysis"
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">

            <div className="text-center mb-16">
                <h1 className="text-6xl md:text-8xl font-display font-black tracking-widest leading-none mb-4">
                    <span className="text-white">TRI</span>
                    <span className="text-[#FF9933] mx-1">NET</span>
                    <span className="text-[#138808]">RA</span>
                </h1>
                <p className="text-xl text-gray-400 font-mono tracking-[0.3em]">INTEGRATED FORENSIC SUITE v1.0</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {modules.map((mod, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(mod.path)}
                        className={`relative group cursor-pointer p-8 rounded-2xl border ${mod.border} ${mod.bg} backdrop-blur-sm overflow-hidden`}
                    >
                        {/* Hover Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-50 group-hover:opacity-20 transition-opacity`} />

                        <div className="relative z-10">
                            <div className={`mb-6 ${mod.color} p-4 rounded-full bg-white/5 w-fit`}>
                                {mod.icon}
                            </div>
                            <h3 className={`text-2xl font-black font-display tracking-wider mb-2 text-white group-hover:${mod.color} transition-colors`}>
                                {mod.title}
                            </h3>
                            <div className={`text-xs font-mono font-bold mb-4 ${mod.color} opacity-80 uppercase tracking-widest`}>
                                {mod.subtitle}
                            </div>
                            <p className="text-sm text-gray-400 font-sans leading-relaxed">
                                {mod.description}
                            </p>
                        </div>

                        {/* Tech Decoration */}
                        <div className="absolute top-4 right-4 text-[10px] font-mono text-gray-600 opacity-50">
                            SYS.MOD.0{i + 1}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-500">
                    <Server size={12} />
                    <span>SYSTEM ONLINE // PORT 5000 CONNECTED</span>
                </div>
            </div>

        </div>
    );
};

export default TrinetraHub;
