import type { CustomerTemplate, Customer } from '@/types'

export const CUSTOMER_TEMPLATES: CustomerTemplate[] = [
  {
    type: '书生',
    name: '书生',
    preferenceTags: ['爱情', '才子佳人', '历史', '婉约', '诗词'],
    generosity: 3,
    patience: 5,
    baseWealth: 30,
    socialInfluence: 3,
    emoji: '📚',
  },
  {
    type: '商贾',
    name: '商人',
    preferenceTags: ['历史', '谋略', '世情', '讽刺'],
    generosity: 5,
    patience: 3,
    baseWealth: 100,
    socialInfluence: 4,
    emoji: '💰',
  },
  {
    type: '妇人',
    name: '夫人',
    preferenceTags: ['爱情', '婉约', '神怪', '才子佳人'],
    generosity: 4,
    patience: 4,
    baseWealth: 50,
    socialInfluence: 3,
    emoji: '👩',
  },
  {
    type: '江湖人',
    name: '侠客',
    preferenceTags: ['武侠', '热血', '江湖', '冒险', '义气'],
    generosity: 2,
    patience: 2,
    baseWealth: 20,
    socialInfluence: 5,
    emoji: '⚔️',
  },
  {
    type: '官员',
    name: '大人',
    preferenceTags: ['历史', '谋略', '官场', '世情'],
    generosity: 5,
    patience: 3,
    baseWealth: 150,
    socialInfluence: 5,
    emoji: '🎩',
  },
  {
    type: '平民',
    name: '百姓',
    preferenceTags: ['神怪', '悬疑', '热血', '冒险', '励志'],
    generosity: 2,
    patience: 4,
    baseWealth: 15,
    socialInfluence: 2,
    emoji: '👤',
  },
]

export function generateRandomCustomers(count: number): Customer[] {
  const result: Customer[] = []
  for (let i = 0; i < count; i++) {
    const tpl = CUSTOMER_TEMPLATES[Math.floor(Math.random() * CUSTOMER_TEMPLATES.length)]
    result.push({
      id: `c-${Date.now()}-${i}`,
      type: tpl.type,
      name: `${tpl.name}${['甲', '乙', '丙', '丁', '戊', '己'][i % 6]}`,
      preferenceTags: [...tpl.preferenceTags],
      generosity: tpl.generosity + Math.floor(Math.random() * 2) - 1,
      patience: tpl.patience + Math.floor(Math.random() * 2) - 1,
      wealth: tpl.baseWealth + Math.floor(Math.random() * tpl.baseWealth * 0.5),
      socialInfluence: tpl.socialInfluence,
      seatId: null,
      satisfaction: 50,
      emoji: tpl.emoji,
    })
  }
  return result
}
