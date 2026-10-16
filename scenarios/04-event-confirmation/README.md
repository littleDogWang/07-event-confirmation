# 04 Event reminder and confirmation

Start event reminder opens a real voice conversation with Riley directly. The interface centers the conversation and voice dock; event details and the recorded response are secondary. End the reminder to retain and download its result as CSV. Start another reminder uses a fresh isolated registration. No manual response form is presented.

Voice uses the existing Agora pipeline. TOP_TEN_SCENARIO_TOOL_BASE_URL enables session-scoped registration REST tools. Without it, the assistant explicitly discusses the event without recording changes; voice is not blocked. Spoken intention is never shown as a saved response. When no update was recorded, the ended result says No response recorded.

All state is temporary in one long-running Node process and browser memory. There is no database or external business integration. Refresh/restart may lose access; download a copy first. See design.md, acceptance.md.


## Local conversation and optional tools

Default conversations retain the existing event/participant fixture and discussion-only registration prompt. Attendance intent, session preferences and follow-up interest can be discussed but not recorded. A configured public HTTPS tool origin enables the existing session-bound registration tools.

TOP_TEN_SCENARIO_TOOL_BASE_URL is optional. Only an explicitly configured public HTTPS endpoint enables tools; malformed, HTTP, localhost and local/private origins leave tools disabled. URL validation does not prove network reachability. No tunnel, knowledge base or database is needed for the default conversation. Local checks do not establish live speech or cloud callback acceptance.
