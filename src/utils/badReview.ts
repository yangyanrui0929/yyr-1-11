import type { Customer, CalcResult } from '@/types'

export function calcBadReview(
  customers: Customer[],
  reputation: number
): CalcResult {
  const details: Record<string, number> = {}

  const unsatisfied = customers.filter((c) => c.satisfaction < 40)
  const unsatisfiedRate = customers.length > 0 ? unsatisfied.length / customers.length : 0
  details['不满意人数'] = unsatisfied.length
  details['不满意率'] = Math.round(unsatisfiedRate * 100)

  let socialSum = 0
  for (const c of unsatisfied) {
    socialSum += c.socialInfluence
  }
  details['社交影响力总和'] = socialSum

  const repProtect = Math.round((100 - reputation) * 0.1)
  details['声望保护减免'] = -repProtect

  const basePenalty = Math.round(unsatisfiedRate * socialSum * 3)
  const value = Math.max(0, basePenalty - repProtect)
  details['声望损失值'] = value

  return { value, details }
}

export function calcBadReviewGold(customers: Customer[]): number {
  const unsatisfied = customers.filter((c) => c.satisfaction < 40)
  return unsatisfied.reduce((s, c) => s + Math.round(c.wealth * 0.05), 0)
}
