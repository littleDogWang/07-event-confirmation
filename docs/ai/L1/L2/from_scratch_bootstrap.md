# Scenario Baseline Copy Map

> Read when integrating Event Reminder & Confirmation into another application.

## Baseline Rule

This checkout is the 04-event-confirmation scenario derivative of the official Agora Next.js voice quickstart. Read its current source before adapting SDK, token or event behavior. Do not generate a replacement integration from memory.

## Implementation Map

| Need | Source of truth | Guidance |
| --- | --- | --- |
| Setup and env | package.json, env.local.example | [Setup](../01_setup.md) |
| Voice lifecycle | components/LandingPage.tsx, components/ConversationComponent.tsx | [Lifecycle](conversation_lifecycle.md) |
| Scenario prompt and fixtures | scenarios/04-event-confirmation/config.ts and local data | [Public recipe](../../../../RECIPE.md) |
| Agent providers and tools | app/api/invite-agent/route.ts, scenarios/tool-contracts.ts | [Agent configuration](invite_agent_config.md) |
| API and call scope | app/api/scenarios, types/conversation.ts | [Interfaces](../06_interfaces.md) |
| Tokens and renewal | app/api/generate-agora-token/route.ts | [Token model](token_model.md) |
| State and deployment | ARCHITECTURE.md, Dockerfile | [Architecture](../../../../ARCHITECTURE.md) |

## Adaptation Sequence

1. Run the existing scenario using Node.js 22+, pnpm 9.15.9 and the documented .env.local contract.
2. Verify an actual call before declaring speech success; local contracts alone are not runtime evidence.
3. Map token, invite, stop, RTC join, RTM subscription and toolkit events into the target app's existing owners.
4. Preserve StrictMode initialization, hook-owned cleanup, combined token privileges, UID remap and interrupted turns.
5. The invite additionally requires `event_session_id`, created by the scenario session API. Keep the server-bound capability header and tool-call replay handling.
6. Start with default conversation: The assistant discusses the event and attendance intent but cannot record registration changes. An unmodified result remains 'No response recorded'.
7. Add only requested business tools, preserving their exact call scope and confirmation semantics. The assistant cannot cancel the event itself, change its timetable, send a recording, schedule a real callback or verify actual attendance. Recording and callback actions record preferences only.
8. Run pnpm run verify and the appropriate separate Docker/live acceptance checks.

## See Also

- [Internal recipe](../../RECIPE.md)
- [Workflows](../05_workflows.md)
- [Interfaces](../06_interfaces.md)
