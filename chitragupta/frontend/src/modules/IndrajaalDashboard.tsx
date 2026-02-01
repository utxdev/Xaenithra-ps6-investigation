import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldAlert,
    Activity,
    Database,
    Lock,
    Smartphone,
    Play,
    CheckCircle,
    Loader2,
    FileText
} from 'lucide-react';
import { useTrinetra } from '../context/TrinetraContext';
import ChakraRadar from './ChakraRadar';

const IndrajaalDashboard = () => {
    const { state, runProtocol, resetProtocol } = useTrinetra();

    const isRunning = state.status !== 'IDLE' && state.status !== 'COMPLETED' && state.status !== 'FAILED';
    const isComplete = state.status === 'COMPLETED';

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full flex flex-col">

            {/* HERO / PROTOCOL CONTROLLER */}
            <div className="relative mb-8 p-1 rounded-2xl bg-gradient-to-r from-[#FF9933] via-white to-[#138808] animate-gradient-bg bg-[length:200%_200%] transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                <div className="bg-[#050508] rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden text-center">

                    {/* Background Tech GFX */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    <h1 className="text-4xl md:text-6xl font-display font-black tracking-widest leading-none mb-2 z-10 flex flex-col md:block">
                        <span className="text-white">TRINETRA</span>
                        <span className="text-[#00D9FF] mx-2 text-2xl font-mono align-middle tracking-normal">MOTHER DASHBOARD</span>
                    </h1>

                    {/* STATUS INDICATOR */}
                    <div className="flex items-center gap-4 mb-8 z-10">
                        <div className={`flex items-center gap-2 px-4 py-1 rounded-full border ${state.status === 'IDLE' ? 'border-gray-500 text-gray-400 bg-gray-900/50' :
                                state.status === 'FAILED' ? 'border-red-500 text-red-500 bg-red-900/50' :
                                    isComplete ? 'border-green-500 text-green-500 bg-green-900/50' :
                                        'border-[#00D9FF] text-[#00D9FF] bg-blue-900/50 animate-pulse'
                            }`}>
                            {isRunning && <Loader2 size={14} className="animate-spin" />}
                            <span className="font-mono text-xs tracking-widest">{state.status === 'IDLE' ? 'SYSTEM READY' : state.status}</span>
                        </div>
                    </div>

                    {/* MAIN BUTTON */}
                    {!isRunning && !isComplete && (
                        <button
                            onClick={runProtocol}
                            className="group relative px-12 py-4 bg-white text-black font-black font-display tracking-[0.2em] text-xl rounded hover:scale-105 transition-transform z-10 flex items-center gap-3 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            <Play size={24} fill="currentColor" /> INITIATE ALL PROTOCOLS
                        </button>
                    )}

                    {isRunning && (
                        <div className="w-full max-w-2xl z-10">
                            <div className="flex justify-between text-xs font-mono text-[#00D9FF] mb-2">
                                <span>TOTAL SYSTEM PROGRESS</span>
                                <span>{state.progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${state.progress}%` }}
                                />
                            </div>
                            <div className="mt-4 h-24 overflow-y-auto bg-black/50 border border-white/10 rounded p-2 font-mono text-xs text-green-400 custom-scrollbar text-left">
                                {state.logs.map((log, i) => (
                                    <div key={i}>&gt; {log}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isComplete && (
                        <div className="z-10 text-center">
                            <div className="text-green-500 text-6xl mb-4 flex justify-center"><CheckCircle size={64} /></div>
                            <div className="text-xl text-white font-mono mb-6">ALL TASKS COMPLETED SUCCESSFULLY</div>
                            <button onClick={resetProtocol} className="text-gray-500 hover:text-white underline text-xs font-mono">RESET SYSTEM</button>
                        </div>
                    )}
                </div>
            </div>

            {/* LIVE WIDGETS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">

                {/* 1. THREAT MONITOR (SUDARSHANA) */}
                <div className="bg-black/40 border border-white/10 rounded-xl p-4 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[#FF3333] font-display font-bold flex items-center gap-2 text-sm">
                            <ShieldAlert size={16} /> SUDARSHANA
                        </h3>
                        <Activity size={14} className={isRunning ? "text-[#FF3333] animate-pulse" : "text-gray-600"} />
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center h-32">
                        {state.threatScore > 0 ? (
                            <>
                                <div className="scale-50 origin-center">
                                    <ChakraRadar threatLevel={state.threatScore > 50 ? 'high' : 'low'} isScanning={true} />
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-2">
                                    <div className="text-2xl font-bold text-white">{state.threatScore}</div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-600">
                                <ShieldAlert size={32} className="mx-auto mb-2 opacity-20" />
                                <div className="text-[10px] font-mono">WAITING SCAN</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. EXTRACTION STATS (INDRAJAAL) */}
                <div className="bg-black/40 border border-white/10 rounded-xl p-4 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[#FFD700] font-display font-bold flex items-center gap-2 text-sm">
                            <Database size={16} /> INDRAJAAL
                        </h3>
                        {state.deviceConnected && <Smartphone size={14} className="text-green-500" />}
                    </div>

                    <div className="space-y-4">
                        <div className="p-3 bg-white/5 rounded border border-white/5">
                            <div className="text-[10px] text-gray-500 mb-1">ARTIFACTS</div>
                            <div className="text-xl font-bold text-white">{state.artifactsCount.toLocaleString()}</div>
                        </div>
                        <div className="p-3 bg-white/5 rounded border border-white/5">
                            <div className="text-[10px] text-gray-500 mb-1">DEVICE</div>
                            <div className={`text-xs font-bold font-mono ${state.deviceConnected ? 'text-green-400' : 'text-gray-500'}`}>
                                {state.deviceConnected ? 'CONNECTED' : 'WAITING...'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. TIMELINE (KAAL CHAKRA) */}
                <div className="bg-black/40 border border-white/10 rounded-xl p-4 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[#00D9FF] font-display font-bold flex items-center gap-2 text-sm">
                            <Activity size={16} /> KAAL CHAKRA
                        </h3>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center p-2">
                        {state.artifactsCount > 0 ? (
                            <div className="w-full space-y-2">
                                <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                                    <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse"></span>
                                    <span>Building Timeline...</span>
                                </div>
                                <div className="h-24 bg-white/5 rounded p-2 overflow-hidden relative">
                                    <div className="absolute top-0 left-4 w-[1px] h-full bg-[#00D9FF]/20"></div>
                                    <div className="space-y-3 pl-4 pt-1">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="text-[10px] text-gray-500 flex justify-between">
                                                <span>Event_Log_{i}293</span>
                                                <span>{new Date().toLocaleTimeString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-600">
                                <Activity size={32} className="mx-auto mb-2 opacity-20" />
                                <div className="text-[10px] font-mono">NO DATA</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. FINAL REPORT (CHITRAGUPTA) */}
                <div className="bg-black/40 border border-white/10 rounded-xl p-4 relative overflow-hidden group flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[#00FF41] font-display font-bold flex items-center gap-2 text-sm">
                            <FileText size={16} /> CHITRAGUPTA
                        </h3>
                        <Lock size={14} className="text-[#00FF41]" />
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                        {isComplete ? (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center w-full"
                            >
                                <div className="bg-[#00FF41]/10 border border-[#00FF41]/30 p-2 rounded-lg mb-2 cursor-pointer hover:bg-[#00FF41]/20 transition-colors">
                                    <div className="flex items-center justify-center gap-2 text-[#00FF41] mb-1">
                                        <FileText size={20} />
                                        <span className="font-bold text-sm">CASE_FINAL.pdf</span>
                                    </div>
                                    <div className="text-[9px] text-gray-400">VERIFIED</div>
                                </div>
                                <button className="w-full py-2 bg-[#00FF41] text-black font-bold text-[10px] rounded hover:bg-white transition-colors">
                                    DOWNLOAD
                                </button>
                            </motion.div>
                        ) : (
                            <div className="text-center text-gray-600">
                                <FileText size={32} className="mx-auto mb-2 opacity-20" />
                                <div className="text-[10px] font-mono">PENDING...</div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default IndrajaalDashboard;
