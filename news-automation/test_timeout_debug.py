
import requests
import time

url = "http://localhost:11434/api/generate"
data = {
    "model": "mistral:latest",
    "prompt": "Write a long story about a cat.",
    "stream": False
}

print("Starting request with 120s timeout...")
start = time.time()
try:
    response = requests.post(url, json=data, timeout=120)
    print(f"Success after {time.time() - start:.2f}s")
    print(f"Status: {response.status_code}")
except Exception as e:
    print(f"Failed after {time.time() - start:.2f}s")
    print(f"Error: {e}")
