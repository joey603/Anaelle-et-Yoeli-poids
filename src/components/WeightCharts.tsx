import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Profile } from '../types'
import { getChartData } from '../utils/calculations'

interface WeightChartsProps {
  profile: Profile
}

export function WeightCharts({ profile }: WeightChartsProps) {
  const data = getChartData(profile)
  const accent = profile.color === 'teal' ? '#0d9488' : '#e11d6a'
  const accentLight = profile.color === 'teal' ? '#99f6e4' : '#fecdd3'

  if (profile.entries.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-sm border border-white/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Évolution du poids</h3>
        <p className="text-sm text-slate-500 mb-4">Courbe de progression</p>
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${profile.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accent} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis
                domain={['dataMin - 2', 'dataMax + 2']}
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
                unit=" kg"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
                formatter={(value) => [`${value} kg`, 'Poids']}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullDate ?? ''
                }
              />
              <ReferenceLine
                y={profile.goalWeight}
                stroke="#8b5cf6"
                strokeDasharray="5 5"
                label={{ value: 'Objectif', position: 'right', fill: '#8b5cf6', fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke={accent}
                strokeWidth={2.5}
                fill={`url(#gradient-${profile.id})`}
                dot={{ fill: accent, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: accentLight, stroke: accent }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-sm border border-white/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">
          Variation par période
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Poids perdu ou gagné entre chaque pesée
        </p>
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.slice(1)}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" unit=" kg" />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
                formatter={(value) => {
                  const num = Number(value)
                  const sign = num > 0 ? '+' : ''
                  return [`${sign}${num} kg`, 'Variation']
                }}
              />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <Bar dataKey="change" name="Variation" radius={[6, 6, 0, 0]}>
                {data.slice(1).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.change > 0 ? '#f59e0b' : entry.change < 0 ? '#10b981' : '#94a3b8'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
