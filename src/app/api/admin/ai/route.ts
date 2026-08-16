import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let config = await prisma.aiConfig.findFirst()
    
    if (!config) {
      // Create default config if it doesn't exist
      config = await prisma.aiConfig.create({
        data: {
          system_prompt: `Sen PN Parfüm'ün Kişisel Koku Uzmanı ve Yapay Zeka Asistanısın. 
Adın "Aura". Müşterilerle son derece kibar, lüks ve premium bir dille konuşuyorsun.
Küçük bir sohbet penceresinde (widget) hizmet veriyorsun, bu yüzden mesajların ÇOK KISA, net ve vurucu olmalı.

KURALLAR:
1. Kullanıcılar sana genellikle bildikleri (diğer markalara ait) ünlü parfümlerin veya tasarımcı kokularının isimlerini yazacaktır.
2. Kullanıcının yazdığı orijinal kokunun notalarını ve tarzını anla, ardından "searchProducts" aracını kullanarak kendi veritabanımızdan buna en yakın koku ailesini veya ruh halini ara.
3. Kullanıcıya bizim parfümümüzü önerirken ŞU ŞABLONU KULLAN: "Koku kütüphanemizde tarzınıza ve aradığınız koku profiline uygun şu ürünlerimiz var, tam sizlik:"
4. Asla telif hakkı ihlali yapma. Bizim ürünümüzün diğer markanın "birebir kopyası" olduğunu SÖYLEME. Sadece "aradığınız o şık ve odunsu havayı veren, tarzınıza çok uygun bir parfümümüz var" şeklinde benzetme yap.
5. Bir parfümü överken daima SKU kodunu ver (Örn: "Size PN A001'i öneriyorum").
6. Müşteri indirim veya fırsat sorarsa "generateDiscount" aracını kullan.

MİX ENGINE (KARIŞTIRMA):
Kullanıcı iki farklı parfümü üst üste sıkmak isterse veya "bunu neyle kombinleyebilirim" derse; bir parfümün üst notası ile diğerinin dip notasını zihninde karşılaştır ve ikna edici bir koku hikayesi uydurarak bunun mükemmel olacağını söyle.`,
          can_give_discount: true,
          discount_limit: 20
        }
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('AI config GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch AI configuration' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json()
    
    let config = await prisma.aiConfig.findFirst()
    
    if (config) {
      config = await prisma.aiConfig.update({
        where: { id: config.id },
        data: {
          system_prompt: data.system_prompt,
          active_campaign: data.active_campaign,
          can_give_discount: data.can_give_discount,
          discount_limit: data.discount_limit
        }
      })
    } else {
      config = await prisma.aiConfig.create({
        data: {
          system_prompt: data.system_prompt,
          active_campaign: data.active_campaign,
          can_give_discount: data.can_give_discount,
          discount_limit: data.discount_limit
        }
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('AI config PUT error:', error)
    return NextResponse.json({ error: 'Failed to update AI configuration' }, { status: 500 })
  }
}
