import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  GameState,
  Weather,
  Snack,
  Seat,
  Customer,
  Story,
  StoryBranch,
  InterruptionEvent,
  InterruptionOption,
  LedgerRecord,
  StoryRecord,
  ReputationHistory,
  Renovation,
  GenealogyBranchRecord,
  CustomerMood,
  PreScheduledSegment,
  InterruptionRecord,
  CustomerType,
} from '@/types'
import { STORIES } from '@/data/stories'
import { initSnacks } from '@/data/snacks'
import { initSeats } from '@/data/seats'
import { initRenovations, getUpgradeCost } from '@/data/renovations'
import { INTERRUPTIONS } from '@/data/interruptions'
import { CUSTOMER_TEMPLATES, generateRandomCustomers } from '@/data/customers'
import { calcSettlement } from '@/utils/settlement'

const WEATHERS: Weather[] = ['晴', '晴', '晴', '云', '云', '雨', '雪']

function randomWeather(): Weather {
  return WEATHERS[Math.floor(Math.random() * WEATHERS.length)]
}

function pickRandomStories(count: number): Story[] {
  const pool = [...STORIES]
  const result: Story[] = []
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    result.push(pool.splice(idx, 1)[0])
  }
  return result
}

function uid(): string {
  return `r-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const initialState: GameState = {
  day: 1,
  phase: 'day',
  gold: 200,
  reputation: 30,
  weather: '晴',
  snacks: initSnacks(),
  seats: initSeats(),
  renovations: initRenovations(),
  customers: [],
  currentStory: null,
  currentBranch: null,
  storyProgress: 0,
  availableStories: [],
  interruptions: INTERRUPTIONS,
  currentInterruption: null,
  performanceActive: false,
  ledger: [],
  storyHistory: [],
  reputationHistory: [],
  lastStoryDay: {},
  storyScores: {},
  isSettlement: false,
  lastSettlement: null,
  genealogyRecords: [],
  customerMoods: CUSTOMER_TEMPLATES.map((t) => ({
    type: t.type,
    mood: 50,
    consecutiveNeglectDays: 0,
    lastCateredDay: null,
  })),
  preScheduledSegments: [],
  currentInterruptionRecords: [],
}

interface GameActions {
  buySnack: (snackId: string, qty: number) => void
  moveSeat: (seatId: number, x: number, y: number) => void
  upgradeRenovation: (renoId: string) => void
  switchToNight: () => void
  selectStory: (storyId: string, branchId: string) => void
  startPerformance: () => void
  tickPerformance: () => void
  handleInterruption: (option: InterruptionOption) => void
  doSettlement: () => void
  nextDay: () => void
  resetGame: () => void
  addLedgerRecord: (type: LedgerRecord['type'], category: string, amount: number, note: string) => void
  preScheduleSegment: (storyId: string, branchId: string, order: number) => void
  removePreScheduledSegment: (segmentId: string) => void
  clearPreScheduledSegments: () => void
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      buySnack: (snackId: string, qty: number) => {
        const state = get()
        const snack = state.snacks.find((s) => s.id === snackId)
        if (!snack) return
        const totalCost = snack.cost * qty
        if (state.gold < totalCost) return
        const newStock = Math.min(snack.maxStock, snack.stock + qty)
        const actualQty = newStock - snack.stock
        if (actualQty <= 0) return
        const actualCost = snack.cost * actualQty

        set((s) => ({
          gold: s.gold - actualCost,
          snacks: s.snacks.map((x) =>
            x.id === snackId ? { ...x, stock: newStock } : x
          ),
        }))
        get().addLedgerRecord('支出', '茶点采购', actualCost, `采购${snack.name} x${actualQty}`)
      },

      moveSeat: (seatId: number, x: number, y: number) => {
        set((s) => ({
          seats: s.seats.map((seat) =>
            seat.id === seatId ? { ...seat, x, y } : seat
          ),
        }))
      },

      upgradeRenovation: (renoId: string) => {
        const state = get()
        const reno = state.renovations.find((r) => r.id === renoId)
        if (!reno || reno.level >= reno.maxLevel) return
        const cost = getUpgradeCost(reno)
        if (state.gold < cost) return

        const repGain = reno.bonusReputation

        set((s) => ({
          gold: s.gold - cost,
          reputation: Math.min(100, s.reputation + repGain),
          renovations: s.renovations.map((r) =>
            r.id === renoId ? { ...r, level: r.level + 1 } : r
          ),
          reputationHistory: [
            ...s.reputationHistory,
            {
              day: s.day,
              value: Math.min(100, s.reputation + repGain),
              delta: repGain,
              reason: `装修升级：${reno.name}`,
            },
          ],
        }))
        get().addLedgerRecord('支出', '装修升级', cost, `升级${reno.name}至${reno.level + 1}级`)
      },

      switchToNight: () => {
        const state = get()
        const weather = state.weather
        let customerCount = 6
        if (weather === '雨') customerCount = Math.max(2, customerCount - 3)
        if (weather === '雪') customerCount = Math.max(2, customerCount - 4)
        if (weather === '云') customerCount = Math.max(3, customerCount - 1)
        if (state.reputation > 50) customerCount += 2
        if (state.reputation > 80) customerCount += 2

        let customers = generateRandomCustomers(customerCount)
        customers = customers.map((c) => {
          const mood = state.customerMoods.find((m) => m.type === c.type)
          const moodPenalty = mood ? Math.max(0, (50 - mood.mood) / 10) : 0
          return {
            ...c,
            satisfaction: Math.max(10, Math.min(90, 50 - moodPenalty * 5 + (Math.random() * 10 - 5))),
          }
        })

        const seats = [...state.seats].map((s) => ({ ...s, occupied: false }))
        const sortedSeats = [...seats].sort((a, b) => {
          const order: Record<Seat['tier'], number> = { 贵宾: 0, 雅座: 1, 普通: 2 }
          return order[a.tier] - order[b.tier]
        })
        for (let i = 0; i < Math.min(customers.length, sortedSeats.length); i++) {
          const seat = sortedSeats[i]
          customers[i].seatId = seat.id
          const idx = seats.findIndex((s) => s.id === seat.id)
          if (idx >= 0) seats[idx].occupied = true
        }

        let availableStories: Story[]
        if (state.preScheduledSegments.length > 0) {
          const scheduled = state.preScheduledSegments
            .sort((a, b) => a.order - b.order)
            .map((seg) => {
              const story = STORIES.find((s) => s.id === seg.storyId)
              return story ?? null
            })
            .filter((s): s is Story => s !== null)
          availableStories = scheduled.length > 0 ? scheduled : pickRandomStories(3)
        } else {
          availableStories = pickRandomStories(3)
        }

        set({
          phase: 'night',
          customers,
          seats,
          availableStories,
          currentStory: null,
          currentBranch: null,
          storyProgress: 0,
          performanceActive: false,
          currentInterruption: null,
          currentInterruptionRecords: [],
        })
      },

      selectStory: (storyId: string, branchId: string) => {
        const state = get()
        const story = state.availableStories.find((s) => s.id === storyId)
        const branch = story?.branches.find((b) => b.id === branchId)
        if (!story || !branch) return
        set({ currentStory: story, currentBranch: branch, storyProgress: 0 })
      },

      startPerformance: () => {
        const state = get()
        if (!state.currentStory || !state.currentBranch) return
        set({ performanceActive: true, storyProgress: 0 })
      },

      tickPerformance: () => {
        const state = get()
        if (!state.performanceActive) return

        const newProgress = Math.min(100, state.storyProgress + 4)

        if (!state.currentInterruption && Math.random() < 0.18 && state.storyProgress > 10 && state.storyProgress < 90) {
          const seatedCustomers = state.customers.filter((c) => c.seatId !== null)
          if (seatedCustomers.length > 0) {
            const c = seatedCustomers[Math.floor(Math.random() * seatedCustomers.length)]
            const matching = state.interruptions.filter((i) => i.customerType === c.type)
            const pool = matching.length > 0 ? matching : state.interruptions
            const ev = pool[Math.floor(Math.random() * pool.length)]
            set({ currentInterruption: ev, storyProgress: newProgress })
            return
          }
        }

        const customers = state.customers.map((c) => {
          if (c.seatId === null) return c
          let delta = Math.random() < 0.7 ? 1 : -1
          if (state.currentStory && state.currentBranch) {
            const match = state.currentBranch.tags.some((t) => c.preferenceTags.includes(t))
            if (match) delta += 1
          }
          return { ...c, satisfaction: Math.max(0, Math.min(100, c.satisfaction + delta)) }
        })

        if (newProgress >= 100) {
          set({ performanceActive: false, storyProgress: 100, customers })
          setTimeout(() => get().doSettlement(), 600)
        } else {
          set({ storyProgress: newProgress, customers })
        }
      },

      handleInterruption: (option: InterruptionOption) => {
        const state = get()
        if (!state.currentInterruption) return

        const customers = state.customers.map((c) => ({
          ...c,
          satisfaction: Math.max(0, Math.min(100, c.satisfaction + option.satisfactionEffect)),
        }))

        const newReputation = Math.max(0, Math.min(100, state.reputation + option.reputationEffect))

        const interruptionRecord: InterruptionRecord = {
          id: uid(),
          interruptionId: state.currentInterruption.id,
          customerType: state.currentInterruption.customerType,
          content: state.currentInterruption.content,
          chosenOptionText: option.text,
          satisfactionEffect: option.satisfactionEffect,
          reputationEffect: option.reputationEffect,
          goldEffect: option.goldEffect,
          timestamp: Date.now(),
        }

        set({
          currentInterruption: null,
          customers,
          gold: state.gold + option.goldEffect,
          reputation: newReputation,
          currentInterruptionRecords: [...state.currentInterruptionRecords, interruptionRecord],
        })

        if (option.goldEffect !== 0) {
          get().addLedgerRecord(
            option.goldEffect > 0 ? '收入' : '支出',
            '插话应对',
            Math.abs(option.goldEffect),
            option.text.slice(0, 20)
          )
        }

        if (option.reputationEffect !== 0) {
          set((s) => ({
            reputationHistory: [
              ...s.reputationHistory,
              {
                day: s.day,
                value: newReputation,
                delta: option.reputationEffect,
                reason: option.reputationEffect > 0 ? '插话应对得当' : '插话处理失当',
              },
            ],
          }))
        }
      },

      doSettlement: () => {
        const state = get()
        if (!state.currentStory || !state.currentBranch) return

        const result = calcSettlement(
          state.day,
          state.currentStory,
          state.currentBranch,
          state.customers,
          state.seats,
          state.renovations,
          state.storyHistory,
          state.lastStoryDay,
          state.storyScores,
          state.reputation,
          state.snacks
        )

        const storyRecord: StoryRecord = {
          day: state.day,
          storyId: state.currentStory.id,
          branchId: state.currentBranch.id,
          audienceCount: result.audienceCount,
          earnings: result.totalEarnings,
          avgSatisfaction: result.avgSatisfaction,
        }

        const seatedCustomers = state.customers.filter((c) => c.seatId !== null)
        const satisfactionByType: Partial<Record<CustomerType, number[]>> = {}
        seatedCustomers.forEach((c) => {
          if (!satisfactionByType[c.type]) satisfactionByType[c.type] = []
          satisfactionByType[c.type]!.push(c.satisfaction)
        })
        const avgSatisfactionByType: Partial<Record<CustomerType, number>> = {}
        Object.entries(satisfactionByType).forEach(([type, scores]) => {
          avgSatisfactionByType[type as CustomerType] =
            Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        })

        const drivingCustomerTypes: CustomerType[] = (
          Object.entries(avgSatisfactionByType) as [CustomerType, number][]
        )
          .filter(([, score]) => score >= 70)
          .map(([type]) => type)

        const branchTags = state.currentBranch.tags
        const interruptionTags = state.currentInterruptionRecords
          .filter((r) => r.reputationEffect > 0)
          .map((r) => '妙答' + r.customerType)
        const highSatTags = result.avgSatisfaction >= 80 ? ['满堂喝彩'] : result.avgSatisfaction >= 60 ? ['好评如潮'] : []
        const lowSatTags = result.avgSatisfaction < 40 ? ['冷场'] : []
        const earningsTags = result.totalEarnings >= 150 ? ['日进斗金'] : result.totalEarnings >= 80 ? ['小有进账'] : []
        const reputationTags = [...branchTags, ...interruptionTags, ...highSatTags, ...lowSatTags, ...earningsTags].slice(0, 6)

        const genealogyRecord: GenealogyBranchRecord = {
          day: state.day,
          storyId: state.currentStory.id,
          branchId: state.currentBranch.id,
          drivingCustomerTypes,
          interruptionRecords: [...state.currentInterruptionRecords],
          reputationTags,
          audienceCount: result.audienceCount,
          earnings: result.totalEarnings,
          avgSatisfaction: result.avgSatisfaction,
          avgSatisfactionByType,
        }

        const newStoryScores = { ...state.storyScores }
        if (!newStoryScores[state.currentStory.id]) {
          newStoryScores[state.currentStory.id] = []
        }
        newStoryScores[state.currentStory.id] = [
          ...newStoryScores[state.currentStory.id],
          result.avgSatisfaction,
        ].slice(-10)

        const newRep = Math.max(0, Math.min(100, state.reputation + result.reputationDelta))

        const repHistory: ReputationHistory = {
          day: state.day,
          value: newRep,
          delta: result.reputationDelta,
          reason: result.reputationDelta >= 0 ? '说书好评' : '差评影响',
        }

        const branchTagsSet = new Set(state.currentBranch.tags)
        const updatedCustomerMoods = state.customerMoods.map((mood) => {
          const tpl = CUSTOMER_TEMPLATES.find((t) => t.type === mood.type)
          const isCatered = tpl?.preferenceTags.some((tag) => branchTagsSet.has(tag)) ?? false
          if (isCatered) {
            const typeSatisfaction = avgSatisfactionByType[mood.type] ?? 50
            return {
              ...mood,
              mood: Math.max(0, Math.min(100, mood.mood + Math.max(-5, Math.min(10, typeSatisfaction - 50)))),
              consecutiveNeglectDays: 0,
              lastCateredDay: state.day,
            }
          } else {
            const neglectPenalty = mood.consecutiveNeglectDays >= 2 ? 8 : 5
            return {
              ...mood,
              mood: Math.max(0, Math.min(100, mood.mood - neglectPenalty)),
              consecutiveNeglectDays: mood.consecutiveNeglectDays + 1,
              lastCateredDay: mood.lastCateredDay,
            }
          }
        })

        set((s) => ({
          isSettlement: true,
          lastSettlement: result,
          gold: s.gold + result.totalEarnings,
          reputation: newRep,
          storyHistory: [...s.storyHistory, storyRecord],
          lastStoryDay: { ...s.lastStoryDay, [state.currentStory!.id]: state.day },
          storyScores: newStoryScores,
          reputationHistory: [...s.reputationHistory, repHistory],
          genealogyRecords: [...s.genealogyRecords, genealogyRecord],
          customerMoods: updatedCustomerMoods,
          currentInterruptionRecords: [],
        }))

        get().addLedgerRecord('收入', '基础门票', result.baseEarnings, '晚场门票')
        if (result.tasteMatchBonus > 0)
          get().addLedgerRecord('收入', '口味匹配', result.tasteMatchBonus, '故事对味')
        if (result.seatViewBonus > 0)
          get().addLedgerRecord('收入', '视野加成', result.seatViewBonus, '座位优良')
        if (result.storyHeatBonus > 0)
          get().addLedgerRecord('收入', '热度加成', result.storyHeatBonus, '故事热门')
        if (result.serialExpectBonus > 0)
          get().addLedgerRecord('收入', '连载期待', result.serialExpectBonus, '观众期待')
        if (result.tips > 0)
          get().addLedgerRecord('收入', '客人打赏', result.tips, '客人满意打赏')
        if (result.snackRevenue > 0)
          get().addLedgerRecord('收入', '茶点售卖', result.snackRevenue, '消费茶点')
        if (result.badReviewPenalty > 0)
          get().addLedgerRecord('支出', '差评损失', result.badReviewPenalty, '客人不满索赔')
      },

      nextDay: () => {
        set((s) => ({
          day: s.day + 1,
          phase: 'day',
          weather: randomWeather(),
          customers: [],
          currentStory: null,
          currentBranch: null,
          storyProgress: 0,
          availableStories: [],
          performanceActive: false,
          currentInterruption: null,
          isSettlement: false,
          seats: s.seats.map((seat) => ({ ...seat, occupied: false })),
        }))
      },

      resetGame: () => {
        set({ ...initialState, weather: randomWeather() })
      },

      addLedgerRecord: (type, category, amount, note) => {
        set((s) => ({
          ledger: [
            ...s.ledger,
            {
              day: s.day,
              id: uid(),
              type,
              category,
              amount,
              note,
              timestamp: Date.now(),
            },
          ],
        }))
      },

      preScheduleSegment: (storyId: string, branchId: string, order: number) => {
        set((s) => {
          const existing = s.preScheduledSegments.filter(
            (seg) => !(seg.storyId === storyId && seg.branchId === branchId)
          )
          const newSeg: PreScheduledSegment = {
            id: `seg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            storyId,
            branchId,
            order,
          }
          const sorted = [...existing, newSeg].sort((a, b) => a.order - b.order)
          return { preScheduledSegments: sorted }
        })
      },

      removePreScheduledSegment: (segmentId: string) => {
        set((s) => ({
          preScheduledSegments: s.preScheduledSegments.filter((seg) => seg.id !== segmentId),
        }))
      },

      clearPreScheduledSegments: () => {
        set({ preScheduledSegments: [] })
      },
    }),
    {
      name: 'teahouse-storyteller-save',
      partialize: (s) => ({
        day: s.day,
        gold: s.gold,
        reputation: s.reputation,
        snacks: s.snacks,
        seats: s.seats,
        renovations: s.renovations,
        ledger: s.ledger,
        storyHistory: s.storyHistory,
        reputationHistory: s.reputationHistory,
        lastStoryDay: s.lastStoryDay,
        storyScores: s.storyScores,
        genealogyRecords: s.genealogyRecords,
        customerMoods: s.customerMoods,
        preScheduledSegments: s.preScheduledSegments,
      }),
    }
  )
)
