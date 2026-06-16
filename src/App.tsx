import { useState } from 'react'
import { ExportImport } from './components/ExportImport'
import { Header } from './components/Header'
import { ProfileTabs } from './components/ProfileTabs'
import { SetupForm } from './components/SetupForm'
import { StatsCards } from './components/StatsCards'
import { SyncStatus } from './components/SyncStatus'
import { Toast } from './components/Toast'
import { WeightCharts } from './components/WeightCharts'
import { WeightEntryForm } from './components/WeightEntryForm'
import { WeightTable } from './components/WeightTable'
import { useWeightStore } from './hooks/useWeightStore'

function App() {
  const {
    state,
    activeProfile,
    toast,
    isConfigured,
    setActiveProfile,
    updateProfile,
    addEntry,
    deleteEntry,
    exportData,
    importData,
    dismissToast,
    isLoading,
    isSaving,
    syncError,
    isCloudEnabled,
  } = useWeightStore()

  const [showSetup, setShowSetup] = useState(false)

  return (
    <div className="min-h-screen pb-8">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        <SyncStatus
          isLoading={isLoading}
          isSaving={isSaving}
          syncError={syncError}
          isCloudEnabled={isCloudEnabled}
        />

        {isLoading ? (
          <div className="text-center py-16 text-slate-500">Chargement…</div>
        ) : (
          <div
            inert={isSaving}
            className={`space-y-6 sm:space-y-8${isSaving ? ' opacity-60' : ''}`}
          >
        <ProfileTabs
          profiles={state.profiles}
          activeId={state.activeProfileId}
          onSelect={setActiveProfile}
          disabled={isSaving}
        />

        {!isConfigured || showSetup ? (
          <SetupForm
            profile={activeProfile}
            disabled={isSaving}
            onSave={(updates) => {
              updateProfile(activeProfile.id, updates)
              setShowSetup(false)
            }}
          />
        ) : (
          <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
            <StatsCards profile={activeProfile} />
            <WeightEntryForm profile={activeProfile} disabled={isSaving} onAdd={addEntry} />
            <WeightTable profile={activeProfile} disabled={isSaving} onDelete={deleteEntry} />
            <WeightCharts profile={activeProfile} />
            <ExportImport
              profile={activeProfile}
              disabled={isSaving}
              onExport={exportData}
              onImport={importData}
              onEditSettings={() => setShowSetup(true)}
            />
          </div>
        )}
          </div>
        )}
      </main>

      {toast && <Toast message={toast} onClose={dismissToast} />}
    </div>
  )
}

export default App
