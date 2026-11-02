# 01 Setup

Use Node.js 22+ and pnpm 9.15.9. Install with pnpm install --frozen-lockfile. Copy env.local.example to .env.local only when absent; preserve existing credentials.

| Variable | Required | Exposure |
| --- | --- | --- |
| `NEXT_PUBLIC_AGORA_APP_ID` | Yes | Public; build and runtime |
| `NEXT_AGORA_APP_CERTIFICATE` | Yes | Server runtime only |


Run pnpm run doctor and pnpm run dev. No business-tool origin or storage configuration is used. The optional ready-CLI command is `agora quickstart env write . --template nextjs --project <your-project> --json`.

Run pnpm run verify; run pnpm run verify:docker separately. Real speech needs a configured Agora project, microphone permission and real acceptance.

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Tokens](L2/token_model.md)
- [Agent configuration](L2/invite_agent_config.md)
