# 05 Workflows

## First success

Install dependencies, configure the two Agora values in .env.local, run pnpm run doctor and pnpm run dev, and choose the scenario start action. No business session is required.

## Change behavior

Edit lib/agent-config.ts for the conversation and lib/presentation.ts for visible copy. Run pnpm run verify and real speech acceptance for prompt/provider changes.

## Deploy

The browser uses Agora RTC for audio and RTM for transcript and Agent events. Next.js only signs credentials and starts/stops the managed Agent. No business session, data API, local file store or persistent application database is required. Native Node.js, Docker and a Next.js-compatible serverless deployment use the same conversation flow. Actual hosted voice acceptance remains a separate check.

Read [the deployment guide](../../../README.md#deployment). Supply the public App ID at build and runtime; keep the certificate server-only. Docker checks and hosted speech are separate.

## Diagnose

Inspect the actual failing token, Agent, RTC or RTM response. Report setup, transport and provider failures directly; never present synthetic checks as real speech acceptance.

## Improve prompt-based guidance

Edit `lib/agent-config.ts` and `lib/scenario-knowledge.ts` together. Keep business facts grounded in the configured reference; do not treat a date calendar as live availability. `lib/prompt-context.ts` provides current business-local date context without adding an API, provider setting or business session.

Synchronize the scenario guide and acceptance cases. Run `pnpm run verify`; its date-context regressions check UTC/local-date boundaries, daylight saving and month/year transitions. Verify actual model responses and speech separately before claiming conversational acceptance.

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Tokens](L2/token_model.md)
- [Agent configuration](L2/invite_agent_config.md)
