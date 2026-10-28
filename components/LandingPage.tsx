'use client';

import { type ReactNode } from 'react';
import { EMPTY_INSPECTION, type InspectionSnapshot } from '@/lib/inspection';
import type { AgentSignalSnapshot } from '@/lib/agent-signal';
import { getScenarioPresentation } from '@/lib/presentation';
import { ScenarioIdentity } from './ScenarioIdentity';
import { ConversationWorkspace } from './ConversationWorkspace';
import { QuickstartPreCallCard, ScenarioEntryDialog } from './QuickstartPreCallCard';
import { ScenarioInspector } from './ScenarioInspector';
import { DeveloperGuide } from './DeveloperGuide';
import { ConversationPanel } from './agent-ui/conversation-panel';
import { Button } from './ui/button';

import { useState, useRef, Suspense, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { CalendarDays } from 'lucide-react';
import { EventResultCard } from './EventResultCard';
import {
  formatEventTime,
  type EventSnapshot,
} from '@/lib/event-confirmation/types';
import type { RTMClient } from 'agora-rtm';
import type {
  AgoraTokenData,
  ClientStartRequest,
  AgentResponse,
  AgoraRenewalTokens,
} from '../types/conversation';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSkeleton } from './LoadingSkeleton';

// Dynamically import the ConversationComponent with ssr disabled
const ConversationComponent = dynamic(() => import('./ConversationComponent'), {
  ssr: false,
});

// Dynamically import AgoraRTCProvider (browser-only).
// The AgoraVoiceAI toolkit is initialized inside ConversationComponent after
// the RTC join succeeds, so this wrapper only needs to provide the RTC client.
const AgoraProvider = dynamic(
  async () => {
    const { AgoraRTCProvider, default: AgoraRTC } =
      await import('agora-rtc-react');
    return {
      default: function AgoraProviders({
        children,
      }: {
        children: React.ReactNode;
      }) {
        // useRef persists across StrictMode's simulated unmount/remount, so only
        // one RTC client is ever created per session (useMemo creates two in StrictMode).
        const clientRef = useRef<ReturnType<
          typeof AgoraRTC.createClient
        > | null>(null);
        if (!clientRef.current) {
          clientRef.current = AgoraRTC.createClient({
            mode: 'rtc',
            codec: 'vp8',
          });
        }
        return (
          <AgoraRTCProvider client={clientRef.current}>
            {children}
          </AgoraRTCProvider>
        );
      },
    };
  },
  { ssr: false },
);

const sessionEndpoint = '/api/scenarios/07-event-confirmation/sessions';

