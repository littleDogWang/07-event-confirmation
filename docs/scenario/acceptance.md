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
