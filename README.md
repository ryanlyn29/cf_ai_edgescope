# cf_ai_edgescope

**Real-time Edge Traffic Intelligence Dashboard**

A production-ready AI-powered network monitoring platform that simulates, visualizes, and analyzes traffic across global edge locations using Cloudflare's edge computing infrastructure.

## Overview

EdgeScope is a full-stack application demonstrating advanced edge computing concepts through real-time traffic simulation and AI-powered anomaly detection. Built entirely on Cloudflare's platform, it showcases the power of Workers, Workers AI, and KV storage for building sophisticated observability tools.

### Problem Statement

Modern distributed systems require real-time visibility into edge network performance. EdgeScope solves this by:
- Simulating realistic traffic patterns across 24 global edge locations
- Detecting anomalies using statistical analysis
- Providing AI-powered root cause analysis via Llama 3
- Enabling session replay for historical analysis

### Why Edge Computing?

By leveraging Cloudflare's edge network, EdgeScope demonstrates:
- **Low Latency**: AI analysis runs at the edge, close to users
- **Scalability**: Serverless Workers handle traffic spikes automatically
- **Cost Efficiency**: Pay only for actual compute time
- **Global Reach**: Deploy once, run everywhere

## Features

- **AI-Powered Anomaly Detection** - Llama 3 (Workers AI) analyzes network anomalies and provides root cause analysis
- **Real-time Traffic Simulation** - Generates realistic traffic patterns between 24 global edge nodes with geographic-based latency
- **Interactive Network Visualization** - Canvas-based world map showing live traffic flows with color-coded status indicators
- **Intelligent Metrics Dashboard** - Real-time monitoring of requests, latency, success rates, errors, and anomalies
- **Session Management** - Cloudflare KV stores simulation sessions for replay and analysis with 30-day retention
- **Professional UI/UX** - Modern SaaS interface with light/dark modes, collapsible panels, and responsive design
- **Chat Interface** - AI assistant for querying simulations and understanding anomalies

## Architecture

```
┌─────────────────┐
│  Browser/UI     │
│  (Next.js 16)   │
└────────┬────────┘
         │
         ├─── Traffic Simulation (Client-side)
         │    • Geographic calculations
         │    • Anomaly injection
         │    • Real-time visualization
         │
         ├─── API Requests
         │
┌────────▼────────┐
│ Cloudflare      │
│ Workers         │
│ (Hono Framework)│
└────────┬────────┘
         │
         ├─────┬─────────────┬──────────┐
         │     │             │          │
    ┌────▼───┐ │        ┌────▼────┐ ┌──▼──┐
    │Workers │ │        │Cloudflare│ │ KV  │
    │   AI   │ │        │  Pages  │ │Store│
    │(Llama3)│ │        │         │ │     │
    └────────┘ │        └─────────┘ └─────┘
               │
               └─── CORS & Routing
```

## Tech Stack

### Frontend
- **Next.js 16** with App Router and Turbopack
- **React 19** with TypeScript
- **Tailwind CSS** for styling with OKLCH color system
- **Zustand** for global state management
- **Lucide React** for icons
- **Canvas API** for network visualization

### Backend
- **Cloudflare Workers** (serverless edge compute)
- **Hono** framework for API routing
- **TypeScript** throughout
- **Workers AI** (@cf/meta/llama-3-8b-instruct)
- **Cloudflare KV** for persistent storage

### Features
- Geographic distance-based latency calculation
- Statistical anomaly detection algorithms
- AI-powered root cause analysis
- Session replay capabilities
- Real-time streaming updates

## Running Locally

### Prerequisites

- **Node.js** v18 or later
- **npm** or **pnpm**
- **Wrangler CLI**: `npm install -g wrangler`
- A **Cloudflare account** (free tier works)

### 1. Clone & Setup

```bash
git clone https://github.com/ryanlyn29/cf_ai_edgescope.git
cd cf_ai_edgescope
```

### 2. Backend Setup (Cloudflare Worker)

```bash
cd backend
npm install

# Authenticate with Cloudflare
wrangler login

# Create a KV namespace for chat history
wrangler kv:namespace create "CHAT_HISTORY"

# Copy the namespace ID from the output and update wrangler.toml
# Replace YOUR_KV_NAMESPACE_ID with the actual ID

# Run locally
wrangler dev
```

The worker will be available at `http://localhost:8787`

**Note:** Workers AI requires a Cloudflare account. Local development will connect to the production AI service.

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create .env file
echo "NEXT_PUBLIC_API_URL=http://localhost:8787" > .env

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Test the Application

1. Open `http://localhost:5173`
2. Click "Start Simulation" in the header
3. Watch traffic flow across the network map
4. Observe anomaly detection in real-time
5. Click "Analyze with AI" on detected anomalies
6. Use the chat interface to query simulations

## Deployment

### Backend Deployment

```bash
cd backend

# Deploy to Cloudflare Workers
wrangler deploy
```

