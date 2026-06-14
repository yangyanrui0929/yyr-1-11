import type { Seat } from '@/types'

export const GRID_COLS = 6
export const GRID_ROWS = 4
export const STAGE_POS = { x: 3, y: 0 }

export function initSeats(): Seat[] {
  const seats: Seat[] = []
  let id = 1
  const layouts: { x: number; y: number; tier: Seat['tier'] }[] = [
    { x: 2, y: 1, tier: '贵宾' },
    { x: 3, y: 1, tier: '贵宾' },
    { x: 4, y: 1, tier: '贵宾' },
    { x: 1, y: 2, tier: '雅座' },
    { x: 2, y: 2, tier: '雅座' },
    { x: 3, y: 2, tier: '雅座' },
    { x: 4, y: 2, tier: '雅座' },
    { x: 5, y: 2, tier: '雅座' },
    { x: 0, y: 3, tier: '普通' },
    { x: 1, y: 3, tier: '普通' },
    { x: 2, y: 3, tier: '普通' },
    { x: 3, y: 3, tier: '普通' },
    { x: 4, y: 3, tier: '普通' },
    { x: 5, y: 3, tier: '普通' },
  ]
  for (const l of layouts) {
    seats.push({ id: id++, x: l.x, y: l.y, tier: l.tier, occupied: false })
  }
  return seats
}

export const SEAT_PRICE_MULTIPLIER: Record<Seat['tier'], number> = {
  普通: 1,
  雅座: 1.8,
  贵宾: 3,
}
