# Event Reminder Assistant

The previous business implementation is retained as inactive source for a later version. It is not exposed by the conversation Agent or used by voice startup; its HTTP routes return 410.

Discuss a webinar, attendance plans and questions about joining.

## First-version scope

This first version is conversation-only. No business data lookup, external tools, database, record writes, saved results, or cross-session business history are available. Keep user-provided details only in the current conversation. Never claim an order, appointment, registration, feedback submission, callback, payment, shipment or other external action was created, saved or completed. Offer a verbal summary and explain the appropriate human next step instead. Do not request passwords, verification codes, payment details or unnecessary personal identifiers.

The application exposes only the token, Agent invite, stop and optional custom-LLM proxy routes. Business APIs are disabled and return HTTP 410; customer records, result stores and data workbenches are not used by the first version. Static public reference material is part of the prompt; it is not queried as a business service.

## Run it

Use Node.js 22+ and pnpm 9.15.9. Install with pnpm install --frozen-lockfile. Copy env.local.example to .env.local only when absent and fill the required values. Never overwrite an existing environment file.

| Variable | Required | Exposure |
| --- | --- | --- |
| `NEXT_PUBLIC_AGORA_APP_ID` | Yes | Public; build and runtime |
| `NEXT_AGORA_APP_CERTIFICATE` | Yes | Server runtime only |

~~~bash
pnpm run doctor
pnpm run dev
~~~

Open http://localhost:3000. The page opens directly with an inline welcome and persistent scenario header, without an introductory dialog. Starting voice requires the user to choose `Start event reminder` and grant microphone permission.

With a ready Agora CLI, the optional template-aware environment command is `agora quickstart env write . --template nextjs --project <your-project> --json`. Check CLI readiness before any configuration operation.

## Conversation

- What is the webinar about?
- I am not sure I can attend. Help me review my options.

Use the microphone, transcript and End conversation controls. Ask for a recap before ending; End conversation stops the session and does not request another model response. Inspector reflects current-call evidence and manually selected outcomes, not saved business results.

## Commands

- pnpm run doctor: check the local environment without printing secrets.
- pnpm run dev: start the local app.
- pnpm run verify: canonical repository, lint, types, mocked API, conversation-only, activity, Inspector, scenario and build checks.
- pnpm run build and pnpm run start: native production build and server.
- pnpm run verify:docker: separate container build/startup/token checks.

## Deployment

The browser uses Agora RTC for audio and RTM for transcript and Agent events. Next.js only signs credentials and starts/stops the managed Agent. No business session, data API, local file store or persistent application database is required. Native Node.js, Docker and a Next.js-compatible serverless deployment use the same conversation flow. Actual hosted voice acceptance remains a separate check.

Provide NEXT_PUBLIC_AGORA_APP_ID during the client build and at runtime. Keep NEXT_AGORA_APP_CERTIFICATE in server-only runtime configuration. No business callback origin, database, writable application volume or business session is needed.

### Docker

~~~bash
docker build --build-arg NEXT_PUBLIC_AGORA_APP_ID=<public-app-id> -t agora-scenario/07-event-confirmation .
docker run --rm -p 3000:3000 --env-file .env.local agora-scenario/07-event-confirmation
~~~

The image runs as a non-root user. Build and runtime App IDs must match. Do not place the certificate in a build argument. Docker and real hosted voice acceptance are separate from local verification.

## Architecture and customization

See [architecture](ARCHITECTURE.md), [the public recipe](RECIPE.md), [the internal contract](docs/ai/RECIPE.md) and [the scenario guide](docs/scenario/README.md). Edit lib/agent-config.ts for behavior, lib/presentation.ts for copy and lib/runtime-profile.ts for the non-secret provider settings.

## Limits and security

No business data is queried or saved by this application. Current-call transcript and Inspector state are held in the page and disappear on refresh. This does not describe the retention policies of external voice/model providers. Sample token/start/stop endpoints are not production login or abuse controls; configure appropriate public-demo access and usage limits before a public release.

Keep certificates and any optional custom-LLM credentials server-only. Report security issues privately to security@agora.io. Real speech, model quality and public hosting have not been established by mocked checks.

## Attribution

Derived from [the official Agora Next.js voice quickstart](https://github.com/AgoraIO-Conversational-AI/agent-quickstart-nextjs). Retain [the license](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md).

## Prompt guidance update — 2026-11-05

The scenario now includes task-specific follow-ups, grounded recommendations and a business-local date calendar. Public reference material lives in `lib/scenario-knowledge.ts`; conversation/date rules live in `lib/prompt-context.ts`. Configured scenario reference, explicitly separate from live business records. No business tool or record-saving capability is enabled.

See [the updated scenario guide](docs/scenario/README.md) and [multi-turn acceptance cases](docs/scenario/acceptance.md). `pnpm run verify` covers local contracts, calendar regressions and build checks; actual model and voice quality require separate real conversations.
