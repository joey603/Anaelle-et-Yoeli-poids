import { Flag, Scale, TrendingDown, TrendingUp } from 'lucide-react'
import type { Profile } from '../types'
import {
  getLatestWeight,
  getProgressPercent,
  getRemainingWeight,
  getTotalChange,
} from '../utils/calculations'

interface StatsCardsProps {
  profile: Profile
}

export function StatsCards({ profile }: StatsCardsProps) {
  const current = getLatestWeight(profile)
  const totalChange = getTotalChange(profile)
  const progress = getProgressPercent(profile)
  const remaining = getRemainingWeight(profile)
  const isLoss = profile.goalWeight < profile.initialWeight
  const accent = profile.color === 'teal' ? 'teal' : 'rose'

  const cards = [
    {
      label: 'Poids actuel',
      value: `${current} kg`,
      icon: Scale,
      color: accent === 'teal' ? 'text-teal-600 bg-teal-50' : 'text-rose-600 bg-rose-50',
    },
    {
      label: 'Depuis le départ',
      value: `${totalChange > 0 ? '+' : ''}${totalChange} kg`,
      icon: totalChange <= 0 ? TrendingDown : TrendingUp,
      color:
        totalChange <= 0
          ? 'text-emerald-600 bg-emerald-50'
          : 'text-amber-600 bg-amber-50',
    },
    {
      label: isLoss ? 'Reste à perdre' : 'Reste à prendre',
      value: `${remaining} kg`,
      icon: Flag,
      color: 'text-violet-600 bg-violet-50',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm border border-white/60"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500">{card.label}</p>
                <p className="text-lg sm:text-xl font-bold text-slate-800">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm border border-white/60">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-600">Progression vers l'objectif</span>
          <span className="text-sm font-bold text-slate-800">{progress}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              accent === 'teal'
                ? 'bg-gradient-to-r from-teal-400 to-teal-600'
                : 'bg-gradient-to-r from-rose-400 to-rose-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-slate-400">
          <span>{profile.initialWeight} kg</span>
          <span>{profile.goalWeight} kg</span>
        </div>
      </div>
    </div>
  )
}
