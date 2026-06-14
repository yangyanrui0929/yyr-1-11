import { useState, useCallback } from 'react'
import { Armchair, Move, X, Eye, MapPin } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'
import { GRID_COLS, GRID_ROWS, STAGE_POS, SEAT_PRICE_MULTIPLIER } from '@/data/seats'
import { calcSeatView } from '@/utils/seatView'
import type { Seat, CalcResult } from '@/types'

const TIER_COLORS: Record<string, string> = {
  普通: 'bg-sandal-light/50 border-sandal',
  雅座: 'bg-tea-light/50 border-tea',
  贵宾: 'bg-gold/60 border-gold',
}

const TIER_TEXT_COLOR: Record<string, string> = {
  普通: 'text-sandal',
  雅座: 'text-tea',
  贵宾: 'text-gold',
}

export default function SeatGrid() {
  const { seats, renovations, moveSeat, customers } = useGameStore()
  const [dragging, setDragging] = useState<number | null>(null)
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)

  const viewCache = new Map(seats.map((s) => [s.id, calcSeatView(s, renovations)]))

  const handleCellDrop = useCallback(
    (x: number, y: number) => {
      if (dragging === null) return
      if (x === STAGE_POS.x && y === STAGE_POS.y) {
        setDragging(null)
        return
      }
      const occupied = seats.some((s) => s.x === x && s.y === y && s.id !== dragging)
      if (occupied) {
        setDragging(null)
        return
      }
      moveSeat(dragging, x, y)
      setDragging(null)
    },
    [dragging, seats, moveSeat]
  )

  const handleSeatClick = (seat: Seat) => {
    if (dragging !== null) return
    setSelectedSeat(seat)
  }

  const selectedView: CalcResult | null = selectedSeat
    ? viewCache.get(selectedSeat.id) || null
    : null

  const seatedCustomer = selectedSeat
    ? customers.find((c) => c.seatId === selectedSeat.id)
    : null

  return (
    <div className="scroll-panel">
      <h2 className="text-2xl font-brush text-sandal mb-2 flex items-center gap-2">
        <Armchair className="w-6 h-6" /> 座位排布
      </h2>
      <p className="text-sm text-ink-light mb-4">
        拖拽座位调整位置，距离说书台越近视野越好。点击座位查看视野评分详情
      </p>

      <div className="flex flex-wrap gap-4 mb-4">
        {(['贵宾', '雅座', '普通'] as const).map((t) => (
          <div key={t} className="flex items-center gap-2 text-sm">
            <div className={`w-4 h-4 rounded ${TIER_COLORS[t]} border-2`} />
            <span className="font-song">{t}座 · 票价倍率 x{SEAT_PRICE_MULTIPLIER[t]}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <div
          className="relative bg-paper-dark/50 rounded-lg p-4 border-2 border-sandal/30 flex-1"
          style={{ minHeight: 320 }}
        >
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0,1fr))` }}>
            {Array.from({ length: GRID_ROWS }).map((_, y) =>
              Array.from({ length: GRID_COLS }).map((__, x) => {
                const isStage = x === STAGE_POS.x && y === STAGE_POS.y
                const seat = seats.find((s) => s.x === x && s.y === y)

                if (isStage) {
                  return (
                    <div
                      key={`${x}-${y}`}
                      className="aspect-square flex flex-col items-center justify-center bg-cinnabar/20 border-2 border-cinnabar rounded-lg"
                    >
                      <span className="text-2xl">🎭</span>
                      <span className="text-xs font-brush text-cinnabar">说书台</span>
                    </div>
                  )
                }

                if (seat) {
                  const view = viewCache.get(seat.id)?.value || 0
                  const isSelected = selectedSeat?.id === seat.id
                  return (
                    <div
                      key={`${x}-${y}`}
                      draggable
                      onDragStart={() => setDragging(seat.id)}
                      onDragEnd={() => setDragging(null)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleCellDrop(x, y)}
                      onClick={() => handleSeatClick(seat)}
                      className={`aspect-square flex flex-col items-center justify-center rounded-lg border-2 cursor-move transition-all relative ${TIER_COLORS[seat.tier]} ${
                        dragging === seat.id ? 'opacity-50 scale-95' : 'hover:scale-105 hover:shadow-md'
                      } ${isSelected ? 'ring-2 ring-cinnabar ring-offset-2' : ''}`}
                    >
                      <Move className="w-3 h-3 text-ink-light absolute top-0.5 right-0.5 opacity-50" />
                      <span className="text-xl">{seat.occupied ? '👤' : '🪑'}</span>
                      <span className="text-[10px] font-song text-ink-light">{seat.tier}</span>
                      <div
                        className="text-[10px] font-semibold"
                        style={{ color: view > 70 ? '#6B8E5A' : view > 40 ? '#C9A24B' : '#A83232' }}
                      >
                        视野 {view}
                      </div>
                    </div>
                  )
                }

                return (
                  <div
                    key={`${x}-${y}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleCellDrop(x, y)}
                    className="aspect-square flex items-center justify-center border-2 border-dashed border-sandal/20 rounded-lg text-sandal/30 text-xs hover:bg-sandal/5"
                  >
                    空位
                  </div>
                )
              })
            )}
          </div>
        </div>

        {selectedSeat && selectedView && (
          <div className="w-64 card-ancient animate-unroll flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-brush text-xl text-sandal flex items-center gap-2">
                <Eye className="w-5 h-5" /> 座位详情
              </h3>
              <button
                onClick={() => setSelectedSeat(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-paper-dark text-ink-light"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className={`text-center py-3 rounded-lg mb-4 ${TIER_COLORS[selectedSeat.tier]}`}>
              <div className="text-4xl mb-1">{selectedSeat.occupied ? '👤' : '🪑'}</div>
              <div className={`font-brush text-lg ${TIER_TEXT_COLOR[selectedSeat.tier]}`}>
                {selectedSeat.tier}座 · 第{selectedSeat.id}号
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-ink-light flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> 位置
                </span>
                <span className="font-medium">列 {selectedSeat.x + 1}，排 {selectedSeat.y + 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-light">票价倍率</span>
                <span className="font-medium text-gold">x{SEAT_PRICE_MULTIPLIER[selectedSeat.tier]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-light">入座状态</span>
                <span className={selectedSeat.occupied ? 'text-tea' : 'text-ink-light'}>
                  {selectedSeat.occupied ? '已入座' : '空闲'}
                </span>
              </div>
            </div>

            {seatedCustomer && (
              <div className="p-2 bg-paper-dark/50 rounded-lg mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{seatedCustomer.emoji}</span>
                  <div>
                    <div className="font-medium">{seatedCustomer.name}</div>
                    <div className="text-xs text-ink-light">{seatedCustomer.type}</div>
                  </div>
                </div>
                <div className="text-xs text-ink-light mt-1">
                  喜好：{seatedCustomer.preferenceTags.slice(0, 3).join('、')}
                </div>
              </div>
            )}

            <div className="divider-ancient text-sm">视野评分明细</div>
            <div className="space-y-1.5 text-sm">
              {Object.entries(selectedView.details).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-ink-light">{key}</span>
                  <span className="font-medium">{typeof val === 'number' ? val : val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
