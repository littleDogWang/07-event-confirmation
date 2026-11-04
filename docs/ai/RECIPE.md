---
recipe_version: 0.3.0
recipe_status: draft
extension_points:
  - id: prompts.system
    name: Scenario conversation and static public reference material
  - id: pipeline.providers
    name: Managed speech, model, voice and turn detection
  - id: ui.conversation
    name: Scenario identity, voice controls and current-call evidence
invariants:
  - id: tokens.rtc-rtm
    summary: Preserve combined RTC/RTM privileges and server-only credentials
  - id: lifecycle.strict-mode
    summary: Preserve initialization guards and hook-owned cleanup
  - id: scenario.conversation-only
    summary: Do not add business sessions, tools, data routes or persistent business records
stable_contracts:
  - id: api.invite-agent
    summary: Only requester_id and channel_name are required for voice startup
  - id: verification.canonical
    summary: pnpm run verify includes conversation-only regression checks
---

# Conversation-Only Recipe Profile

Read [the public recipe](../../RECIPE.md) for Event Reminder Assistant.

## Recipe Scope

Discuss a webinar, attendance plans and questions about joining.

This first version is conversation-only. No business data lookup, external tools, database, record writes, saved results, or cross-session business history are available. Keep user-provided details only in the current conversation. Never claim an order, appointment, registration, feedback submission, callback, payment, shipment or other external action was created, saved or completed. Offer a verbal summary and explain the appropriate human next step instead. Do not request passwords, verification codes, payment details or unnecessary personal identifiers.

## Baseline Implementation Guidance

This independent scenario derives from the [official Agora Next.js voice quickstart](https://github.com/AgoraIO-Conversational-AI/agent-quickstart-nextjs). Preserve the actual SDK, token and lifecycle code. See [the source map](L1/03_code_map.md) and [bootstrap guidance](L1/L2/from_scratch_bootstrap.md).

## Extension Points

- lib/agent-config.ts: role, greeting, workflow, guardrails and static public material.
- lib/presentation.ts: inline welcome, visible identity and developer guidance.
- lib/runtime-profile.ts and app/api/invite-agent/route.ts: existing speech/provider settings.
- lib/agent-tools.ts: intentionally empty; no environment flag enables business tools.

## Invariants

Preserve StrictMode guards, hook-owned RTC and microphone cleanup, combined RTC/RTM token privileges, local-user UID remapping and interrupted transcript turns. Start voice without creating a business session. Retain current-call evidence only; a verbal recap is not a stored result.

## Stable Contracts

- GET /api/generate-agora-token returns token, uid and channel.
- POST /api/invite-agent requires requester_id and channel_name and returns the managed Agent ID.
- POST /api/stop-conversation accepts agent_id; retain the existing idempotent stop behavior.
- POST /api/chat/completions is an optional custom-LLM proxy and is not used by the default pipeline.
- Existing app/api/scenarios endpoints return HTTP 410 without invoking business modules.
- env.local.example documents the two required Agora values for .env.local.
- pnpm run verify is canonical; Docker and real voice acceptance remain separate.

## Deployment

The browser uses Agora RTC for audio and RTM for transcript and Agent events. Next.js only signs credentials and starts/stops the managed Agent. No business session, data API, local file store or persistent application database is required. Native Node.js, Docker and a Next.js-compatible serverless deployment use the same conversation flow. Actual hosted voice acceptance remains a separate check.

## Consumer Onboarding Recipe

1. Clone https://github.com/littleDogWang/07-event-confirmation and use Node.js 22+ with pnpm 9.15.9.
2. Install with pnpm install --frozen-lockfile.
3. Create .env.local from env.local.example only if absent and configure the two Agora project values.
4. Run pnpm run doctor and pnpm run dev, then choose the scenario start action.
5. Verify actual speech, transcript, interruptions and clean stop.
6. Run pnpm run verify and any separately required deployment checks. A local catalog entry is not evidence of public availability.
