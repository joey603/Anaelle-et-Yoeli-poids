import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppState, EncouragementMessage, Profile } from '../types'
import { fetchAppState, saveAppState } from '../lib/database'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { calculateChange, getLatestWeight } from '../utils/calculations'
import { getEncouragementMessage } from '../utils/messages'

const STORAGE_KEY = 'poids-suivi-data'

const defaultProfiles: Profile[] = [
  {
    id: 'yoeli',
    name: 'Yoeli',
    initialWeight: 0,
    goalWeight: 0,
    entries: [],
    color: 'teal',
  },
  {
    id: 'anaelle',
    name: 'Anaelle',
    initialWeight: 0,
    goalWeight: 0,
    entries: [],
    color: 'rose',
  },
]

function migrateState(state: AppState): AppState {
  const profiles = state.profiles.map((p) => {
    const isAnaelleProfile =
      p.id === 'anelle' || p.id === 'anaelle' || p.name === 'Anelle' || p.name === 'Anaelle'
    if (!isAnaelleProfile) return p
    return { ...p, id: 'anaelle', name: 'Anaelle' }
  })

  const activeProfileId =
    state.activeProfileId === 'anelle' ? 'anaelle' : state.activeProfileId

  return { ...state, profiles, activeProfileId }
}

function loadLocalState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = migrateState(JSON.parse(raw) as AppState)
      if (parsed.profiles?.length >= 2) return parsed
    }
  } catch {
    /* ignore */
  }
  return { profiles: defaultProfiles, activeProfileId: 'yoeli' }
}

