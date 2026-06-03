import { useState } from 'react'
import './index.css'
import Sidebar from './components/Sidebar'
import CommandCenter from './pages/CommandCenter'
import AgentRunner from './pages/AgentRunner'
import MarketDashboard from './pages/MarketDashboard'
import CompetitorDashboard from './pages/CompetitorDashboard'
import SurveyDashboard from './pages/SurveyDashboard'
import InsightEngine from './pages/InsightEngine'

const SCREENS = {
  command: CommandCenter,
  agent: AgentRunner,
  market: MarketDashboard,
  competitor: CompetitorDashboard,
  survey: SurveyDashboard,
  insight: InsightEngine,
}

export default function App() {
  const [screen, setScreen] = useState('command')
  const [researchData, setResearchData] = useState(null)
  const [productQuery, setProductQuery] = useState('')

  const Screen = SCREENS[screen]

  return (
    <div className="flex h-screen bg-[#faf8f5] text-[#1a1209] overflow-hidden">
      <Sidebar activeScreen={screen} onNavigate={setScreen} researchData={researchData} />
      <main className="flex-1 overflow-auto">
        <Screen
          onNavigate={setScreen}
          researchData={researchData}
          setResearchData={setResearchData}
          productQuery={productQuery}
          setProductQuery={setProductQuery}
        />
      </main>
    </div>
  )
}
