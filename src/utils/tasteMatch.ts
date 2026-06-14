import type { Customer, StoryBranch, CalcResult } from '@/types'

export function calcTasteMatch(customer: Customer, branch: StoryBranch): CalcResult {
  const details: Record<string, number> = {}
  const prefTags = customer.preferenceTags
  const storyTags = branch.tags

  let matchCount = 0
  for (const tag of prefTags) {
    if (storyTags.includes(tag)) {
      matchCount++
      details[`匹配_${tag}`] = 1
    }
  }

  const union = new Set([...prefTags, ...storyTags]).size
  const jaccard = union > 0 ? matchCount / union : 0

  const baseScore = Math.round(jaccard * 80)
  details['基础分'] = baseScore

  const generosityBonus = Math.min((customer.generosity - 1) * 5, 20)
  details['慷慨加成'] = generosityBonus

  const value = Math.min(100, baseScore + generosityBonus)
  details['最终值'] = value

  return { value, details }
}

export function calcAvgTasteMatch(customers: Customer[], branch: StoryBranch): CalcResult {
  if (customers.length === 0) return { value: 0, details: { '无客人': 0 } }

  const details: Record<string, number> = {}
  let sum = 0
  for (const c of customers) {
    const r = calcTasteMatch(c, branch)
    sum += r.value
    details[c.name] = r.value
  }
  const avg = Math.round(sum / customers.length)
  details['平均匹配度'] = avg
  return { value: avg, details }
}
