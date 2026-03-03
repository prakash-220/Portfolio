# 🚀 Quick Start Guide - AI Chat Setup

## Get Your Free API Key (2 minutes)

### 1. Visit Google AI Studio
Go to: **https://ai.google.dev/**

### 2. Click "Get API Key"
Look for the button in the top section

### 3. Select/Create Project
- Create a new project OR select existing
- Click "Create API key in new project"

### 4. Copy Your Key
- Your API key will appear (looks like: `AIzaSyDkjf...`)
- Click the copy button
- Keep it safe!

---

## Activate Chat (1 minute)

### 1. Open Your Portfolio
Visit any page in your portfolio

### 2. Click the Avatar
- Look for the glowing avatar in bottom-right corner
- Click it to open the chat

### 3. Enter API Key
You have two ways to provide the key:

**Option A – UI (quick test)**
- Paste your key in the configuration form that appears after opening the chat
- Click "Save API Key"
- Done! ✅ the key is stored in localStorage

**Option B – Build‑time injection (recommended for live site)**
1. Keep your API key in a `.env` file or your CI secrets but **never commit it**.
2. During deployment use your pipeline to embed the value in a small inline script in the HTML. For example, GitHub Actions could do:
   ```yaml
   - name: Inject Gemini key
     run: |
       echo "<script>window.GEMINI_API_KEY='${{ secrets.GEMINI_API_KEY }}';</script>" \
          > dist/key.js
   - name: Build site
     # copy dist/key.js into the published folder before gh-pages
   ```
3. Include the generated script before `gemini-chat.js` in every page:
   ```html
   <script src="key.js"></script>
   <script src="gemini-chat.js"></script>
   ```
4. When the page loads, `GeminiChat` will read `window.GEMINI_API_KEY` and the chat will open without prompting.

This approach lets you keep the key in `.env` and deploy safely; there is no longer any need for a separate `generate-config.js` utility.

### 4. Start Chatting
- Type a question about your portfolio
- Press Enter or click Send
- AI will respond!

---

## Example Questions to Try

- "Tell me about your tech stack"
- "What projects have you built?"
- "How can someone contact you?"
- "What's your experience with AI?"
- "Tell me about the Process Accelerator project"
- "What are your key skills?"
- "Where did you study?"

---

## Important Notes

✅ **API Key is Free** - Google's free tier is sufficient
✅ **Saved Locally** - Your key stays on your device
✅ **No Backend Needed** - Works directly with Google API
✅ **Available Everywhere** - Works on all portfolio pages

---

## Having Issues?

**Q: Where's my API key?**
A: After creating, click copy icon and paste in chat

**Q: Is it free?**
A: Yes! Google Gemini free tier is included

**Q: Is it secure?**
A: Yes, key is only stored in your browser

**Q: Can I change the key?**
A: Clear localStorage and re-register any time

---

**For detailed information, see: IMPLEMENTATION_REPORT.md**