Your worker will be deployed to `https://cf-ai-edgescope.<your-subdomain>.workers.dev`

### Frontend Deployment

```bash
cd frontend

# Update .env with production Worker URL
# NEXT_PUBLIC_API_URL=https://cf-ai-edgescope.<your-subdomain>.workers.dev

# Build for production
npm run build

# Deploy to Cloudflare Pages
# Option 1: Connect GitHub repo via Cloudflare Dashboard
# Option 2: Use Wrangler
npx wrangler pages deploy .next
```

## Configuration

### Environment Variables (Frontend)

Create `.env` in the `frontend/` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:8787
```

### Wrangler Configuration (Backend)

Key settings in `wrangler.toml`:

```toml
[ai]
binding = "AI"

[[kv_namespaces]]
binding = "CHAT_HISTORY"
id = "YOUR_KV_NAMESPACE_ID"
```

## API Endpoints

### POST /api/chat

Chat with AI about logs and errors.

**Request:**
```json
{
  "message": "Error: ECONNREFUSED...",
  "sessionId": "session_1234567890_abc123"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "session_1234567890_abc123",
  "analysis": {
    "summary": "Connection refused to database",
    "reasoning": "...",
    "potential_fix": "..."
  },
  "messageCount": 4
}
```

### POST /api/analyze

Analyze network anomalies with AI.

**Request:**
```json
{
  "anomaly": {
    "type": "latency",
    "severity": "high",
    "description": "High latency detected: 842ms average",
    "affectedNodes": ["sfo", "nrt", "sin"],
    "timestamp": 1234567890
  },
  "traffic": [...]
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "summary": "...",
    "rootCause": "...",
    "impactAssessment": "...",
    "recommendedActions": [...],
    "severity": "high"
  }
}
```

### GET /api/history/:sessionId

Retrieve chat history for a session.

## How It Works

### Traffic Simulation Flow
1. User clicks "Start Simulation" in header
2. Frontend generates realistic requests between edge nodes every 500ms
3. Latency calculated based on geographic distance between nodes
4. System randomly injects anomalies (latency spikes, error bursts) with 10% probability
5. Canvas map updates in real-time showing traffic flows with color coding
6. Dashboard displays live metrics (requests, latency, errors, success rate)

### AI Analysis Flow
1. System detects anomaly patterns (high latency, error rate spikes, timeouts)
2. User clicks "Analyze with AI" on detected anomaly
3. POST request sent to `/api/analyze` with anomaly data and recent traffic context
4. Workers AI (Llama 3) analyzes the pattern and generates structured insights
5. AI returns root cause, impact assessment, and recommended actions
6. Results displayed in collapsible panels within the anomaly card

### Session Persistence
- **Local Storage:** Recent simulations saved in browser (up to 10 sessions)
- **KV Storage:** Chat history and analysis results stored in Cloudflare KV with 30-day TTL
- **Replay:** Load previous sessions from the Sessions page

## Development Notes

- **Workers AI Limits:** Free tier has rate limits. For production use, upgrade to paid plan.
- **KV Storage:** Free tier includes 100k reads/day and 1k writes/day
- **Session Expiry:** Sessions automatically deleted after 30 days
- **CORS:** Configured for local development; update for production

## Design Philosophy

This project follows a minimalist, developer-first aesthetic:

- **No gradients or shadows** - Clean, flat design
- **High contrast** - Excellent readability in both light and dark modes
- **Border-focused** - Clear visual hierarchy
- **Monospace for code** - JetBrains Mono for technical content
- **Collapsible panels** - Progressive disclosure of complexity
- **OKLCH colors** - Modern color space for consistent theming

## Project Structure

```
cf_ai_edgescope/
├── backend/                    # Cloudflare Worker
│   ├── src/
│   │   ├── index.ts           # API routes
│   │   ├── ai.ts              # Workers AI integration
│   │   └── memory.ts          # KV storage layer
│   ├── package.json
│   └── wrangler.toml          # Cloudflare configuration
│
├── frontend/                   # Next.js Application
│   ├── app/                   # App Router pages
│   ├── components/
│   │   ├── ui/                # Base components
│   │   ├── layout/            # Layout components
│   │   ├── dashboard/         # Dashboard components
│   │   └── chat/              # Chat interface
│   ├── store/                 # Zustand state management
│   ├── services/              # API client
│   ├── types/                 # TypeScript interfaces
│   ├── data/                  # Edge node locations
│   ├── utils/                 # Simulation engine
│   └── package.json
│
└── README.md
```

## AI Assistance

This project was built with assistance from AI tools. See [PROMPTS.md](./PROMPTS.md) for documentation of AI prompts and system design.

## Acknowledgments

Built for the Cloudflare Engineering Internship application. This project demonstrates:
- Deep understanding of Cloudflare's edge computing platform
- Production-ready code architecture and TypeScript best practices
- Developer-focused UX design and modern web standards
- Effective use of Workers AI, KV storage, and serverless patterns
- Real-world application of edge computing for observability tools
