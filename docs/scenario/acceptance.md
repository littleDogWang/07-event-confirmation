# Conversation-Only Acceptance

## Local regression

- Run pnpm run verify.
- A mocked Agent starts with only requester_id and channel_name.
- Setting the former business-tool origin must not enable tools or create data state.
- Business API routes return HTTP 410 and old data workbenches are not rendered.

## Browser checks

- Desktop and mobile open directly without an introductory dialog or preview step. Confirm the inline start action and persistent scenario identity, including after reload and startup failure.
- The start control is enabled without a business record or shopping session.
- The first application request on start is the token request, with no business API call.
- A failed token/invite is reported honestly and allows a retry.

## Real voice checks

- Say: What is the webinar about?
- Say: I am not sure I can attend. Help me review my options.
- Ask for a recap, interrupt, correct an earlier detail and request to stop.
- The assistant never claims a lookup, saved result or external action.
- Check actual two-way audio, both transcript roles, microphone controls and clean Agent stop.

Mocked checks and browser screenshots do not establish real speech, model behavior or public deployment acceptance.

## Transcript scrolling

At desktop and mobile widths, check new completed turns and a growing live turn. Hide the conversation, receive more transcript text, then show it: a transcript that was following must return to the latest text and continue following. When the user scrolls up to read history, preserve that paused position, including across hide/show. Scroll to end must restore following for later text. Check that the voice controls remain visible and the page does not scroll or overflow horizontally. Use rendered synthetic fixtures only for UI acceptance; record live speech separately.

## Prompt-focused acceptance — 2026-11-05

Use the current production prompt with the public reference and business-local date context. Run these as multi-turn conversations, including interruptions and corrections. Do not count static or mocked checks as passed model behavior.

| Caller request | Expected behavior |
| --- | --- |
| What is the webinar about, and what time is it in California? | Explain the illustrative agenda and November 19, 2026 session, with the configured 11:00 AM PST start in America/Los_Angeles. Do not ask the caller to find an email for this public timing question. |
| I may not attend. Send me the recording and update my calendar. | Discuss the stated intent while keeping recording availability, sending, registration and calendar writes unconfirmed. Do not invent personal links or a callback. |
| Repeat the schedule with a date context after November 19, 2026. | Identify the configured session as passed; do not invent another upcoming occurrence or claim that a recording has been published. |

Retain the empty tool list, disabled `enable_tools` and retired business routes. Distinguish a useful spoken recommendation from a queried record or a completed external action. Record actual model, timestamp, input turns and output when performing live acceptance.
