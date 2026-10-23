# 03 Code Map

> Source navigation for Event Reminder & Confirmation.

## Directory Tree

```text
app/                    Next.js pages and API routes
components/             voice lifecycle, transcript and scenario UI
scenarios/04-event-confirmation/         business instructions, data and rules
scenarios/              selected prompt and optional tool contracts
lib/                    token constants and transcript/evidence helpers
scripts/                environment, scenario and delivery verification
docs/ai/L1/L2/          deeper lifecycle and integration guidance
```

## Core Files

- `app/api/generate-agora-token/route.ts`: combined RTC/RTM tokens.
- `app/api/invite-agent/route.ts`: prompt/provider assembly and Agent startup.
- `app/api/stop-conversation/route.ts`: Agent stop.
- `components/LandingPage.tsx`: browser bootstrap, RTM, token renewal and end.
- `components/ConversationComponent.tsx`: RTC/toolkit, transcript and activity/evidence events.
- `scenarios/index.ts`: selected scenario prompt.
- `scenarios/tool-contracts.ts`: tool schemas, origin validation and call-bound paths.
- `scenarios/04-event-confirmation/events.json`: Event and participant fixtures.
- `scenarios/04-event-confirmation/config.ts`: Conversation.
- `scenarios/04-event-confirmation/events.ts`: State and export.
- `package.json`: pinned pnpm and canonical verification.
- `Dockerfile`, `scripts/verify-docker.mjs`: actual image and container smoke contract.
- `scripts/verify-template.mjs`: required paths, identity, link and command consistency.

## Ownership Map

Business data and behavior are owned by the scenario sources above. README owns runnable setup/deployment instructions; ARCHITECTURE owns topology; internal RECIPE owns integration invariants and stable interfaces. The root RECIPE is the eight-part public narrative. CI invokes the same documented commands.

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Baseline copy map](L2/from_scratch_bootstrap.md)
