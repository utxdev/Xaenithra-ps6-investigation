import os
import sys
import platform
import subprocess
import time
import webbrowser
import threading

def install_dependencies(path, req_file="requirements.txt"):
    print(f"[INIT] Installing dependencies for {path}...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", req_file], cwd=path, check=False)

def install_node_deps(path):
    print(f"[INIT] Installing Node modules for {path}...")
    # operating system specific npm command
    npm_cmd = "npm.cmd" if platform.system() == "Windows" else "npm"
    subprocess.run([npm_cmd, "install"], cwd=path, check=False)

def open_terminal(cmd, title, cwd):
    system = platform.system()
    
    if system == "Windows":
        # Windows: start "Title" cmd /k "command"
        full_cmd = f'start "{title}" cmd /k "cd /d {cwd} && {cmd}"'
        subprocess.run(full_cmd, shell=True)
        
    elif system == "Darwin":
        # macOS: osascript to open Terminal
        apple_script = f'''
        tell application "Terminal"
            do script "cd \\"{cwd}\\" && {cmd}"
            activate
        end tell
        '''
        subprocess.run(["osascript", "-e", apple_script])
        
    elif system == "Linux":
        # Linux: try gnome-terminal, xterm, or konsole
        # This is basic support; sophisticated linux users usually know how to run things.
        try:
            subprocess.run(["gnome-terminal", "--", "bash", "-c", f"cd '{cwd}'; {cmd}; exec bash"])
        except:
            try:
                 subprocess.run(["xterm", "-e", f"cd '{cwd}'; {cmd}; exec bash"])
            except:
                print(f"[WARN] Automatic terminal launch not supported for this Linux distro. Please run manually: in {cwd} run '{cmd}'")

def main():
    print("="*60)
    print("      TRINETRA FORENSIC SUITE - UNIVERSAL LAUNCHER")
    print("="*60)
    
    base_dir = os.getcwd()
    inderjaal_dir = os.path.join(base_dir, "Inderjaal", "backend")
    sudarshana_dir = os.path.join(base_dir, "Sudarshana", "backend")
    frontend_dir = os.path.join(base_dir, "chitragupta", "frontend")

    # 1. Install Dependencies (Blocking)
    print("\n[STEP 1/4] Checking Python Dependencies...")
    install_dependencies(inderjaal_dir)
    install_dependencies(sudarshana_dir)
    
    print("\n[STEP 2/4] Checking Frontend Dependencies...")
    install_node_deps(frontend_dir)
    
    # 2. Launch Services
    print("\n[STEP 3/4] Launching Services...")
    
    # Indrajaal
    print(" [+] Starting Indrajaal (Extraction Engine)...")
    open_terminal(f"{sys.executable} main.py --gui", "Trinetra: Indrajaal Core", inderjaal_dir)
    
    # Sudarshana
    print(" [+] Starting Sudarshana (Threat Engine)...")
    open_terminal(f"{sys.executable} main.py", "Trinetra: Sudarshana Core", sudarshana_dir)

    # Chitragupta Backend (Pipeline Engine)
    print(" [+] Starting Chitragupta Engine (Reporting)...")
    chitragupta_backend = os.path.join(base_dir, "chitragupta", "backend")
    install_node_deps(chitragupta_backend) # Install TS/Node deps
    # Use npx ts-node to run typescript file
    ts_cmd = "npx.cmd ts-node src/server.ts" if platform.system() == "Windows" else "npx ts-node src/server.ts"
    open_terminal(ts_cmd, "Trinetra: Chitragupta Core", chitragupta_backend)

    # Frontend (Use system specific npm)
    npm_run = "npm.cmd run dev" if platform.system() == "Windows" else "npm run dev"
    print(" [+] Starting Chitragupta (Interface)...")
    open_terminal(npm_run, "Trinetra: Interface", frontend_dir)
    
    # 3. Open Browser
    print("\n[STEP 4/4] Opening Dashboard...")
    print("Wait for frontend to compile (approx 5-10s)...")
    time.sleep(8)
    webbrowser.open("http://localhost:8080")
    
    print("\n[SUCCESS] Trinetra is running.")
    print("Press Enter to exit this launcher (services will keep running).")
    input()

if __name__ == "__main__":
    main()
