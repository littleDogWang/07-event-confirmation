# Scenario Agent Configuration

> Read when changing Event Reminder & Confirmation's prompt, tools, provider chain or turn detection.

## Source Files

- `scenarios/04-event-confirmation/config.ts`: role, workflow, guardrails and greeting.
- `scenarios/index.ts`: selected prompt and default/tool mode context.
- `scenarios/tool-contracts.ts`: optional tool origin validation, schemas and server-bound scope.
- `app/api/invite-agent/route.ts`: actual SDK builder and session options.
- `scenarios/runtime-profile.ts`: non-secret configured provider/model display.

There are no generic Ada/ADA_PROMPT constants to edit. Use the scenario config and prompt assembly actually imported by the invite route.

## Request And Startup

The invite additionally requires `event_session_id`, created by the scenario session API. Keep the server-bound capability header and tool-call replay handling.

The server reads the App ID and App Certificate, builds AgoraClient with the selected area, and creates an Agent. The configured pipeline is Deepgram nova-3, OpenAI gpt-4o-mini and MiniMax speech_2_6_turbo. Copy the route's current builder pattern and createSession options; do not add an extra client argument or reproduce older SDK signatures.

The browser and invite route share DEFAULT_AGENT_UID. RTM, transcript/error delivery and metrics remain enabled. Session startup returns the Agent ID, creation timestamp and state; ending uses that same Agent ID.

## Prompt And Tools

Default behavior: The assistant discusses the event and attendance intent but cannot record registration changes. An unmodified result remains 'No response recorded'.

Tool behavior: `get_event` and `update_event` read or update the current temporary review. The server binds its capability in the tool header; the model cannot choose another participant's session.

`get_event` and `update_event` use the server-bound `x-event-session` capability. Updates support confirm, cancel, reschedule, undecided, request_recording and request_callback. Tool-call IDs supply request replay protection. The browser polls current results and keeps the final snapshot for export.

The assistant cannot cancel the event itself, change its timetable, send a recording, schedule a real callback or verify actual attendance. Recording and callback actions record preferences only.

## Provider And Turn Detection Changes

Edit the actual constructor blocks and turnDetection.config fields in the invite route. Provider BYOK examples are opt-in; keys stay server-side and are not part of the default two-key environment contract. For recruitment, preserve the configured 1,500 ms end-of-speech pause and 50-message LLM history unless intentionally changing interview pacing.

## Verification

Run `pnpm run verify:api`, `pnpm run verify:scenario` and canonical `pnpm run verify`. Real microphone pacing, interruptions and cloud HTTP execution require separate acceptance; mock Agent startup cannot establish those outcomes.

## See Also

- [Interfaces](../06_interfaces.md)
- [Workflows](../05_workflows.md)
- [Token model](token_model.md)
