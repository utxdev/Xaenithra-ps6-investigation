import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Clock,
    ShieldAlert,
    FileText,
    Eye,
    Menu,
    X,
    Cpu
} from 'lucide-react';

// Helper for conditional classes if 'cn' doesn't exist yet
const classNames = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const SidebarItem = ({ icon: Icon, label, path, active }: { icon: any, label: string, path: string, active: boolean }) => (
    <Link
        to={path}
        className={classNames(
            "flex items-center gap-3 px-4 py-3 my-2 mx-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
            active
                ? "bg-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5 hover:backdrop-blur-sm"
        )}
    >
        {/* Crystal Reflection Effect for Active State */}
        {active && <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none"></div>}

        <Icon size={20} className={classNames(active ? "text-[#00D9FF] drop-shadow-[0_0_5px_rgba(0,217,255,0.8)]" : "group-hover:text-white")} />
        <span className={classNames("font-mono tracking-wider text-sm uppercase z-10", active && "font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200")}>{label}</span>
    </Link>
);

const TrinetraLayout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    const NAV_ITEMS = [
        { label: 'Indrajaal Hub', path: '/', icon: LayoutDashboard },
        { label: 'Kaal Chakra', path: '/timeline', icon: Clock },
        { label: 'Sudarshana', path: '/threats', icon: ShieldAlert },
        { label: 'Chitragupta', path: '/reports', icon: FileText },
        { label: 'Divya Drishti', path: '/viewer', icon: Eye },
    ];

    return (
        <div className="min-h-screen bg-[#050508] text-white flex overflow-hidden font-body selection:bg-[#FFD700] selection:text-black relative">

            {/* Background Ambient Effects (Deep Space/Cyber) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FF9933]/10 blur-[150px] rounded-full opacity-40"></div> {/* Saffron Hue */}
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#138808]/10 blur-[150px] rounded-full opacity-40"></div> {/* Green Hue */}
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-[#000088]/10 blur-[120px] rounded-full opacity-30"></div> {/* Chakra Blue Hue */}
            </div>

            {/* Sidebar - Crystal Glass Panel */}
            <aside
                className={classNames(
                    "relative z-50 h-screen transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex flex-col border-r border-white/5",
                    isOpen ? "w-72" : "w-20",
                    "bg-black/20 backdrop-blur-xl shadow-[5px_0_30px_rgba(0,0,0,0.3)]"
                )}
            >
                {/* Helper Crystal shine on the edge */}
                <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

                {/* Header */}
                <div className="h-24 flex items-center justify-between px-6 mb-2">
                    {isOpen ? (
                        <div className="flex flex-col">
                            {/* TRICOLOUR BRANDING */}
                            <h1 className="font-display font-black text-3xl tracking-widest leading-none drop-shadow-lg flex">
                                <span className="text-[#FF9933]">TRI</span>
                                <span className="text-white">NET</span>
                                <span className="text-[#138808]">RA</span>
                            </h1>
                            <div className="text-[10px] text-gray-500 font-mono tracking-[0.4em] uppercase mt-1 pl-1">
                                Forensic Suite
                            </div>
                        </div>
                    ) : (
                        <Cpu size={28} className="text-white mx-auto opacity-50" />
                    )}

                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-white lg:hidden">
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
                    {NAV_ITEMS.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                        />
                    ))}
                </nav>

                {/* Footer User Profile */}
                <div className="p-4 mt-auto">
                    {isOpen ? (
                        <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-3 shadow-lg">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-[2px]">
                                <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-xs font-bold text-white">
                                    KQ
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-white truncate">Katana Officer</div>
                                <div className="text-[10px] text-[#00D9FF] font-mono flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse"></span>
                                    ONLINE
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-white/10 mx-auto flex items-center justify-center text-white text-xs">KQ</div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative z-10 overflow-hidden flex flex-col bg-transparent">
                {/* Mobile Toggle */}
                <div className="h-16 flex items-center px-6 lg:hidden absolute top-0 left-0 z-50">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white bg-black/50 p-2 rounded-md backdrop-blur-md">
                        <Menu size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default TrinetraLayout;
