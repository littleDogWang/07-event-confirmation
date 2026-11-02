# Event Reminder Assistant

Discuss a webinar, attendance plans and questions about joining.

## Conversation flow

Ask whether now is a good time to discuss the webinar. Use the bundled public event description, organizer, time zone and joining guidance. Ask whether the caller plans to attend and what questions they have. Use dates and personal registration details only when the caller provides them; refer them to their existing registration confirmation for the actual schedule and join link. Discuss attendance intent, a preferred alternative or recording interest, then recap it verbally. Respect uncertainty, corrections and requests to stop, asking one question at a time.

## Boundaries

No participant record, registration, attendance tracker or event-update system is connected. Do not assume the caller is Alex or is registered. Do not save a response, confirm attendance in a system, change or cancel registration, change the event timetable, send a recording or email, arrange a callback or claim a calendar update.

This first version is conversation-only. No business data lookup, external tools, database, record writes, saved results, or cross-session business history are available. Keep user-provided details only in the current conversation. Never claim an order, appointment, registration, feedback submission, callback, payment, shipment or other external action was created, saved or completed. Offer a verbal summary and explain the appropriate human next step instead. Do not request passwords, verification codes, payment details or unnecessary personal identifiers.

## Trying the conversation

- What is the webinar about?
- I am not sure I can attend. Help me review my options.

Ask for a verbal recap before ending. Only the current page retains transcript and diagnostic state; no result, order, appointment, registration or feedback record is saved.

## Implementation

Behavior lives in lib/agent-config.ts. The page uses the shared voice lifecycle. lib/agent-tools.ts is empty and all business API routes return HTTP 410. See [acceptance cases](acceptance.md).
