'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type QuickstartPreCallCardProps = {
  ended?: boolean;
  isLoading: boolean;
  error: string | null;
  onStartConversation: () => void;
};

export function QuickstartPreCallCard({
  isLoading,
  ended = false,
  error,
  onStartConversation,
}: QuickstartPreCallCardProps) {
  return (
    <div
      className="mx-auto flex w-[min(92vw,26.25rem)] animate-fade-up flex-col items-center rounded-[20px] border border-[#2b2b2b] px-10 py-10 text-center shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
      style={{
        backgroundImage:
          'linear-gradient(164.988deg, rgba(54,54,54,0.2) 1.0596%, rgba(0,0,0,0) 96.089%), linear-gradient(90deg, rgb(16,16,16) 0%, rgb(16,16,16) 100%)',
      }}
    >
      <span className="mb-4 text-xs font-medium tracking-wide text-white/60">SCENARIO 04</span>
      <h1 className="text-[28px] font-medium leading-[1.2] text-white">
        Event Reminder Assistant
      </h1>
      <p className="mt-[14px] text-sm font-medium leading-6 text-white/70">
        Talk with Riley about your upcoming webinar. Confirm attendance, explore another session, or ask how to join.
      </p>

      <Button
        onClick={onStartConversation}
        disabled={isLoading}
        className="mt-8 min-h-10 h-auto py-3 whitespace-normal w-full rounded-lg border border-primary bg-primary text-sm font-medium text-black hover:border-white hover:bg-white hover:text-black disabled:hover:border-primary disabled:hover:bg-primary disabled:hover:text-black"
        aria-label={
          isLoading
            ? 'Connecting to Riley…'
            : 'Start event reminder'
        }
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting to Riley…
          </>
        ) : (
          ended ? 'Start another reminder' : 'Start event reminder'
        )}
      </Button>
      <p className="mt-5 text-xs leading-5 text-white/60">Speak as Alex Morgan using an example invitation. Recorded responses remain available below for CSV download after ending.</p>
      {ended && <p className="mt-3 text-xs text-white/70">Your last recorded response is available below. Download a copy before leaving.</p>}
      {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
}
