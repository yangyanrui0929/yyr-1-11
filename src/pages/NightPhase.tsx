import { Link } from 'react-router-dom'
import { ArrowLeft, Sun } from 'lucide-react'
import StatusPanel from '@/components/StatusPanel'
import StoryPicker from '@/components/StoryPicker'
import Performance from '@/components/Performance'
import Settlement from '@/components/Settlement'
import { useGameStore } from '@/store/useGameStore'

export default function NightPhase() {
  const { phase } = useGameStore()

  if (phase !== 'night') {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <StatusPanel />
          <div className="scroll-panel text-center py-12">
            <Sun className="w-16 h-16 text-gold mx-auto mb-4" />
            <h2 className="font-brush text-3xl text-sandal mb-2">尚未入夜</h2>
            <p className="text-ink-light mb-6">请先在白天做好经营准备</p>
            <Link to="/day" className="btn-gold">前往白天经营 →</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <StatusPanel />

        <div className="mb-6">
          <Link to="/" className="btn-wood text-sm">
            <ArrowLeft className="w-4 h-4" /> 返回首页
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <StoryPicker />
          <Performance />
        </div>

        <Settlement />
      </div>
    </div>
  )
}
