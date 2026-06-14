import type { Renovation } from '@/types'

export const RENOVATION_TEMPLATES: Omit<Renovation, 'level'>[] = [
  {
    id: 'stage',
    name: '说书台',
    maxLevel: 5,
    baseCost: 80,
    bonusReputation: 3,
    bonusComfort: 0.05,
    description: '精美的说书台能让故事更添感染力',
    emoji: '🎭',
  },
  {
    id: 'seats',
    name: '座椅档次',
    maxLevel: 5,
    baseCost: 60,
    bonusReputation: 2,
    bonusComfort: 0.08,
    description: '舒适的座椅让客人久坐不累',
    emoji: '🪑',
  },
  {
    id: 'lanterns',
    name: '灯笼装饰',
    maxLevel: 5,
    baseCost: 40,
    bonusReputation: 2,
    bonusComfort: 0.04,
    description: '精致灯笼营造温馨氛围',
    emoji: '🏮',
  },
  {
    id: 'calligraphy',
    name: '字画悬挂',
    maxLevel: 5,
    baseCost: 100,
    bonusReputation: 4,
    bonusComfort: 0.03,
    description: '名人字画提升茶楼品味',
    emoji: '🖼️',
  },
  {
    id: 'tea_counter',
    name: '茶柜陈设',
    maxLevel: 5,
    baseCost: 70,
    bonusReputation: 2,
    bonusComfort: 0.06,
    description: '整洁的茶柜彰显专业',
    emoji: '🫖',
  },
  {
    id: 'garden',
    name: '庭院景致',
    maxLevel: 5,
    baseCost: 120,
    bonusReputation: 5,
    bonusComfort: 0.05,
    description: '亭台楼阁、假山流水，尽显雅致',
    emoji: '🌳',
  },
]

export function initRenovations(): Renovation[] {
  return RENOVATION_TEMPLATES.map((r) => ({ ...r, level: 1 }))
}

export function getUpgradeCost(reno: Renovation): number {
  return Math.floor(reno.baseCost * Math.pow(1.6, reno.level - 1))
}
