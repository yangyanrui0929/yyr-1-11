import type { Story, StoryBranch, CalcResult, StoryRecord } from '@/types'

export function calcStoryHeat(
  story: Story,
  branch: StoryBranch,
  history: StoryRecord[],
  reputation: number
): CalcResult {
  const details: Record<string, number> = {}

  const baseHeat = story.heat
  details['基础热度'] = baseHeat

  const branchModifier = branch.heatModifier
  details['分支加成'] = branchModifier

  const sameStory = history.filter((h) => h.storyId === story.id)
  let serialBonus = 0
  if (sameStory.length > 0) {
    const recent = sameStory.slice(-3)
    const avgSat = recent.reduce((s, r) => s + r.avgSatisfaction, 0) / recent.length
    serialBonus = Math.round(avgSat * 0.15)
  }
  details['连载加成'] = serialBonus

  const repBonus = Math.round(reputation * 0.3)
  details['声望加成'] = repBonus

  const value = Math.min(100, baseHeat + branchModifier + serialBonus + repBonus)
  details['最终值'] = value

  return { value, details }
}
