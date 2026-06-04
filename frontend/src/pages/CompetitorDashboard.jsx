import { Users, AlertTriangle } from 'lucide-react'
import { cleanMarkdown } from '../utils/cleanMarkdown'
import DemoModeBanner from '../components/DemoModeBanner'
import SourcesPanel from '../components/SourcesPanel'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts'

const COMPETITORS = [
  { name: 'Slate Milk',       protein: 20, price: 4.5,  rating: 4.3, channel: 'D2C + Amazon',   origin: 'USA',   presence: 'Global', color: '#2563eb' },
  { name: 'Laird Superfood',  protein: 10, price: 3.8,  rating: 4.1, channel: 'Retail + D2C',   origin: 'USA',   presence: 'Global', color: '#7c3aed' },
  { name: 'Bulletproof',      protein: 12, price: 5.2,  rating: 4.0, channel: 'Retail + D2C',   origin: 'USA',   presence: 'Global', color: '#0891b2' },
  { name: 'WonderLab',        protein: 15, price: 2.8,  rating: 4.2, channel: 'D2C',            origin: 'China', presence: 'Asia',   color: '#d97706' },
  { name: 'MuscleBlaze',      protein: 18, price: 1.5,  rating: 4.0, channel: 'D2C + Retail',   origin: 'India', presence: 'India',  color: '#059669' },
  { name: 'OZiva',            protein: 12, price: 1.2,  rating: 3.8, channel: 'D2C',            origin: 'India', presence: 'India',  color: '#dc2626' },
  { name: 'RiteBite',         protein: 8,  price: 0.9,  rating: 3.6, channel: 'Offline',        origin: 'India', presence: 'India',  color: '#db2777' },
  { name: 'Nestlé (Target)',  protein: 15, price: 1.0,  rating: null, channel: 'Omnichannel',   origin: 'India', presence: 'India',  color: '#63513d' },
]

const RADAR_DATA = [
  { metric: 'Brand Equity',    Slate: 55, MuscleBlaze: 65, Nestlé: 95 },
  { metric: 'Distribution',   Slate: 60, MuscleBlaze: 60, Nestlé: 97 },
  { metric: 'Price Value',    Slate: 40, MuscleBlaze: 75, Nestlé: 88 },
  { metric: 'Protein Level',  Slate: 95, MuscleBlaze: 85, Nestlé: 80 },
  { metric: 'India Presence', Slate: 20, MuscleBlaze: 75, Nestlé: 95 },
  { metric: 'Taste Profile',  Slate: 80, MuscleBlaze: 68, Nestlé: 90 },
]

const GAPS = [
  { title: 'Affordable Premium Gap', desc: 'No competitor offers >12g protein at <₹40 price point in India', severity: 'High' },
  { title: 'Instant / Sachet Format', desc: 'Zero players in high-protein instant coffee sachet — dominant Indian format', severity: 'High' },
  { title: 'Tier 2 & 3 City Reach', desc: 'All India competitors are D2C-heavy; offline distribution is completely untapped', severity: 'Medium' },
  { title: 'Trusted FMCG Brand', desc: 'No established FMCG player in protein coffee — only D2C startups with limited trust', severity: 'Medium' },
]

