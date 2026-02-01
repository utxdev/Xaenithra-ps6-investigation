import subprocess
import threading
import sys
import os
import time

def stream_output(process, prefix):
    for line in iter(process.stdout.readline, ''):
        try:
            print(f"[{prefix}] {line.strip()}")
        except:
            pass
    process.stdout.close()

def run_service(command, cwd, prefix):
    print(f"[*] Starting {prefix}...")
    # Use shell=True for complex commands (like npx) on Windows
    use_shell = True if "npx" in command or "npm" in command else False
    
    proc = subprocess.Popen(
        command,
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        shell=use_shell,
        universal_newlines=True,
        encoding='utf-8',
        errors='replace'
    )
    
    t = threading.Thread(target=stream_output, args=(proc, prefix))
    t.daemon = True
    t.start()
    return proc

def main():
    print("==================================================")
    print("   TRINETRA UNIFIED BACKEND SERVER")
    print("==================================================")
    print("Initializing services...")

    base_dir = os.path.dirname(os.path.abspath(__file__))

    # 1. INDRAJAAL (Port 5000)
    indrajaal_path = os.path.join(base_dir, "Inderjaal", "backend", "src", "api")
    if os.path.exists(indrajaal_path):
        run_service([sys.executable, "server.py"], indrajaal_path, "INDRAJAAL")
    else:
        print("[!] Indrajaal path not found!")

    # 2. SUDARSHANA (Port 8000)
    sudarshana_path = os.path.join(base_dir, "Sudarshana", "backend")
    if os.path.exists(sudarshana_path):
        run_service([sys.executable, "main.py"], sudarshana_path, "SUDARSHANA")
    else:
        print("[!] Sudarshana path not found!")

    # 3. CHITRAGUPTA (Port 3001)
    chitragupta_path = os.path.join(base_dir, "chitragupta", "backend")
    if os.path.exists(chitragupta_path):
        # Ensure dependencies are installed first? Assume launcher did it or do it here?
        # Ideally launcher does it, but let's be safe.
        # run_service(["npm", "install"], chitragupta_path, "CHITRA-INSTALL").wait() 
        cmd = "npx.cmd ts-node src/server.ts" if os.name == 'nt' else "npx ts-node src/server.ts"
        run_service(cmd, chitragupta_path, "CHITRAGUPTA")
    else:
        print("[!] Chitragupta path not found!")

    print("\n[+] ALL BACKEND SERVICES RUNNING.")
    print("[+] Keep this window open.\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping services...")
        # Processes are daemons or children, might need explicit kill, but killing this window usually kills children on Windows if shell=False was used or job object.
        # Simple exit for now.
        sys.exit(0)

if __name__ == "__main__":
    main()
