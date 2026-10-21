# Event reminder and confirmation acceptance

- Event time, timezone, joining instructions and participant identity match the fixtures.
- Each new review has a unique capability and a fresh registration. Two reviews cannot change one another.
- Cancellation changes only the current participant registration. Rescheduling changes only that registration session ID; all event times remain unchanged.
- Unavailable sessions preserve the original state. Cancelled registrations, expired reviews and ended reviews reject new changes.
- Identical request replay returns the original snapshot without changing the current state; conflicting reuse fails. Returned data cannot mutate the store.
- Undecided, recording preference and later-contact preference appear only after successful API results. Requested contact notes support up to 500 characters.
- Recording/later-contact copy does not claim that delivery or a callback happened. Verbal confirmation is not displayed as actual attendance.
- Results remain visible and downloadable after finishing. New review resets preferences and response. Refresh/restart recovery is not promised.
- CSV content matches the displayed confirmed snapshot, including selected session and preferences; quotes, line breaks and formula prefixes are handled.
- A failed tool update must not appear successful. Failed result refresh retains the last confirmed snapshot with an explicit notice.
- The starter entry card and main identity explain scenario 04. Verify starter components/theme, desktop/mobile layouts, conversation, collapsed event context, auxiliary result and ended states.
- Start event reminder directly starts voice. Missing HTTPS registration tools do not disable it: the assistant explicitly states it cannot record changes, the response remains unchanged, and the ended result reports No response recorded.
- Verify local domain/API checks, lint, typecheck and production build separately from real Agora audio/tool acceptance. Browser simulations are not live voice evidence.
