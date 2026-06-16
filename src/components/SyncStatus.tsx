import { Cloud, CloudOff, Loader2 } from 'lucide-react'

interface SyncStatusProps {
  isLoading: boolean
  isSaving: boolean
  syncError: string | null
  isCloudEnabled: boolean
}

export function SyncStatus({
  isLoading,
  isSaving,
  syncError,
  isCloudEnabled,
}: SyncStatusProps) {
  if (!isCloudEnabled) {
    return (
      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-amber-700 bg-amber-50/90 border border-amber-100 rounded-xl px-4 py-2 mx-4 sm:mx-0">
        <CloudOff className="w-4 h-4 shrink-0" />
        <span>Mode local uniquement — configurez Supabase pour synchroniser entre appareils</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600 bg-white/80 border border-slate-100 rounded-xl px-4 py-2 mx-4 sm:mx-0">
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        <span>Chargement depuis le cloud…</span>
      </div>
    )
  }

  if (syncError) {
    return (
      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-red-700 bg-red-50/90 border border-red-100 rounded-xl px-4 py-2 mx-4 sm:mx-0">
        <CloudOff className="w-4 h-4 shrink-0" />
        <span>{syncError}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-teal-700 bg-teal-50/90 border border-teal-100 rounded-xl px-4 py-2 mx-4 sm:mx-0">
      {isSaving ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Sauvegarde en cours…</span>
        </>
      ) : (
        <>
          <Cloud className="w-4 h-4 shrink-0" />
          <span>Synchronisé — vos données sont partagées entre tous vos appareils</span>
        </>
      )}
    </div>
  )
}
