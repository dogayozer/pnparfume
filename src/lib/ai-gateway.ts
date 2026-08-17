import { google } from '@ai-sdk/google';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { fallback } from 'ai';

// Initialize DeepSeek (will only be used if API key is present)
const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY || 'dummy_key',
});

/**
 * Returns the best available AI model using a fallback strategy.
 * If Vercel AI Gateway is configured in the future, we can swap this
 * to a single gateway endpoint. For now, it uses native SDK fallbacks.
 *
 * Primary Model: DeepSeek V4 Flash (if API key exists) OR Gemini Flash (default)
 * Secondary Model: Gemini Pro (fallback for high demand)
 */
export function getAIModel() {
  const models = [];

  // 1. If DeepSeek is configured, prefer it for routine fast tasks (cheaper off-peak)
  if (process.env.DEEPSEEK_API_KEY) {
    models.push(deepseek('deepseek-chat')); // Standard DeepSeek v3/v4 model name
  }

  // 2. Primary / Default: Google Gemini Flash
  models.push(google('gemini-flash-latest'));

  // 3. Fallback: Google Gemini Pro (If Flash is overloaded, try Pro)
  models.push(google('gemini-pro-latest'));

  // Return a fallback chain. The AI SDK will try the first, and if it fails (e.g., 429), it will automatically try the next.
  return fallback(models);
}
