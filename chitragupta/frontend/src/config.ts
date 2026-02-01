const config = {
    // Auto-detects if running on localhost or a real domain
    // But defaults to localhost ports for the backend services since they run locally
    INDRJAAL_API: "https://trinetra-indrajaal.onrender.com",   // Extraction Engine
    SUDARSHANA_API: "https://trinetra-sudarshana.onrender.com", // Threat Engine (Python)
    CHITRAGUPTA_API: "https://trinetra-sudarshana.onrender.com", // Report Engine (Python)

    // Websockets
    SUDARSHANA_WS: "wss://trinetra-sudarshana.onrender.com/ws/sudarshana",
};

export default config;
