# Agent Development Guide

This guide is for coding agents making changes in `event-reminder-assistant`.

## Shared scenario UI requirements

1. **Open the main page directly**: show the scenario explanation and task-specific start action inline. Do not add an introductory dialog, automatic welcome overlay, or Preview first step. Connecting, errors and retry feedback stay inline. Loading the page must not start a session or request microphone access.
2. **Keep the public scenario identity visible**: the public scenario name and short purpose remain visible on desktop and mobile from first load and throughout the session. The header and main heading use the same public name. Keep internal numeric IDs out of visible page and Build copy. Activity status must not replace the scenario name.
3. **Use our UIkit components**: adopt actual component source and accompanying theme/styles from [shczhen/agent-ui](https://github.com/shczhen/agent-ui), connected to real session data and actions. Preserve source provenance and RTC/RTM ownership.

Inspect desktop/mobile direct entry, reload and inline startup failure/retry states. Confirm there is no introductory overlay and that the main start control directly starts the existing session flow. Inspect actual screenshots before acceptance. Inspector, Build and the coach phrasebook open only on explicit user actions.

For transcript changes, verify desktop/mobile live text growth, hidden arrivals and showing the conversation again. Restore following only if it was active before hiding; preserve deliberate history reading and verify that Scroll to end resumes following.

This direct-entry rule applies to the base template and all scenarios. It supersedes earlier introductory-dialog requirements and per-scenario exceptions. Keep this self-contained section synchronized with the workspace SCENARIO_UI_RULES.md.

## U.S. scenario content

Use a United States setting for fictional business examples, UI copy, Agent context and sample data. Use U.S. cities and addresses, American English (`en-US`), USD for configured prices, and U.S. local dates and times. Use an explicit IANA time zone and the date-correct UTC offset, including daylight saving time; keep data, prompts, tools, exports and UI labels consistent. Do not introduce East Asian locations, regional currencies or time zones into scenario examples. Keep fictional data clearly distinguished from live business facts. Preserve original source citations and third-party license attribution accurately.

## Repository language

Use English for repository content, including documentation, code comments, UI copy and examples. Keep future additions and edits free of Chinese text.

## First-version scope

Discuss a webinar, attendance plans and questions about joining.

This first version is conversation-only. No business data lookup, external tools, database, record writes, saved results, or cross-session business history are available. Keep user-provided details only in the current conversation. Never claim an order, appointment, registration, feedback submission, callback, payment, shipment or other external action was created, saved or completed. Offer a verbal summary and explain the appropriate human next step instead. Do not request passwords, verification codes, payment details or unnecessary personal identifiers.

## Start here

Read [README](README.md) for setup and deployment, [architecture](ARCHITECTURE.md) for ownership, [the public recipe](RECIPE.md) and [scenario acceptance](docs/scenario/acceptance.md) for behavior and evidence boundaries.

Use Node.js 24 from .nvmrc and pnpm 9.15.9. Install with pnpm install --frozen-lockfile. Copy env.local.example to .env.local only when absent; preserve existing credentials. Run pnpm run doctor, pnpm run dev and pnpm run verify. Docker checks use pnpm run verify:docker separately.

## Ownership and runtime contracts

- LandingPage owns token/invite bootstrap, RTM, renewal, stop and current-page state. ConversationComponent owns guarded RTC/toolkit initialization and transcripts.
- Preserve RtcTokenBuilder.buildTokenWithRtm, matching RTC/RTM identities and RTM readiness before RTC/toolkit mount.
- Keep the isReady StrictMode guard and stable RTC client ref. useJoin owns leave, the microphone hook owns track cleanup and usePublish owns publication. Never manually close hook-owned tracks or disable StrictMode.
- Remap the toolkit local uid=0 sentinel; keep interrupted turns. Preserve deliberate transcript history reading and restore following across hide/show only when it was previously active.
- lib/agent-config.ts owns instructions and greeting; lib/prompt-context.ts owns concise conversation rules and business-local date/calendar context where present. lib/runtime-profile.ts owns non-secret provider defaults.
- lib/scenario-knowledge.ts supplies static public prompt reference; it is not a live customer, stock or booking service.
- Keep startup independent of business state. No business tools, saved results or persistent customer/learner history are available. Retired business requests return HTTP 410 where present.
- NEXT_PUBLIC_AGORA_APP_ID is public and required at build/runtime. Keep NEXT_AGORA_APP_CERTIFICATE and optional vendor keys server-only. Never log, commit or screenshot credentials.
- Sample token/start/stop endpoints are not production login or abuse controls. Provider retention is external to this source. Keep missing measurements unknown and Inspector outcomes manual.
- Keep Inspector, Build, adopted UIkit source, source/font licenses and Docker support.

## Prompt behavior contract — 2026-11-05

Keep `lib/agent-config.ts` as the prompt entry point. Use `lib/scenario-knowledge.ts` for public scenario material and `lib/prompt-context.ts` for concise conversation rules and business-local date/calendar context. Keep the source classification visible in the prompt: configured fictional business facts and static public references are not live customer records.

Answer supported questions and continue useful advice after identifying one unavailable action. Preserve one-question turns, corrected details, honest uncertainty and the conversation-only boundary. Do not reactivate retired business fixtures or tools while changing a prompt. Update the scenario guide and acceptance cases with behavior changes; run `pnpm run verify` and report real-model/voice acceptance separately.

## Public presentation ownership

`lib/presentation.ts` owns the single public `name`, purpose and summary. The header and main heading both render that name; `app/layout.tsx` derives browser metadata from it. There is no separate headline field. Internal IDs stay available for diagnostics and configuration, without being rendered as public identity text.

## Verification and maintenance

Run pnpm run verify for repository checks, lint, types, mocked API/startup, transcript/Inspector, scenario rules and production build. Keep synthetic checks, rendered UI, Docker and actual human speech evidence distinct.

Inspect actual desktop/mobile screenshots after visible changes, including direct entry and inline startup error/retry. Transcript changes also need live growth, hidden arrivals, paused history and Scroll to end checks.

Keep README, AGENTS, RECIPE, ARCHITECTURE and the affected scenario guide/checklist aligned with behavior. Contributor guidance is consolidated here.

## Git Conventions

### Commit messages — conventional commits

- **Format:** `type: description` or `type(scope): description`
- **Types:** `feat:` (new feature), `fix:` (bug fix), `chore:` (maintenance, version bumps), `test:` (test additions/changes), `docs:` (documentation)
- **Scoped variant:** `feat(scope):`, `fix(scope):` — e.g. `feat(api): add stop-conversation status flag`
- **Lowercase after prefix** — `feat: add feature`, not `feat: Add feature`
- **Present tense** — "add feature", not "added feature"
- **PR number appended** — `feat: add feature (#123)`

### Branch names

- **Format:** `type/short-description` — lowercase, hyphen-separated
- **Types match commit types:** `feat/`, `fix/`, `chore/`, `test/`, `docs/`
- **Examples:** `feat/agent-metrics`, `fix/transcript-uid`, `docs/progressive-disclosure`

### General rules

- **No AI tool names** — never mention claude, cursor, copilot, cody, aider, gemini, codex, chatgpt, or gpt-3/4 in commit messages or PR descriptions.
- **No Co-Authored-By trailers** — omit AI attribution lines.
- **No `--no-verify`** — let git hooks run normally.
- **No git config changes** — do not modify `user.name` or `user.email`.

Local implementation does not authorize a commit. A commit does not authorize a push or GitHub write; each requires explicit current-conversation authorization. Preserve unrelated local changes and never alter Git identity or bypass hooks.

## Usage FAQ contract

Keep FAQ in the upper-right header beside Inspector and Build. `components/ScenarioFaq.tsx` and `styles/faq.css` follow the Voice Shopping drawer pattern: closed on entry, right-side on desktop, full-width on mobile, internally scrollable, and keyboard accessible. Opening FAQ must not start a session or request microphone access. Keep answers consistent with this scenario’s conversation-only scope. Preserve the coach Phrasebook where present.
