import { BookOpen, TrendingUp, TrendingDown } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'

export default function Ledger() {
  const { ledger, day } = useGameStore()

  const todayRecords = ledger.filter((r) => r.day === day).reverse()
  const totalIncome = todayRecords.filter((r) => r.type === '收入').reduce((s, r) => s + r.amount, 0)
  const totalExpense = todayRecords.filter((r) => r.type === '支出').reduce((s, r) => s + r.amount, 0)

  return (
    <div className="scroll-panel">
      <h2 className="text-2xl font-brush text-sandal mb-2 flex items-center gap-2">
        <BookOpen className="w-6 h-6" /> 今日账本
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="card-ancient text-center">
          <div className="stat-label flex items-center justify-center gap-1 text-tea">
            <TrendingUp className="w-3 h-3" /> 今日收入
          </div>
          <div className="stat-value text-tea">{totalIncome}</div>
        </div>
        <div className="card-ancient text-center">
          <div className="stat-label flex items-center justify-center gap-1 text-cinnabar">
            <TrendingDown className="w-3 h-3" /> 今日支出
          </div>
          <div className="stat-value text-cinnabar">{totalExpense}</div>
        </div>
        <div className="card-ancient text-center">
          <div className="stat-label">今日结余</div>
          <div className={`stat-value ${totalIncome - totalExpense >= 0 ? 'text-gold' : 'text-cinnabar'}`}>
            {totalIncome - totalExpense >= 0 ? '+' : ''}
            {totalIncome - totalExpense}
          </div>
        </div>
      </div>

      {todayRecords.length === 0 ? (
        <div className="text-center py-8 text-ink-light font-song">今日暂无记录</div>
      ) : (
        <div className="divide-y divide-sandal/20 border border-sandal/20 rounded-lg overflow-hidden">
          {todayRecords.map((r) => (
            <div key={r.id} className="flex items-center justify-between px-4 py-2.5 bg-paper/50 hover:bg-paper-dark/30">
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${r.type === '收入' ? 'bg-tea-light/30 text-tea' : 'bg-cinnabar/20 text-cinnabar'}`}
                >
                  {r.type === '收入' ? '收' : '支'}
                </span>
                <div>
                  <div className="font-song text-sm text-ink">{r.category}</div>
                  <div className="text-xs text-ink-light">{r.note}</div>
                </div>
              </div>
              <div className={`font-semibold ${r.type === '收入' ? 'text-tea' : 'text-cinnabar'}`}>
                {r.type === '收入' ? '+' : '-'}
                {r.amount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
