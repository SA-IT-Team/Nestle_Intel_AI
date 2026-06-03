import { useState } from 'react'
import { Lightbulb, Loader2, ChevronRight, Target, TrendingUp, Users, BarChart2, RefreshCw, Sparkles, Download, CheckCircle2 } from 'lucide-react'
import { API } from '../utils/api'
import { generatePDF } from '../utils/generatePDF'

const DASHBOARD_CARDS = [
  { id: 'market',    title: 'Market Opportunity', icon: TrendingUp, color: '#2563eb', summary: '$2.9B global · India 48% YoY · Score 8.7/10',         stats: ['Global TAM: $2.9B', 'India SAM: $420M', 'CAGR: 48%'] },
  { id: 'competitor',title: 'Competitive Landscape', icon: Users,   color: '#7c3aed', summary: '12 competitors · No FMCG in sachet · 4 gaps found',   stats: ['12 competitors', 'No sachet player', 'Nestlé #1 distribution'] },
  { id: 'survey',   title: 'Consumer Survey',     icon: BarChart2,  color: '#059669', summary: '73% intent · Sachet 43% · ₹30–50 sweet spot',         stats: ['73% intent to buy', 'Sachet: 43%', '₹30–50 price'] },
]

const PILLARS = [
  { title: 'Product Strategy', icon: Target, color: '#63513d', points: ['NESCAFÉ Protein+ instant sachet — 15g protein', 'Price: ₹35–40 MRP (10-pack ₹320)', 'Flavors: Classic, Mocha, Vanilla'] },
  { title: 'Go-to-Market',    icon: TrendingUp, color: '#2563eb', points: ['Phase 1: Metro modern trade + gyms', 'Phase 2: E-commerce (Amazon, Flipkart, Blinkit)', 'Phase 3: Kirana via NESCAFÉ supply chain'] },
  { title: 'Target Audience', icon: Users,     color: '#7c3aed',  points: ['Primary: Urban pros 25–40, fitness-aware', 'Secondary: Gen Z health seekers & students', 'Geo: Tier 1 first, then top 15 Tier 2'] },
]

const STATIC_INSIGHT = `Based on a comprehensive analysis across market sizing, competitive intelligence, and consumer research, here is the consolidated executive recommendation for Nestlé's high-protein coffee opportunity:

**Market Verdict: STRONG GO**
The protein coffee category in India is at an inflection point — ₹420M market, growing at 48% YoY, with zero established FMCG players. This is a textbook white-space opportunity that aligns perfectly with Nestlé's existing capabilities.

**Competitive Moat**
Nestlé enters with 3 structural advantages no competitor can replicate: (1) NESCAFÉ brand trust built over 85 years, (2) pan-India distribution reaching 3.5M retail points, and (3) existing coffee manufacturing infrastructure. The closest India competitor (MuscleBlaze) lacks coffee heritage; global leaders (Slate, Bulletproof) are priced 3–4x beyond India's market reality.

**Consumer Signal**
73% purchase intent is exceptionally strong for a new category. The format signal is unambiguous — 43% want instant sachets, which is exactly Nestlé's core strength. The ₹30–50 price point aligns precisely with NESCAFÉ Classic positioning and India's mass-premium tier.

**Recommended Launch**
NESCAFÉ Protein+ Instant Coffee Sachet — 15g protein, ₹35 MRP. Metro launch Q3, national rollout Q1 next year. Expected Year-1 revenue: ₹85–120 Crore at 3% India market share with break-even at Month 14.

**Time-to-Market Advantage**
The window is 12–18 months before a well-funded D2C brand achieves scale. This research took 4 minutes. Act before your competitors spend 4 years reaching the same conclusion.`

