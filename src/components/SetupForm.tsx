import { Target, TrendingDown } from 'lucide-react'
import type { Profile } from '../types'

interface SetupFormProps {
  profile: Profile
  onSave: (updates: Partial<Profile>) => void
  disabled?: boolean
}

export function SetupForm({ profile, onSave, disabled }: SetupFormProps) {
  const accent = profile.color === 'teal' ? 'teal' : 'rose'
  const btnClass =
    accent === 'teal'
      ? 'bg-teal-500 hover:bg-teal-600 shadow-teal-200'
      : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
  const ringClass = accent === 'teal' ? 'focus:ring-teal-300' : 'focus:ring-rose-300'

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    onSave({
      initialWeight: Number(form.get('initialWeight')),
      goalWeight: Number(form.get('goalWeight')),
    })
  }

  return (
    <div className="animate-fade-in-up bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <div
          className={`inline-flex p-3 rounded-2xl mb-3 ${
            accent === 'teal' ? 'bg-teal-50' : 'bg-rose-50'
          }`}
        >
          <Target
            className={`w-8 h-8 ${accent === 'teal' ? 'text-teal-600' : 'text-rose-600'}`}
          />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          Configuration — {profile.name}
        </h2>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">
          Définis ton poids de départ et ton objectif
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset disabled={disabled} className="space-y-5 border-0 p-0 m-0 min-w-0">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Poids initial (kg)
          </label>
          <input
            type="number"
            name="initialWeight"
            step="0.1"
            min="30"
            max="300"
            required
            defaultValue={profile.initialWeight || ''}
            placeholder="Ex: 85.5"
            className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 ${ringClass} transition-shadow`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Objectif (kg)
          </label>
          <input
            type="number"
            name="goalWeight"
            step="0.1"
            min="30"
            max="300"
            required
            defaultValue={profile.goalWeight || ''}
            placeholder="Ex: 75.0"
            className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 ${ringClass} transition-shadow`}
          />
        </div>

        <button
          type="submit"
          disabled={disabled}
          className={`w-full py-3.5 rounded-xl text-white font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${btnClass}`}
        >
          <span className="inline-flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Enregistrer et commencer
          </span>
        </button>
        </fieldset>
      </form>
    </div>
  )
}
