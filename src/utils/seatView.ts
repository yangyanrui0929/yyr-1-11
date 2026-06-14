import type { Seat, Renovation, CalcResult } from '@/types'
import { STAGE_POS } from '@/data/seats'

export function calcSeatView(seat: Seat, renovations: Renovation[]): CalcResult {
  const details: Record<string, number> = {}

  const dx = seat.x - STAGE_POS.x
  const dy = seat.y - STAGE_POS.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  const distScore = Math.max(0, Math.round(100 - distance * 20))
  details['距离分'] = distScore

  const angle = Math.abs(Math.atan2(dy, dx))
  const anglePenalty = Math.round(Math.abs(angle - Math.PI / 2) * 10)
  const angleScore = Math.max(0, 100 - anglePenalty)
  details['角度分'] = angleScore

  const tierBonus = seat.tier === '贵宾' ? 20 : seat.tier === '雅座' ? 10 : 0
  details['座位等级加成'] = tierBonus

  let comfortBonus = 0
  for (const r of renovations) {
    comfortBonus += r.level * r.bonusComfort * 100
  }
  comfortBonus = Math.round(comfortBonus)
  details['装修舒适加成'] = comfortBonus

  const raw = distScore * 0.5 + angleScore * 0.2 + tierBonus + comfortBonus
  const value = Math.min(100, Math.round(raw))
  details['最终值'] = value

  return { value, details }
}

export function calcAvgSeatView(seats: Seat[], renovations: Renovation[]): CalcResult {
  const occupied = seats.filter((s) => s.occupied)
  if (occupied.length === 0) return { value: 0, details: { '无客人入座': 0 } }

  const details: Record<string, number> = {}
  let sum = 0
  for (const s of occupied) {
    const r = calcSeatView(s, renovations)
    sum += r.value
    details[`座位${s.id}(${s.tier})`] = r.value
  }
  const avg = Math.round(sum / occupied.length)
  details['平均视野'] = avg
  return { value: avg, details }
}
