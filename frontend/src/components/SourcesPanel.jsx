import { BookOpen, Database } from 'lucide-react'

const FALLBACK_SOURCES = {
  market: [
    { name: 'Euromonitor', dataset: 'Protein Beverages Global Market Report 2024', type: 'Market Intelligence' },
    { name: 'Statista',    dataset: 'India Health & Wellness Consumer Trends Q4 2024', type: 'Consumer Data' },
    { name: 'IBEF',        dataset: 'India Food & Beverage Sector Overview 2024', type: 'Industry Report' },
  ],
  competitor: [
    { name: 'Nielsen IQ', dataset: 'India Retail Tracking — Protein Category Q3 2024', type: 'Retail Intelligence' },
    { name: 'Mintel',     dataset: 'Protein Coffee & Functional Beverages Report 2024', type: 'Category Intelligence' },
    { name: 'Crunchbase', dataset: 'D2C Protein Brand Funding & Valuation Data 2024', type: 'Investment Data' },
  ],
  survey: [
    { name: 'Nielsen IQ',   dataset: 'FMCG Concept Testing Norms India 2024', type: 'Benchmark Data' },
    { name: 'Kantar',       dataset: 'Purchase Intent Benchmarks — New FMCG Categories', type: 'Survey Norms' },
    { name: 'EY-Parthenon', dataset: 'India Protein Supplement Consumer Study 2024', type: 'Consulting Report' },
  ],
  insight: [
    { name: 'McKinsey',       dataset: 'India FMCG Growth Opportunity Matrix 2024', type: 'Strategy Report' },
    { name: 'Bain & Company', dataset: 'India Consumer Market Entry Playbook', type: 'Strategy Report' },
    { name: 'Euromonitor',    dataset: 'Competitive Landscape — Protein Coffee India', type: 'Market Intelligence' },
  ],
}

const TYPE_COLORS = {
  'Market Intelligence':  { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'Consumer Data':        { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  'Industry Report':      { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff' },
  'Retail Intelligence':  { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' },
  'Category Intelligence':{ bg: '#ecfeff', text: '#155e75', border: '#a5f3fc' },
  'Investment Data':      { bg: '#fefce8', text: '#854d0e', border: '#fef08a' },
  'Benchmark Data':       { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  'Survey Norms':         { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'Consulting Report':    { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff' },
  'Strategy Report':      { bg: '#fff1f2', text: '#9f1239', border: '#fecdd3' },
  'Social Intelligence':  { bg: '#ecfeff', text: '#155e75', border: '#a5f3fc' },
}

export default function SourcesPanel({ stage, connectors }) {
  const sources = connectors?.length ? connectors : FALLBACK_SOURCES[stage] || []
  if (!sources.length) return null

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm" style={{ borderColor: '#ddd0c0' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f5ede3' }}>
          <BookOpen size={14} style={{ color: '#63513d' }} />
        </div>
        <div>
          <p className="text-sm font-bold text-[#1a1209]">Data Sources & References</p>
          <p className="text-xs text-[#8b7355]">Intelligence synthesised from verified research databases</p>
        </div>
        <span className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: '#f5ede3', color: '#63513d', border: '1px solid #ddd0c0' }}>
          Demo Connectors
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {sources.map((s, i) => {
          const clr = TYPE_COLORS[s.type] || { bg: '#f5ede3', text: '#63513d', border: '#ddd0c0' }
          return (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 border"
              style={{ backgroundColor: clr.bg, borderColor: clr.border }}
            >
              <Database size={13} style={{ color: clr.text }} className="shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold" style={{ color: clr.text }}>{s.name}</p>
                <p className="text-xs truncate" style={{ color: clr.text, opacity: 0.8 }}>{s.dataset}</p>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 border"
                style={{ backgroundColor: 'white', color: clr.text, borderColor: clr.border }}
              >
                {s.type}
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-[#c4a882] mt-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
        Demo mode — In production, these connectors fetch live data from licensed sources.
      </p>
    </div>
  )
}
