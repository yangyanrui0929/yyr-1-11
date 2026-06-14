import { useEffect } from 'react'
import { Users } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'
import Interruption from './Interruption'

function getMood(sat: number): string {
  if (sat >= 80) return '😍'
  if (sat >= 60) return '😊'
  if (sat >= 40) return '😐'
  if (sat >= 20) return '😕'
  return '😠'
}

export default function Performance() {
  const {
    customers,
    currentStory,
    currentBranch,
    storyProgress,
    performanceActive,
    currentInterruption,
    tickPerformance,
    handleInterruption,
  } = useGameStore()

  useEffect(() => {
    if (!performanceActive) return
    const timer = setInterval(tickPerformance, 800)
    return () => clearInterval(timer)
  }, [performanceActive, tickPerformance])

  const seated = customers.filter((c) => c.seatId !== null)
  const avgSat =
    seated.length > 0
      ? Math.round(seated.reduce((s, c) => s + c.satisfaction, 0) / seated.length)
      : 0

  if (!performanceActive && storyProgress === 0) {
    return (
      <div className="scroll-panel text-center py-12">
        <span className="text-6xl mb-4 block">🎭</span>
        <div className="font-brush text-2xl text-sandal mb-2">等待开讲</div>
        <div className="text-ink-light">请先选择故事与分支</div>
      </div>
    )
  }

  return (
    <div className="scroll-panel">
      <h2 className="text-2xl font-brush text-sandal mb-4 flex items-center gap-2">
        <Users className="w-6 h-6" /> 开讲现场
      </h2>

      {currentInterruption && <Interruption event={currentInterruption} onChoose={handleInterruption} />}

      <div className="relative">
        <div className="text-center py-6 bg-gradient-to-b from-cinnabar/10 to-paper rounded-xl border-2 border-cinnabar/30 mb-6">
          <div className="text-7xl mb-2">🎙️</div>
          <div className="font-brush text-2xl text-cinnabar">{currentStory?.title}</div>
          <div className="text-ink-light mt-1">{currentBranch?.title}</div>
          <div className="text-sm text-sandal mt-3 font-song italic">
            {currentBranch?.content?.slice(0, Math.floor((storyProgress / 100) * currentBranch.content.length))}
            <span className="animate-pulse text-cinnabar">▊</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-song">说书进度</span>
            <span className="font-semibold text-sandal">{storyProgress}%</span>
          </div>
          <div className="h-3 bg-paper-dark rounded-full overflow-hidden border border-sandal/30">
            <div
              className="h-full bg-gradient-to-r from-gold via-cinnabar to-sandal transition-all duration-500"
              style={{ width: `${storyProgress}%` }}
            />
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-ink-light">
            观众 <span className="font-semibold text-ink">{seated.length}</span> 人
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-light">平均满意度</span>
            <span className="text-2xl">{getMood(avgSat)}</span>
            <span className="font-bold text-lg" style={{ color: avgSat > 60 ? '#6B8E5A' : avgSat > 40 ? '#C9A24B' : '#A83232' }}>
              {avgSat}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
          {seated.map((c) => (
            <div
              key={c.id}
              className={`card-ancient p-2 text-center transition-all ${c.satisfaction < 40 ? 'animate-shake border-cinnabar' : ''}`}
            >
              <div className="text-2xl">{c.emoji}</div>
              <div className="text-xs font-song truncate">{c.name}</div>
              <div className="text-xl my-1">{getMood(c.satisfaction)}</div>
              <div className="h-1.5 bg-paper-dark rounded-full overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${c.satisfaction}%`,
                    backgroundColor: c.satisfaction > 60 ? '#6B8E5A' : c.satisfaction > 40 ? '#C9A24B' : '#A83232',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
