import sys
from pathlib import Path

required_files = ["index.html", "style.css", "script.js", "readme.md"]
project_root = Path(__file__).resolve().parents[1]

deployment_ready = True
reasons = []

print("Checking project...\n")

for file in required_files:
    data_path = project_root / file

    if not data_path.is_file():
        print(f"❌ {file} (Missing)")
        deployment_ready = False
        reasons.append(f"{file} is missing.")
        continue

    if data_path.stat().st_size == 0:
        print(f"❌ {file} (Empty File)")
        deployment_ready = False
        reasons.append(f"{file} is empty.")
        continue

    if file == "index.html":
        content = data_path.read_text(encoding="utf-8")
        if "<!DOCTYPE html>" not in content:
            print(f"❌ {file} (Invalid HTML)")
            deployment_ready = False
            reasons.append(f"{file} is not a valid HTML document.")
            continue

    print(f"✅ {file}")

print()

if deployment_ready:
    print("Deployment Ready ✅")
    sys.exit(0)
else:
    print("Deployment Blocked ❌")
    print("\nReason:")
    for reason in reasons:
        print(reason)
    sys.exit(1)