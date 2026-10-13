import type { LlmTool } from 'agora-agents';
type Property = Record<string, unknown>;
function tool(baseUrl: string, name: string, description: string, method: 'GET' | 'POST', path: string, properties: Property, required: string[], body?: Record<string, unknown>): LlmTool {
  return { type: 'function', function: { name, description, parameters: { type: 'object', properties, required } }, server: { method, url: `${baseUrl.replace(/\/$/, '')}${path}`, ...(body ? { body } : {}) } };
}
export function getScenarioTools(_scenarioId: string, baseUrl = process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL): LlmTool[] {
  if (!baseUrl) return [];
  const stringProperty = { type: 'string' };
  const integerProperty = { type: 'integer' };
  return [
        tool(baseUrl, 'get_event', 'Read the configured event record.', 'GET', '/api/scenarios/04-event-confirmation/events?event_id={{args.event_id}}', { event_id: stringProperty }, ['event_id']),
        tool(baseUrl, 'update_event', 'Confirm, cancel, or request a supported event reschedule.', 'POST', '/api/scenarios/04-event-confirmation/events', { event_id: stringProperty, action: { type: 'string', enum: ['confirm', 'cancel', 'reschedule'] }, request_id: stringProperty, new_time: stringProperty }, ['event_id', 'action', 'request_id'], { event_id: '{{args.event_id}}', action: '{{args.action}}', request_id: '{{args.request_id}}', new_time: '{{args.new_time}}' }),
      ];
}
