import { useEffect, useState } from 'react'
import { Coins, Trophy, ArrowUp, ArrowDown, Sparkles } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'

interface RowProps {
  label: string
  value: number
  positive?: boolean
  showIcon?: boolean
  highlight?: boolean
}

function Row({ label, value, positive, showIcon, highlight }: RowProps) {
  if (value === 0) return null
  return (
    <div
      className={`flex justify-between items-center py-2 px-3 rounded-lg ${highlight ? 'bg-gold/20 border-2 border-gold' : 'bg-paper-dark/30'}`}
    >
      <span className="font-song text-ink-light">{label}</span>
      <span
        className={`font-semibold flex items-center gap-1 ${
          positive ? 'text-tea' : 'text-cinnabar'
        } ${highlight ? 'text-xl' : ''}`}
      >
        {showIcon && (positive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />)}
        {positive ? '+' : ''}
        {value} 文
      </span>
    </div>
  )
}

export default function Settlement() {
  const { lastSettlement, isSettlement, nextDay } = useGameStore()
  const [showCoins, setShowCoins] = useState(true)

  useEffect(() => {
    if (isSettlement) {
      setShowCoins(true)
      const t = setTimeout(() => setShowCoins(false), 2000)
      return () => clearTimeout(t)
    }
  }, [isSettlement])

  if (!isSettlement || !lastSettlement) return null

  const r = lastSettlement
  const repColor = r.reputationDelta >= 0 ? 'text-tea' : 'text-cinnabar'

  return (
    <div className="fixed inset-0 bg-ink/60 z-50 flex items-center justify-center p-4 overflow-auto py-8">
      <div className="scroll-panel max-w-xl w-full my-8 animate-unroll relative">
        {showCoins && (
          <>
            {Array.from({ length: 15 }).map((_, i) => (
              <span
                key={i}
                className="absolute text-3xl animate-coinFall pointer-events-none"
                style={{
                  left: `${5 + (i * 7) % 90}%`,
                  animationDelay: `${i * 0.08}s`,
                  top: '10%',
                }}
              >
                🪙
              </span>
            ))}
          </>
        )}

        <div className="text-center mb-6">
          <Sparkles className="w-10 h-10 text-gold mx-auto mb-2" />
          <h2 className="font-brush text-3xl text-sandal">今夜结算</h2>
          <div className="text-sm text-ink-light">第 {r.day} 日夜场说书</div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="card-ancient text-center">
            <div className="stat-label">观众人数</div>
            <div className="stat-value">{r.audienceCount} 人</div>
          </div>
          <div className="card-ancient text-center">
            <div className="stat-label">平均满意度</div>
            <div className="stat-value">{r.avgSatisfaction} 分</div>
          </div>
        </div>

        <div className="space-y-2 mb-5">
          <Row label="基础门票收入" value={r.baseEarnings} positive showIcon />
          <Row label="口味匹配加成" value={r.tasteMatchBonus} positive />
          <Row label="座位视野加成" value={r.seatViewBonus} positive />
          <Row label="故事热度加成" value={r.storyHeatBonus} positive />
          <Row label="连载期待加成" value={r.serialExpectBonus} positive />
          <Row label="打赏收入" value={r.tips} positive />
          <Row label="茶点售卖利润" value={r.snackRevenue} positive />
          {r.badReviewPenalty > 0 && <Row label="差评索赔" value={r.badReviewPenalty} />}
        </div>

        <Row label="今夜合计收入" value={r.totalEarnings} positive showIcon highlight />

        <div className="mt-5 flex items-center justify-center gap-3 py-3 rounded-xl bg-sandal/10 border-2 border-sandal/30">
          <Trophy className={`w-6 h-6 ${repColor}`} />
          <span className="font-song text-ink-light">声望变化</span>
          <span className={`font-brush text-2xl ${repColor}`}>
            {r.reputationDelta >= 0 ? '+' : ''}
            {r.reputationDelta}
          </span>
          <Coins className="w-6 h-6 text-gold" />
          <span className="font-song text-ink-light">合计入账</span>
          <span className="font-brush text-2xl text-gold">+{r.totalEarnings} 文</span>
        </div>

        <div className="mt-6 flex justify-center">
          <button onClick={nextDay} className="btn-gold text-lg px-8 py-3">
            迎接新的一天 →
          </button>
        </div>
      </div>
    </div>
  )
}
