import type { ScenarioPresentation } from '@/types/presentation';
export type { ScenarioPresentation } from '@/types/presentation';

export const presentation: ScenarioPresentation = {
  "id": "04-event-confirmation",
  "name": "Event Reminder Assistant",
  "purpose": "Event plans and registration response",
  "headline": [
    "Confirm your plans."
  ],
  "summary": "Review the event with Riley and record your attendance plans when tools are connected.",
  "featuresHeading": "Beyond starter",
  "features": [
    {
      "emoji": "📅",
      "title": "Event & session details"
    },
    {
      "emoji": "✅",
      "title": "Registration response"
    },
    {
      "emoji": "📥",
      "title": "Download your result"
    }
  ],
  "builtWith": [
    "Agora Conversational AI",
    "Agents SDK",
    "Next.js"
  ],
  "startLabel": "Start event reminder",
  "boundaryShort": "Temporary registration responses. No attendance tracking, email or scheduled callback.",
  "outcomes": [
    {
      "id": "reviewed",
      "label": "I reviewed my event plans"
    },
    {
      "id": "needs-help",
      "label": "I need more help"
    }
  ],
  "developer": {
    "sourceUrl": "https://github.com/AgoraIO-Conversational-AI/agent-quickstart-nextjs",
    "runCommand": "pnpm install\nagora login\nagora project use <your-project>\nagora project env write .env.local\npnpm dev",
    "skillsCommand": "npx skills add github:AgoraIO/skills",
    "assistantPrompt": "Use Agora Skills to work in the existing 04-event-confirmation scenario checkout. Preserve the working Agora session lifecycle and business contracts. Help me adapt its business data and assistant instructions for my workflow.",
    "docsUrl": "https://docs.agora.io/en/ai/build/build-server-client",
    "sdkUrl": "https://www.npmjs.com/package/agora-agents",
    "consoleUrl": "https://console.agora.io/",
    "cliUrl": "https://github.com/AgoraIO/cli",
    "skillsUrl": "https://github.com/AgoraIO/skills",
    "extensionPoints": [
      {
        "title": "Change assistant instructions",
        "path": "lib/agent-config.ts"
      },
      {
        "title": "Choose models and voice",
        "path": "app/api/invite-agent/route.ts"
      },
      {
        "title": "Adapt scenario UI content",
        "path": "lib/presentation.ts"
      }
    ]
  }
};

export function getScenarioPresentation(): ScenarioPresentation {
  return presentation;
}
