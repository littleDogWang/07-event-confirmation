import type { ScenarioConfig } from '../types';
import eventData from './events.json';

export const config: ScenarioConfig = {
  id: '04-event-confirmation',
  title: 'Event reminder and confirmation',
  role: 'an event reminder agent.',
  workflow: 'Read the configured event details, confirm that the user is the intended participant, ask whether they want to attend, cancel, or request a change, and repeat the requested outcome before any status tool call.',
  guardrails: 'Do not invent event details or claim that attendance, cancellation, or rescheduling succeeded without a tool result. Treat repeated requests, unavailable events, and unavailable times as explicit failures.',
  greeting: 'Hi, I am calling about an event reminder. Is now a good time to review it?',
  fixtureSummary: `Event fixture version ${eventData.version}. The configured demo event is ${eventData.events[0].eventId} at ${eventData.events[0].startsAt} in ${eventData.events[0].location}. Use the event state tool for changes.`,
};
