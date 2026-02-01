import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TrinetraLayout from './Layout';
import IndrajaalDashboard from './modules/IndrajaalDashboard';
import IndrajaalExtraction from './modules/IndrajaalExtraction';
import KaalChakraTimeline from './modules/KaalChakraTimeline';
import SudarshanaDashboard from './modules/SudarshanaDashboard';
import DivyaDrishtiViewer from './modules/DivyaDrishtiViewer';

// Placeholder for Chitragupta Reports (Simplest module, can stay inline or be moved later)
const ChitraguptaReports = () => (
  <div className="h-full flex items-center justify-center text-center p-10">
    <div>
      <h1 className="text-6xl text-[#FF9933] font-display mb-4 opacity-80">CHITRA<span className="text-white">GUPTA</span></h1>
      <p className="text-gray-400 font-mono mb-8 max-w-md mx-auto">
        The automated integrity reporting engine is compiling the case file.
        <br /><br />
        <span className="text-[#00FF41]">[HASH VERIFICATION ACTIVE]</span>
      </p>
      <div className="p-6 bg-white/5 border border-white/10 rounded-xl inline-block text-left w-full max-w-2xl">
        <h3 className="text-white font-bold border-b border-white/10 pb-2 mb-4">GENERATED REPORTS</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded hover:bg-white/5 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700] font-mono text-xs">PDF</div>
                <div>
                  <div className="text-sm text-white group-hover:text-[#FFD700]">CASE_FILE_00{i}_FINAL.pdf</div>
                  <div className="text-[10px] text-gray-500">2.4 MB • Generated Today</div>
                </div>
              </div>
              <div className="text-[#00D9FF] text-xs opacity-0 group-hover:opacity-100 transition-opacity">DOWNLOAD</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

import { TrinetraProvider } from './context/TrinetraContext';

function App() {
  return (
    <TrinetraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TrinetraLayout />}>
            <Route index element={<IndrajaalDashboard />} />
            <Route path="extraction" element={<IndrajaalExtraction />} />
            <Route path="timeline" element={<KaalChakraTimeline />} />
            <Route path="threats" element={<SudarshanaDashboard />} />
            <Route path="viewer" element={<DivyaDrishtiViewer />} />
            <Route path="reports" element={<ChitraguptaReports />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrinetraProvider>
  );
}

export default App;
