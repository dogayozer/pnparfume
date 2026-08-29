'use client'

import { useEffect } from 'react'

// Kutuların üzerine ZATEN basılmış QR kod https://pnparfume.com/#sales-channels
// adresini kodluyor (muhtemelen QR üretilirken kullanılan eski/varsayılan bir
// bağlantı) — kutular basıldığı için QR'ı değiştiremiyoruz. #sales-channels bir
// URL fragment olduğundan sunucu bunu hiç görmez (istek header'ında gitmez), o
// yüzden bu yönlendirme yalnızca tarayıcıda, istemci tarafında yapılabilir. Ana
// sayfaya (kök domain, QR'ın gerçekten indiği yer) bu bileşen monte edilip QR
// okutan her ziyaretçi gerçek "Hoş Geldin" sayfasına (/hosgeldin) yönlendiriliyor.
export default function QrHashRedirect() {
  useEffect(() => {
    if (window.location.hash === '#sales-channels') {
      window.location.replace('/hosgeldin')
    }
  }, [])

  return null
}
