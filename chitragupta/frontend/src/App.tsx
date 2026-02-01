import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TrinetraLayout from './Layout';
import IndrajaalDashboard from './modules/IndrajaalDashboard';
import IndrajaalExtraction from './modules/IndrajaalExtraction';
import KaalChakraTimeline from './modules/KaalChakraTimeline';
import SudarshanaDashboard from './modules/SudarshanaDashboard';
import DivyaDrishtiViewer from './modules/DivyaDrishtiViewer';

import ChitraguptaReports from './modules/ChitraguptaReports';
import { TrinetraProvider } from './context/TrinetraContext';

function App() {
  return (
    <TrinetraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TrinetraLayout />}>
            {/* FORCE INDEX TO BE HUB */}
            <Route index element={<IndrajaalDashboard />} />

            <Route path="extraction" element={<IndrajaalExtraction />} />
            <Route path="timeline" element={<KaalChakraTimeline />} />
            <Route path="threats" element={<SudarshanaDashboard />} />
            <Route path="viewer" element={<DivyaDrishtiViewer />} />
            <Route path="reports" element={<ChitraguptaReports />} />

            {/* HARD REDIRECT FAILSAFE: Any unknown route goes to Hub */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrinetraProvider>
  );
}

export default App;
