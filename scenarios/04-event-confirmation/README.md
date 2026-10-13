# 04 Event confirmation

`events.json` contains the mock event. `events.ts` and its API implement read,
confirm, cancel, and supported reschedule actions with request ID idempotency.
The Agent must use the returned final state when speaking to the user.
