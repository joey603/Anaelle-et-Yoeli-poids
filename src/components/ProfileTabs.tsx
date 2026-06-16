import type { Profile } from '../types'

interface ProfileTabsProps {
  profiles: Profile[]
  activeId: string
  onSelect: (id: string) => void
  disabled?: boolean
}

const colorMap = {
  teal: {
    active: 'bg-teal-500 text-white shadow-lg shadow-teal-200',
    inactive: 'bg-white/80 text-teal-700 hover:bg-teal-50 border border-teal-100',
    dot: 'bg-teal-400',
  },
  rose: {
    active: 'bg-rose-500 text-white shadow-lg shadow-rose-200',
    inactive: 'bg-white/80 text-rose-700 hover:bg-rose-50 border border-rose-100',
    dot: 'bg-rose-400',
  },
}

export function ProfileTabs({ profiles, activeId, onSelect, disabled }: ProfileTabsProps) {
  return (
    <div className="flex gap-2 sm:gap-3 justify-center px-4">
      {profiles.map((profile) => {
        const colors = colorMap[profile.color]
        const isActive = profile.id === activeId
        return (
          <button
            key={profile.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(profile.id)}
            className={`
              flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl
              font-semibold text-sm sm:text-base transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isActive ? colors.active : colors.inactive}
            `}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-white/80' : colors.dot}`}
            />
            {profile.name}
          </button>
        )
      })}
    </div>
  )
}
