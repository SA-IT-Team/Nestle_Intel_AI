import { ClipboardList, ThumbsUp, Package, DollarSign } from 'lucide-react'
import { cleanMarkdown } from '../utils/cleanMarkdown'
import DemoModeBanner from '../components/DemoModeBanner'
import SourcesPanel from '../components/SourcesPanel'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const SURVEY_QUESTIONS = [
  'Would you buy a high-protein (15g) coffee product from Nestlé?',
  'How often do you currently consume coffee?',
  'What protein level matters most to you per serving?',
  'What format would you prefer for your protein coffee?',
  'What price per serving is acceptable to you?',
  'Where would you prefer to purchase this product?',
  'What would drive you to switch from your current protein supplement?',
  'How important is the Nestlé brand in your purchase decision?',
]

const INTENT_DATA = [
  { label: 'Definitely Buy', value: 34, color: '#059669' },
  { label: 'Likely Buy',     value: 39, color: '#63513d' },
  { label: 'Maybe',          value: 18, color: '#d97706' },
  { label: 'Unlikely',       value: 6,  color: '#dc2626' },
  { label: 'No',             value: 3,  color: '#9ca3af' },
]

const FORMAT_DATA    = [{ name: 'Instant Sachet', value: 43 }, { name: 'RTD Can', value: 28 }, { name: 'Cold Brew Bottle', value: 16 }, { name: 'Capsule', value: 13 }]
const PRICE_DATA     = [{ name: '< ₹30', value: 28 }, { name: '₹30–50', value: 41 }, { name: '₹50–80', value: 22 }, { name: '> ₹80', value: 9 }]
const CHANNEL_DATA   = [{ name: 'Supermarket', value: 38 }, { name: 'Amazon/Flipkart', value: 29 }, { name: 'Brand Website', value: 14 }, { name: 'Gym / Health', value: 12 }, { name: 'Quick Commerce', value: 7 }]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border rounded-xl shadow-md px-3 py-2" style={{ borderColor: '#ddd0c0' }}>
      <p className="text-xs font-bold text-[#1a1209]">{payload[0].payload.name}</p>
      <p className="text-xs text-[#63513d] font-semibold">{payload[0].value}% of respondents</p>
    </div>
  )
}

function HBar({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 24, top: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0e8de" horizontal={false} />
        <XAxis type="number" tick={{ fill: '#8b7355', fontSize: 10 }} tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} />
        <YAxis dataKey="name" type="category" tick={{ fill: '#6b5b4e', fontSize: 10 }} width={100} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
          {data.map((_, i) => <Cell key={i} fill={color} fillOpacity={0.6 + i * 0.1} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default function SurveyDashboard({ researchData }) {
  const connectors = researchData?.survey?.connectors || []
  const totalBuy = INTENT_DATA.slice(0, 2).reduce((a, b) => a + b.value, 0)
  const aiInsight = cleanMarkdown(researchData?.survey?.insight || "73% of respondents show purchase intent. The dominant preference is instant sachets (43%) at ₹30–50 price point — perfectly aligned with Nestlé's existing NESCAFÉ distribution model. Gym/health channels are under-indexed (12%) vs online (29%), signaling a hybrid GTM opportunity.")

  return (
    <div className="min-h-full flex flex-col bg-[#faf8f5]">
      <div className="bg-white border-b px-8 py-5 flex items-center justify-between" style={{ borderColor: '#ddd0c0' }}>
        <div>
          <h1 className="text-xl font-bold text-[#1a1209]">Consumer Survey Intelligence</h1>
          <p className="text-sm mt-0.5 text-[#8b7355]">AI-Generated Survey · 1,200 Simulated Responses · India Urban Panel</p>
        </div>
        <div className="flex items-center gap-2 border rounded-full px-4 py-1.5" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <ThumbsUp size={13} className="text-emerald-600" />
          <span className="text-xs font-bold text-emerald-700">{totalBuy}% Purchase Intent</span>
        </div>
      </div>

      <div className="p-8 space-y-5">
        <DemoModeBanner />
        {/* Survey Questions */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm" style={{ borderColor: '#ddd0c0' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f5ede3' }}>
              <ClipboardList size={14} style={{ color: '#63513d' }} />
            </div>
            <h3 className="text-sm font-bold text-[#1a1209]">AI-Generated Survey</h3>
            <span className="ml-auto text-xs px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: '#f5ede3', color: '#63513d', border: '1px solid #ddd0c0' }}>Auto-designed by Survey Agent</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SURVEY_QUESTIONS.map((q, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-xl px-3.5 py-2.5" style={{ backgroundColor: '#faf8f5', border: '1px solid #ede0d0' }}>
                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white" style={{ backgroundColor: '#63513d' }}>
                  {i + 1}
                </div>
                <p className="text-xs text-[#3a2e23] leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase Intent */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm" style={{ borderColor: '#ddd0c0' }}>
          <h3 className="text-sm font-bold text-[#1a1209]">Purchase Intent Distribution</h3>
          <p className="text-xs text-[#8b7355] mb-5">"Would you buy a high-protein (15g) coffee from Nestlé?" — 1,200 respondents</p>
          <div className="flex items-end gap-3" style={{ height: 120 }}>
            {INTENT_DATA.map(item => (
              <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-sm font-black text-[#1a1209]">{item.value}%</span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{ height: `${(item.value / 42) * 85}px`, backgroundColor: item.color, opacity: 0.85 }}
                />
                <span className="text-xs text-[#8b7355] text-center leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { title: 'Preferred Format', sub: 'Product packaging preference', icon: Package, color: '#63513d', data: FORMAT_DATA },
            { title: 'Price Sensitivity', sub: 'Acceptable price per serving', icon: DollarSign, color: '#059669', data: PRICE_DATA },
            { title: 'Purchase Channel', sub: 'Where they prefer to buy', icon: ClipboardList, color: '#2563eb', data: CHANNEL_DATA },
          ].map(({ title, sub, icon: Icon, color, data }) => (
            <div key={title} className="bg-white border rounded-2xl p-5 shadow-sm" style={{ borderColor: '#ddd0c0' }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={13} style={{ color }} />
                <h3 className="text-sm font-bold text-[#1a1209]">{title}</h3>
              </div>
              <p className="text-xs text-[#8b7355] mb-3">{sub}</p>
              <HBar data={data} color={color} />
            </div>
          ))}
        </div>

        {/* Key Findings */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Ready to Buy', value: '73%', desc: 'Purchase intent', accent: '#059669' },
            { label: 'Ideal Format', value: 'Sachet', desc: '43% preference', accent: '#63513d' },
            { label: 'Price Point', value: '₹30–50', desc: '41% respondents', accent: '#7c3aed' },
            { label: 'Top Channel', value: 'Supermarket', desc: '38% prefer offline', accent: '#2563eb' },
          ].map(({ label, value, desc, accent }) => (
            <div key={label} className="bg-white border rounded-2xl p-4 text-center shadow-sm" style={{ borderColor: '#ddd0c0' }}>
              <p className="text-2xl font-black" style={{ color: accent }}>{value}</p>
              <p className="text-xs font-bold text-[#1a1209] mt-1">{label}</p>
              <p className="text-xs text-[#8b7355]">{desc}</p>
            </div>
          ))}
        </div>

        <SourcesPanel stage="survey" connectors={connectors} />
      </div>
    </div>
  )
}
