import { Plus } from 'lucide-react'
import type { Profile } from '../types'

interface WeightEntryFormProps {
  profile: Profile
  onAdd: (weight: number, date: string) => void
  disabled?: boolean
}

export function WeightEntryForm({ profile, onAdd, disabled }: WeightEntryFormProps) {
  const accent = profile.color === 'teal' ? 'teal' : 'rose'
  const btnClass =
    accent === 'teal'
      ? 'bg-teal-500 hover:bg-teal-600 shadow-teal-200'
      : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
  const ringClass = accent === 'teal' ? 'focus:ring-teal-300' : 'focus:ring-rose-300'

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const weight = Number(form.get('weight'))
    const date = form.get('date') as string
    if (weight > 0 && date) {
      onAdd(weight, date)
      ;(e.target as HTMLFormElement).reset()
      const dateInput = (e.target as HTMLFormElement).querySelector(
        '[name="date"]',
      ) as HTMLInputElement
      if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10)
    }
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-sm border border-white/60">
      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        Nouvelle pesée
      </h3>
      <p className="text-sm text-slate-500 mb-4">
        Entre ton poids du jour
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <fieldset disabled={disabled} className="contents border-0 p-0 m-0 min-w-0">
        <div className="flex-1">
          <label className="sr-only">Poids (kg)</label>
          <input
            type="number"
            name="weight"
            step="0.1"
            min="30"
            max="300"
            required
            placeholder="Poids en kg (ex: 82.3)"
            className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 ${ringClass}`}
          />
        </div>
        <div className="sm:w-44">
          <label className="sr-only">Date</label>
          <input
            type="date"
            name="date"
            required
            defaultValue={today}
            max={today}
            className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 ${ringClass}`}
          />
        </div>
        <button
          type="submit"
          disabled={disabled}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${btnClass}`}
        >
          <Plus className="w-5 h-5" />
          <span className="sm:hidden">Ajouter</span>
          <span className="hidden sm:inline">Enregistrer</span>
        </button>
        </fieldset>
      </form>
    </div>
  )
}
