import { useState } from 'react'
import { Search, Zap, Coffee, ArrowRight, ChevronRight, Clock, CheckCircle2 } from 'lucide-react'

const SUGGESTIONS = [
  'High-protein coffee with 15g protein per serving for Indian market',
  'Ready-to-drink protein coffee targeting fitness enthusiasts aged 25–40',
  'Instant protein coffee sachet at ₹35 for working professionals in Tier 1 cities',
]

const STATS = [
  { label: 'Manual Research Replaced', value: 'Weeks → Hours', icon: Clock },
  { label: 'AI Agents Deployed', value: '5 Parallel Agents', icon: Zap },
  { label: 'Insights Generated', value: 'Market + Competitor + Survey', icon: CheckCircle2 },
]

export default function CommandCenter({ onNavigate, setProductQuery, productQuery }) {
  const [input, setInput] = useState(productQuery || 'High-protein coffee with 15g protein per serving for Indian market')

  function handleLaunch() {
    if (!input.trim()) return
    setProductQuery(input.trim())
    onNavigate('agent')
  }

  return (
    <div className="min-h-full flex flex-col bg-[#faf8f5]">
      {/* Page Header */}
      <div className="bg-white border-b px-8 py-5 flex items-center justify-between" style={{ borderColor: '#ddd0c0' }}>
        <div>
          <h1 className="text-xl font-bold text-[#1a1209]">Command Center</h1>
          <p className="text-sm mt-0.5 text-[#8b7355]">Describe your product concept · AI agents do the rest</p>
        </div>
        <div className="flex items-center gap-2 rounded-full px-4 py-1.5 border text-xs font-medium" style={{ backgroundColor: '#f5ede3', borderColor: '#ddd0c0', color: '#63513d' }}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
          5 Agents Ready
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 max-w-3xl mx-auto w-full">

        {/* Hero Text */}
        <div className="text-center mb-8 w-full">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-5 border" style={{ backgroundColor: '#f5ede3', borderColor: '#c4a882', color: '#63513d' }}>
            <Zap size={12} />
            Multi-Agent Consumer Research Platform
          </div>
          <h2 className="text-4xl font-black text-[#1a1209] mb-3 leading-tight">
            From Brief to Synthesised<br />
            <span style={{ color: '#63513d' }}>Market Intelligence — Automatically.</span>
          </h2>
          <p className="text-[#6b5b4e] text-base leading-relaxed">
            What takes your research team <span className="font-bold text-red-600">weeks of manual searching</span>, our AI agents synthesise overnight — at scale.<br />
            Market sizing, competitor mapping, consumer surveys, and a unified executive brief, all in one place.
          </p>
        </div>

        {/* Input Card */}
        <div className="w-full bg-white rounded-2xl shadow-lg border overflow-hidden" style={{ borderColor: '#ddd0c0' }}>
          {/* Card Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: '#ede0d0', backgroundColor: '#faf8f5' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#63513d' }}>
              <Coffee size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1a1209]">Product Research Brief</p>
              <p className="text-xs text-[#8b7355]">Be as specific as possible for best results</p>
            </div>
          </div>

          <div className="p-5">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. I want to launch a high-protein coffee with 15g protein targeting fitness-conscious consumers in India at ₹35–40 per sachet..."
              rows={4}
              className="w-full rounded-xl px-4 py-3 text-sm text-[#1a1209] placeholder-[#c4a882] resize-none focus:outline-none transition-all border"
              style={{ backgroundColor: '#faf8f5', borderColor: '#ddd0c0', lineHeight: '1.6' }}
              onFocus={e => e.target.style.borderColor = '#63513d'}
              onBlur={e => e.target.style.borderColor = '#ddd0c0'}
            />

            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-[#c4a882]">{input.length} / 500 characters</p>
              <button
                onClick={handleLaunch}
                disabled={!input.trim()}
                className="flex items-center gap-2 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all duration-150 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                style={{ backgroundColor: '#63513d' }}
              >
                <Search size={15} />
                Launch Research Pipeline
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="w-full mt-4">
          <p className="text-xs font-semibold text-[#8b7355] uppercase tracking-wider mb-2.5 px-1">Quick Start Templates</p>
          <div className="space-y-2">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="w-full flex items-center gap-3 bg-white hover:bg-[#f5ede3] border rounded-xl px-4 py-3 text-left transition-all duration-150 group"
                style={{ borderColor: '#ddd0c0' }}
              >
                <ChevronRight size={14} style={{ color: '#c4a882' }} className="shrink-0 group-hover:text-[#63513d] transition-colors" />
                <span className="text-sm text-[#4a3c2d] group-hover:text-[#1a1209] transition-colors">{s}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="w-full mt-6 grid grid-cols-3 gap-3">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white border rounded-xl p-4 text-center" style={{ borderColor: '#ddd0c0' }}>
              <Icon size={18} style={{ color: '#63513d' }} className="mx-auto mb-2" />
              <p className="text-sm font-bold text-[#1a1209]">{value}</p>
              <p className="text-xs text-[#8b7355] mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Pipeline Steps */}
        <div className="w-full mt-5 flex items-center justify-center gap-1.5 flex-wrap">
          {['Market Scoping', 'Competitor Intel', 'Consumer Sentiment', 'Survey Design', 'Synthesis'].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-1.5">
              <div className="text-xs px-3 py-1.5 rounded-full border font-medium" style={{ backgroundColor: '#f5ede3', borderColor: '#ddd0c0', color: '#63513d' }}>{step}</div>
              {i < arr.length - 1 && <ArrowRight size={11} style={{ color: '#c4a882' }} />}
            </div>
          ))}
        </div>
        <p className="text-xs text-[#c4a882] mt-2">5-stage parallel agentic pipeline · Powered by Claude AI · Save hundreds of hours of manual research</p>
      </div>
    </div>
  )
}
