import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  GitBranch,
  Users,
  TrendingUp,
  Package,
  MessageCircle,
  Tag,
  CalendarDays,
  Plus,
  X,
  AlertTriangle,
  Heart,
  Frown,
  Meh,
  Sparkles,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import StatusPanel from '@/components/StatusPanel'
import { useGameStore } from '@/store/useGameStore'
import { CUSTOMER_TEMPLATES } from '@/data/customers'
import { STORIES } from '@/data/stories'
import type { CustomerType, GenealogyBranchRecord } from '@/types'

function getMoodIcon(mood: number) {
  if (mood >= 70) return <Heart className="w-4 h-4 text-tea" />
  if (mood >= 40) return <Meh className="w-4 h-4 text-gold" />
  return <Frown className="w-4 h-4 text-cinnabar" />
}

function getMoodLabel(mood: number, neglectDays: number) {
  if (neglectDays >= 3) return '积怨已久'
  if (neglectDays >= 2) return '颇感冷落'
  if (mood >= 80) return '心花怒放'
  if (mood >= 60) return '甚感满意'
  if (mood >= 40) return '不咸不淡'
  if (mood >= 20) return '颇感失望'
  return '愤懑不平'
}

function getMoodColor(mood: number) {
  if (mood >= 70) return 'text-tea'
  if (mood >= 40) return 'text-gold'
  return 'text-cinnabar'
}

