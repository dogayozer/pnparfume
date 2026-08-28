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
  // Maliyet optimizasyonu: gemini-3.1-flash-lite, Google'ın kendi dokümantasyonunda
  // "en maliyet-etkin Gemini modeli" olarak tanımlanıyor — gemini-3.7-flash'e göre
  // önemli ölçüde daha ucuz. (gemini-2.5-flash-lite daha da ucuz ama 16 Ekim 2026'da
  // emekliye ayrılıyor, canlı sistem için tercih edilmedi.) Canlıya almadan önce
  // güncel fiyatı https://ai.google.dev/gemini-api/docs/pricing adresinden teyit edin.
  return google('gemini-3.1-flash-lite');
}
