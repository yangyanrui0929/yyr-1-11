import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import DayPhase from '@/pages/DayPhase'
import NightPhase from '@/pages/NightPhase'
import Archive from '@/pages/Archive'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/day" element={<DayPhase />} />
        <Route path="/night" element={<NightPhase />} />
        <Route path="/archive" element={<Archive />} />
      </Routes>
    </Router>
  )
}
