import { useState } from 'react'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'

export default function TeaShop() {
  const { snacks, gold, buySnack } = useGameStore()
  const [qtys, setQtys] = useState<Record<string, number>>({})

  const groupedByCategory = snacks.reduce(
    (acc, s) => {
      if (!acc[s.category]) acc[s.category] = []
      acc[s.category].push(s)
      return acc
    },
    {} as Record<string, typeof snacks>
  )

  const setQty = (id: string, v: number) =>
    setQtys((q) => ({ ...q, [id]: Math.max(0, Math.min(20, v)) }))

  const handleBuy = (id: string) => {
    const q = qtys[id] || 0
    if (q > 0) buySnack(id, q)
    setQty(id, 0)
  }

  return (
    <div className="scroll-panel">
      <h2 className="text-2xl font-brush text-sandal mb-2 flex items-center gap-2">
        <ShoppingCart className="w-6 h-6" /> 茶点采购
      </h2>
      <p className="text-sm text-ink-light mb-4">采购今日所需茶点，客人们听书时会自行购买消费</p>

      {Object.entries(groupedByCategory).map(([cat, list]) => (
        <div key={cat} className="mb-5">
          <div className="divider-ancient font-brush text-lg">【{cat}】</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {list.map((s) => {
              const q = qtys[s.id] || 0
              const totalCost = s.cost * q
              const canBuy = gold >= totalCost && q > 0
              const stockPct = (s.stock / s.maxStock) * 100
              return (
                <div key={s.id} className="card-ancient">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{s.emoji}</span>
                        <div>
                          <div className="font-song font-semibold text-ink">{s.name}</div>
                          <div className="text-xs text-ink-light">
                            进价 {s.cost}文 · 售价 {s.price}文 · 品质 {'★'.repeat(s.quality)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-ink-light mb-1">
                          <span>库存</span>
                          <span>{s.stock} / {s.maxStock}</span>
                        </div>
                        <div className="h-2 bg-paper-dark rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              stockPct < 20 ? 'bg-cinnabar' : stockPct < 50 ? 'bg-gold' : 'bg-tea'
                            }`}
                            style={{ width: `${stockPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-sandal/20">
                    <div className="flex items-center gap-1 bg-paper-dark rounded-full px-1">
                      <button
                        onClick={() => setQty(s.id, q - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-sandal/20 text-sandal"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-song font-semibold">{q}</span>
                      <button
                        onClick={() => setQty(s.id, q + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-sandal/20 text-sandal"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      {q > 0 && (
                        <div className="text-xs text-ink-light">合计 {totalCost} 文</div>
                      )}
                      <button
                        onClick={() => handleBuy(s.id)}
                        disabled={!canBuy}
                        className="btn-gold text-sm py-1.5 px-3 mt-1"
                      >
                        采购
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
