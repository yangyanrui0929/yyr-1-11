import { useState } from 'react'
import { Scroll, Flame, Heart, Users, UserCheck, Sparkles, AlertTriangle, Frown, Lock } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'
import type { Story, StoryBranch, CustomerType } from '@/types'
import { calcStoryHeat } from '@/utils/storyHeat'
import { calcSerialExpect } from '@/utils/serialExpect'
import { calcAvgTasteMatch } from '@/utils/tasteMatch'
import { CUSTOMER_TEMPLATES } from '@/data/customers'

export default function StoryPicker() {
  const {
    availableStories,
    selectStory,
    currentStory,
    currentBranch,
    reputation,
    storyHistory,
    day,
    lastStoryDay,
    storyScores,
    startPerformance,
    customers,
    customerMoods,
    preScheduledSegments,
  } = useGameStore()

  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null)
  const seated = customers.filter((c) => c.seatId !== null)

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

  const selectedStory = selectedStoryId
    ? availableStories.find((s) => s.id === selectedStoryId)
    : null

  const tasteMatchForBranch = (branch: StoryBranch) => {
    return calcAvgTasteMatch(seated, branch)
  }

  const tasteMatchForStory = (story: Story) => {
    const best = story.branches.reduce(
      (best, b) => {
        const t = tasteMatchForBranch(b)
        return t.value > best.value ? t : best
      },
      { value: 0, details: {} }
    )
    return best
  }

  if (!currentStory) {
    return (
      <div className="scroll-panel">
        <h2 className="text-2xl font-brush text-sandal mb-2 flex items-center gap-2">
          <Scroll className="w-6 h-6" /> 选择今日故事
        </h2>
        <p className="text-sm text-ink-light mb-4">
          从备选故事中挑选一篇，并选择讲述分支。注意匹配客人们的口味偏好！
        </p>

        {neglectedTypes.length > 0 && (
          <div className="card-ancient p-3 mb-4 border-cinnabar/40 bg-cinnabar/5">
            <div className="flex items-start gap-2 text-sm">
              <AlertTriangle className="w-5 h-5 text-cinnabar flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-cinnabar mb-1">客群冷落警告</div>
                <div className="text-ink-light text-xs">
                  以下客群已被连续冷落，情绪低落，若继续忽视可能影响生意：
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {neglectedTypes.map((t) => {
                      const tpl = CUSTOMER_TEMPLATES.find((ct) => ct.type === t)
                      const mood = customerMoods.find((m) => m.type === t)
                      return (
                        <span key={t} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-cinnabar/20 text-cinnabar text-xs">
                          {tpl?.emoji} {t}（{mood?.consecutiveNeglectDays}日未照顾 · 情绪{mood?.mood}）
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableStories.map((story) => {
                const heat = calcStoryHeat(story, story.branches[0], storyHistory, reputation)
                const expect = calcSerialExpect(story.id, day, lastStoryDay, storyScores)
                const tasteMatch = tasteMatchForStory(story)
                const isSelected = selectedStoryId === story.id

                return (
                  <div
                    key={story.id}
                    onClick={() => setSelectedStoryId(isSelected ? null : story.id)}
                    className={`card-ancient cursor-pointer hover:-translate-y-1 transition-all border-2 ${
                      isSelected ? 'border-gold ring-2 ring-gold/30' : 'border-sandal/30 hover:border-gold'
                    }`}
                  >
                    <div className="aspect-[3/4] flex flex-col items-center justify-center bg-gradient-to-b from-paper to-paper-dark rounded-lg mb-3 border border-sandal/30">
                      <span className="text-5xl mb-2">📜</span>
                      <span className="font-brush text-xl text-sandal text-center px-2">
                        {story.title}
                      </span>
                    </div>

                    <div className="text-xs text-ink-light mb-2 line-clamp-2">{story.summary}</div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {story.tags.map((t) => (
                        <span key={t} className="tag-chip">#{t}</span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-cinnabar">
                          <Flame className="w-3 h-3" />
                        </div>
                        <div className="font-semibold text-cinnabar">{heat.value}</div>
                        <div className="text-[10px] text-ink-light">热度</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gold">
                          <Heart className="w-3 h-3" />
                        </div>
                        <div className="font-semibold text-gold">{expect.value}</div>
                        <div className="text-[10px] text-ink-light">期待</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-tea">
                          <Sparkles className="w-3 h-3" />
                        </div>
                        <div className="font-semibold text-tea">{tasteMatch.value}</div>
                        <div className="text-[10px] text-ink-light">口味匹配</div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="border-t border-sandal/20 pt-2 animate-unroll">
                        <div className="text-xs text-ink-light mb-2">选择分支：</div>
                        <div className="flex flex-col gap-1.5">
                          {story.branches.map((b: StoryBranch) => {
                            const tm = tasteMatchForBranch(b)
                            const stillNeglected = checkNeglectWarning(b.tags)
                            return (
                              <button
                                key={b.id}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  selectStory(story.id, b.id)
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-all border ${
                                  stillNeglected.length > 0
                                    ? 'bg-paper-dark/50 hover:bg-cinnabar/10 border-cinnabar/30 hover:border-cinnabar'
                                    : 'bg-paper-dark/50 hover:bg-gold/30 border-sandal/20 hover:border-gold'
                                }`}
                              >
                                <div className="font-medium flex justify-between items-center">
                                  <span>{b.title}</span>
                                  <span className={`text-xs font-semibold ${
                                    stillNeglected.length > 0 ? 'text-cinnabar' : 'text-tea'
                                  }`}>
                                    匹配 {tm.value}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {b.tags.map((t) => (
                                    <span key={t} className="text-[10px] text-tea">
                                      #{t}
                                    </span>
                                  ))}
                                </div>
                                {stillNeglected.length > 0 && (
                                  <div className="flex items-center gap-1 mt-1.5 text-[10px] text-cinnabar">
                                    <Frown className="w-3 h-3" />
                                    仍冷落：{stillNeglected.map((t) => {
                                      const tpl = CUSTOMER_TEMPLATES.find((ct) => ct.type === t)
                                      return <span key={t} className="inline-flex items-center gap-0.5">{tpl?.emoji}{t}</span>
                                    }).reduce((prev: any, curr: any, i: number) => i === 0 ? [curr] : [...prev, '、', curr], [])}
                                  </div>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card-ancient">
            <h3 className="font-brush text-lg text-sandal mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" /> 今日宾客 ({seated.length}人)
            </h3>

            {neglectedTypes.length > 0 && (
              <div className="mb-3 p-2 rounded border border-cinnabar/30 bg-cinnabar/5 text-[11px]">
                <div className="flex items-center gap-1 text-cinnabar font-semibold mb-1">
                  <AlertTriangle className="w-3 h-3" /> 情绪预警
                </div>
                <div className="flex flex-wrap gap-1 text-cinnabar">
                  {neglectedTypes.map((t) => {
                    const tpl = CUSTOMER_TEMPLATES.find((ct) => ct.type === t)
                    return <span key={t}>{tpl?.emoji}{t}</span>
                  })}
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {seated.map((c) => {
                const mood = customerMoods.find((m) => m.type === c.type)
                const isLowMood = mood && mood.mood < 40
                return (
                  <div
                    key={c.id}
                    className={`p-2 rounded-lg border ${
                      isLowMood ? 'bg-cinnabar/5 border-cinnabar/20' : 'bg-paper-dark/40 border-sandal/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{c.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-song font-medium text-sm truncate">
                          {c.name}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-ink-light">
                          <span>{c.type}</span>
                          {mood && mood.consecutiveNeglectDays >= 2 && (
                            <span className="text-cinnabar">（冷落{mood.consecutiveNeglectDays}日）</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gold font-semibold">
                          💰 {c.wealth}
                        </div>
                        <div className="text-[10px] text-ink-light">
                          慷慨 {'★'.repeat(c.generosity)}
                        </div>
                      </div>
                    </div>
                    {mood && (
                      <div className="h-1 bg-paper-dark rounded-full overflow-hidden mb-1.5">
                        <div
                          className={`h-full ${
                            mood.mood >= 70 ? 'bg-tea' : mood.mood >= 40 ? 'bg-gold' : 'bg-cinnabar'
                          }`}
                          style={{ width: `${mood.mood}%` }}
                        />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {c.preferenceTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-tea-light/30 text-tea border border-tea/30"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="divider-ancient text-xs">口味统计</div>
            <TasteStats customers={seated} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="scroll-panel">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-ink-light">已选故事</div>
            {preScheduledSegments.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sandal/20 text-sandal text-[10px] font-semibold">
                <Lock className="w-3 h-3" /> 预排锁定
              </span>
            )}
          </div>
          <div className="font-brush text-2xl text-sandal">{currentStory.title}</div>
          <div className="font-song text-lg text-ink mt-1">{currentBranch?.title}</div>
          {currentBranch && checkNeglectWarning(currentBranch.tags).length > 0 && (
            <div className="flex items-center gap-1 mt-2 text-xs text-cinnabar">
              <AlertTriangle className="w-3.5 h-3.5" />
              本桥段仍会冷落：
              {checkNeglectWarning(currentBranch.tags).map((t) => {
                const tpl = CUSTOMER_TEMPLATES.find((ct) => ct.type === t)
                return <span key={t} className="inline-flex items-center gap-0.5">{tpl?.emoji}{t}</span>
              }).reduce((prev: any, curr: any, i: number) => i === 0 ? [curr] : [...prev, '、', curr], [])}
            </div>
          )}
        </div>
        <button onClick={startPerformance} className="btn-gold text-lg px-6 py-3">
          🎭 开讲！
        </button>
      </div>
      <div className="p-4 bg-paper-dark/30 rounded-lg border border-sandal/20 font-song leading-relaxed text-ink">
        {currentBranch?.content}
      </div>
      <div className="flex flex-wrap gap-1 mt-3">
        {currentBranch?.tags.map((t) => (
          <span key={t} className="tag-chip">
            #{t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <UserCheck className="w-4 h-4 text-tea" />
        <span className="text-sm text-ink-light">
          口味匹配度：
          <span className="font-semibold text-tea ml-1">
            {seated.length > 0 ? tasteMatchForBranch(currentBranch!).value : 0}
          </span>
          <span className="text-xs text-ink-light ml-2">（{seated.length} 位宾客）</span>
        </span>
      </div>
    </div>
  )
}

function TasteStats({ customers }: { customers: ReturnType<typeof useGameStore.getState>['customers'] }) {
  const tagCounts: Record<string, number> = {}
  for (const c of customers) {
    for (const tag of c.preferenceTags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    }
  }

  const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-1.5">
      {sorted.map(([tag, count]) => (
        <div key={tag} className="flex items-center gap-2">
          <span className="text-xs text-tea w-24 truncate">#{tag}</span>
          <div className="flex-1 h-1.5 bg-paper-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-tea rounded-full"
              style={{ width: `${(count / customers.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-ink-light w-6 text-right">{count}</span>
        </div>
      ))}
    </div>
  )
}
