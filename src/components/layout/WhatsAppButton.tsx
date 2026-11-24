'use client';
import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

// Sağ alt köşede, ChatWidget'ın hemen üzerinde yer alan sabit WhatsApp sohbet butonu
export function WhatsAppButton() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    fetch('/api/site-flags').then(r => r.json()).then(d => setEnabled(!!d.whatsapp)).catch(() => {});
  }, []);
  if (!enabled) return null;
  const whatsappUrl =
    'https://wa.me/902127360990?text=Merhaba%2C%20PN%20Parf%C3%BCm%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile sohbet başlat (+90 212 736 09 90)"
      title="WhatsApp Destek (+90 212 736 09 90)"
      className="fixed bottom-24 right-4 md:bottom-24 md:right-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-3 shadow-lg hover:bg-[#1ebe5d] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#25D366]/60"
    >
      <MessageCircle size={22} className="shrink-0" />
      <span className="hidden sm:inline text-sm font-medium tracking-wide">
        WhatsApp
      </span>
    </a>
  );
}
