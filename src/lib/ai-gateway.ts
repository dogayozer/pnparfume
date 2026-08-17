import { google } from '@ai-sdk/google';
import { createDeepSeek } from '@ai-sdk/deepseek';

// Initialize DeepSeek (will only be used if API key is present)
const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY || 'dummy_key',
});

export function getAIModel() {
  if (process.env.DEEPSEEK_API_KEY) {
    return deepseek('deepseek-chat');
  }
  return google('gemini-3.7-flash');
}
