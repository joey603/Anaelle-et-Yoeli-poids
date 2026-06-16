import { Heart, Scale } from 'lucide-react'

export function Header() {
  return (
    <header className="text-center py-6 sm:py-8">
      <div className="inline-flex items-center gap-2 sm:gap-3 mb-2">
        <div className="p-2 sm:p-2.5 rounded-2xl bg-white/70 shadow-sm backdrop-blur-sm">
          <Scale className="w-6 h-6 sm:w-7 sm:h-7 text-teal-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-rose-500 bg-clip-text text-transparent">
          Notre Suivi Poids
        </h1>
        <div className="p-2 sm:p-2.5 rounded-2xl bg-white/70 shadow-sm backdrop-blur-sm">
          <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-rose-500 fill-rose-200" />
        </div>
      </div>
      <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto px-4">
        Yoeli & Anaelle — ensemble vers nos objectifs
      </p>
    </header>
  )
}
