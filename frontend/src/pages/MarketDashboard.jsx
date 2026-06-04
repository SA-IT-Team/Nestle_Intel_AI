import { TrendingUp, DollarSign, Users, Target, Star } from 'lucide-react'
import { cleanMarkdown } from '../utils/cleanMarkdown'
import DemoModeBanner from '../components/DemoModeBanner'
import SourcesPanel from '../components/SourcesPanel'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const GROWTH_DATA = [
  { year: '2020', global: 1.1, india: 0.08 },
  { year: '2021', global: 1.4, india: 0.12 },
  { year: '2022', global: 1.8, india: 0.18 },
  { year: '2023', global: 2.3, india: 0.28 },
  { year: '2024', global: 2.9, india: 0.42 },
  { year: '2025', global: 3.6, india: 0.61 },
  { year: '2026', global: 4.4, india: 0.87 },
  { year: '2027', global: 5.3, india: 1.20 },
  { year: '2028', global: 6.4, india: 1.65 },
]

const SEGMENTS = [
  { name: 'Fitness Enthusiasts', value: 38, color: '#63513d' },
  { name: 'Working Professionals', value: 29, color: '#8b7355' },
  { name: 'Health-Conscious Gen Z', value: 22, color: '#c4a882' },
  { name: 'Others', value: 11, color: '#e5d5c5' },
]

const STAT_CARDS = [
  { label: 'Global TAM (2024)', value: '$2.9B', sub: 'Protein Coffee Market', icon: DollarSign, accent: '#2563eb' },
  { label: 'India SAM', value: '$420M', sub: '↑ 48% YoY Growth', icon: TrendingUp, accent: '#059669' },
  { label: 'Nestlé Target SOM', value: '$42M', sub: '10% India Share (Yr 3)', icon: Target, accent: '#63513d' },
  { label: 'Addressable Users', value: '62M', sub: 'Urban + Semi-Urban India', icon: Users, accent: '#7c3aed' },
]

const SCORE_DIMS = [['Growth', '9.2'], ['Competition', '7.4'], ['Feasibility', '8.9'], ['Brand Fit', '9.1']]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border rounded-xl shadow-lg px-4 py-3" style={{ borderColor: '#ddd0c0' }}>
      <p className="text-xs font-semibold text-[#1a1209] mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-xs" style={{ color: p.color }}>
          {p.name}: <span className="font-bold">${p.value}B</span>
        </p>
      ))}
    </div>
  )
}

export default function MarketDashboard({ researchData }) {
  const connectors = researchData?.market?.connectors || []
  const aiInsight = cleanMarkdown(researchData?.market?.insight || "The protein coffee market in India is experiencing explosive 48% YoY growth, driven by rising fitness culture and the $2.9B global tailwind. Nestlé's strong distribution network gives it an unparalleled advantage to capture 10%+ market share within 3 years.")

  return (
    <div className="min-h-full flex flex-col bg-[#faf8f5]">
      <div className="bg-white border-b px-8 py-5" style={{ borderColor: '#ddd0c0' }}>
        <h1 className="text-xl font-bold text-[#1a1209]">Market Opportunity</h1>
        <p className="text-sm mt-0.5 text-[#8b7355]">High-Protein Coffee — Global & India Opportunity Sizing</p>
      </div>

      <div className="p-8 space-y-5">
        <DemoModeBanner />
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          {STAT_CARDS.map(({ label, value, sub, icon: Icon, accent }) => (
            <div key={label} className="bg-white border rounded-2xl p-5 shadow-sm" style={{ borderColor: '#ddd0c0' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: accent + '12' }}>
                <Icon size={18} style={{ color: accent }} />
              </div>
              <p className="text-2xl font-black text-[#1a1209]">{value}</p>
              <p className="text-xs font-medium text-[#1a1209] mt-0.5">{label}</p>
              <p className="text-xs mt-1 font-medium" style={{ color: accent }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 bg-white border rounded-2xl p-5 shadow-sm" style={{ borderColor: '#ddd0c0' }}>
            <h3 className="text-sm font-bold text-[#1a1209]">Market Growth Trajectory</h3>
            <p className="text-xs text-[#8b7355] mb-4">Global vs India Protein Coffee (USD Billion) · 2020–2028</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={GROWTH_DATA}>
                <defs>
                  <linearGradient id="gGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="iGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#63513d" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#63513d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e8de" />
                <XAxis dataKey="year" tick={{ fill: '#8b7355', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8b7355', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#6b5b4e' }} />
                <Area type="monotone" dataKey="global" stroke="#2563eb" fill="url(#gGrad)" strokeWidth={2.5} name="Global" dot={false} />
                <Area type="monotone" dataKey="india" stroke="#63513d" fill="url(#iGrad)" strokeWidth={2.5} name="India" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border rounded-2xl p-5 shadow-sm" style={{ borderColor: '#ddd0c0' }}>
            <h3 className="text-sm font-bold text-[#1a1209]">Consumer Segments</h3>
            <p className="text-xs text-[#8b7355] mb-3">India Target Audience</p>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={SEGMENTS} cx="50%" cy="50%" innerRadius={42} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {SEGMENTS.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd0c0', borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-1">
              {SEGMENTS.map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-xs text-[#6b5b4e] flex-1">{s.name}</span>
                  <span className="text-xs font-bold text-[#1a1209]">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunity Score */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm flex items-center gap-6" style={{ borderColor: '#ddd0c0' }}>
          <div className="text-center shrink-0 px-6 py-3 rounded-2xl" style={{ backgroundColor: '#f5ede3' }}>
            <p className="text-5xl font-black" style={{ color: '#63513d' }}>8.7</p>
            <p className="text-xs text-[#8b7355] mt-1 font-medium">/ 10 Opportunity Score</p>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-[#1a1209] mb-1">Market Opportunity Score</h3>
            <p className="text-xs text-[#6b5b4e] leading-relaxed mb-3">
              Strong opportunity: high category growth (48% CAGR India), low penetration in protein coffee,
              large addressable base of 62M health-conscious consumers, and Nestlé's existing NESCAFÉ brand equity.
            </p>
            <div className="grid grid-cols-4 gap-3">
              {SCORE_DIMS.map(([k, v]) => (
                <div key={k} className="text-center rounded-xl py-2.5 px-2" style={{ backgroundColor: '#faf8f5', border: '1px solid #ede0d0' }}>
                  <p className="text-lg font-black" style={{ color: '#63513d' }}>{v}</p>
                  <p className="text-xs text-[#8b7355]">{k}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SourcesPanel stage="market" connectors={connectors} />
      </div>
    </div>
  )
}
