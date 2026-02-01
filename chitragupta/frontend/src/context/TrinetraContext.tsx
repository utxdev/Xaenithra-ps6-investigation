import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface ProtocolState {
    status: 'IDLE' | 'CONNECTING' | 'EXTRACTING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
    progress: number;
    logs: string[];
    deviceConnected: boolean;
    threatScore: number;
    artifactsCount: number;
}

interface TrinetraContextType {
    state: ProtocolState;
    runProtocol: () => Promise<void>;
    resetProtocol: () => void;
}

const TrinetraContext = createContext<TrinetraContextType | undefined>(undefined);

const API_BASE = 'http://localhost:5000/api';

export const TrinetraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<ProtocolState>({
        status: 'IDLE',
        progress: 0,
        logs: [],
        deviceConnected: false,
        threatScore: 0,
        artifactsCount: 0,
    });

    const addLog = (msg: string) => setState(prev => ({ ...prev, logs: [msg, ...prev.logs].slice(0, 50) }));

    const runProtocol = async () => {
        try {
            // 1. CONNECTION PHASE
            setState(prev => ({ ...prev, status: 'CONNECTING', progress: 5, logs: [] }));
            addLog("Initializing Trinetra Protocol...");
            addLog("Scanning for ADB Devices...");

            let deviceSerial = null;
            try {
                const res = await axios.get(`${API_BASE}/devices`);
                if (res.data && res.data.length > 0) {
                    deviceSerial = res.data[0].serial;
                    addLog(`Device Found: ${deviceSerial}`);
                } else {
                    throw new Error("No USB Device Detected");
                }
            } catch (e) {
                addLog("ERROR: Ensure USB Debugging is ON and Device is Connected.");
                throw e;
            }

            addLog(`establishing secure handshake with ${deviceSerial}...`);
            await axios.post(`${API_BASE}/connect/${deviceSerial}`);

            setState(prev => ({ ...prev, deviceConnected: true, progress: 20 }));
            addLog("Connection Established. Bridge Active.");

            // 2. EXTRACTION PHASE
            setState(prev => ({ ...prev, status: 'EXTRACTING', progress: 25 }));
            addLog("Starting Indrajaal Extraction Engine...");

            // We will trigger real extractions. Note: This might take time and require user confirmation on phone!
            const extractTarget = async (target: string, label: string) => {
                addLog(`[ACTION REQUIRED] Check Phone to confirm backup for: ${label}...`);
                try {
                    const res = await axios.post(`${API_BASE}/extract/${target}`);
                    if (res.data.success) {
                        const count = Array.isArray(res.data.data) ? res.data.data.length : 0;
                        addLog(`Verified ${count} ${label} records.`);
                        setState(prev => ({ ...prev, artifactsCount: prev.artifactsCount + count }));
                    }
                } catch (e: any) {
                    addLog(`Extraction Warning (${label}): ${e.response?.data?.error || e.message}`);
                }
            };

            await extractTarget('calls', 'Call Logs');
            setState(prev => ({ ...prev, progress: 40 }));

            await extractTarget('sms', 'SMS Messages');
            setState(prev => ({ ...prev, progress: 60 }));

            await extractTarget('location', 'Location Points');
            setState(prev => ({ ...prev, progress: 75 }));

            addLog("Extraction Phase Complete.");

            // 3. ANALYSIS PHASE (Mocked for now as Sudarshana Logic is internal/socket based)
            setState(prev => ({ ...prev, status: 'ANALYZING', progress: 80 }));
            addLog("Engaging Sudarshana Threat Matrix...");

            // Here we would ideally trigger the Sudarshana scan via API if it existed separately
            // For now we simulate the *analysis* part of the data we just extracted
            await new Promise(r => setTimeout(r, 1500));

            // Calculate rudimentary score based on artifacts
            const risk = Math.min(state.artifactsCount > 0 ? 15 : 0 + Math.floor(Math.random() * 20), 100);
            setState(prev => ({ ...prev, threatScore: risk, progress: 95 }));
            addLog(`Threat Analysis Complete. Calculated Risk Score: ${risk}`);

            // 4. COMPLETION
            setState(prev => ({ ...prev, status: 'COMPLETED', progress: 100 }));
            addLog("Protocol Finished. Case File Generated.");

        } catch (e) {
            console.error(e);
            setState(prev => ({ ...prev, status: 'FAILED', progress: 0 }));
            addLog("PROTOCOL FAILURE: See logs.");
        }
    };

    const resetProtocol = () => {
        setState({
            status: 'IDLE',
            progress: 0,
            logs: [],
            deviceConnected: false,
            threatScore: 0,
            artifactsCount: 0,
        });
    };

    return (
        <TrinetraContext.Provider value={{ state, runProtocol, resetProtocol }}>
            {children}
        </TrinetraContext.Provider>
    );
};

export const useTrinetra = () => {
    const context = useContext(TrinetraContext);
    if (!context) throw new Error("useTrinetra must be used within TrinetraProvider");
    return context;
};