export default function LandingPage() {
  const [result, setResult] = useState<EventSnapshot | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const ui = useScenarioUi();
  const [recordingAvailable, setRecordingAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [agoraData, setAgoraData] = useState<AgoraTokenData | null>(null);
  const [rtmClient, setRtmClient] = useState<RTMClient | null>(null);
  const voiceStartPending = useRef(false);
  const operationPending = useRef(false);

  const acceptResult = useCallback((next: EventSnapshot) => {
    setResult((current) =>
      current &&
      current.sessionId === next.sessionId &&
      next.revision >= current.revision
        ? { ...next, ended: current.ended || next.ended }
        : current,
    );
  }, []);

  const reviewId = result?.sessionId;
  const reviewEnded = result?.ended;

  // Poll only while voice tools can update this registration. Keep a browser copy after ending.
  useEffect(() => {
    if (!reviewId || !showConversation || reviewEnded) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const sessionId = reviewId;
    const refresh = async () => {
      try {
        const response = await fetch(sessionEndpoint, {
          headers: { 'x-event-session': sessionId },
          cache: 'no-store',
        });
        if (!response.ok)
          throw new Error('Your response could not be refreshed.');
        const data = await response.json();
        if (!cancelled) {
          acceptResult(data.result);
          setSyncError(null);
        }
      } catch {
        if (!cancelled) setSyncError('Your response could not be refreshed.');
      }
      if (!cancelled) timer = setTimeout(refresh, 1200);
    };
    void refresh();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reviewId, reviewEnded, showConversation, acceptResult]);

  const handleStartConversation = async () => {
    if (
      voiceStartPending.current ||
      operationPending.current ||
      showConversation
    )
      return;
    voiceStartPending.current = true;
    setIsLoading(true);
    ui.start();
    setError(null);
    let startedAgent: AgentResponse | null = null;
    let startedRtm: RTMClient | null = null;
    try {
      const reviewResponse = await fetch(sessionEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create' }),
      });
      if (!reviewResponse.ok)
        throw new Error(
          'Could not start the event reminder. Please try again.',
        );
      const reviewData = await reviewResponse.json();
      const nextResult: EventSnapshot = reviewData.result;
      const tokenResponse = await fetch('/api/generate-agora-token');
      if (!tokenResponse.ok)
        throw new Error('Could not connect to Riley. Please try again.');
      const tokenData: AgoraTokenData = await tokenResponse.json();
      const inviteResponse = await fetch('/api/invite-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requester_id: tokenData.uid,
          channel_name: tokenData.channel,
          event_session_id: nextResult.sessionId,
        } as ClientStartRequest),
      });
      if (!inviteResponse.ok)
        throw new Error(
          'Could not start the event reminder. Please try again.',
        );
      startedAgent = await inviteResponse.json();
      const { default: AgoraRTM } = await import('agora-rtm');
      startedRtm = new AgoraRTM.RTM(
        process.env.NEXT_PUBLIC_AGORA_APP_ID!,
        tokenData.uid,
      );
      await startedRtm.login({ token: tokenData.token });
      await startedRtm.subscribe(tokenData.channel);
      setResult(nextResult);
      setRecordingAvailable(startedAgent!.recording_available === true);
      setSyncError(null);
      setAgoraData({ ...tokenData, agentId: startedAgent!.agent_id, startedAt: Date.now() });
      setRtmClient(startedRtm);
      setShowConversation(true);
    } catch (error) {
      await startedRtm?.logout().catch(() => {});
      if (startedAgent)
        await fetch('/api/stop-conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agent_id: startedAgent.agent_id }),
        }).catch(() => {});
      setError(
        error instanceof Error &&
          !(error instanceof TypeError) &&
          !(error instanceof SyntaxError)
          ? error.message
          : 'Voice assistance could not connect.',
      );
    } finally {
      setIsLoading(false);
      voiceStartPending.current = false;
    }
  };

  const handleTokenWillExpire = useCallback(
    async (uid: string): Promise<AgoraRenewalTokens> => {
      if (!agoraData) throw new Error('Missing active voice session');
      const [rtc, rtm] = await Promise.all([
        fetch(
          '/api/generate-agora-token?channel=' +
            encodeURIComponent(agoraData.channel) +
            '&uid=' +
            encodeURIComponent(uid),
        ),
        fetch(
          '/api/generate-agora-token?channel=' +
            encodeURIComponent(agoraData.channel) +
            '&uid=' +
            encodeURIComponent(agoraData.uid),
        ),
      ]);
      if (!rtc.ok || !rtm.ok) throw new Error('Could not renew voice session');
      return {
        rtcToken: (await rtc.json()).token,
        rtmToken: (await rtm.json()).token,
      };
    },
    [agoraData],
  );

  const finishReview = async () => {
    if (!result || operationPending.current || voiceStartPending.current)
      return;
    operationPending.current = true;
    setEnding(true);
    setError(null);
    try {
      if (showConversation && agoraData?.agentId) {
        const stopped = await fetch('/api/stop-conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agent_id: agoraData.agentId }),
        });
        if (!stopped.ok)
          throw new Error('Could not end the voice session. Please try again.');
      }
      const response = await fetch(sessionEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-event-session': result.sessionId,
        },
        body: JSON.stringify({ action: 'finish' }),
      });
      if (!response.ok)
        throw new Error(
          'Could not finish the reminder. Your last result is still available to download. Please try again.',
        );
      const data = await response.json();
      acceptResult(data.result);
      setSyncError(null);
      await rtmClient?.logout().catch(() => {});
      setRtmClient(null);
      setShowConversation(false);
      ui.end();
    } catch (error) {
      setError(
        error instanceof Error &&
          !(error instanceof TypeError) &&
          !(error instanceof SyntaxError)
          ? error.message
          : 'Could not finish the reminder. Please try again.',
      );
    } finally {
      setEnding(false);
      operationPending.current = false;
    }
  };

  const slot = result?.event.sessions.find(
    (item) => item.sessionId === result.registration.sessionId,
  );
  return (
    <ScenarioShell ui={ui} active={showConversation} loading={isLoading} error={error} disabled={false} onStart={handleStartConversation}
      business={<>{result && <EventResultCard result={result} syncError={syncError} />}</>}>
      {result && <details className="event-context"><summary><CalendarDays /><span>{result.event.title}</span><span className="event-context-time">{formatEventTime(slot!.startsAt)}</span></summary><div><p>{result.event.description}</p><p>{result.event.location} · {slot!.durationMinutes} minutes · {result.registration.participantName}</p><p>{result.event.joiningInstructions}</p><p>{result.event.recordingInfo}</p></div></details>}
          {!recordingAvailable && <p className="event-recording-notice" role="status">You can discuss the event with Riley. Registration changes cannot be recorded in this session.</p>}
      {error && <p className="demo-workspace-fallback" role="alert">{error}</p>}
      {showConversation && agoraData && rtmClient && <Suspense fallback={<LoadingSkeleton />}><ErrorBoundary><AgoraProvider>
        <ConversationComponent agoraData={agoraData} rtmClient={rtmClient} onTokenWillExpire={handleTokenWillExpire} onEndConversation={finishReview}
          onActivityChange={ui.setActivity} onInspectionChange={ui.setInspection} ending={ending}
           />
      </AgoraProvider></ErrorBoundary></Suspense>}
    </ScenarioShell>
  );
}


