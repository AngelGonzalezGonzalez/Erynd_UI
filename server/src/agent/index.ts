import type { AgentProvider } from './provider.js';
import { ClaudeAgent } from './claude.js';
import { MockAgent } from './mock.js';

/** Pick the real agent when a key is present; otherwise the offline rules. */
export function makeAgent(): AgentProvider {
  const key = process.env.ANTHROPIC_API_KEY;
  if (key) {
    console.log('[agent] Claude Sonnet 4.6 provider enabled');
    return new ClaudeAgent(key);
  }
  console.log('[agent] no ANTHROPIC_API_KEY — using offline mock agent');
  return new MockAgent();
}
