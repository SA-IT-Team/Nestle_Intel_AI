import { useState, useEffect, useRef } from 'react'
import {
  TrendingUp, Users, MessageSquare, ClipboardList, Sparkles,
  CheckCircle2, Loader2, ArrowRight, ChevronDown, ChevronUp, Zap, Database
} from 'lucide-react'
import { API } from '../utils/api'

const PARALLEL_STAGES = [
  {
    id: 'market',
    label: 'Market Scoping',
    subLabel: 'Opportunity Sizing Agent',
    icon: TrendingUp,
    desc: 'Analyzing global & India market size, growth rates, and consumer segments for protein coffee',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
  },
  {
    id: 'competitor',
    label: 'Competitor Intel',
    subLabel: 'Competitive Intelligence Agent',
    icon: Users,
    desc: 'Mapping 12+ competitors, pricing, positioning, market presence and white-space gaps',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
  {
    id: 'consumer',
    label: 'Consumer Sentiment',
    subLabel: 'Consumer Research Agent',
    icon: MessageSquare,
    desc: 'Profiling target consumer personas, pain points, purchase motivators and behavioral signals',
    color: '#0891b2',
    bg: '#ecfeff',
    border: '#a5f3fc',
  },
  {
    id: 'survey',
    label: 'Survey Design',
    subLabel: 'Survey Intelligence Agent',
    icon: ClipboardList,
    desc: 'Generating survey questions, simulating consumer responses and extracting key findings',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
  },
]

const SYNTHESIS_STAGE = {
  id: 'synthesis',
  label: 'Synthesis',
  subLabel: 'Executive Report Agent',
  icon: Sparkles,
  desc: 'Consolidating all research into a unified executive strategy brief with go-to-market recommendations',
  color: '#63513d',
  bg: '#f5ede3',
  border: '#ddd0c0',
}

function StatusBadge({ status, color }) {
  if (status === 'done')    return <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5" style={{ backgroundColor: color + '15', color }}><CheckCircle2 size={10} /> Complete</span>
  if (status === 'running') return <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse" style={{ backgroundColor: color + '15', color }}><Loader2 size={10} className="animate-spin" /> Running</span>
  return <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#f5ede3', color: '#8b7355' }}>Queued</span>
}

function AgentCard({ stage, data = {}, wide = false }) {
  const { label, subLabel, icon: Icon, desc, color, bg, border } = stage
  const { status = 'pending', log = [], connectors = [] } = data
  const isRunning = status === 'running'
  const isDone    = status === 'done'
  const [expanded, setExpanded] = useState(false)
  const logRef = useRef(null)

  useEffect(() => { if (isRunning) setExpanded(true)  }, [isRunning])
  useEffect(() => { if (isDone)    setExpanded(false) }, [isDone])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [log])

  const lastLog = log.filter(l => l?.trim()).slice(-1)[0]

  return (
    <div
      className={`bg-white rounded-2xl border-2 overflow-hidden flex flex-col transition-all duration-300 ${
        isRunning ? 'agent-card-running shadow-lg' : isDone ? 'shadow-sm' : 'opacity-55'
      } ${wide ? 'col-span-2' : ''}`}
      style={{ borderColor: isRunning ? color : isDone ? color + '55' : '#ddd0c0' }}
    >
      {/* Header */}
      <div className="p-4" style={{ backgroundColor: isRunning || isDone ? bg : '#faf8f5' }}>
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: isRunning || isDone ? color : '#e5d5c5' }}
          >
            {isRunning ? <Loader2 size={18} className="text-white animate-spin" />
            : isDone    ? <CheckCircle2 size={18} className="text-white" />
                        : <Icon size={18} style={{ color: '#a09585' }} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-[#1a1209]">{label}</p>
              <StatusBadge status={status} color={color} />
            </div>
            <p className="text-xs text-[#8b7355] mt-0.5">{subLabel}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#ede0d0' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: isDone ? '100%' : isRunning ? '70%' : '0%',
              backgroundColor: color,
              transition: isRunning ? 'width 12s ease-in-out' : 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-2.5 border-t" style={{ borderColor: '#f0e8de' }}>
        <p className="text-xs leading-relaxed text-[#6b5b4e]">{desc}</p>
      </div>

      {/* MCP Connector badges */}
      {(isRunning || isDone) && connectors.length > 0 && (
        <div className="px-4 pb-3 border-t pt-2.5" style={{ borderColor: '#f0e8de' }}>
          <p className="text-xs font-semibold text-[#8b7355] mb-1.5 flex items-center gap-1.5">
            <Database size={10} style={{ color }} /> Connected Data Sources
          </p>
          <div className="flex flex-wrap gap-1.5">
            {connectors.map((c, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-full font-medium border"
                style={{ backgroundColor: color + '10', borderColor: color + '30', color }}
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Log toggle */}
      {(isRunning || (isDone && log.length > 0)) && (
        <div className="border-t" style={{ borderColor: '#f0e8de' }}>
          <button
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium hover:bg-[#faf8f5] transition-colors"
            style={{ color: '#8b7355' }}
            onClick={() => setExpanded(e => !e)}
          >
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-[#c4a882]'}`} />
              {isRunning ? 'Live output' : `${log.filter(l => l?.trim()).length} log entries`}
            </span>
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {expanded && (
            <div ref={logRef} className="px-4 pb-3 max-h-28 overflow-y-auto space-y-0.5 font-mono">
              {log.filter(l => l?.trim()).map((line, j) => (
                <p key={j} className="text-xs text-[#6b5b4e] leading-relaxed slide-in">
                  <span className="text-[#c4a882] mr-2 select-none">{String(j + 1).padStart(2, '0')}</span>
                  {line.startsWith('→') || line.includes('→')
                    ? <span style={{ color: '#63513d' }}>{line}</span>
                    : line}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Last activity preview (collapsed) */}
      {isRunning && !expanded && lastLog && (
        <div className="px-4 pb-3">
          <p className="text-xs font-mono truncate" style={{ color: '#63513d' }}>{lastLog}</p>
        </div>
      )}
    </div>
  )
}

export default function AgentRunner({ onNavigate, productQuery, researchData, setResearchData }) {
  const initData = () => {
    const all = [...PARALLEL_STAGES, SYNTHESIS_STAGE]
    return Object.fromEntries(all.map(s => [s.id, { status: 'pending', log: [] }]))
  }

  const [stagesData, setStagesData]   = useState(initData)
  const [pipelineDone, setPipelineDone] = useState(false)
  const [running, setRunning]         = useState(false)
  const [elapsed, setElapsed]         = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (researchData) setPipelineDone(true)
  }, [])

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [running])

  function updateStage(id, patch) {
    setStagesData(prev => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }))
  }

  function appendLog(id, message) {
    if (!message?.trim()) return
    setStagesData(prev => ({
      ...prev,
      [id]: { ...prev[id], log: [...(prev[id]?.log || []), message] },
    }))
  }

  async function runOneStage(stageId, query, context = {}) {
    updateStage(stageId, { status: 'running' })

    const resp = await fetch(API.stream, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: stageId, query, context }),
    })

    const reader  = resp.body.getReader()
    const decoder = new TextDecoder()
    let result    = null

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data: '))
      for (const line of lines) {
        try {
          const data = JSON.parse(line.slice(6))
          if (data.type === 'log') appendLog(stageId, data.message)
          if (data.type === 'connector') {
            setStagesData(prev => ({
              ...prev,
              [stageId]: {
                ...prev[stageId],
                connectors: [...(prev[stageId]?.connectors || []), data.data],
              },
            }))
          }
          if (data.type === 'result') result = data.data
        } catch (_) {}
      }
    }

    updateStage(stageId, { status: 'done' })
    return result
  }

  async function runPipeline() {
    setRunning(true)
    setPipelineDone(false)
    setElapsed(0)
    setStagesData(initData())

    try {
      // ── Phase 1: run all 4 research agents in PARALLEL ──────────────────
      const [marketRes, competitorRes, consumerRes, surveyRes] = await Promise.all([
        runOneStage('market',     productQuery),
        runOneStage('competitor', productQuery),
        runOneStage('consumer',   productQuery),
        runOneStage('survey',     productQuery),
      ])

      const collected = {
        market:     marketRes,
        competitor: competitorRes,
        consumer:   consumerRes,
        survey:     surveyRes,
      }

      // ── Phase 2: synthesis runs after all 4 complete ─────────────────────
      const synthesisRes = await runOneStage('synthesis', productQuery, collected)
      collected.synthesis = synthesisRes

      setResearchData(collected)
      setPipelineDone(true)
    } catch (err) {
      console.error('Pipeline error:', err)
    } finally {
      setRunning(false)
    }
  }

  const allStages    = [...PARALLEL_STAGES, SYNTHESIS_STAGE]
  const doneCount    = allStages.filter(s => stagesData[s.id]?.status === 'done').length
  const totalProgress = (running || pipelineDone) ? Math.round((doneCount / allStages.length) * 100) : 0

  return (
    <div className="min-h-full flex flex-col bg-[#faf8f5]">
      {/* Header */}
      <div className="bg-white border-b px-8 py-5 flex items-center justify-between" style={{ borderColor: '#ddd0c0' }}>
        <div>
          <h1 className="text-xl font-bold text-[#1a1209]">Agent Pipeline</h1>
          <p className="text-sm mt-0.5 text-[#8b7355] max-w-lg truncate">
            {productQuery || 'No query — go back to Command Center'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {(running || pipelineDone) && (
            <div className="text-right">
              <p className="text-xs text-[#8b7355]">{running ? 'Elapsed' : 'Completed in'}</p>
              <p className="text-sm font-bold text-[#1a1209]">
                {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
              </p>
            </div>
          )}
          {!running && !pipelineDone && (
            <button
              onClick={runPipeline}
              disabled={!productQuery}
              className="flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-sm hover:opacity-90 active:scale-95 transition-all"
              style={{ backgroundColor: '#63513d' }}
            >
              <Zap size={15} /> Start Pipeline
            </button>
          )}
          {pipelineDone && (
            <button
              onClick={() => onNavigate('market')}
              className="flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-sm hover:opacity-90 active:scale-95 transition-all"
              style={{ backgroundColor: '#059669' }}
            >
              View Results <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {(running || pipelineDone) && (
        <div className="bg-white border-b px-8 py-3" style={{ borderColor: '#ddd0c0' }}>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#ede0d0' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${totalProgress}%`, backgroundColor: '#63513d' }}
              />
            </div>
            <span className="text-sm font-bold shrink-0" style={{ color: '#63513d' }}>{totalProgress}%</span>
            <span className="text-xs text-[#8b7355] shrink-0">{doneCount} / {allStages.length} agents done</span>
          </div>
          {running && doneCount < 4 && (
            <p className="text-xs text-[#8b7355] mt-1.5 flex items-center gap-1.5">
              <Zap size={11} style={{ color: '#63513d' }} />
              4 research agents running in parallel — synthesis starts when all complete
            </p>
          )}
          {running && doneCount >= 4 && stagesData.synthesis?.status === 'running' && (
            <p className="text-xs mt-1.5 flex items-center gap-1.5 font-medium" style={{ color: '#63513d' }}>
              <Sparkles size={11} />
              All research complete — Synthesis Agent generating executive brief...
            </p>
          )}
        </div>
      )}

      <div className="flex-1 p-8">
        {/* Empty state */}
        {!running && !pipelineDone && (
          <div className="flex flex-col items-center justify-center h-full min-h-64 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#f5ede3' }}>
              <Zap size={28} style={{ color: '#63513d' }} />
            </div>
            <h3 className="text-lg font-bold text-[#1a1209] mb-1">Ready to Launch</h3>
            <p className="text-sm text-[#8b7355] mb-2">4 research agents run in parallel · synthesis follows automatically</p>
            <p className="text-xs text-[#c4a882] mb-6">Save hundreds of hours of manual research — agents synthesise in the background</p>
            <button
              onClick={runPipeline}
              disabled={!productQuery}
              className="flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
              style={{ backgroundColor: '#63513d' }}
            >
              <Zap size={16} /> Start Pipeline Now
            </button>
          </div>
        )}

        {/* Parallel agent cards */}
        {(running || pipelineDone) && (
          <div className="space-y-4">
            {/* Phase 1 label */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#63513d' }}>1</div>
                <span className="text-xs font-semibold text-[#63513d] uppercase tracking-wide">Phase 1 — Parallel Research</span>
              </div>
              <div className="flex-1 h-px" style={{ backgroundColor: '#ddd0c0' }} />
              {PARALLEL_STAGES.every(s => stagesData[s.id]?.status === 'done') && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12} /> All complete</span>
              )}
            </div>

            {/* 4-card grid — all run simultaneously */}
            <div className="grid grid-cols-2 gap-4">
              {PARALLEL_STAGES.map(stage => (
                <AgentCard
                  key={stage.id}
                  stage={stage}
                  data={stagesData[stage.id]}
                />
              ))}
            </div>

            {/* Phase 2 label */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#63513d' }}>2</div>
                <span className="text-xs font-semibold text-[#63513d] uppercase tracking-wide">Phase 2 — Synthesis</span>
              </div>
              <div className="flex-1 h-px" style={{ backgroundColor: '#ddd0c0' }} />
              <span className="text-xs text-[#8b7355]">Runs after Phase 1 completes</span>
            </div>

            {/* Synthesis card — full width */}
            <AgentCard
              stage={SYNTHESIS_STAGE}
              data={stagesData[SYNTHESIS_STAGE.id]}
            />
          </div>
        )}

        {/* Completion banner */}
        {pipelineDone && (
          <div className="mt-5 rounded-2xl border-2 p-5 flex items-center gap-5" style={{ backgroundColor: '#f0fdf4', borderColor: '#86efac' }}>
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-emerald-900">All 5 Agents Completed</h3>
              <p className="text-sm text-emerald-700 mt-0.5">
                Pipeline finished in {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')} · 4 agents ran in parallel · Explore your results
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {[{ label: 'Market', id: 'market' }, { label: 'Competitors', id: 'competitor' }, { label: 'Survey', id: 'survey' }, { label: 'Insights', id: 'insight' }].map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#63513d' }}
                >
                  {label} →
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
