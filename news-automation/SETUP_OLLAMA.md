# Setup Guide: Using Ollama for Free AI Rewriting

Your Gemini API free tier quota is exhausted. Here are your solutions:

## ✅ Option 1: Use Free Local AI (Ollama) - Recommended

### Step 1: Install Ollama
1. Download from: https://ollama.ai
2. Run the installer and complete setup
3. Restart your computer

### Step 2: Download & Run a Model
Open PowerShell and run:
```powershell
ollama pull mistral
ollama serve
```

Keep this terminal window open (Ollama server must run in background).

### Step 3: Test Your System
In another PowerShell terminal:
```powershell
cd "e:\ai agents\newsatoumation"
python -m app.scheduler
```

### Why This Works:
- ✅ **100% Free** - No API costs
- ✅ **Fully Private** - Runs locally on your machine
- ✅ **Unlimited Usage** - No quotas or rate limits
- ✅ **Same Output Quality** - Mistral model is excellent for text rewriting
- ⚠️ **Slower** - Takes 5-30 seconds per article (vs Gemini's 1-2 seconds)

---

## ✅ Option 2: Upgrade Gemini to Paid Tier

1. Go to: https://ai.google.dev/pricing
2. Add a billing method to your Google Cloud project
3. No changes needed in code - your API key will work immediately
4. Cost: ~$0.075 per 1M input tokens (usually $2-5/month for this project)

---

## How the System Now Works:

1. **First Try:** Google Gemini (if quota available)
2. **Falls Back to:** Ollama (if Gemini fails or quota exceeded)
3. **Last Resort:** Uses original summary (if both AI services unavailable)

---

## Recommended Models for Ollama:

- `mistral` (7B) - **Best for news rewriting** (fastest)
- `neural-chat` (7B) - Good alternative
- `llama2` (7B) - Other option
- `llama2:13b` - Better quality (slower, needs 8GB RAM)

Pull any model with: `ollama pull <model-name>`

---

## Troubleshooting:

**"Connection refused" error?**
- Ensure Ollama server is running: `ollama serve`

**"Model not found"?**
- Pull it first: `ollama pull mistral`

**Want to use Gemini again?**
- Simply upgrade to paid tier or wait for free quota reset (usually monthly)

