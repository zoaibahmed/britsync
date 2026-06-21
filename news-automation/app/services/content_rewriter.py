import os
import google.generativeai as genai
from dotenv import load_dotenv
import requests
import json

# Load .env from project root
# Using path relative to this file to be robust
_script_dir = os.path.dirname(os.path.abspath(__file__))
_base_path = os.path.abspath(os.path.join(_script_dir, "..", ".."))

load_dotenv(os.path.join(_base_path, ".env"))

class ContentRewriter:
    def __init__(self):
        self.available_models = []
        
        # Try Claude first (Anthropic)
        self.claude_key = os.getenv("CLAUDE_API_KEY")
        if self.claude_key and "your_claude_api_key_here" not in self.claude_key:
            try:
                # Test Claude API availability (simple check)
                self.available_models.append("claude")
                print("[INFO] Claude API configured")
            except Exception as e:
                print(f"Claude API setup warning: {e}")
        
        # Try Groq (Ultra-fast) - High priority to bypass Gemini limits
        self.groq_key = os.getenv("GROQ_API_KEY")
        if self.groq_key and "your_groq_api_key_here" not in self.groq_key:
            try:
                # Test Groq API availability (simple check)
                self.available_models.append("groq")
                print("[INFO] Groq API configured")
            except Exception as e:
                print(f"Groq API setup warning: {e}")

        # Try Gemini
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        if self.gemini_key and "your_gemini_api_key_here" not in self.gemini_key:
            try:
                genai.configure(api_key=self.gemini_key)
                self.gemini_model = genai.GenerativeModel('gemini-2.0-flash-lite')
                self.available_models.append("gemini")
                print("[INFO] Gemini API configured")
            except Exception as e:
                print(f"Gemini API error: {e}")

        # Try Ollama (local)
        try:
            response = requests.get("http://localhost:11434/api/tags", timeout=2)
            if response.status_code == 200:
                self.available_models.append("ollama")
                print("[INFO] Ollama local service detected")
        except:
            pass

        if not self.available_models:
            print("[WARNING] No AI service available. Add CLAUDE_API_KEY or GEMINI_API_KEY to .env, or install Ollama")

    def rewrite_summary(self, title: str, original_summary: str) -> str:
        """
        Rewrites the news summary to be original and 120-180 words long.
        Tries available models in order: Claude -> Gemini -> Ollama.
        """
        if not self.available_models:
            return None

        content_to_use = original_summary if original_summary else "No detailed summary provided."
        
        prompt = (
            f"Act as a professional senior news editor for 'The Zyphra', a premium digital newspaper. "
            f"Using the information provided in the title and content below, write a comprehensive, engaging, and professional news report. "
            f"Structure the report with a strong lead paragraph, followed by detailed sections. "
            f"If the input information is limited, use the context to provide a well-structured news brief of at least 150-200 words. "
            f"Maintain a formal, authoritative tone. Do not invent facts, but expand on the significance of the news where implied. "
            f"Format the output as clean HTML with <p>, <h3> for subheaders, and <strong> for emphasis where appropriate.\n\n"
            f"Title: {title}\n"
            f"Input Content: {content_to_use}\n\n"
            f"Detailed News Report (HTML):"
        )

        for model_name in self.available_models:
            result = None
            if model_name == "claude":
                result = self._rewrite_with_claude(prompt)
            elif model_name == "groq":
                result = self._rewrite_with_groq(prompt)
            elif model_name == "gemini":
                result = self._rewrite_with_gemini(prompt)
            elif model_name == "ollama":
                result = self._rewrite_with_ollama(prompt)
            
            if result:
                return result
            else:
                print(f"[WARNING] {model_name} failed to generate summary, trying next...")
        
        return None

    def _rewrite_with_claude(self, prompt: str) -> str:
        """Rewrite using Claude (Anthropic)"""
        try:
            headers = {
                "x-api-key": self.claude_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            }
            data = {
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 1024,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }
            response = requests.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=data,
                timeout=30
            )
            if response.status_code == 200:
                result = response.json()
                if "content" in result and len(result["content"]) > 0:
                    return result["content"][0]["text"].strip()
            else:
                print(f"Claude API error {response.status_code}: {response.text}")
        except Exception as e:
            print(f"Claude rewrite failed: {e}")
        return None

    def _rewrite_with_gemini(self, prompt: str) -> str:
        """Rewrite using Google Gemini"""
        try:
            # Simple config dict instead of explicit type
            config = {
                "temperature": 0.7,
                "max_output_tokens": 1024,
            }
            
            response = self.gemini_model.generate_content(
                prompt,
                generation_config=config,
                request_options={'retry': None, 'timeout': 30}
            )
            
            if response.text:
                return response.text.strip()
        except Exception as e:
            err_str = str(e)
            if "429" in err_str:
                print(f"[WARNING] Gemini quota exceeded (429).")
            else:
                print(f"[WARNING] Gemini error: {err_str[:100]}...")
        return None

    def _rewrite_with_ollama(self, prompt: str) -> str:
        """Rewrite using Ollama local model"""
        try:
            # Short timeout to avoid hanging if model isn't loaded/present
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "mistral:latest",
                    "prompt": prompt,
                    "stream": False,
                    "temperature": 0.7,
                },
                timeout=600
            )
            if response.status_code == 200:
                result = response.json()
                if "response" in result:
                    return result["response"].strip()
        except Exception as e:
            print(f"Ollama rewrite failed or timed out: {str(e)[:50]}...")
        return None

    def _rewrite_with_groq(self, prompt: str) -> str:
        """Rewrite using Groq (llama-3.3-70b-versatile or similar)"""
        try:
            headers = {
                "Authorization": f"Bearer {self.groq_key}",
                "Content-Type": "application/json"
            }
            data = {
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a professional senior news editor."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 1024
            }
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=30
            )
            if response.status_code == 200:
                result = response.json()
                if "choices" in result and len(result["choices"]) > 0:
                    return result["choices"][0]["message"]["content"].strip()
            else:
                print(f"Groq API error {response.status_code}: {response.text}")
        except Exception as e:
            print(f"Groq rewrite failed: {e}")
        return None
