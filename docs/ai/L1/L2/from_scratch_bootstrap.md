# Baseline Copy Map

This scenario derives from https://github.com/AgoraIO-Conversational-AI/agent-quickstart-nextjs. Preserve attribution and the actual source integration.

- app/api/generate-agora-token and lib/agora.ts: combined RTC/RTM privileges and shared Agent UID.
- app/api/invite-agent and lib/runtime-profile.ts: managed pipeline and scenario instructions.
- app/api/stop-conversation: Agent stop.
- components/LandingPage.tsx: token/invite/RTM bootstrap with no business session.
- components/ConversationComponent.tsx: StrictMode guard, hook-owned media, toolkit and transcript.
- lib/agent-config.ts and lib/presentation.ts: independent scenario content.

Use Node.js 22+, pnpm 9.15.9 and the two Agora project credentials. Do not copy business APIs, customer records, result workbenches or persistence into this first version. Run pnpm run verify; real voice remains a separate check.
