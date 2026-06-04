import { Info } from 'lucide-react'

export default function DemoModeBanner() {
  return (
    <div
      className="flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed"
      style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}
    >
      <Info size={13} className="shrink-0 mt-0.5 text-amber-500" />
      <span>
        <span className="font-semibold">Demo Mode — </span>
        Data shown is AI-synthesised for demonstration purposes. Live deployment connects to verified market databases and licensed research sources.
      </span>
    </div>
  )
}
