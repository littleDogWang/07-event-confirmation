# 03 Code Map

- components/LandingPage.tsx: voice entry, bootstrap, RTM, renewal, stop and current-call UI.
- components/ConversationComponent.tsx: guarded RTC/toolkit integration and transcript.
- lib/agent-config.ts: scenario role, workflow, greeting and static public reference material.
- lib/agent-tools.ts: empty tool list.
- lib/runtime-profile.ts: non-secret model and voice configuration.
- app/api/generate-agora-token/route.ts, app/api/invite-agent/route.ts and app/api/stop-conversation/route.ts: voice lifecycle.
- lib/chat-completions.ts: optional custom-LLM SSE proxy, not enabled by default.
- scripts/verify-conversation-only.ts: startup without business state and rejection of legacy tool enablement.
- docs/scenario/: conversation guide and acceptance.

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Tokens](L2/token_model.md)
- [Agent configuration](L2/invite_agent_config.md)
