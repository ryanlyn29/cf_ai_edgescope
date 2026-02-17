# EdgeScope AI Prompts Documentation

This document contains all AI prompts used in the EdgeScope application, including system prompts for Workers AI and development prompts used during the project.

## System AI Prompts

### Log Analysis System Prompt

**Model:** @cf/meta/llama-3-8b-instruct  
**Location:** `backend/src/ai.ts`  
**Temperature:** 0.3 (focused, technical responses)  
**Max Tokens:** 1024

```
You are a Senior Site Reliability Engineer specialized in debugging and log analysis. When analyzing logs, stack traces, or error messages:

1. Identify the root cause of the issue
2. Explain the reasoning behind the error
3. Provide actionable fixes

IMPORTANT: You MUST respond ONLY with valid JSON in this exact format:
{
  "summary": "One-sentence summary of the error (under 20 words)",
  "reasoning": "Step-by-step explanation of what's happening and why",
  "potential_fix": "Concrete fix or code snippet to resolve the issue"
}

Do not include any text before or after the JSON. Only output valid JSON.
```

**Purpose:**  
This prompt instructs the AI to act as a Senior SRE when analyzing logs and network anomalies. The strict JSON output format ensures consistent, parseable responses that can be displayed in the UI.

**Response Structure:**
- `summary`: One-sentence overview for quick scanning
- `reasoning`: Detailed technical explanation of the root cause
- `potential_fix`: Actionable steps or code to resolve the issue

### Anomaly Analysis Context

**Endpoint:** POST /api/analyze  
**Location:** `backend/src/index.ts`

When analyzing network anomalies, the system provides structured context to the AI:

```
Network Anomaly Detected:
Type: [latency|error_rate|timeout]
Severity: [critical|high|medium|low]
Description: [Human-readable description]
Affected Nodes: [comma-separated list of edge locations]
Timestamp: [ISO 8601 timestamp]

Recent Traffic Data:
- [from] → [to]: [status] ([latency]ms, [method] [path])
...

Please analyze this network anomaly and provide:
1. Root cause analysis
2. Impact assessment
3. Recommended actions to resolve
```

**Purpose:**  
Provides the AI with structured context about network anomalies including affected nodes, recent traffic patterns, and specific metrics. This enables more accurate root cause analysis.

## Chat Interface Prompts

### User Query Context

**Location:** `frontend/components/chat/ChatPanel.tsx`  
**Endpoint:** POST /api/chat

When users interact with the chat interface, the system includes simulation context:

```json
{
  "message": "[user's question]",
  "context": {
    "trafficCount": 1247,
    "anomalyCount": 3,
    "metrics": {
      "totalRequests": 1247,
      "successRate": 0.94,
      "averageLatency": 245,
      "errorCount": 75,
      "anomalyCount": 3,
      "activeNodes": 24
    },
    "recentAnomalies": [
      {
        "type": "latency",
        "severity": "high",
        "description": "High latency detected: 842ms average",
        "affectedNodes": ["sfo", "nrt", "sin"]
      }
    ]
  }
}
```

**Purpose:**  
Enriches user queries with real-time simulation data, allowing the AI to provide context-aware responses about current anomalies, metrics, and system state.

## Development Prompts

### Project Architecture Prompt

Used during initial development to establish architecture:

```
Create a real-time edge traffic intelligence dashboard using:
- Next.js 16 for the frontend with App Router
- Cloudflare Workers for serverless backend
- Workers AI (Llama 3) for anomaly analysis
- Cloudflare KV for session persistence
- TypeScript throughout
- Tailwind CSS for styling

Features:
- Traffic simulation between 24 global edge nodes
- Canvas-based network visualization
- Real-time anomaly detection
- AI-powered root cause analysis
- Session replay capabilities
- Chat interface for querying simulations

Design: Minimalist, developer-first aesthetic with light/dark modes
```

### UI/UX Design Prompt

Used to establish design system:

```
Design a professional SaaS dashboard inspired by Vercel and Linear:
- No gradients or shadows (flat design)
- High contrast for readability
- Border-focused visual hierarchy
- OKLCH color system for theming
- Inter font for UI, JetBrains Mono for code
- Collapsible panels for progressive disclosure
- Responsive grid layouts
```

### Component Architecture Prompt

Used for structuring React components:

