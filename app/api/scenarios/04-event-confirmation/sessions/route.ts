import {
  createEventSession,
  getEventSession,
  finishEventSession,
} from '@/lib/event-confirmation/events';
import {
  requireEventSession,
  eventJson,
  eventFailure,
} from '@/lib/event-confirmation/http';
import { getToolBaseUrl } from '@/lib/agent-tools';

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    return eventJson({ result: getEventSession(requireEventSession(request)) });
  } catch (error) {
    return eventFailure(error);
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body?.action === 'create') {
      return eventJson(
        {
          result: createEventSession(),
          recordingAvailable: !!getToolBaseUrl(),
        },
        201,
      );
    }
    if (body?.action === 'finish') {
      return eventJson({
        result: finishEventSession(requireEventSession(request)),
      });
    }
    return eventJson({ error: 'invalid_session_action' }, 400);
  } catch (error) {
    return eventFailure(error);
  }
}
