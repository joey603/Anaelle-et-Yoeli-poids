import type { Profile, WeightEntry } from '../types'

export function calculateChange(
  previousWeight: number | null,
  newWeight: number,
): number | null {
  if (previousWeight === null) return null
  return Math.round((newWeight - previousWeight) * 10) / 10
}

export function getLatestWeight(profile: Profile): number {
  if (profile.entries.length === 0) return profile.initialWeight
  return profile.entries[profile.entries.length - 1].weight
}

export function getTotalChange(profile: Profile): number {
  const current = getLatestWeight(profile)
  return Math.round((current - profile.initialWeight) * 10) / 10
}

export function getProgressPercent(profile: Profile): number {
  const total = profile.initialWeight - profile.goalWeight
  if (total === 0) return 100
  const current = getLatestWeight(profile)
  const done = profile.initialWeight - current
  const percent = (done / total) * 100
  return Math.min(100, Math.max(0, Math.round(percent)))
}

export function getRemainingWeight(profile: Profile): number {
  const current = getLatestWeight(profile)
  return Math.round(Math.abs(current - profile.goalWeight) * 10) / 10
}

export function formatChange(change: number | null): string {
  if (change === null) return '—'
  if (change === 0) return '0 kg'
  const sign = change > 0 ? '+' : ''
  return `${sign}${change} kg`
}

export function getChartData(profile: Profile) {
  const points = [
    {
      date: 'Départ',
      weight: profile.initialWeight,
      change: 0,
      fullDate: 'Poids initial',
    },
    ...profile.entries.map((entry: WeightEntry) => ({
      date: new Date(entry.date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
      }),
      weight: entry.weight,
      change: entry.change ?? 0,
      fullDate: new Date(entry.date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    })),
  ]
  return points
}
