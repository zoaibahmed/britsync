
import requests
import time

url = "http://localhost:11434/api/generate"
data = {
    "model": "mistral:latest",
    "prompt": "Hi",
    "stream": False
}

print("Starting request with 300s timeout...")
start = time.time()
try:
    response = requests.post(url, json=data, timeout=300)
    print(f"Success after {time.time() - start:.2f}s")
    print(f"Result: {response.json().get('response')}")
except Exception as e:
    print(f"Failed after {time.time() - start:.2f}s")
    print(f"Error: {e}")
