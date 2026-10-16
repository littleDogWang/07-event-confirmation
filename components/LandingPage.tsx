'use client';

import { useState, useRef, Suspense, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { EventSnapshot } from '@/scenarios/04-event-confirmation/types';
import type { RTMClient } from 'agora-rtm';
import type {
  AgoraTokenData,
  ClientStartRequest,
  AgentResponse,
  AgoraRenewalTokens,
} from '../types/conversation';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSkeleton } from './LoadingSkeleton';
import { QuickstartPreCallCard } from './QuickstartPreCallCard';

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

const sessionEndpoint = '/api/scenarios/04-event-confirmation/sessions';

export default function LandingPage() {
  const [result, setResult] = useState<EventSnapshot | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setSyncError] = useState<string | null>(null);
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
      setSyncError(null);
      setAgoraData({ ...tokenData, agentId: startedAgent!.agent_id });
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

  return (
    <div className="relative flex h-dvh min-h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Hero shell: either shows the pre-call CTA or swaps in the live conversation experience. */}
      <div
        className={`flex min-h-0 flex-1 flex-col ${
          showConversation
            ? 'items-stretch justify-start'
            : 'items-center justify-center'
        }`}
      >
        <div
          className={`z-10 flex min-h-0 flex-1 flex-col ${
            showConversation
              ? 'h-full w-full max-w-none items-stretch gap-0 px-0 text-left'
              : 'w-full max-w-none items-center justify-center px-4 text-center'
          }`}
        >
          {!showConversation ? (
            <QuickstartPreCallCard
              isLoading={isLoading}
              error={error}
              onStartConversation={handleStartConversation}
            />
          ) : agoraData && rtmClient ? (
            <>
              {/* Browser-only conversation mount: RTC provider, error boundary, and lazy-loaded call UI. */}
              <Suspense fallback={<LoadingSkeleton />}>
                <ErrorBoundary>
                  <AgoraProvider>
                    <ConversationComponent
                      agoraData={agoraData}
                      rtmClient={rtmClient}
                      onTokenWillExpire={handleTokenWillExpire}
                      onEndConversation={finishReview}
                    />
                  </AgoraProvider>
                </ErrorBoundary>
              </Suspense>
            </>
          ) : (
            /* Fallback if session bootstrap partially succeeded but required state is missing. */
            <p className="text-sm text-muted-foreground">
              Failed to load conversation data.
            </p>
          )}
        </div>
      </div>

      {/* Persistent attribution footer for the pre-call and in-call views. */}
      <footer className="fixed bottom-0 right-0 z-40 py-4 pr-4 md:py-6 md:pr-6">
        <div className="flex items-center justify-end gap-2 text-muted-foreground">
          <span className="text-xs font-medium tracking-wide uppercase">
            Powered by
          </span>
          <a
            href="https://agora.io/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
            aria-label="Visit Agora's website"
          >
            <Image
              src="/agora-logo-rgb-blue.svg"
              alt="Agora"
              width={86}
              height={24}
              priority
              className="h-6 w-auto hover:opacity-80 transition-opacity translate-y-1"
            />
            <span className="sr-only">Agora</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
