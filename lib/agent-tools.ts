import type { LlmTool } from 'agora-agents';

// Business integrations are inactive in this first version, including when old environment variables are set.
export function getScenarioTools(..._inactiveOptions: unknown[]): LlmTool[] { return []; }
export function getToolBaseUrl(..._inactiveOptions: unknown[]): null { return null; }
