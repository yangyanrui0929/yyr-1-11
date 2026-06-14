import { MessageCircle } from 'lucide-react'
import type { InterruptionEvent, InterruptionOption } from '@/types'

interface Props {
  event: InterruptionEvent
  onChoose: (opt: InterruptionOption) => void
}

export default function Interruption({ event, onChoose }: Props) {
  return (
    <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4 animate-unroll">
      <div className="scroll-panel max-w-lg w-full animate-unroll">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-cinnabar/20 border-2 border-cinnabar flex items-center justify-center text-2xl animate-shake">
            <MessageCircle className="w-6 h-6 text-cinnabar" />
          </div>
          <div>
            <div className="text-xs text-cinnabar font-semibold">⚠ 客人插话</div>
            <div className="font-song text-ink text-base leading-relaxed mt-1">{event.content}</div>
          </div>
        </div>

        <div className="divider-ancient text-sm font-brush">如何应对？</div>

        <div className="space-y-2">
          {event.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => onChoose(opt)}
              className="w-full text-left p-3 rounded-lg bg-paper-dark/40 border-2 border-sandal/30 hover:border-gold hover:bg-gold/10 transition-all group"
            >
              <div className="font-song text-sm text-ink group-hover:text-sandal font-medium">
                {['甲', '乙', '丙', '丁'][idx]}、{opt.text}
              </div>
              <div className="flex gap-3 mt-1 text-xs">
                {opt.satisfactionEffect !== 0 && (
                  <span className={opt.satisfactionEffect > 0 ? 'text-tea' : 'text-cinnabar'}>
                    满意度 {opt.satisfactionEffect > 0 ? '+' : ''}{opt.satisfactionEffect}
                  </span>
                )}
                {opt.reputationEffect !== 0 && (
                  <span className={opt.reputationEffect > 0 ? 'text-gold' : 'text-cinnabar'}>
                    声望 {opt.reputationEffect > 0 ? '+' : ''}{opt.reputationEffect}
                  </span>
                )}
                {opt.goldEffect !== 0 && (
                  <span className={opt.goldEffect > 0 ? 'text-gold' : 'text-cinnabar'}>
                    金币 {opt.goldEffect > 0 ? '+' : ''}{opt.goldEffect}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