interface ExpandedState {
  [key: string]: boolean
}

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
    genealogyRecords,
    customerMoods,
    preScheduledSegments,
    preScheduleSegment,
    removePreScheduledSegment,
    clearPreScheduledSegments,
  } = useGameStore()

  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [schedulingBranch, setSchedulingBranch] = useState<string | null>(null)

  const totalIncome = ledger.filter((r) => r.type === '收入').reduce((s, r) => s + r.amount, 0)
  const totalExpense = ledger.filter((r) => r.type === '支出').reduce((s, r) => s + r.amount, 0)

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const getStoryBranch = (storyId: string, branchId: string) => {
    const story = STORIES.find((s) => s.id === storyId)
    const branch = story?.branches.find((b) => b.id === branchId)
    return { story, branch }
  }

  const neglectedTypes: CustomerType[] = customerMoods
    .filter((m) => m.consecutiveNeglectDays >= 2)
    .map((m) => m.type)

  const getAffectedCustomerTypes = (tags: string[]): CustomerType[] => {
    return CUSTOMER_TEMPLATES.filter((tpl) =>
      tpl.preferenceTags.some((tag) => tags.includes(tag))
    ).map((tpl) => tpl.type)
  }

  const checkNeglectWarning = (tags: string[]): CustomerType[] => {
    const willCater = new Set(getAffectedCustomerTypes(tags))
    return neglectedTypes.filter((t) => !willCater.has(t))
  }

  const handlePreSchedule = (storyId: string, branchId: string) => {
    const order = preScheduledSegments.length
    preScheduleSegment(storyId, branchId, order)
    setSchedulingBranch(null)
  }

  const groupedGenealogy = genealogyRecords.reduce((acc, rec) => {
    if (!acc[rec.storyId]) acc[rec.storyId] = []
    acc[rec.storyId].push(rec)
    return acc
  }, {} as Record<string, GenealogyBranchRecord[]>)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <StatusPanel />

        <div className="mb-6">
          <Link to="/" className="btn-wood text-sm">
            <ArrowLeft className="w-4 h-4" /> 返回首页
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="scroll-panel">
              <h2 className="text-2xl font-brush text-sandal mb-4 flex items-center gap-2">
                <GitBranch className="w-6 h-6" /> 说书谱系
              </h2>

              {genealogyRecords.length === 0 ? (
                <div className="text-center py-8 text-ink-light">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <div>尚无说书谱系记录</div>
                  <div className="text-xs mt-1">完成一场说书后，将在此记录各分支的演化脉络</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedGenealogy).map(([storyId, records]) => {
                    const story = STORIES.find((s) => s.id === storyId)
                    const isExpanded = expanded[storyId] ?? true
                    return (
                      <div key={storyId} className="card-ancient">
                        <button
                          onClick={() => toggleExpand(storyId)}
                          className="w-full flex items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-sandal" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-sandal" />
                            )}
                            <span className="font-brush text-xl text-ink">{story?.title}</span>
                            <span className="text-xs text-ink-light">{records.length}段演化</span>
                          </div>
                          <div className="flex gap-1">
                            {story?.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="tag-chip">#{tag}</span>
                            ))}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="mt-4 space-y-3 pl-6 border-l-2 border-sandal/30">
                            {records.map((rec, idx) => {
                              const { branch } = getStoryBranch(rec.storyId, rec.branchId)
                              const neglectWarning = checkNeglectWarning(branch?.tags ?? [])
                              const recKey = `${rec.storyId}-${rec.branchId}-${rec.day}`
                              const recExpanded = expanded[recKey] ?? false
                              return (
                                <div key={recKey} className="relative">
                                  <div className="absolute -left-[30px] top-2 w-3 h-3 rounded-full bg-sandal border-2 border-paper" />
                                  <div className="card-ancient py-3 px-4 bg-paper/60">
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <button
                                            onClick={() => toggleExpand(recKey)}
                                            className="inline-flex items-center"
                                          >
                                            {recExpanded ? (
                                              <ChevronDown className="w-4 h-4 text-sandal" />
                                            ) : (
                                              <ChevronRight className="w-4 h-4 text-sandal" />
                                            )}
                                          </button>
                                          <CalendarDays className="w-3.5 h-3.5 text-ink-light" />
                                          <span className="text-xs text-ink-light">第{rec.day}日</span>
                                          <span className="font-song font-semibold text-ink">{branch?.title}</span>
                                        </div>
                                      </div>
                                      <div className="text-right text-xs">
                                        <div className="text-gold font-semibold">+{rec.earnings}文</div>
                                        <div className="text-ink-light">
                                          {rec.audienceCount}人 · 满意{rec.avgSatisfaction}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 text-xs">
                                      <div className="flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-sandal" />
                                        <span className="text-ink-light">推动客群：</span>
                                        {rec.drivingCustomerTypes.length > 0 ? (
                                          rec.drivingCustomerTypes.map((type) => {
                                            const tpl = CUSTOMER_TEMPLATES.find((t) => t.type === type)
                                            return (
                                              <span key={type} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-tea-light/30 text-tea text-xs">
                                                {tpl?.emoji} {type}
                                              </span>
                                            )
                                          })
                                        ) : (
                                          <span className="text-ink-light">暂无突出客群</span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {rec.reputationTags.map((tag) => (
                                        <span key={tag} className="tag-chip">#{tag}</span>
                                      ))}
                                    </div>

                                    {recExpanded && (
                                      <div className="mt-4 pt-4 border-t border-sandal/20 space-y-3">
                                        {rec.avgSatisfactionByType && Object.keys(rec.avgSatisfactionByType).length > 0 && (
                                          <div>
                                            <div className="text-xs text-ink-light mb-2 flex items-center gap-1">
                                              <Users className="w-3.5 h-3.5" /> 各客群满意度
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                              {Object.entries(rec.avgSatisfactionByType).map(([type, score]) => {
                                                const tpl = CUSTOMER_TEMPLATES.find((t) => t.type === type)
                                                return (
                                                  <div key={type} className="flex items-center gap-2 text-sm">
                                                    <span>{tpl?.emoji}</span>
                                                    <span className="font-song text-xs w-12">{type}</span>
                                                    <div className="flex-1 h-2 bg-paper-dark rounded-full overflow-hidden">
                                                      <div
                                                        className={`h-full ${
                                                          score >= 70 ? 'bg-tea' : score >= 40 ? 'bg-gold' : 'bg-cinnabar'
                                                        }`}
                                                        style={{ width: `${score}%` }}
                                                      />
                                                    </div>
                                                    <span className="text-xs w-8 text-right font-semibold">{score}</span>
                                                  </div>
                                                )
                                              })}
                                            </div>
                                          </div>
                                        )}

                                        {rec.interruptionRecords.length > 0 && (
                                          <div>
                                            <div className="text-xs text-ink-light mb-2 flex items-center gap-1">
                                              <MessageCircle className="w-3.5 h-3.5" /> 插话记录（{rec.interruptionRecords.length}条）
                                            </div>
                                            <div className="space-y-2">
                                              {rec.interruptionRecords.map((ir) => (
                                                <div key={ir.id} className="p-2 rounded bg-paper-dark/40 text-xs">
                                                  <div className="flex items-center gap-1.5 mb-1">
                                                    <span>{CUSTOMER_TEMPLATES.find((t) => t.type === ir.customerType)?.emoji}</span>
                                                    <span className="font-semibold text-sandal">{ir.customerType}插话</span>
                                                    {ir.reputationEffect > 0 && <span className="text-tea">+{ir.reputationEffect}声望</span>}
                                                    {ir.reputationEffect < 0 && <span className="text-cinnabar">{ir.reputationEffect}声望</span>}
                                                    {ir.satisfactionEffect !== 0 && (
                                                      <span className={ir.satisfactionEffect > 0 ? 'text-tea' : 'text-cinnabar'}>
                                                        {ir.satisfactionEffect > 0 ? '+' : ''}{ir.satisfactionEffect}满意
                                                      </span>
                                                    )}
                                                  </div>
                                                  <div className="text-ink truncate">"{ir.content.slice(0, 40)}..."</div>
                                                  <div className="text-ink-light mt-0.5 truncate">应对：{ir.chosenOptionText.slice(0, 30)}...</div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  {idx < records.length - 1 && <div className="h-3" />}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="scroll-panel">
              <h2 className="text-2xl font-brush text-sandal mb-4 flex items-center gap-2">
                <CalendarDays className="w-6 h-6" /> 明晚桥段预排
              </h2>

              <div className="mb-4">
                {neglectedTypes.length > 0 && (
                  <div className="card-ancient p-3 mb-4 border-cinnabar/40 bg-cinnabar/5">
                    <div className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-5 h-5 text-cinnabar flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-cinnabar mb-1">冷落警告</div>
                        <div className="text-ink-light text-xs">
                          以下客群已被连续冷落，情绪低落：
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {neglectedTypes.map((t) => {
                              const tpl = CUSTOMER_TEMPLATES.find((ct) => ct.type === t)
                              const mood = customerMoods.find((m) => m.type === t)
                              return (
                                <span key={t} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-cinnabar/20 text-cinnabar text-xs">
                                  {tpl?.emoji} {t}（{mood?.consecutiveNeglectDays}日未照顾）
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {preScheduledSegments.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-ink-light">已预排 {preScheduledSegments.length} 段桥段</div>
                      <button
                        onClick={clearPreScheduledSegments}
                        className="text-xs text-cinnabar hover:underline"
                      >
                        清空预排
                      </button>
                    </div>
                    {preScheduledSegments.map((seg, idx) => {
                      const { story, branch } = getStoryBranch(seg.storyId, seg.branchId)
                      const warnTypes = checkNeglectWarning(branch?.tags ?? [])
                      return (
                        <div key={seg.id} className="card-ancient py-2 px-3 flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-sandal text-paper flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-song font-semibold text-ink truncate">{story?.title} · {branch?.title}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {branch?.tags.map((tag) => (
                                <span key={tag} className="tag-chip">#{tag}</span>
                              ))}
                            </div>
                            {warnTypes.length > 0 && (
                              <div className="flex items-center gap-1 mt-1.5 text-xs text-cinnabar">
                                <AlertTriangle className="w-3 h-3" />
                                仍会冷落：
                                {warnTypes.map((t) => {
                                  const tpl = CUSTOMER_TEMPLATES.find((ct) => ct.type === t)
                                  return <span key={t}>{tpl?.emoji}{t}</span>
                                })}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removePreScheduledSegment(seg.id)}
                            className="p-1 rounded hover:bg-cinnabar/10 text-cinnabar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-ink-light text-sm mb-4">
                    尚未预排桥段，可从下方故事库中添加
                  </div>
                )}
              </div>

              <div className="divider-ancient text-sm">故事库</div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {STORIES.map((story) => {
                  const storyExpanded = expanded[`lib-${story.id}`] ?? false
                  return (
                    <div key={story.id} className="card-ancient py-2 px-3">
                      <button
                        onClick={() => toggleExpand(`lib-${story.id}`)}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-2">
                          {storyExpanded ? (
                            <ChevronDown className="w-4 h-4 text-sandal" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-sandal" />
                          )}
                          <span className="font-song font-semibold text-ink">{story.title}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {story.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="tag-chip text-[10px]">#{tag}</span>
                          ))}
                        </div>
                      </button>

                      {storyExpanded && (
                        <div className="mt-3 pt-3 border-t border-sandal/20 space-y-2 pl-6">
                          {story.branches.map((branch) => {
                            const affectedTypes = getAffectedCustomerTypes(branch.tags)
                            const stillNeglected = checkNeglectWarning(branch.tags)
                            const isScheduled = preScheduledSegments.some(
                              (s) => s.storyId === story.id && s.branchId === branch.id
                            )
                            return (
                              <div key={branch.id} className="p-2 rounded bg-paper-dark/30">
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                  <div className="flex-1">
                                    <div className="font-song text-sm font-semibold text-ink">{branch.title}</div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {branch.tags.map((tag) => (
                                        <span key={tag} className="tag-chip text-[10px]">#{tag}</span>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1.5 text-[11px]">
                                      <Users className="w-3 h-3 text-sandal" />
                                      <span className="text-ink-light">契合：</span>
                                      {affectedTypes.map((t) => {
                                        const tpl = CUSTOMER_TEMPLATES.find((ct) => ct.type === t)
                                        const mood = customerMoods.find((m) => m.type === t)
                                        return (
                                          <span key={t} className={`inline-flex items-center gap-0.5 ${mood ? getMoodColor(mood.mood) : ''}`}>
                                            {tpl?.emoji}{t}
                                          </span>
                                        )
                                      })}
                                    </div>
                                    {stillNeglected.length > 0 && (
                                      <div className="flex items-center gap-1 mt-1 text-[11px] text-cinnabar">
                                        <AlertTriangle className="w-3 h-3" />
                                        选择后仍冷落：{stillNeglected.map((t) => {
                                          const tpl = CUSTOMER_TEMPLATES.find((ct) => ct.type === t)
                                          return <span key={t}>{tpl?.emoji}{t}</span>
                                        })}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handlePreSchedule(story.id, branch.id)}
                                    disabled={isScheduled}
                                    className={`p-1.5 rounded transition-colors ${
                                      isScheduled
                                        ? 'bg-sandal/30 text-ink-light cursor-not-allowed'
                                        : 'bg-tea-light/30 text-tea hover:bg-tea-light/50'
                                    }`}
                                    title={isScheduled ? '已在预排中' : '加入预排'}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="scroll-panel">
              <h2 className="text-2xl font-brush text-sandal mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6" /> 客群情绪
              </h2>
              <div className="space-y-3">
                {customerMoods.map((mood) => {
                  const tpl = CUSTOMER_TEMPLATES.find((t) => t.type === mood.type)
                  const isNeglected = mood.consecutiveNeglectDays >= 2
                  return (
                    <div
                      key={mood.type}
                      className={`card-ancient py-2 px-3 ${
                        isNeglected ? 'border-cinnabar/40' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tpl?.emoji}</span>
                          <span className="font-song font-semibold">{mood.type}</span>
                          {isNeglected && (
                            <span className="px-1.5 py-0.5 rounded bg-cinnabar/20 text-cinnabar text-[10px]">
                              冷落{mood.consecutiveNeglectDays}日
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {getMoodIcon(mood.mood)}
                          <span className={`text-xs font-semibold ${getMoodColor(mood.mood)}`}>
                            {getMoodLabel(mood.mood, mood.consecutiveNeglectDays)}
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-paper-dark rounded-full overflow-hidden mb-1.5">
                        <div
                          className={`h-full transition-all duration-500 ${
                            mood.mood >= 70 ? 'bg-gradient-to-r from-tea to-tea-light' :
                            mood.mood >= 40 ? 'bg-gradient-to-r from-gold to-gold-light' :
                            'bg-gradient-to-r from-cinnabar to-cinnabar-dark'
                          }`}
                          style={{ width: `${mood.mood}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-ink-light">
                        <span>情绪值 {mood.mood}</span>
                        <span>
                          {mood.lastCateredDay ? `上次照顾：第${mood.lastCateredDay}日` : '尚未照顾'}
                        </span>
                      </div>
                    </div>
                  )
                })}
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

            <div className="scroll-panel">
              <h2 className="text-2xl font-brush text-sandal mb-4 flex items-center gap-2">
                <Tag className="w-6 h-6" /> 口碑标签云
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {Array.from(
                  genealogyRecords.reduce((acc, rec) => {
                    rec.reputationTags.forEach((t) => acc.add(t))
                    return acc
                  }, new Set<string>())
                ).map((tag) => {
                  const count = genealogyRecords.filter((r) => r.reputationTags.includes(tag)).length
                  const size = count >= 3 ? 'text-base' : count >= 2 ? 'text-sm' : 'text-xs'
                  return (
                    <span key={tag} className={`tag-chip ${size} px-3 py-1`}>
                      #{tag}
                      <span className="ml-1 text-[10px] opacity-70">×{count}</span>
                    </span>
                  )
                })}
                {genealogyRecords.length === 0 && (
                  <div className="text-center w-full py-4 text-ink-light text-sm">暂无口碑标签</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
