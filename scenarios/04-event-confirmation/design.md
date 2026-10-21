# Event reminder and confirmation design

## Scope

An event assistant reviews one participant registration for a fixed webinar. Event definitions and session times are immutable. Every review starts with an isolated example registration for Alex Morgan.

## Supported flow

1. Use the scenario-specific starter entry card and choose Start event reminder to create temporary state and start voice directly.
2. Use the conversation and starter voice controls as the primary interface. A collapsed context strip contains event/session details.
3. Respond by voice. When REST tools are unavailable, Riley explicitly discusses the event without recording registration changes. No manual response form is presented.
4. Confirm attendance, explicitly cancel this participant registration, move it to an available session, remain undecided, or record recording/later-contact preferences.
5. Display the authoritative API result. Keep verbal intent separate from actual attendance.
6. End the reminder, retain its last confirmed result in browser memory, and download a CSV. A new result replaces the old one only after another voice conversation starts successfully.

## Temporary state and export

No database, disk files, localStorage or permanent history. The Node process holds sessions for up to two hours; the browser keeps the last confirmed snapshot in React state. Refreshing or restarting may lose access. An ended review rejects new writes, while result viewing and download remain available. No automatic download is triggered.

CSV contains participant, event, selected session, response, preferences, revision, update timestamp and ended status. It uses UTF-8 with BOM, quotes values and neutralizes spreadsheet formula prefixes.

## API and tools

POST /api/scenarios/04-event-confirmation/sessions with action=create returns a session capability, initial result and registration recording capability. Requests after creation send x-event-session. GET sessions or events reads that review. POST events updates only its bound registration. POST sessions with action=finish closes it.

The synchronous Agora REST tools get_event and update_event use a server-bound session header; the model cannot select another participant or review. Tool call IDs supply request idempotency keys. An identical replay returns an immutable original result; reusing an ID for a different update fails. Unknown slots, cancelled registrations and ended/expired reviews cannot be updated.

TOP_TEN_SCENARIO_TOOL_BASE_URL must be a public HTTPS URL for this same single-process app. With it absent, voice starts in discussion-only mode, an explicit capability notice is shown, and the registration result remains unchanged. It is never inferred from the transcript. In-memory sessions are not shared between multiple instances or serverless workers; this release targets one long-running Node process. No tunnel or deployment is created automatically.

## UI

Restore the official starter entry card, transcript, layout and agora-agent-uikit visualizer/microphone controls. Use Tailwind 3 and starter HSL tokens. Agent-ui adoption is paused for scenario 04; scenario 01 keeps its existing interface. Event identity and identifier 04 stay visible on desktop/mobile. Retain event context, authoritative response display, ended state and CSV download. This UI change does not reset business state or alter the API/voice workflow.

## Boundaries

Recording and contact preferences are records only. No recording/email is sent, no telephone callback is scheduled, no human transfer is performed, and no real calendar or event registration is changed. No external CRM, calendar, messaging or knowledge service is required. Real PSTN outbound calls and actual attendance tracking are excluded.
