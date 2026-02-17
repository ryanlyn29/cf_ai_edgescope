# Quick Start Guide

Get `cf_ai_debug_pilot` running in under 5 minutes!

## Prerequisites

- Node.js 18+
- A Cloudflare account (free tier works)

## Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

## Step 2: Setup Cloudflare

```bash
cd backend

# Login to Cloudflare
wrangler login

# Create KV namespace
wrangler kv:namespace create "CHAT_HISTORY"

# Copy the ID from output, then edit wrangler.toml:
# Replace YOUR_KV_NAMESPACE_ID with your actual ID
```

## Step 3: Run Backend

```bash
# In backend/
wrangler dev
```

Backend runs at: `http://localhost:8787`

## Step 4: Run Frontend

```bash
# In frontend/
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Step 5: Test It!

1. Open http://localhost:5173
2. Paste this test error:

```
Error: Cannot read property 'map' of undefined
    at getUserData (/app/src/utils/api.js:45:23)
    at processRequest (/app/src/handlers/user.js:12:18)
```

3. Press `Ctrl+Enter` (or `Cmd+Enter` on Mac)
4. View the AI analysis!

## Troubleshooting

**"Workers AI is not available"**
- Workers AI requires a Cloudflare account
- Local development might show mock responses
- Deploy to production for full AI functionality

**"KV namespace not found"**
- Make sure you updated the ID in `wrangler.toml`
- Run `wrangler kv:namespace list` to see your namespaces

**"CORS error"**
- Ensure backend is running on port 8787
- Check `frontend/.env` has correct API URL

## Next Steps

- Read [README.md](./README.md) for full documentation
- Deploy to production (see README)
- Customize the system prompt in `backend/src/ai.ts`

---

**Happy debugging!** 🚀
