# 05 Workflows

> Complete development and delivery workflows.

## First Success

```bash
git clone https://github.com/littleDogWang/04-event-confirmation.git
cd 04-event-confirmation
pnpm install --frozen-lockfile
cp env.local.example .env.local
```

Fill the two required Agora values in `.env.local`, then run `pnpm run doctor` and `pnpm run dev`. Keep an existing env file instead of overwriting it. With a ready Agora CLI, use `agora quickstart env write . --template nextjs --project <your-project> --json` to write template-aware keys for an existing authorized project. Check `agora version` and `agora doctor --json` first; do not create or change a remote project without authorization.

Open http://localhost:3000 and start the scenario. Confirm actual two-way audio and both transcript roles; use [the public guide](../../../RECIPE.md#2-try-the-demo) for concrete cases. The assistant discusses the event and attendance intent but cannot record registration changes. An unmodified result remains 'No response recorded'.

## Modify The Agent Or Core Flow

Edit `scenarios/04-event-confirmation/config.ts` and the selected data/rules, then inspect prompt assembly in scenarios/index.ts and provider/turn detection in the invite route. Preserve the internal recipe invariants. Run scenario/API checks and canonical verify; repeat real speech cases for timing or behavior changes.

## Modify The Client Or UI

Use scenario presentation and existing components. Preserve the initial Dialog, persistent identity, real toolkit/Glass callbacks and RTC/RTM ownership. Use the scenario-specific entry and persistent identity; starting voice requires a user action. Render desktop/mobile and inspect real states before delivery.

## Change An Interface

Update the owning route/types, browser consumer, tool schema, matching checks and docs together. The invite additionally requires `event_session_id`, created by the scenario session API. Keep the server-bound capability header and tool-call replay handling. Never introduce caller-selectable business scope or imply a successful write from a verbal summary.

## Deploy

Local development runs one Next.js process at http://localhost:3000 using `.env.local`. Native production uses `pnpm run build` then `pnpm run start`. Docker runs the same app as non-root UID 1001 on port 3000, without a reverse proxy inside the image. Run one long-lived Node process. Reviews live in process memory for up to two hours and are not shared across workers. Restart loses server state; refresh can lose the browser capability. Download CSV before leaving. Serverless hosting does not support this temporary store as a reliable shared session service.

Follow [README Docker](../../../README.md#docker): public App ID at build, both Agora values at runtime, port 3000, and a persistent .scenario-data volume where required. Run `pnpm run verify:docker`; test live cloud tool calls independently.

## Diagnose A Failure

Inspect the exact failing token, invite, RTM or business API response. Separate setup, transport, provider and tool failures. Reproduce one narrow case, compare the documented contract with its source, then run the matching check. A local URL does not prove public callback reachability, and a built image does not prove speech.

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Agent configuration](L2/invite_agent_config.md)
