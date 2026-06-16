import { Download, Settings, Upload } from 'lucide-react'
import { useRef } from 'react'
import type { Profile } from '../types'

interface ExportImportProps {
  profile: Profile
  onExport: () => void
  onImport: (file: File) => void
  onEditSettings: () => void
  disabled?: boolean
}

const btnClass =
  'inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-slate-200 text-slate-600 text-sm font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/80'

export function ExportImport({
  onExport,
  onImport,
  onEditSettings,
  disabled,
}: ExportImportProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
      <button type="button" disabled={disabled} onClick={onEditSettings} className={btnClass}>
        <Settings className="w-4 h-4" />
        Modifier objectif
      </button>
      <button type="button" disabled={disabled} onClick={onExport} className={btnClass}>
        <Download className="w-4 h-4" />
        Exporter
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => fileRef.current?.click()}
        className={btnClass}
      >
        <Upload className="w-4 h-4" />
        Importer
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onImport(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
