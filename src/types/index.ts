export type Phase = 'day' | 'night'

export type Weather = '晴' | '云' | '雨' | '雪'

export type SnackCategory = '茶' | '小吃' | '点心'

export interface Snack {
  id: string
  name: string
  category: SnackCategory
  stock: number
  maxStock: number
  price: number
  cost: number
  quality: number
  emoji: string
}

export type SeatTier = '普通' | '雅座' | '贵宾'

export interface Seat {
  id: number
  x: number
  y: number
  tier: SeatTier
  occupied: boolean
}

export interface Renovation {
  id: string
  name: string
  level: number
  maxLevel: number
  baseCost: number
  bonusReputation: number
  bonusComfort: number
  description: string
  emoji: string
}

export interface StoryBranch {
  id: string
  title: string
  content: string
  tags: string[]
  heatModifier: number
}

export interface Story {
  id: string
  title: string
  tags: string[]
  heat: number
  branches: StoryBranch[]
  summary: string
}

export type CustomerType = '书生' | '商贾' | '妇人' | '江湖人' | '官员' | '平民'

export interface CustomerTemplate {
  type: CustomerType
  name: string
  preferenceTags: string[]
  generosity: number
  patience: number
  baseWealth: number
  socialInfluence: number
  emoji: string
}

export interface Customer {
  id: string
  type: CustomerType
  name: string
  preferenceTags: string[]
  generosity: number
  patience: number
  wealth: number
  socialInfluence: number
  seatId: number | null
  satisfaction: number
  emoji: string
}

export interface InterruptionOption {
  text: string
  satisfactionEffect: number
  reputationEffect: number
  goldEffect: number
}

export interface InterruptionEvent {
  id: string
  customerType: CustomerType
  content: string
  options: InterruptionOption[]
}

export type LedgerType = '收入' | '支出'

export interface LedgerRecord {
  day: number
  id: string
  type: LedgerType
  category: string
  amount: number
  note: string
  timestamp: number
}

export interface InterruptionRecord {
  id: string
  interruptionId: string
  customerType: CustomerType
  content: string
  chosenOptionText: string
  satisfactionEffect: number
  reputationEffect: number
  goldEffect: number
  timestamp: number
}

export interface GenealogyBranchRecord {
  day: number
  storyId: string
  branchId: string
  drivingCustomerTypes: CustomerType[]
  interruptionRecords: InterruptionRecord[]
  reputationTags: string[]
  audienceCount: number
  earnings: number
  avgSatisfaction: number
  avgSatisfactionByType: Partial<Record<CustomerType, number>>
}

export interface CustomerMood {
  type: CustomerType
  mood: number
  consecutiveNeglectDays: number
  lastCateredDay: number | null
}

export interface PreScheduledSegment {
  id: string
  storyId: string
  branchId: string
  order: number
}

export interface StoryRecord {
  day: number
  storyId: string
  branchId: string
  audienceCount: number
  earnings: number
  avgSatisfaction: number
}

export interface ReputationHistory {
  day: number
  value: number
  delta: number
  reason: string
}

export interface GameState {
  day: number
  phase: Phase
  gold: number
  reputation: number
  weather: Weather
  snacks: Snack[]
  seats: Seat[]
  renovations: Renovation[]
  customers: Customer[]
  currentStory: Story | null
  currentBranch: StoryBranch | null
  storyProgress: number
  availableStories: Story[]
  interruptions: InterruptionEvent[]
  currentInterruption: InterruptionEvent | null
  performanceActive: boolean
  ledger: LedgerRecord[]
  storyHistory: StoryRecord[]
  reputationHistory: ReputationHistory[]
  lastStoryDay: Record<string, number>
  storyScores: Record<string, number[]>
  isSettlement: boolean
  lastSettlement: SettlementResult | null
  genealogyRecords: GenealogyBranchRecord[]
  customerMoods: CustomerMood[]
  preScheduledSegments: PreScheduledSegment[]
  currentInterruptionRecords: InterruptionRecord[]
}

export interface SettlementResult {
  day: number
  audienceCount: number
  baseEarnings: number
  tasteMatchBonus: number
  seatViewBonus: number
  storyHeatBonus: number
  serialExpectBonus: number
  badReviewPenalty: number
  tips: number
  snackRevenue: number
  totalEarnings: number
  reputationDelta: number
  avgSatisfaction: number
}

export interface CalcResult {
  value: number
  details: Record<string, number>
}
