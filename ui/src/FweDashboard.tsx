import { Info, Loader2, RefreshCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// API helper
function getApiBase() {
  const search = new URLSearchParams(window.location.search)
  const fromQuery = search.get('api')
  const fromEnv = import.meta.env.VITE_API_BASE as string | undefined
  return fromQuery || fromEnv || 'http://localhost:8081'
}

type RunScenarioReq = {
  PI: number
  CI: 0 | 1 | 2 | 3
  D_weeks: number
  demand_cal_per_cap_day?: number
  population_m?: number
  budget_musd?: number
  seed?: number
}
type RunScenarioResp = {
  kpis: Record<string, number>
  diagnostics: Record<string, number>
  notes: string[]
}

async function runScenario(req: RunScenarioReq): Promise<RunScenarioResp> {
  const res = await fetch(`${getApiBase()}/run-scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
    mode: 'cors',
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export function FweDashboard() {
  const [pi, setPi] = useState(0)
  const [ci, setCi] = useState<0 | 1 | 2 | 3>(2)
  const [weeks, setWeeks] = useState(12)
  const [populationM, setPopulationM] = useState(5.9)
  const [budget, setBudget] = useState(500)
  const [seed, setSeed] = useState<number | undefined>(undefined)

  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [kpis, setKpis] = useState<Record<string, number> | null>(null)
  const [diag, setDiag] = useState<Record<string, number> | null>(null)
  const [notes, setNotes] = useState<string[]>([])

  const piDisplay = useMemo(() => pi.toFixed(2), [pi])

  const run = async () => {
    setLoading(true)
    setErr(null)
    try {
      const res = await runScenario({
        PI: pi,
        CI: ci,
        D_weeks: weeks,
        population_m: populationM,
        budget_musd: budget,
        seed,
      })
      setKpis(res.kpis)
      setDiag(res.diagnostics)
      setNotes(res.notes || [])
    } catch (e: any) {
      setErr(e?.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  const radarData = useMemo(() => {
    if (!diag) return []
    return [
      { metric: 'Delivery', value: (diag.M_deliv ?? 0) * 100 },
      { metric: 'Payments', value: 100 - (diag.M_margin ?? 0 - 1) * 25 },
      { metric: 'PRC Fric', value: 100 / (diag.M_prc_fric ?? 1) },
      { metric: 'Insurance', value: 100 / (1 + (diag.delta_ins ?? 0)) },
      { metric: 'HedgeOps', value: 100 / (diag.M_margin ?? 1) },
    ]
  }, [diag])

  const barData = useMemo(() => {
    if (!kpis) return []
    return [
      {
        name: 'Days of Supply (cal)',
        value: kpis.days_of_supply_calories || 0,
      },
      {
        name: 'Logistics Delay (d)',
        value: kpis.mean_logistics_delay_days || 0,
      },
    ]
  }, [kpis])

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">FWE Scenario Dashboard</h1>
            <p className="text-neutral-400">
              Posture-aware Food • Water • Energy model (Vite + Tailwind)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={run}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-neutral-200/10 hover:bg-neutral-200/20 px-4 py-2 border border-neutral-700"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCcw className="w-4 h-4" />
              )}
              Run Scenario
            </button>
          </div>
        </header>

        {/* Controls */}
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="text-sm text-neutral-300">
                Posture Index (PI):{' '}
                <span className="font-mono">{piDisplay}</span>
              </label>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-neutral-400">
                  China-leaning -1
                </span>
                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={0.01}
                  value={pi}
                  onChange={(e) => setPi(parseFloat(e.target.value))}
                  className="flex-1 accent-cyan-400"
                />
                <span className="text-xs text-neutral-400">
                  +1 Western-leaning
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-300">
                  Conflict Intensity (CI)
                </label>
                <select
                  value={ci}
                  onChange={(e) =>
                    setCi(Number(e.target.value) as 0 | 1 | 2 | 3)
                  }
                  className="mt-2 w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2"
                >
                  <option value={0}>0 – none</option>
                  <option value={1}>1 – coercive crisis</option>
                  <option value={2}>2 – limited kinetic</option>
                  <option value={3}>3 – major conflict</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-neutral-300">
                  Duration (weeks)
                </label>
                <input
                  type="range"
                  min={1}
                  max={52}
                  step={1}
                  value={weeks}
                  onChange={(e) => setWeeks(parseInt(e.target.value))}
                  className="mt-2 w-full accent-cyan-400"
                />
                <div className="text-xs text-neutral-400 mt-1">
                  {weeks} weeks
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-neutral-300">
                  Population (M)
                </label>
                <input
                  className="mt-2 w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2"
                  type="number"
                  step="0.1"
                  value={populationM}
                  onChange={(e) => setPopulationM(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="text-sm text-neutral-300">
                  Budget (M USD)
                </label>
                <input
                  className="mt-2 w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2"
                  type="number"
                  step="10"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="text-sm text-neutral-300">
                  Seed (optional)
                </label>
                <input
                  className="mt-2 w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2"
                  type="number"
                  value={seed ?? ''}
                  onChange={(e) =>
                    setSeed(
                      e.target.value === ''
                        ? undefined
                        : parseInt(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Info className="w-4 h-4" /> Set API with{' '}
              <span className="font-mono">?api=http://host:8081</span> or{' '}
              <span className="font-mono">window.FWE_API_BASE</span>.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Radar / Operability */}
            <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-4">
              <div className="text-sm text-neutral-300 mb-2">
                System Operability (higher is better)
              </div>
              <div className="h-56">
                <ResponsiveContainer>
                  <RadarChart data={radarData} outerRadius={90}>
                    <PolarGrid stroke="#334155" /> {/* slate-700 */}
                    <PolarAngleAxis
                      dataKey="metric"
                      tick={{ fill: '#cbd5e1', fontSize: 12 }}
                    />{' '}
                    {/* slate-300 */}
                    <Radar
                      dataKey="value"
                      stroke="#22d3ee" /* cyan-400 */
                      fill="#22d3ee"
                      fillOpacity={0.28}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar / KPIs */}
            <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-4">
              <div className="text-sm text-neutral-300 mb-2">
                Key Performance Indicators
              </div>
              <div className="h-56">
                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#cbd5e1', fontSize: 12 }}
                      axisLine={{ stroke: '#334155' }}
                      tickLine={{ stroke: '#334155' }}
                      interval={0}
                      angle={-10}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tick={{ fill: '#cbd5e1' }}
                      axisLine={{ stroke: '#334155' }}
                      tickLine={{ stroke: '#334155' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0b1220',
                        border: '1px solid #334155',
                      }}
                      labelStyle={{ color: '#e5e7eb' }}
                      itemStyle={{ color: '#e5e7eb' }}
                    />
                    <Bar dataKey="value" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <MiniStat
            title="Delivery Reliability (M_deliv)"
            value={diag?.M_deliv}
            fmt={(v) => `${(v * 100).toFixed(1)}%`}
          />
          <MiniStat
            title="Insurance Uplift (Δins)"
            value={diag?.delta_ins}
            fmt={(v) => `+${(v * 100).toFixed(0)}%`}
          />
          <MiniStat
            title="PRC Friction (×)"
            value={diag?.M_prc_fric}
            fmt={(v) => `${v.toFixed(2)}×`}
          />
          <MiniStat
            title="Margin Multiplier"
            value={diag?.M_margin}
            fmt={(v) => `${v.toFixed(2)}×`}
          />
          <MiniStat
            title="Days of Supply"
            value={kpis?.days_of_supply_calories}
            fmt={(v) => v.toFixed(1)}
          />
          <MiniStat
            title="Logistics Delay (d)"
            value={kpis?.mean_logistics_delay_days}
            fmt={(v) => v.toFixed(1)}
          />
        </div>

        {err && (
          <div className="p-3 rounded-xl bg-red-900/30 border border-red-700 text-red-200 text-sm">
            {err}
          </div>
        )}
        {!!notes?.length && (
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4">
            <div className="text-sm text-neutral-300">Notes</div>
            <ul className="list-disc pl-6 text-neutral-400 text-sm">
              {notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function MiniStat({
  title,
  value,
  fmt,
}: {
  title: string
  value: number | undefined | null
  fmt: (v: number) => string
}) {
  const display = value === undefined || value === null ? '—' : fmt(value)
  return (
    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4">
      <div className="text-xs text-neutral-400">{title}</div>
      <div className="text-2xl font-semibold mt-1">{display}</div>
    </div>
  )
}