```
Organize components following Next.js App Router conventions:
- app/: Pages using file-based routing
- components/ui/: Reusable base components (Button, Input, Card)
- components/layout/: Layout components (Sidebar, Header)
- components/dashboard/: Domain-specific components (NetworkMap, MetricsPanel)
- components/chat/: Chat interface components
- store/: Zustand state management
- services/: API client functions
- types/: TypeScript interfaces
- utils/: Utility functions
```

## AI Integration Strategy

### Why Workers AI?

EdgeScope uses Cloudflare Workers AI for several reasons:

1. **Edge Computing:** AI runs at the edge, close to users, reducing latency
2. **Serverless:** No infrastructure to manage, automatic scaling
3. **Cost Effective:** Pay only for actual AI inference time
4. **Integrated:** Seamlessly works with Workers and KV storage

### Model Selection

**Llama 3 8B Instruct** was chosen because:
- Strong performance on technical/debugging tasks
- Fast inference time suitable for real-time analysis
- Good balance of capability and cost
- Supports structured JSON output

### Prompt Engineering Techniques

1. **Role Assignment:** "You are a Senior Site Reliability Engineer..."
   - Establishes expertise domain
   - Improves technical accuracy

2. **Structured Output:** "MUST respond ONLY with valid JSON..."
   - Ensures parseable responses
   - Enables programmatic handling

3. **Low Temperature:** 0.3
   - Reduces randomness
   - More focused, consistent technical responses

4. **Context Injection:** Including recent traffic and metrics
   - Provides situational awareness
   - Enables specific, actionable recommendations

## Response Handling

### JSON Parsing Strategy

**Location:** `backend/src/ai.ts`

```typescript
// Try to extract JSON from response
const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
if (jsonMatch) {
  analysisText = jsonMatch[0];
}

// Parse and validate
const parsed = JSON.parse(analysisText);
if (!parsed.summary || !parsed.reasoning || !parsed.potential_fix) {
  throw new Error('Invalid response structure');
}
```

**Purpose:**  
Handles cases where the AI includes markdown formatting or extra text. Extracts the JSON object using regex before parsing.

### Error Handling

```typescript
catch (error) {
  // Graceful fallback
  return {
    summary: 'Failed to analyze the log',
    reasoning: `An error occurred while processing your request: ${error.message}`,
    potential_fix: 'Please try again or check the log format.',
  };
}
```

**Purpose:**  
Ensures the application never crashes due to AI errors. Always returns a valid response structure, even on failure.

## Performance Considerations

### Context Window Management

- Limited to last 10 messages in conversation history
- Prevents context window overflow
- Keeps token usage predictable

### Traffic Context Pruning

- Only last 50 traffic requests included in analysis
- Reduces payload size
- Focuses AI on recent patterns

### Response Streaming

Future enhancement: Could use streaming responses for real-time feedback during long analyses.

## Testing AI Prompts

### Manual Testing

Test prompts with various inputs:
- Valid error logs
- Network anomalies with different severities
- Edge cases (empty logs, malformed data)
- Long conversation histories

### Example Test Cases

1. **Latency Anomaly:**
```
Input: "High latency detected: 842ms average across sfo→nrt route"
Expected: Identifies geographic distance, suggests route optimization
```

2. **Error Burst:**
```
Input: "15 consecutive 500 errors from api.example.com"
Expected: Suggests server health check, upstream dependency issue
```

3. **Timeout Pattern:**
```
Input: "Multiple timeouts on database queries >5s"
Expected: Identifies database performance issue, suggests query optimization
```

## Future Enhancements

### Potential Prompt Improvements

1. **Few-Shot Examples:** Include example analyses in system prompt
2. **Chain-of-Thought:** Ask AI to reason step-by-step
3. **Confidence Scores:** Request confidence level in analysis
4. **Suggested Queries:** Generate follow-up questions for users

### Additional AI Use Cases

1. **Predictive Anomaly Detection:** Train on historical patterns
2. **Auto-Remediation:** Generate Infrastructure-as-Code fixes
3. **Performance Optimization:** Suggest configuration improvements
4. **Report Generation:** Automatic incident reports

## References

- [Cloudflare Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Llama 3 Model Card](https://ai.meta.com/llama/)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

## Notes

- All AI prompts should be version controlled
- Test prompt changes in staging before production
- Monitor AI token usage and costs
- Collect user feedback on AI response quality
- Consider A/B testing different prompt variations
