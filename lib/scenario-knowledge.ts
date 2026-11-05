// Public reference only. Keep private records, live inventory and business actions out of this module.
export const SCENARIO_KNOWLEDGE = {
  "source": {
    "kind": "Fictional event reference",
    "revision": "2026-11-05",
    "scope": "One illustrative scheduled session; not a real event listing, attendee record or live event update."
  },
  "timeZone": "America/New_York",
  "title": "Building better customer conversations",
  "organizer": "Agora (fictional example event)",
  "location": "Online webinar",
  "description": "A practical session on designing helpful voice experiences, with examples and a live Q&A.",
  "session": {
    "date": "2026-11-19",
    "startsAt": "2026-11-19T14:00:00-05:00",
    "endsAt": "2026-11-19T14:45:00-05:00",
    "durationMinutes": 45,
    "timeZone": "America/New_York",
    "localStartTimes": {
      "America/New_York": "November 19, 2026, 2:00 PM EST (UTC-05:00)",
      "America/Chicago": "November 19, 2026, 1:00 PM CST (UTC-06:00)",
      "America/Denver": "November 19, 2026, 12:00 PM MST (UTC-07:00)",
      "America/Los_Angeles": "November 19, 2026, 11:00 AM PST (UTC-08:00)"
    }
  },
  "agenda": [
    {
      "minutes": 15,
      "topic": "Understand the user's goal and ask useful follow-up questions"
    },
    {
      "minutes": 20,
      "topic": "Examples of voice-agent conversations and capability boundaries"
    },
    {
      "minutes": 10,
      "topic": "Live Q&A"
    }
  ],
  "audience": "People designing or evaluating voice experiences, including product, support and development teams.",
  "joining": "A personal join link would come from the attendee's existing registration confirmation. No public or personal join URL is configured here.",
  "recording": "A recording is planned in the example. Publication, availability and delivery are unconfirmed; discussing interest does not send or request it."
} as const;
