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
    
    # UNIFIED BACKEND (Runs Indrajaal, Sudarshana, Chitragupta together)
    print(" [+] Launching Unified Backend Server...")
    
    # 1. Install Dependencies First (ensure they exist)
    print("     - Checking dependencies...")
    install_dependencies(os.path.join(base_dir, "Inderjaal", "backend"))
    install_dependencies(os.path.join(base_dir, "Sudarshana", "backend"))
    install_node_deps(os.path.join(base_dir, "chitragupta", "backend"))

    # 2. Run Unified Script
    open_terminal(f"{sys.executable} run_unified_backend.py", "Trinetra: Unified Backend Services", base_dir)

    # 3. Frontend (UI)
    chitragupta_frontend = os.path.join(base_dir, "chitragupta", "frontend")
    install_node_deps(chitragupta_frontend)
    
    print(" [+] Launching Trinetra Interface...")
    npm_run = "npm.cmd run dev" if platform.system() == "Windows" else "npm run dev"
    open_terminal(npm_run, "Trinetra: Interface", chitragupta_frontend)

    print("\n[SUCCESS] System Launched.")
    print("   - Window 1: Unified Backend (Indrajaal, Sudarshana, Chitragupta)")
    print("   - Window 2: Trinetra Interface (Frontend)")
    print("\nAccess the Hub at: http://localhost:8080")
    print("\n[STEP 4/4] Opening Dashboard...")
    print("Wait for frontend to compile (approx 5-10s)...")
    time.sleep(8)
    webbrowser.open("http://localhost:8080")
    
    print("\n[SUCCESS] Trinetra is running.")
    input()

if __name__ == "__main__":
    main()
