import { LayoutDashboard, Bot, TrendingUp, Users, ClipboardList, Lightbulb, Lock } from 'lucide-react'
import nestleLogo from '../assets/Nestle-Logo.png'

const NAV = [
  { id: 'command',    label: 'Command Center',     icon: LayoutDashboard, desc: 'Launch Research' },
  { id: 'agent',      label: 'Agent Pipeline',     icon: Bot,             desc: 'Live Execution' },
  { id: 'market',     label: 'Market Opportunity', icon: TrendingUp,      desc: 'Sizing & Trends' },
  { id: 'competitor', label: 'Competitive Intel',  icon: Users,           desc: 'Landscape Analysis' },
  { id: 'survey',     label: 'Survey Intelligence',icon: ClipboardList,   desc: 'Consumer Insights' },
  { id: 'insight',    label: 'Insight Engine',     icon: Lightbulb,       desc: 'Unified Summary' },
]

export default function Sidebar({ activeScreen, onNavigate, researchData }) {
  return (
    <aside className="w-64 bg-white border-r flex flex-col shrink-0" style={{ borderColor: '#ddd0c0' }}>

      {/* Brand Header */}
      <div className="border-b" style={{ borderColor: '#ddd0c0', backgroundColor: '#63513d' }}>
        {/* Logo area */}
        <div className="flex items-center justify-center pt-5 pb-3 px-5">
          <div className="bg-white rounded-xl px-4 py-2.5 flex items-center justify-center w-full">
            <img
              src={nestleLogo}
              alt="Nestlé"
              className="h-12 w-auto object-contain"
              style={{ filter: 'brightness(0) saturate(100%) invert(22%) sepia(20%) saturate(800%) hue-rotate(5deg) brightness(70%)' }}
            />
          </div>
        </div>

        {/* App name */}
        <div className="px-5 pb-3 text-center">
          <p className="text-white font-bold text-base tracking-widest uppercase">Nestle Intel</p>
          <p className="text-white/55 text-xs mt-0.5">AI Research Platform</p>
        </div>

        {/* Status pill */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${researchData ? 'bg-emerald-400' : 'bg-white/40'}`} />
            <span className="text-white/70 text-xs">
              {researchData ? 'Research Complete' : 'Awaiting Research'}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="text-xs font-semibold uppercase tracking-widest px-3 py-2 mt-1" style={{ color: '#c4a882' }}>
          Navigation
        </p>
        {NAV.map(({ id, label, icon: Icon, desc }) => {
          const active = activeScreen === id
          const locked = id !== 'command' && id !== 'agent' && !researchData

          return (
            <button
              key={id}
              onClick={() => !locked && onNavigate(id)}
              disabled={locked}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                active       ? 'text-white shadow-sm'          :
                locked       ? 'opacity-40 cursor-not-allowed' :
                               'hover:bg-[#f5ede3]'
              }`}
              style={active ? { backgroundColor: '#63513d' } : {}}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                active ? 'bg-white/20' : 'bg-[#f5ede3] group-hover:bg-[#ede0d0]'
              }`}>
                <Icon size={15} style={{ color: active ? '#fff' : '#63513d' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${active ? 'text-white' : 'text-[#1a1209]'}`}>{label}</p>
                <p className={`text-xs truncate ${active ? 'text-white/60' : 'text-[#8b7355]'}`}>{desc}</p>
              </div>
              {locked && <Lock size={11} style={{ color: '#c4a882' }} />}
            </button>
          )
        })}
      </nav>

    </aside>
  )
}
