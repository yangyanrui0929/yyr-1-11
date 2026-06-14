import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Users, TrendingUp, Package } from 'lucide-react'
import StatusPanel from '@/components/StatusPanel'
import { useGameStore } from '@/store/useGameStore'
import { CUSTOMER_TEMPLATES } from '@/data/customers'
import { STORIES } from '@/data/stories'

export default function Archive() {
  const {
    snacks,
    renovations,
    storyHistory,
    reputationHistory,
    ledger,
    reputation,
    gold,
    day,
  } = useGameStore()

  const totalIncome = ledger.filter((r) => r.type === '收入').reduce((s, r) => s + r.amount, 0)
  const totalExpense = ledger.filter((r) => r.type === '支出').reduce((s, r) => s + r.amount, 0)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <StatusPanel />

        <div className="mb-6">
          <Link to="/" className="btn-wood text-sm">
            <ArrowLeft className="w-4 h-4" /> 返回首页
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="scroll-panel">
            <h2 className="text-2xl font-brush text-sandal mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6" /> 说书档案
            </h2>
            {storyHistory.length === 0 ? (
              <div className="text-center py-8 text-ink-light">暂无说书记录</div>
            ) : (
              <div className="space-y-2">
                {storyHistory.slice().reverse().slice(0, 15).map((r, i) => {
                  const story = STORIES.find((s) => s.id === r.storyId)
                  const branch = story?.branches.find((b) => b.id === r.branchId)
                  return (
                    <div key={i} className="card-ancient py-2 px-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-song font-semibold text-ink">
                            第{r.day}日 · {story?.title}
                          </div>
                          <div className="text-xs text-ink-light">{branch?.title}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-gold font-semibold">+{r.earnings}文</div>
                          <div className="text-xs text-ink-light">
                            {r.audienceCount}人 · 满意度{r.avgSatisfaction}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="scroll-panel">
            <h2 className="text-2xl font-brush text-sandal mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" /> 顾客偏好
            </h2>
            <div className="space-y-3">
              {CUSTOMER_TEMPLATES.map((t) => (
                <div key={t.type} className="card-ancient py-2 px-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="font-song font-semibold">{t.type}</span>
                    <span className="text-xs text-ink-light">
                      慷慨 {'★'.repeat(t.generosity)} · 社交 {'★'.repeat(t.socialInfluence)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {t.preferenceTags.map((tag) => (
                      <span key={tag} className="tag-chip">#{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="scroll-panel">
            <h2 className="text-2xl font-brush text-sandal mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" /> 声望走势
            </h2>
            <div className="mb-4 grid grid-cols-3 gap-3">
              <div className="card-ancient text-center py-2">
                <div className="stat-label">经营天数</div>
                <div className="stat-value">{day}</div>
              </div>
              <div className="card-ancient text-center py-2">
                <div className="stat-label">当前声望</div>
                <div className="stat-value text-cinnabar">{reputation}</div>
              </div>
              <div className="card-ancient text-center py-2">
                <div className="stat-label">累计盈亏</div>
                <div className={`stat-value ${totalIncome - totalExpense >= 0 ? 'text-tea' : 'text-cinnabar'}`}>
                  {totalIncome - totalExpense}
                </div>
              </div>
            </div>
            {reputationHistory.length > 0 && (
              <div className="space-y-1.5">
                {reputationHistory.slice().reverse().slice(0, 12).map((r, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-ink-light w-16">第{r.day}日</span>
                    <div className="flex-1 h-4 bg-paper-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold to-cinnabar"
                        style={{ width: `${r.value}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-10 text-right">{r.value}</span>
                    <span
                      className={`text-xs w-14 text-right ${r.delta >= 0 ? 'text-tea' : 'text-cinnabar'}`}
                    >
                      {r.delta >= 0 ? '+' : ''}
                      {r.delta}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="scroll-panel">
            <h2 className="text-2xl font-brush text-sandal mb-4 flex items-center gap-2">
              <Package className="w-6 h-6" /> 茶楼现状
            </h2>

            <h3 className="font-brush text-lg text-sandal mb-2">茶点库存</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {snacks.map((s) => {
                const pct = (s.stock / s.maxStock) * 100
                return (
                  <div key={s.id} className="card-ancient py-2 px-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1 text-sm">
                        <span>{s.emoji}</span>
                        <span className="font-song">{s.name}</span>
                      </span>
                      <span className="text-xs font-semibold">{s.stock}</span>
                    </div>
                    <div className="h-1.5 bg-paper-dark rounded-full overflow-hidden">
                      <div
                        className={`h-full ${pct < 20 ? 'bg-cinnabar' : pct < 50 ? 'bg-gold' : 'bg-tea'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <h3 className="font-brush text-lg text-sandal mb-2">装修等级</h3>
            <div className="space-y-2">
              {renovations.map((r) => (
                <div key={r.id} className="card-ancient py-2 px-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{r.emoji}</span>
                      <span className="font-song">{r.name}</span>
                    </span>
                    <span className="text-sm font-semibold text-gold">Lv.{r.level}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider-ancient">总账</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="card-ancient text-center py-2">
                <div className="stat-label text-tea">累计收入</div>
                <div className="stat-value text-tea">{totalIncome}</div>
              </div>
              <div className="card-ancient text-center py-2">
                <div className="stat-label text-cinnabar">累计支出</div>
                <div className="stat-value text-cinnabar">{totalExpense}</div>
              </div>
            </div>
            <div className="text-center mt-3">
              <span className="font-song">结余：</span>
              <span
                className={`font-brush text-2xl ${totalIncome - totalExpense >= 0 ? 'text-gold' : 'text-cinnabar'}`}
              >
                {totalIncome - totalExpense} 文
              </span>
              <span className="mx-2 text-ink-light">|</span>
              <span className="font-song">金库：</span>
              <span className="font-brush text-2xl text-gold">{gold} 文</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
