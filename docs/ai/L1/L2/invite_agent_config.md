# Agent Configuration

lib/agent-config.ts defines the scenario conversation and static public background. lib/agent-tools.ts returns an empty list. app/api/invite-agent/route.ts supplies the existing managed STT/LLM/TTS configuration from lib/runtime-profile.ts and explicitly disables tool execution.

The body requires requester_id and channel_name only. Preserve remoteUids scope, shared Agent UID, turn detection, model/voice settings and explicit startup failures. No business session or result store is created.

Run pnpm run verify:api and pnpm run verify:conversation before the full pnpm run verify. Real speech and provider quality require real acceptance.
