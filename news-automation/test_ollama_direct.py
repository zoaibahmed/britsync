
import requests

def test_ollama():
    print("Testing Ollama local connection...")
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Content: {response.text}")
        
        # Try a simple generation
        print("\nTesting generation...")
        gen_response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral:latest",
                "prompt": "Say hello",
                "stream": False
            },
            timeout=15
        )
        print(f"Gen Status: {gen_response.status_code}")
        print(f"Gen Result: {gen_response.json().get('response')}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_ollama()