function useScenarioUi() {
  const [activity, setActivity] = useState<AgentSignalSnapshot>({ state: 'idle', micEnabled: false });
  const [inspection, setInspection] = useState<InspectionSnapshot>(EMPTY_INSPECTION);
  const [entryOpen, setEntryOpen] = useState(true);
  const [outcome, setOutcome] = useState('');
  const start = useCallback(() => {
    setActivity({ state: 'connecting', micEnabled: false });
    setInspection({ ...EMPTY_INSPECTION, lifecycle: 'starting', startedAt: Date.now() });
    setOutcome('');
    setEntryOpen(false);
  }, []);
  const end = useCallback(() => {
    setActivity({ state: 'ended', micEnabled: false });
    setInspection(previous => ({ ...previous, lifecycle: 'ended', endedAt: Date.now(), agentState: 'ended', micEnabled: false, transport: 'DISCONNECTED' }));
  }, []);
  return { activity, setActivity, inspection, setInspection, entryOpen, setEntryOpen, outcome, setOutcome, start, end };
}

type ScenarioUi = ReturnType<typeof useScenarioUi>;

function ScenarioShell({ ui, active, loading, error, disabled = false, onStart, children, business }: {
  ui: ScenarioUi;
  active: boolean;
  loading: boolean;
  error: string | null;
  disabled?: boolean;
  onStart: () => void;
  children: ReactNode;
  business?: ReactNode;
}) {
  const scenario = getScenarioPresentation();
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [buildOpen, setBuildOpen] = useState(false);
  const activity: AgentSignalSnapshot = !active && error
    ? { state: 'error', micEnabled: false }
    : loading ? { state: 'connecting', micEnabled: false } : ui.activity;
  const inspection: InspectionSnapshot = !active && error
    ? { ...ui.inspection, lifecycle: 'error', agentState: 'error', events: [...ui.inspection.events, { id: 'session-error', time: ui.inspection.startedAt ?? 0, kind: 'error', label: 'Session needs attention', detail: error }] }
    : ui.inspection;
  return (
    <div className="demo-shell">
      <ScenarioIdentity scenario={scenario} onInspect={() => setInspectorOpen(true)} onBuild={() => setBuildOpen(true)} />
      <ConversationWorkspace scenario={scenario} activity={activity} inspection={inspection}>
        {active ? children : inspection.lifecycle === 'ended' ? (
          <section className="demo-session demo-session-ended">
            <div className="demo-session-heading"><h2>Session ended.</h2></div>
            <ConversationPanel id="last-session-transcript" name={scenario.name} messages={inspection.messages} pending={false} voiceState="ended" className="demo-conversation" />
            <div className="demo-ended-actions">
              <Button disabled={disabled || loading} onClick={onStart}>Start again</Button>
            </div>
          </section>
        ) : (
          <QuickstartPreCallCard scenario={scenario} isLoading={loading} disabled={disabled} error={error} onStart={onStart} />
        )}
      </ConversationWorkspace>
      {business ? <section className="demo-business" aria-label={`${scenario.name} details`}>{business}</section> : null}
      <ScenarioEntryDialog scenario={scenario} open={ui.entryOpen && !active} onOpenChange={ui.setEntryOpen} isLoading={loading} disabled={disabled} error={error} sessionActive={active} onStart={onStart} />
      <ScenarioInspector scenario={scenario} snapshot={inspection} outcome={ui.outcome} onOutcomeChange={ui.setOutcome} open={inspectorOpen} onOpenChange={setInspectorOpen} />
      <DeveloperGuide scenario={scenario} open={buildOpen} onOpenChange={setBuildOpen} />
    </div>
  );
}