const presenceColors = {
  Global: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  Asia:   { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  India:  { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
}

const severityStyle = {
  High:   { bg: '#fef2f2', text: '#991b1b', border: '#fecaca', badge: '#dc2626' },
  Medium: { bg: '#fffbeb', text: '#92400e', border: '#fde68a', badge: '#d97706' },
}

export default function CompetitorDashboard({ researchData }) {
  const connectors = researchData?.competitor?.connectors || []
  const aiInsight = cleanMarkdown(researchData?.competitor?.insight || "The protein coffee space has 12+ global players but zero credible FMCG competitors in India's sachet/instant segment. Slate Milk dominates on protein (20g) but is priced out of India ($4.5/serving). MuscleBlaze is the closest India threat but lacks coffee heritage. Nestlé has a decisive moat: NESCAFÉ brand + pan-India distribution + existing coffee infrastructure.")

  return (
    <div className="min-h-full flex flex-col bg-[#faf8f5]">
      <div className="bg-white border-b px-8 py-5" style={{ borderColor: '#ddd0c0' }}>
        <h1 className="text-xl font-bold text-[#1a1209]">Competitive Intelligence</h1>
        <p className="text-sm mt-0.5 text-[#8b7355]">Protein Coffee Landscape — {COMPETITORS.length - 1} Competitors Analyzed</p>
      </div>

      <div className="p-8 space-y-5">
        <DemoModeBanner />
        {/* Competitor Table */}
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm" style={{ borderColor: '#ddd0c0' }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: '#ede0d0', backgroundColor: '#faf8f5' }}>
            <Users size={15} style={{ color: '#63513d' }} />
            <h3 className="text-sm font-bold text-[#1a1209]">Competitor Matrix</h3>
            <span className="ml-auto text-xs text-[#8b7355]">{COMPETITORS.length - 1} active competitors + Nestlé target positioning</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: '#f0e8de', backgroundColor: '#faf8f5' }}>
                  {['Brand', 'Protein (g)', 'Price/Serving', 'Rating', 'Channel', 'Market'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#8b7355]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPETITORS.map((c) => {
                  const isNestle = c.name.includes('Nestlé')
                  const pc = presenceColors[c.presence]
                  return (
                    <tr
                      key={c.name}
                      className="border-b transition-colors hover:bg-[#faf8f5]"
                      style={{ borderColor: '#f0e8de', backgroundColor: isNestle ? '#fdf6ee' : 'transparent' }}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                          <span className={`font-semibold text-sm ${isNestle ? 'text-[#63513d]' : 'text-[#1a1209]'}`}>{c.name}</span>
                          {isNestle && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#f5ede3', color: '#63513d', border: '1px solid #ddd0c0' }}>Target</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[#1a1209] font-medium">{c.protein}g</td>
                      <td className="px-5 py-3 text-[#1a1209] font-medium">{c.origin === 'India' || isNestle ? `₹${Math.round(c.price * 83)}` : `$${c.price}`}</td>
                      <td className="px-5 py-3">
                        {c.rating
                          ? <span className="font-semibold text-[#d97706]">★ {c.rating}</span>
                          : <span className="text-[#c4a882] italic text-xs">Planned</span>
                        }
                      </td>
                      <td className="px-5 py-3 text-[#6b5b4e] text-xs">{c.channel}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: pc.bg, color: pc.text, border: `1px solid ${pc.border}` }}>
                          {c.presence}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white border rounded-2xl p-5 shadow-sm" style={{ borderColor: '#ddd0c0' }}>
            <h3 className="text-sm font-bold text-[#1a1209]">Positioning Map</h3>
            <p className="text-xs text-[#8b7355] mb-4">Protein Content vs Price/Serving (USD)</p>
            <ResponsiveContainer width="100%" height={220}>
              <ScatterChart margin={{ top: 5, right: 5, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e8de" />
                <XAxis dataKey="price" name="Price" tick={{ fill: '#8b7355', fontSize: 10 }} label={{ value: 'Price/Serving (USD)', position: 'insideBottom', offset: -12, fill: '#8b7355', fontSize: 10 }} />
                <YAxis dataKey="protein" name="Protein" tick={{ fill: '#8b7355', fontSize: 10 }} label={{ value: 'Protein (g)', angle: -90, position: 'insideLeft', fill: '#8b7355', fontSize: 10 }} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3', stroke: '#ddd0c0' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd0c0', borderRadius: 12, fontSize: 11 }}
                />
                <Scatter
                  data={COMPETITORS}
                  shape={(props) => {
                    const c = COMPETITORS.find(comp => comp.price === props.price)
                    return (
                      <g>
                        <circle cx={props.cx} cy={props.cy} r={c?.name.includes('Nestlé') ? 10 : 7} fill={c?.color || '#63513d'} fillOpacity={0.85} />
                        {c?.name.includes('Nestlé') && <circle cx={props.cx} cy={props.cy} r={14} fill="none" stroke="#63513d" strokeWidth={1.5} strokeDasharray="3 3" />}
                      </g>
                    )
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border rounded-2xl p-5 shadow-sm" style={{ borderColor: '#ddd0c0' }}>
            <h3 className="text-sm font-bold text-[#1a1209]">Capability Radar</h3>
            <p className="text-xs text-[#8b7355] mb-4">Nestlé vs Key Competitors</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#f0e8de" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#8b7355', fontSize: 9 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Slate Milk" dataKey="Slate" stroke="#2563eb" fill="#2563eb" fillOpacity={0.08} strokeWidth={1.5} />
                <Radar name="MuscleBlaze" dataKey="MuscleBlaze" stroke="#059669" fill="#059669" fillOpacity={0.08} strokeWidth={1.5} />
                <Radar name="Nestlé" dataKey="Nestlé" stroke="#63513d" fill="#63513d" fillOpacity={0.18} strokeWidth={2.5} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#6b5b4e' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gap Analysis */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} style={{ color: '#d97706' }} />
            <h3 className="text-sm font-bold text-[#1a1209]">Market Gaps — Nestlé Entry Opportunities</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {GAPS.map(g => {
              const s = severityStyle[g.severity]
              return (
                <div key={g.title} className="border rounded-2xl p-4 shadow-sm" style={{ backgroundColor: s.bg, borderColor: s.border }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#1a1209]">{g.title}</h4>
                      <p className="text-xs text-[#6b5b4e] mt-1 leading-relaxed">{g.desc}</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold text-white shrink-0" style={{ backgroundColor: s.badge }}>{g.severity}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <SourcesPanel stage="competitor" connectors={connectors} />
      </div>
    </div>
  )
}
