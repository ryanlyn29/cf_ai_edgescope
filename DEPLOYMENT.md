# Deployment Guide

Complete guide to deploying `cf_ai_debug_pilot` to production on Cloudflare's platform.

## Prerequisites

- ✅ Cloudflare account (free or paid)
- ✅ Domain connected to Cloudflare (optional, but recommended)
- ✅ Wrangler CLI installed: `npm install -g wrangler`
- ✅ Git repository (for Pages deployment)

## Part 1: Backend Deployment (Cloudflare Workers)

### Step 1: Setup KV Namespace

```bash
cd backend

# Login to Cloudflare
wrangler login

# Create production KV namespace
wrangler kv:namespace create "CHAT_HISTORY"

# Create preview namespace (for testing)
wrangler kv:namespace create "CHAT_HISTORY" --preview
```

You'll see output like:
```
✨ Created namespace with title "cf-ai-debug-pilot-CHAT_HISTORY"
✅ Add the following to your wrangler.toml:
[[kv_namespaces]]
binding = "CHAT_HISTORY"
id = "abc123..."
```

### Step 2: Update wrangler.toml

```toml
name = "cf-ai-debug-pilot"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[ai]
binding = "AI"

[[kv_namespaces]]
binding = "CHAT_HISTORY"
id = "YOUR_PRODUCTION_KV_ID"
preview_id = "YOUR_PREVIEW_KV_ID"
```

### Step 3: Deploy Worker

```bash
# Deploy to production
wrangler deploy

# You'll see output like:
# ✨ Success! Uploaded to Cloudflare.
# ✨ https://cf-ai-debug-pilot.your-subdomain.workers.dev
```

**Save your Worker URL!** You'll need it for the frontend.

### Step 4: Verify Backend

```bash
# Test the health endpoint
curl https://cf-ai-debug-pilot.your-subdomain.workers.dev/

# Expected response:
# {"status":"ok","service":"cf-ai-debug-pilot","version":"1.0.0",...}
```

## Part 2: Frontend Deployment (Cloudflare Pages)

### Option A: Deploy via GitHub (Recommended)

#### 1. Push to GitHub

```bash
cd cf_ai_debug_pilot
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/cf_ai_debug_pilot.git
git push -u origin main
```

#### 2. Connect to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages**
3. Click **"Create a project"**
4. Click **"Connect to Git"**
5. Select your repository: `cf_ai_debug_pilot`
6. Configure build settings:

```
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: frontend
```

7. Add environment variable:

```
VITE_API_URL = https://cf-ai-debug-pilot.your-subdomain.workers.dev
```

8. Click **"Save and Deploy"**

#### 3. Wait for Deployment

Cloudflare Pages will:
- Install dependencies
- Build your React app
- Deploy to their global network

You'll get a URL like: `https://cf-ai-debug-pilot.pages.dev`

### Option B: Deploy via Wrangler CLI

```bash
cd frontend

# Update .env with production Worker URL
echo "VITE_API_URL=https://cf-ai-debug-pilot.your-subdomain.workers.dev" > .env

# Build the project
npm run build

# Deploy to Pages
npx wrangler pages deploy dist --project-name=cf-ai-debug-pilot

# Follow the prompts to create a new project
```

## Part 3: Custom Domain (Optional)

### For Workers

```bash
cd backend

# Add a route to your worker
wrangler route add "api.yourdomain.com/*" cf-ai-debug-pilot
```

Update DNS:
```
Type: CNAME
Name: api
Content: cf-ai-debug-pilot.your-subdomain.workers.dev
Proxy: Enabled (orange cloud)
```

### For Pages

1. Go to Cloudflare Pages > Your Project > **Custom Domains**
2. Click **"Set up a custom domain"**
3. Enter: `debug.yourdomain.com`
4. Cloudflare automatically adds DNS records

## Part 4: Environment Configuration

### Production Environment Variables

#### Backend (wrangler.toml)
```toml
# Already configured via bindings
[ai]
binding = "AI"

[[kv_namespaces]]
binding = "CHAT_HISTORY"
id = "production_kv_id"
```

#### Frontend (Cloudflare Pages)
```
VITE_API_URL = https://api.yourdomain.com
# or
VITE_API_URL = https://cf-ai-debug-pilot.your-subdomain.workers.dev
```

## Part 5: CORS Configuration

Update `backend/src/index.ts` for production:

```typescript
app.use('/*', cors({
  origin: ['https://cf-ai-debug-pilot.pages.dev', 'https://yourdomain.com'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));
```

Then redeploy:
```bash
cd backend
wrangler deploy
```

## Part 6: Monitoring & Analytics

### Enable Cloudflare Analytics

1. **Workers Analytics**:
   - Dashboard > Workers > cf-ai-debug-pilot > Analytics
   - View: Requests, Errors, CPU time, Duration

2. **Pages Analytics**:
   - Dashboard > Pages > cf-ai-debug-pilot > Analytics
   - View: Visits, Page views, Bandwidth

3. **Workers Logpush** (Paid Plans):
   ```bash
   wrangler tail
   ```

### Set Up Alerts

1. Go to Notifications in Cloudflare Dashboard
2. Create alert for:
   - Worker errors > 10/min
   - KV quota approaching limit
   - Pages deployment failures

## Part 7: Performance Optimization

### Backend Optimizations

1. **Enable Caching** (for repeated errors):
```typescript
// In ai.ts
const cacheKey = `analysis:${hashLog(logMessage)}`;
const cached = await CACHE.get(cacheKey);
if (cached) return JSON.parse(cached);
```

2. **Batch KV Writes**:
```typescript
// Save history less frequently
// Only on significant state changes
```

### Frontend Optimizations

1. **Code Splitting**:
```typescript
// Lazy load syntax highlighter
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter'));
```

2. **Enable Compression** in Cloudflare:
   - Dashboard > Speed > Optimization
   - Enable Brotli compression

## Troubleshooting

### "Worker exceeded CPU time limit"
- **Cause**: AI inference takes too long
- **Fix**: Reduce max_tokens in AI call or upgrade plan

### "KV namespace not found"
- **Cause**: Wrong namespace ID in wrangler.toml
- **Fix**: Run `wrangler kv:namespace list` and update ID

### "CORS error in production"
- **Cause**: Worker not allowing Pages domain
- **Fix**: Update CORS origin in index.ts

### "Build failed on Pages"
- **Cause**: Node version mismatch
- **Fix**: Add `.nvmrc` file with `18` or higher

## Deployment Checklist

- [ ] Backend deployed to Workers
- [ ] KV namespace created and configured
- [ ] Frontend deployed to Pages
- [ ] Environment variables set correctly
- [ ] CORS configured for production domains
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled
- [ ] Test end-to-end in production
- [ ] Monitor for errors in first 24 hours

## Costs (Cloudflare Pricing)

### Free Tier (Sufficient for Demo)
- **Workers**: 100,000 requests/day
- **Pages**: Unlimited requests
- **KV**: 100,000 reads/day, 1,000 writes/day
- **Workers AI**: 10,000 neurons/day (~1,000 requests)

### Paid Plans (If Scaling)
- **Workers Paid** ($5/month): 10M requests/month
- **Workers AI**: ~$0.011 per 1,000 requests
- **KV**: $0.50 per million reads

**Expected monthly cost for 10k users**: $10-30

---

🎉 **Your app is now live!** Share the URL and start debugging logs at scale.
