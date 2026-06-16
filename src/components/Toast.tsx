import { Sparkles, X } from 'lucide-react'
import type { EncouragementMessage } from '../types'

interface ToastProps {
  message: EncouragementMessage
  onClose: () => void
}

const typeStyles = {
  success: 'from-emerald-500 to-teal-600 border-emerald-300',
  encourage: 'from-amber-400 to-orange-500 border-amber-300',
  neutral: 'from-slate-500 to-slate-600 border-slate-300',
  celebration: 'from-violet-500 to-fuchsia-600 border-violet-300',
}

export function Toast({ message, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fade-in-up">
      <div
        className={`
          bg-gradient-to-r ${typeStyles[message.type]}
          text-white rounded-2xl shadow-2xl p-4 sm:p-5 border
          flex items-start gap-3
        `}
      >
        <Sparkles className="w-6 h-6 shrink-0 mt-0.5 animate-pulse-soft" />
        <p className="flex-1 text-sm sm:text-base font-medium leading-relaxed">
          {message.text}
        </p>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
