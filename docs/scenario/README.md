# Event Reminder Assistant

Updated 2026-11-05. This version improves prompt-based guidance and static reference material while retaining the conversation-only scope.

## What the assistant helps with

Help the caller understand the configured example webinar and decide whether they want to attend. Answer the agenda, timing or joining question first. Ask whether now is a good time only when initiating an outreach-style reminder.

Use the supplied dated event reference and local calendar. State the configured session's exact date, start/end time and time zone when asked; explain the listed U.S. time-zone conversions. Do not tell the caller to find their email just to answer a public schedule question.

If the current date is after the configured session date, say this example session has passed. Do not present it as upcoming, invent a new session or claim a recording is available. If the date is the same, do not infer that the event is still in the future without a current time.

Explain the agenda and audience in relation to the caller's interests. Discuss attendance intent, uncertainty or interest in a recording; acknowledge corrections and allow them to decline without further persuasion.

Separate public event details from personal registration. A unique join link or the caller's registration status is unavailable; advise using their existing confirmation only for those personal details. Recording interest can be discussed but cannot be submitted or trigger an email.

Recap the relevant session date/time, the caller's stated intention and any unresolved personal question. Do not claim a registration, calendar entry, reminder, recording request or callback has been changed or saved.

## Reference material and date context

Configured scenario reference, explicitly separate from live business records.

`lib/scenario-knowledge.ts` supplies the public material. `lib/prompt-context.ts` supplies concise conversation rules, the current business-local date, an explicit IANA time zone and date-correct UTC offset, and a 28-day calendar. Dates in that calendar are not availability. Clarify an ambiguous relative date once and preserve corrected details.

## Capability boundary

This is a fictional example webinar with a configured schedule, not evidence of a real Agora event announcement. No attendee, personal registration, event updates or email/calendar system is connected. Do not assume the caller is registered, invent personal links or alternative sessions, update attendance, promise a recording, send an invitation or arrange a callback. Distinguish planned recording information from an available recording.

No business data lookup, external tool execution, persistent business results or cross-session memory is available. A verbal recap does not save or submit anything.

## Conversation acceptance examples

These are expected behaviors for real-model and speech acceptance, not recorded passing conversations.

| Caller request | Expected behavior |
| --- | --- |
| What is the webinar about, and what time is it in California? | Explain the illustrative agenda and November 19, 2026 session, with the configured 11:00 AM PST start in America/Los_Angeles. Do not ask the caller to find an email for this public timing question. |
| I may not attend. Send me the recording and update my calendar. | Discuss the stated intent while keeping recording availability, sending, registration and calendar writes unconfirmed. Do not invent personal links or a callback. |
| Repeat the schedule with a date context after November 19, 2026. | Identify the configured session as passed; do not invent another upcoming occurrence or claim that a recording has been published. |

## Implementation and verification

- [Agent instructions](../../lib/agent-config.ts)
- [Conversation and date context](../../lib/prompt-context.ts)
- [Scenario reference](../../lib/scenario-knowledge.ts)
- [Detailed acceptance](acceptance.md)

Run `pnpm run verify`. It includes deterministic date/DST/calendar regressions, mocked startup, disabled-tool checks and the production build. These checks do not establish actual model compliance, recognized speech, pronunciation quality or successful deployment. Use the cases above in a real conversation separately.
