import type { LlmTool } from 'agora-agents';

export function getToolBaseUrl(value = process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/\.$/, '');
    const localHost = (!host.includes('.') && !host.startsWith('[')) || /(^|\.)(localhost|local|internal)$/.test(host) ||
      /^(0\.|10\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(host) ||
      /^(\[::|\[f[cd]|\[fe[89ab])/.test(host);
    if (url.protocol !== 'https:' || localHost || url.username || url.password || url.search || url.hash) return null;
    return url.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

export function getScenarioTools(
  _scenarioId: string,
  baseUrl = process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL,
  sessionId?: string,
): LlmTool[] {
  const origin = getToolBaseUrl(baseUrl);
  if (!origin || !sessionId) return [];
  const server = {
    url: origin + '/api/scenarios/04-event-confirmation/events',
    headers: { 'x-event-session': sessionId },
  };
  return [
    {
      type: 'function',
      function: {
        name: 'get_event',
        description:
          'Read the current participant registration, event information and available sessions. Use this before discussing or changing the response.',
        parameters: { type: 'object', properties: {}, required: [] },
      },
      server: { ...server, method: 'GET' },
    },
    {
      type: 'function',
      function: {
        name: 'update_event',
        description:
          'Update only this participant registration. Confirm cancellation or switching sessions with the user first. Recording and callback actions record preferences only; they do not send or schedule anything. Use an empty string for new_session_id unless rescheduling, and for callback_note unless requesting later contact.',
        parameters: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: [
                'confirm',
                'cancel',
                'reschedule',
                'undecided',
                'request_recording',
                'request_callback',
              ],
            },
            new_session_id: {
              type: 'string',
              description:
                'Available event session ID, or empty unless rescheduling.',
            },
            callback_note: {
              type: 'string',
              description:
                'When the participant would prefer contact, or empty. Maximum 500 characters.',
            },
          },
          required: ['action', 'new_session_id', 'callback_note'],
        },
      },
      server: {
        ...server,
        method: 'POST',
        body: {
          action: '{{args.action}}',
          request_id: '{{tool_call_id}}',
          new_session_id: '{{args.new_session_id}}',
          callback_note: '{{args.callback_note}}',
        },
      },
    },
  ];
}
