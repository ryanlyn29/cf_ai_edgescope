# Contributing to cf_ai_debug_pilot

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Development Setup

### Prerequisites
- Node.js 18+
- npm or pnpm
- Git
- Cloudflare account

### First-Time Setup
```bash
# Clone the repository
git clone <repo_url>
cd cf_ai_debug_pilot

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Setup Cloudflare
wrangler login
wrangler kv:namespace create "CHAT_HISTORY"
# Update wrangler.toml with KV namespace ID

# Run development servers
# Terminal 1:
cd backend && wrangler dev

# Terminal 2:
cd frontend && npm run dev
```

## Project Structure

```
cf_ai_debug_pilot/
├── backend/           # Cloudflare Worker
│   └── src/
│       ├── index.ts   # API routes
│       ├── ai.ts      # Workers AI logic
│       └── memory.ts  # KV storage
│
└── frontend/          # React application
    └── src/
        ├── components/
        │   ├── ui/           # Base components
        │   ├── layout/       # Page layouts
        │   └── features/     # Feature components
        ├── hooks/            # Custom hooks
        └── services/         # API client
```

## Code Style

### TypeScript
- Use TypeScript for all new code
- Enable strict mode
- Add JSDoc comments for public APIs
- Use interfaces over types (prefer `interface` to `type`)

### React
- Functional components only (no class components)
- Use hooks for state management
- Keep components small and focused
- Extract custom hooks for reusable logic

### Styling
- Use Tailwind utility classes
- Follow the existing design system (zinc palette)
- Dark mode support is required
- No inline styles or CSS modules

### Naming Conventions
- **Files**: PascalCase for components (`Button.tsx`), camelCase for utilities (`api.ts`)
- **Components**: PascalCase (`function Button()`)
- **Functions**: camelCase (`function sendMessage()`)
- **Constants**: UPPER_SNAKE_CASE (`const API_URL`)

## Making Changes

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

Example: `feature/add-export-functionality`

### Commit Messages
Follow the Conventional Commits format:

```
<type>(<scope>): <description>

[optional body]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(backend): add session deletion endpoint
fix(ui): resolve dark mode contrast issue
docs(readme): update setup instructions
```

## Testing

### Before Submitting
1. Test locally with both frontend and backend running
2. Test in both light and dark modes
3. Check console for errors
4. Verify TypeScript compilation: `tsc --noEmit`

### Test Cases to Verify
- [ ] Submit a log and receive analysis
- [ ] Collapsible sections expand/collapse
- [ ] Session persists across page refresh
- [ ] Dark mode toggles correctly
- [ ] Mobile responsiveness
- [ ] Keyboard shortcuts work (Ctrl+Enter)

## Pull Request Process

1. **Create a branch** from `main`
2. **Make your changes** following code style guidelines
3. **Test thoroughly** (see Testing section)
4. **Update documentation** if needed
5. **Submit PR** with clear description

### PR Description Template
```markdown
## What does this PR do?
Brief description of changes

## Why is this change needed?
Problem this solves or feature it adds

## How was this tested?
- [ ] Tested locally
- [ ] Tested in production-like environment
- [ ] Added/updated tests

## Screenshots (if UI changes)
[Add screenshots here]

## Checklist
- [ ] Code follows project style
- [ ] Documentation updated
- [ ] TypeScript compiles with no errors
- [ ] Tested in both light/dark modes
```

## Areas for Contribution

### High Priority
- [ ] Add unit tests for backend logic
- [ ] Add E2E tests with Playwright
- [ ] Implement rate limiting
- [ ] Add error boundary for frontend
- [ ] Improve mobile UX

### Feature Ideas
- [ ] File upload for logs
- [ ] Export analysis as PDF/Markdown
- [ ] Syntax highlighting improvements
- [ ] Keyboard navigation
- [ ] Session history sidebar
- [ ] Shareable analysis links

### Documentation
- [ ] Add inline code documentation
- [ ] Create video walkthrough
- [ ] Write troubleshooting guide
- [ ] Document deployment process

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues before creating new ones

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the project's coding standards

---

Thank you for contributing! 🎉
