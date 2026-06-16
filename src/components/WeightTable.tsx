import { Trash2 } from 'lucide-react'
import type { Profile } from '../types'
import { formatChange } from '../utils/calculations'

interface WeightTableProps {
  profile: Profile
  onDelete: (entryId: string) => void
  disabled?: boolean
}

export function WeightTable({ profile, onDelete, disabled }: WeightTableProps) {
  if (profile.entries.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/60 text-center">
        <p className="text-slate-500">
          Aucune pesée enregistrée. Ajoute ta première pesée !
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800">Historique des pesées</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm sm:text-base">
          <thead>
            <tr className="bg-slate-50/80 text-left text-slate-600">
              <th className="px-4 sm:px-6 py-3 font-medium">#</th>
              <th className="px-4 sm:px-6 py-3 font-medium">Date</th>
              <th className="px-4 sm:px-6 py-3 font-medium">Poids</th>
              <th className="px-4 sm:px-6 py-3 font-medium">Variation</th>
              <th className="px-4 sm:px-6 py-3 font-medium w-12"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100 bg-slate-50/40">
              <td className="px-4 sm:px-6 py-3 text-slate-400">—</td>
              <td className="px-4 sm:px-6 py-3 text-slate-600">Départ</td>
              <td className="px-4 sm:px-6 py-3 font-semibold">{profile.initialWeight} kg</td>
              <td className="px-4 sm:px-6 py-3 text-slate-400">—</td>
              <td></td>
            </tr>
            {[...profile.entries].reverse().map((entry, index) => {
              const num = profile.entries.length - index
              const changeClass =
                entry.change === null
                  ? 'text-slate-400'
                  : entry.change < 0
                    ? 'text-emerald-600 font-semibold'
                    : entry.change > 0
                      ? 'text-amber-600 font-semibold'
                      : 'text-slate-500'

              return (
                <tr
                  key={entry.id}
                  className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-3 text-slate-400">{num}</td>
                  <td className="px-4 sm:px-6 py-3">
                    {new Date(entry.date).toLocaleDateString('fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 sm:px-6 py-3 font-semibold">{entry.weight} kg</td>
                  <td className={`px-4 sm:px-6 py-3 ${changeClass}`}>
                    {formatChange(entry.change)}
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onDelete(entry.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-slate-400 disabled:hover:bg-transparent"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
