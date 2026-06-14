import { Link } from 'react-router-dom'
import { Sun, Moon, BookOpen, RotateCcw } from 'lucide-react'
import StatusPanel from '@/components/StatusPanel'
import { useGameStore } from '@/store/useGameStore'

export default function Home() {
  const { phase, day, gold, reputation, storyHistory, resetGame } = useGameStore()

  const totalEarnings = storyHistory.reduce((s, r) => s + r.earnings, 0)
  const totalAudience = storyHistory.reduce((s, r) => s + r.audienceCount, 0)
  const avgSatisfaction =
    storyHistory.length > 0
      ? Math.round(storyHistory.reduce((s, r) => s + r.avgSatisfaction, 0) / storyHistory.length)
      : 0

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <StatusPanel />

        <div className="scroll-panel mb-6 text-center">
          <h1 className="font-brush text-5xl text-sandal mb-2">🏮 听雨茶楼 🏮</h1>
          <p className="text-ink-light font-song">
            白日备茶迎客，夜来说书论道。经营一方茶楼，书写千古传奇。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {phase === 'day' ? (
            <Link to="/day" className="block">
              <div className="scroll-panel h-full cursor-pointer hover:-translate-y-1 transition-all border-gold">
                <div className="flex items-center gap-4 mb-3">
                  <Sun className="w-12 h-12 text-gold" />
                  <div>
                    <h2 className="font-brush text-3xl text-sandal">白日经营</h2>
                    <p className="text-ink-light text-sm font-song">采购茶点 · 排布座位 · 装修升级</p>
                  </div>
                </div>
                <div className="text-sm text-sandal font-song">
                  ☀ 打理茶楼，为晚间说书做好准备 →
                </div>
              </div>
            </Link>
          ) : (
            <Link to="/night" className="block">
              <div className="scroll-panel h-full cursor-pointer hover:-translate-y-1 transition-all border-cinnabar bg-gradient-to-b from-paper to-paper-dark">
                <div className="flex items-center gap-4 mb-3">
                  <Moon className="w-12 h-12 text-sandal" />
                  <div>
                    <h2 className="font-brush text-3xl text-cinnabar">夜晚开讲</h2>
                    <p className="text-ink-light text-sm font-song">选故事 · 开讲演出 · 应对插话 · 结算打赏</p>
                  </div>
                </div>
                <div className="text-sm text-cinnabar font-song">
                  🌙 宾客已至，好戏即将开场 →
                </div>
              </div>
            </Link>
          )}

          <Link to="/archive" className="block">
            <div className="scroll-panel h-full cursor-pointer hover:-translate-y-1 transition-all">
              <div className="flex items-center gap-4 mb-3">
                <BookOpen className="w-12 h-12 text-tea" />
                <div>
                  <h2 className="font-brush text-3xl text-sandal">档案总览</h2>
                  <p className="text-ink-light text-sm font-song">故事记录 · 顾客偏好 · 声望历史</p>
                </div>
              </div>
              <div className="text-sm text-tea font-song">
                📚 查看茶楼经营数据与历史档案 →
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="card-ancient text-center">
            <div className="stat-label">经营天数</div>
            <div className="stat-value">{day} 日</div>
          </div>
          <div className="card-ancient text-center">
            <div className="stat-label">累计收入</div>
            <div className="stat-value text-gold">{totalEarnings}</div>
          </div>
          <div className="card-ancient text-center">
            <div className="stat-label">累计听众</div>
            <div className="stat-value text-tea">{totalAudience}</div>
          </div>
          <div className="card-ancient text-center">
            <div className="stat-label">平均满意度</div>
            <div className="stat-value text-cinnabar">{avgSatisfaction}</div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={() => {
            if (confirm('确定要重置游戏进度吗？所有数据将清空！')) resetGame()
          }} className="btn-danger text-sm opacity-60 hover:opacity-100">
            <RotateCcw className="w-4 h-4" /> 重置游戏
          </button>
        </div>
      </div>
    </div>
  )
}
