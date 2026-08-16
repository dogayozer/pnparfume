import 'dotenv/config'
import { prisma } from './src/lib/prisma'

async function main() {
  const rules = [
    { rule_key: 'SHIPPING_COST', rule_value: 100, description: 'Standart kargo ücreti (Paydaş ekonomisi indirimi için)' },
    { rule_key: 'AFFILIATE_COMMISSION_PCT', rule_value: 15, description: 'Influencer satış komisyon yüzdesi' },
    { rule_key: 'B2B_SAMPLE_REWARD_PER_ORDER', rule_value: 5, description: 'B2B satıcısının getirdiği 1 sipariş başına kazandığı ücretsiz tester sayısı' },
    { rule_key: 'REFERRAL_REWARD_NEW', rule_value: 150, description: 'Davetle gelen yeni üyenin kazandığı TL indirim' },
    { rule_key: 'REFERRAL_REWARD_EXISTING', rule_value: 200, description: 'Davet eden üyenin kazandığı TL indirim' },
    { rule_key: 'EXTRA_ESSENCE_PRICE', rule_value: 200, description: 'Sepette %20 fazla esans opsiyonunun fiyatı' },
  ]

  console.log("Senaryolar veritabanına ekleniyor...")
  for (const rule of rules) {
    await prisma.scenarioRule.upsert({
      where: { rule_key: rule.rule_key },
      update: {},
      create: rule,
    })
    console.log(`- ${rule.rule_key} eklendi.`)
  }
  console.log("İşlem tamamlandı.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
