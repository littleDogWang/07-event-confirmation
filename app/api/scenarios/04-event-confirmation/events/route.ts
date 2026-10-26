import {
  getEventSession,
  updateRegistration,
} from '@/lib/event-confirmation/events';
import {
  requireEventSession,
  eventJson,
  eventFailure,
} from '@/lib/event-confirmation/http';

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
    const id = requireEventSession(request);
    const body = await request.json();
    return eventJson(
      updateRegistration(id, {
        action: body?.action,
        requestId: body?.request_id,
        newSessionId: body?.new_session_id,
        callbackNote: body?.callback_note,
      }),
    );
  } catch (error) {
    return eventFailure(error);
  }
}