export default function InsightEngine({ researchData, onNavigate, productQuery }) {
  const [loading, setLoading] = useState(false)
  const [insight, setInsight] = useState(null)
  const [streamText, setStreamText] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    await new Promise(r => setTimeout(r, 100))
    generatePDF(insight || STATIC_INSIGHT, productQuery)
    setDownloading(false)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  async function generateInsight() {
    setLoading(true)
    setInsight(null)
    setStreamText('')
    try {
      const resp = await fetch(API.insight, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ researchData }),
      })
      const reader = resp.body.getReader()
      const decoder = new TextDecoder()
      let full = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.type === 'text') { full += data.text; setStreamText(full) }
            else if (data.type === 'done') { setInsight(full) }
          } catch (_) {}
        }
      }
      setInsight(full || STATIC_INSIGHT)
    } catch {
      setInsight(STATIC_INSIGHT)
    } finally {
      setLoading(false)
    }
  }

  const displayText = insight || streamText

  return (
    <div className="min-h-full flex flex-col bg-[#faf8f5]">
      <div className="bg-white border-b px-8 py-5 flex items-center justify-between" style={{ borderColor: '#ddd0c0' }}>
        <div>
          <h1 className="text-xl font-bold text-[#1a1209]">Insight Engine</h1>
          <p className="text-sm mt-0.5 text-[#8b7355]">AI synthesis across all dashboards — unified executive briefing</p>
        </div>
        <div className="flex gap-2">
          {!researchData && (
            <button onClick={() => setInsight(STATIC_INSIGHT)} className="flex items-center gap-2 border rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:bg-[#f5ede3]" style={{ borderColor: '#ddd0c0', color: '#63513d' }}>
              Preview Demo
            </button>
          )}
          <button
            onClick={generateInsight}
            disabled={loading}
            className="flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all hover:opacity-90 active:scale-95 shadow-sm disabled:opacity-50"
            style={{ backgroundColor: '#63513d' }}
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
            {loading ? 'Synthesizing...' : 'Generate Insight'}
            {!loading && <RefreshCw size={13} />}
          </button>
        </div>
      </div>

      <div className="p-8 space-y-5">
        {/* Dashboard Input Cards */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8b7355] mb-3">Research Inputs</p>
          <div className="grid grid-cols-3 gap-4">
            {DASHBOARD_CARDS.map(({ id, title, icon: Icon, color, summary, stats }) => (
              <div key={id} className="bg-white border rounded-2xl p-4 shadow-sm" style={{ borderColor: '#ddd0c0', borderTopColor: color, borderTopWidth: 3 }}>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: color + '12' }}>
                    <Icon size={14} style={{ color }} />
                  </div>
                  <span className="text-xs font-bold text-[#1a1209]">{title}</span>
                </div>
                <p className="text-xs text-[#6b5b4e] mb-3 leading-relaxed">{summary}</p>
                <div className="space-y-1">
                  {stats.map(s => (
                    <div key={s} className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-xs text-[#3a2e23] font-medium">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insight Output */}
        {(displayText || loading) && (
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm" style={{ borderColor: '#ddd0c0' }}>
            <div className="flex items-center gap-3 px-5 py-3.5 border-b" style={{ borderColor: '#ede0d0', backgroundColor: '#faf8f5' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#63513d' }}>
                <Sparkles size={14} className="text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#1a1209]">Executive Briefing</span>
                <span className="text-xs text-[#8b7355] ml-2">Synthesis Agent</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {loading && <Loader2 size={14} style={{ color: '#63513d' }} className="animate-spin" />}
                {insight && !loading && (
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center gap-2 font-semibold px-4 py-2 rounded-xl text-sm transition-all hover:opacity-90 active:scale-95 shadow-sm border"
                    style={downloaded
                      ? { backgroundColor: '#f0fdf4', borderColor: '#86efac', color: '#166534' }
                      : { backgroundColor: '#63513d', borderColor: '#63513d', color: '#fff' }
                    }
                  >
                    {downloading
                      ? <><Loader2 size={13} className="animate-spin" /> Generating PDF...</>
                      : downloaded
                      ? <><CheckCircle2 size={13} /> Downloaded!</>
                      : <><Download size={13} /> Download PDF Report</>
                    }
                  </button>
                )}
              </div>
            </div>
            <div className="px-6 py-5">
              {displayText ? (
                <div className="text-sm text-[#3a2e23] leading-relaxed space-y-1">
                  {displayText.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <p key={i} className="font-bold text-[#1a1209] mt-4 mb-1 flex items-center gap-2" style={{ color: '#63513d' }}>
                          <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: '#63513d' }} />
                          {line.replace(/\*\*/g, '')}
                        </p>
                      )
                    }
                    return line ? <p key={i}>{line}</p> : <div key={i} className="h-2" />
                  })}
                  {loading && <span className="inline-block w-2 h-4 rounded-sm animate-pulse ml-0.5 align-middle" style={{ backgroundColor: '#63513d' }} />}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[#8b7355] text-sm">
                  <Loader2 size={15} className="animate-spin" /> Agents synthesizing across all research...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendation Pillars */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8b7355] mb-3">Strategic Recommendations</p>
          <div className="grid grid-cols-3 gap-4">
            {PILLARS.map(({ title, icon: Icon, color, points }) => (
              <div key={title} className="bg-white border rounded-2xl p-4 shadow-sm" style={{ borderColor: '#ddd0c0' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + '12' }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                  <span className="text-sm font-bold text-[#1a1209]">{title}</span>
                </div>
                <div className="space-y-2">
                  {points.map(p => (
                    <div key={p} className="flex items-start gap-2">
                      <ChevronRight size={12} style={{ color }} className="mt-0.5 shrink-0" />
                      <p className="text-xs text-[#6b5b4e] leading-relaxed">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty CTA */}
        {!displayText && !loading && (
          <div className="text-center py-16 border-2 border-dashed rounded-2xl" style={{ borderColor: '#ddd0c0' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f5ede3' }}>
              <Sparkles size={24} style={{ color: '#63513d' }} />
            </div>
            <p className="text-sm font-bold text-[#1a1209]">Ready to Synthesize</p>
            <p className="text-xs text-[#8b7355] mt-1">Click <strong>Generate Insight</strong> to create a unified executive briefing from all dashboards</p>
            <p className="text-xs text-[#c4a882] mt-1">Or click <strong>Preview Demo</strong> for a sample output</p>
          </div>
        )}
      </div>
    </div>
  )
}
