# 06 Interfaces

- GET /api/generate-agora-token accepts optional uid/channel and returns token, uid and channel.
- POST /api/invite-agent requires requester_id and channel_name. It never requires a business session or registers business tools.
- POST /api/stop-conversation accepts agent_id; preserve existing idempotency.
- POST /api/chat/completions is an optional custom-LLM proxy.
- Existing business data API routes return HTTP 410 without performing any operation.

RTC carries audio. RTM/toolkit provides transcript, state, metrics and error events. Inspector keeps current-call evidence in the page; it does not save business results.

Local environment uses env.local.example and .env.local. Only NEXT_PUBLIC_AGORA_APP_ID and server-only NEXT_AGORA_APP_CERTIFICATE are required. Old business-tool/storage variables have no runtime effect.

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Tokens](L2/token_model.md)
- [Agent configuration](L2/invite_agent_config.md)
