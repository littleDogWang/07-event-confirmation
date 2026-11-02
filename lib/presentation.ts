import type { ScenarioPresentation } from '@/types/presentation';
export type { ScenarioPresentation } from '@/types/presentation';

export const presentation: ScenarioPresentation = {
  "id": "07-event-confirmation",
  "name": "Event Reminder Assistant",
  "purpose": "Scenario voice conversation",
  "headline": [
    "Confirm your plans."
  ],
  "summary": "Discuss a webinar, attendance plans and questions about joining.",
  "featuresHeading": "In this conversation",
  "features": [
    {
      "emoji": "💬",
      "title": "Webinar questions"
    },
    {
      "emoji": "🎙️",
      "title": "Attendance-plan discussion"
    },
    {
      "emoji": "📝",
      "title": "Verbal reminder recap"
    }
  ],
  "builtWith": [
    "Agora Conversational AI",
    "Agents SDK",
    "Next.js"
  ],
  "startLabel": "Start event reminder",
  "boundaryShort": "Conversation only. No registration updates, saved responses, emails or callbacks.",
  "outcomes": [
    {
      "id": "helpful",
      "label": "The conversation helped"
    },
    {
      "id": "needs-guidance",
      "label": "I need more guidance"
    }
  ],
  "developer": {
    "sourceUrl": "https://github.com/littleDogWang/07-event-confirmation",
    "runCommand": "pnpm install --frozen-lockfile\npnpm run doctor\npnpm run dev",
    "skillsCommand": "npx skills add github:AgoraIO/skills",
    "assistantPrompt": "Work in this existing 07-event-confirmation voice demo. Preserve Agora RTC/RTM lifecycle and the conversation-only first-version boundary. Adapt the assistant instructions and static public background without adding business tools, records, data APIs or persistence.",
    "docsUrl": "https://docs.agora.io/en/ai/build/build-server-client",
    "sdkUrl": "https://www.npmjs.com/package/agora-agents",
    "consoleUrl": "https://console.agora.io/",
    "cliUrl": "https://github.com/AgoraIO/cli",
    "skillsUrl": "https://github.com/AgoraIO/skills",
    "extensionPoints": [
      {
        "title": "Change the conversation",
        "path": "lib/agent-config.ts"
      },
      {
        "title": "Choose models and voice",
        "path": "lib/runtime-profile.ts"
      },
      {
        "title": "Adapt scenario UI copy",
        "path": "lib/presentation.ts"
      }
    ]
  }
};

export function getScenarioPresentation(): ScenarioPresentation { return presentation; }
