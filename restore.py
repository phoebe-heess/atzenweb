import json

with open("payload.json", "r") as f:
    payload = json.load(f)

chunks = json.loads(payload["ReplacementChunks"])

for i, c in enumerate(chunks):
    print(f"--- Chunk {i+1} ---")
    print("TARGET:")
    print(c["TargetContent"][:100] + "...")
    print("REPLACEMENT:")
    print(c["ReplacementContent"][:100] + "...")
