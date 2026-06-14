import { Hammer, Star, ArrowUp } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'
import { getUpgradeCost } from '@/data/renovations'

export default function Renovation() {
  const { renovations, gold, upgradeRenovation } = useGameStore()

  return (
    <div className="scroll-panel">
      <h2 className="text-2xl font-brush text-sandal mb-2 flex items-center gap-2">
        <Hammer className="w-6 h-6" /> 茶楼装修
      </h2>
      <p className="text-sm text-ink-light mb-4">升级装修项目，提升茶楼舒适度与声望加成</p>

      <div className="space-y-3">
        {renovations.map((r) => {
          const cost = getUpgradeCost(r)
          const maxed = r.level >= r.maxLevel
          const canAfford = gold >= cost
          return (
            <div key={r.id} className="card-ancient">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{r.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-song font-semibold text-ink text-lg">{r.name}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: r.maxLevel }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < r.level ? 'text-gold fill-gold' : 'text-sandal/20'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-ink-light mt-0.5">{r.description}</div>
                    <div className="flex gap-4 mt-1 text-xs">
                      <span className="text-cinnabar">声望 +{r.level * r.bonusReputation}</span>
                      <span className="text-tea">舒适度 +{Math.round(r.level * r.bonusComfort * 100)}%</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {maxed ? (
                    <div className="text-gold font-brush text-lg">已满级</div>
                  ) : (
                    <>
                      <div className="text-xs text-ink-light mb-1">升级费用</div>
                      <div className="text-gold font-semibold text-lg mb-2">{cost} 文</div>
                      <button
                        onClick={() => upgradeRenovation(r.id)}
                        disabled={!canAfford}
                        className="btn-gold text-sm py-1.5 px-3"
                      >
                        <ArrowUp className="w-4 h-4" /> 升级
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