function saveLocalState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function profilesEqual(a: Profile[], b: Profile[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

function hasLocalData(state: AppState): boolean {
  return state.profiles.some(
    (p) => p.initialWeight > 0 || p.goalWeight > 0 || p.entries.length > 0,
  )
}

function isDbEmpty(state: AppState): boolean {
  return state.profiles.every(
    (p) => p.initialWeight === 0 && p.goalWeight === 0 && p.entries.length === 0,
  )
}

function mergeRemoteState(remote: AppState, local: AppState): AppState {
  return migrateState({
    profiles: remote.profiles,
    activeProfileId: local.activeProfileId,
  })
}

export function useWeightStore() {
  const [state, setState] = useState<AppState>(loadLocalState)
  const [toast, setToast] = useState<EncouragementMessage | null>(null)
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured)
  const [isSaving, setIsSaving] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const skipNextSave = useRef(false)
  const isSavingRef = useRef(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reloadTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevStateRef = useRef(state)

  const applyRemoteState = useCallback((remote: AppState) => {
    skipNextSave.current = true
    setState((current) => {
      const merged = mergeRemoteState(remote, current)
      saveLocalState(merged)
      return merged
    })
    setSyncError(null)
  }, [])

  const reloadFromCloud = useCallback(async () => {
    if (!isSupabaseConfigured || isSavingRef.current) return

    try {
      const remote = await fetchAppState()
      if (remote) applyRemoteState(remote)
    } catch {
      setSyncError('Impossible de charger les données depuis le cloud.')
    }
  }, [applyRemoteState])

  const scheduleReloadFromCloud = useCallback(() => {
    if (isSavingRef.current) return
    if (reloadTimer.current) clearTimeout(reloadTimer.current)
    reloadTimer.current = setTimeout(() => {
      void reloadFromCloud()
    }, 500)
  }, [reloadFromCloud])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function init() {
      try {
        const remote = await fetchAppState()
        const local = loadLocalState()

        if (remote && !isDbEmpty(remote)) {
          if (!cancelled) {
            const merged = mergeRemoteState(remote, local)
            skipNextSave.current = true
            setState(merged)
            saveLocalState(merged)
          }
        } else if (hasLocalData(local)) {
          await saveAppState(local)
          if (!cancelled) {
            skipNextSave.current = true
            setState(local)
          }
        } else if (remote) {
          if (!cancelled) {
            const merged = mergeRemoteState(remote, local)
            skipNextSave.current = true
            setState(merged)
            saveLocalState(merged)
          }
        }

        setSyncError(null)
      } catch {
        if (!cancelled) {
          setSyncError('Connexion Supabase impossible. Données locales utilisées.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    init()

    if (!supabase) return () => { cancelled = true }

    const channel = supabase
      .channel('poids-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, scheduleReloadFromCloud)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'weight_entries' }, scheduleReloadFromCloud)
      .subscribe()

    return () => {
      cancelled = true
      if (reloadTimer.current) clearTimeout(reloadTimer.current)
      void supabase?.removeChannel(channel)
    }
  }, [scheduleReloadFromCloud])

  useEffect(() => {
    const prev = prevStateRef.current
    const onlyTabChanged =
      prev.activeProfileId !== state.activeProfileId &&
      profilesEqual(prev.profiles, state.profiles)

    prevStateRef.current = state
    saveLocalState(state)

    if (!isSupabaseConfigured) return

    if (skipNextSave.current) {
      skipNextSave.current = false
      return
    }

    if (onlyTabChanged) return

    if (saveTimer.current) clearTimeout(saveTimer.current)

    saveTimer.current = setTimeout(async () => {
      isSavingRef.current = true
      setIsSaving(true)
      try {
        await saveAppState(state)
        setSyncError(null)
      } catch {
        setSyncError('Échec de la sauvegarde cloud. Réessayez.')
      } finally {
        isSavingRef.current = false
        setIsSaving(false)
      }
    }, 400)

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [state])

  const activeProfile =
    state.profiles.find((p) => p.id === state.activeProfileId) ?? state.profiles[0]

  const setActiveProfile = useCallback((id: string) => {
    setState((s) => ({ ...s, activeProfileId: id }))
  }, [])

  const updateProfile = useCallback((id: string, updates: Partial<Profile>) => {
    setState((s) => ({
      ...s,
      profiles: s.profiles.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }))
  }, [])

  const addEntry = useCallback(
    (weight: number, date: string) => {
      const profile = state.profiles.find((p) => p.id === state.activeProfileId)
      if (!profile || profile.initialWeight === 0) return

      const previousWeight =
        profile.entries.length > 0
          ? profile.entries[profile.entries.length - 1].weight
          : profile.initialWeight

      const change = calculateChange(previousWeight, weight)
      const entry = {
        id: crypto.randomUUID(),
        date,
        weight,
        change,
      }

      const updatedProfile = {
        ...profile,
        entries: [...profile.entries, entry],
      }

      setState((s) => ({
        ...s,
        profiles: s.profiles.map((p) =>
          p.id === state.activeProfileId ? updatedProfile : p,
        ),
      }))

      const message = getEncouragementMessage(updatedProfile, weight, change)
      setToast(message)
      setTimeout(() => setToast(null), 6000)
    },
    [state.activeProfileId, state.profiles],
  )

  const deleteEntry = useCallback(
    (entryId: string) => {
      setState((s) => ({
        ...s,
        profiles: s.profiles.map((p) => {
          if (p.id !== state.activeProfileId) return p
          const filtered = p.entries.filter((e) => e.id !== entryId)
          const recalculated = filtered.map((entry, index) => {
            const prev =
              index === 0 ? p.initialWeight : filtered[index - 1].weight
            return { ...entry, change: calculateChange(prev, entry.weight) }
          })
          return { ...p, entries: recalculated }
        }),
      }))
    },
    [state.activeProfileId],
  )

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `suivi-poids-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [state])

  const importData = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = migrateState(JSON.parse(e.target?.result as string) as AppState)
        if (parsed.profiles?.length >= 2) {
          setState(parsed)
        }
      } catch {
        /* ignore */
      }
    }
    reader.readAsText(file)
  }, [])

  const isConfigured = activeProfile.initialWeight > 0 && activeProfile.goalWeight > 0

  const dismissToast = useCallback(() => setToast(null), [])

  return {
    state,
    activeProfile,
    toast,
    isConfigured,
    isLoading,
    isSaving,
    syncError,
    isCloudEnabled: isSupabaseConfigured,
    setActiveProfile,
    updateProfile,
    addEntry,
    deleteEntry,
    exportData,
    importData,
    dismissToast,
    getLatestWeight: () => getLatestWeight(activeProfile),
  }
}
