from pathlib import Path

required_files = ["index.html", "style.css", "script.js", "readme.md"]
project_root = Path(__file__).resolve().parents[1]

deployment_ready = True

print("Checking project...\n")

for file in required_files:
    data_path = project_root / file

    if not data_path.is_file():
        print(f"❌ {file} (Missing)")
        deployment_ready = False
    elif data_path.stat().st_size == 0:
        print(f"❌ {file} (Empty File)")
        deployment_ready = False
    else:
        print(f"✅ {file}")

print()

if deployment_ready:
    print("Deployment Ready ✅")
else:
    print("Deployment Blocked ❌")
    


