import type { CalcResult, StoryRecord } from '@/types'

export function calcSerialExpect(
  storyId: string,
  day: number,
  lastStoryDay: Record<string, number>,
  storyScores: Record<string, number[]>
): CalcResult {
  const details: Record<string, number> = {}

  const lastDay = lastStoryDay[storyId]
  let gapBonus = 0
  if (lastDay !== undefined) {
    const gap = day - lastDay
    if (gap === 0) {
      gapBonus = 20
    } else if (gap <= 2) {
      gapBonus = Math.round(30 - gap * 5)
    } else if (gap <= 7) {
      gapBonus = Math.max(0, 20 - (gap - 2) * 2)
    } else {
      gapBonus = Math.max(0, 10 - (gap - 7))
    }
    details['间隔天数'] = gap
  } else {
    gapBonus = 50
    details['新故事新鲜感'] = 50
  }
  details['间隔/新鲜加成'] = gapBonus

  const scores = storyScores[storyId] || []
  let historyBonus = 0
  if (scores.length > 0) {
    const avg = scores.reduce((s, x) => s + x, 0) / scores.length
    historyBonus = Math.round(avg * 0.4)
    details['历史均分'] = Math.round(avg)
  }
  details['历史口碑加成'] = historyBonus

  const value = Math.min(100, gapBonus + historyBonus)
  details['最终值'] = value

  return { value, details }
}
