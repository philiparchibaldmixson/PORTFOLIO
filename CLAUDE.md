# CLAUDE.md

Guidance for Claude Code (or Cursor) when working in this repository.

## Proof Statement (read this first)

This repo exists to demonstrate one thing: **custom AI-integrated React UIs that resolve support edge cases off-the-shelf chatbots escalate, with a measurable reduction in human-escalated tickets.**

Every change should be evaluated against one question: *does this make the escalation-reduction story clearer, or does it just add code?* If a feature doesn't move a metric in the README's Impact table or improve the demo's first 60 seconds, deprioritize it.

## Stack

- **Frontend:** React 18 + TypeScript, Vite
- **Styling:** Tailwind CSS (no separate CSS files unless a component needs animation keyframes)
- **State:** Zustand for app state; React Query for server/AI-response caching
- **AI layer:** Anthropic Claude API (`@anthropic-ai/sdk`), called from serverless functions — **never from the client**
- **Backend:** Vercel Edge Functions (or `/api` routes if Node runtime is required for a given integration)
- **Validation:** Zod for all API boundaries (request payloads, AI tool-call outputs, webhook bodies)
- **Testing:** Vitest + React Testing Library for components; separate eval harness (see `/evals`) for AI-response quality
- **Deployment:** Vercel

## Folder Conventions

```
/src
  /components     — presentational, no business logic
  /features       — feature-scoped logic + components (e.g. /features/ticket-resolution)
  /lib            — API clients, Claude prompt builders, utilities
  /hooks
  /types
/api              — serverless functions (AI calls, webhooks live here only)
/evals            — test cases for AI resolution quality, not unit tests
/data             — schemas and fixtures only. Real ticket data is gitignored, always.
```

## AI Integration Conventions

1. **Context assembly is a named, testable function** — never inline a giant prompt string in a component or route handler. Put it in `/lib/prompts/` and unit-test it.
2. **Every AI call has an explicit fallback path.** If the model call fails or times out, the UI must degrade to a clear human-handoff state — never a silent hang or generic error. This *is* the product's edge-case-handling story; treat failure states as a feature, not an afterthought.
3. **Log resolution outcomes, not just responses.** Every AI-handled ticket should record: resolved / escalated / abandoned, plus latency. This is what populates the README Impact table — instrument it from day one, not retroactively.
4. **No PII in prompts beyond what's required for the specific resolution.** Redact/tokenize before sending to the model; document the redaction step in `/lib/prompts/`.
5. **Guardrail every tool call** the model can invoke (refunds, account changes, etc.) with a Zod schema and an explicit allow-list of actions. Treat the model as an untrusted caller of your own API.

## Code Conventions

- **Commits:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`). PR titles should be readable by a non-technical prospect skimming commit history.
- **Components:** function components only, colocate types, one component per file, no default exports for anything except pages.
- **No unnecessary dependencies.** Every new package must justify itself against the proof statement — this is a portfolio piece, not a playground. If in doubt, don't add it.
- **Every PR description ends with one line:** *"Impact: ___"* — even if the answer is "no measurable impact, infra only." This habit is what keeps the README's Impact table honest and current.

## What NOT to do in this repo

- Don't build generic chatbot UI patterns (FAQ trees, canned quick-replies) — that's the thing this project explicitly replaces. If Claude Code suggests it, push back.
- Don't let the demo bury the CTA. The "Book a discovery call" action must remain reachable within one scroll/click from any page, including the live demo.
- Don't commit real customer data, transcripts, or PII under any circumstance — see `.gitignore`.
