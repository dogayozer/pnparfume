import { prisma } from '@/lib/prisma'

export const DEFAULT_DEALER_DISCOUNT_PERCENT = 30

export async function getDealerDiscountPercent(): Promise<number> {
  const rule = await prisma.scenarioRule.findUnique({ where: { rule_key: 'DEALER_DISCOUNT_PERCENT' } })
  return rule && rule.is_active ? rule.rule_value : DEFAULT_DEALER_DISCOUNT_PERCENT
}
