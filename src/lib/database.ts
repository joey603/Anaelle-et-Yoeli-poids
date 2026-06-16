import type { AppState, Profile, WeightEntry } from '../types'
import { supabase } from './supabase'

interface ProfileRow {
  id: string
  name: string
  initial_weight: number
  goal_weight: number
  color: 'rose' | 'teal'
}

interface EntryRow {
  id: string
  profile_id: string
  date: string
  weight: number
  change: number | null
}

function rowToProfile(row: ProfileRow, entries: WeightEntry[]): Profile {
  return {
    id: row.id,
    name: row.name,
    initialWeight: Number(row.initial_weight),
    goalWeight: Number(row.goal_weight),
    color: row.color,
    entries,
  }
}

export async function fetchAppState(): Promise<AppState | null> {
  if (!supabase) return null

  const [profilesRes, entriesRes] = await Promise.all([
    supabase.from('profiles').select('*').order('id'),
    supabase.from('weight_entries').select('*').order('date'),
  ])

  if (profilesRes.error) throw profilesRes.error
  if (entriesRes.error) throw entriesRes.error

  const entriesByProfile = new Map<string, WeightEntry[]>()
  for (const row of (entriesRes.data ?? []) as EntryRow[]) {
    const list = entriesByProfile.get(row.profile_id) ?? []
    list.push({
      id: row.id,
      date: row.date,
      weight: Number(row.weight),
      change: row.change === null ? null : Number(row.change),
    })
    entriesByProfile.set(row.profile_id, list)
  }

  const profiles = ((profilesRes.data ?? []) as ProfileRow[]).map((row) =>
    rowToProfile(row, entriesByProfile.get(row.id) ?? []),
  )

  if (profiles.length === 0) return null

  return {
    profiles,
    activeProfileId: 'yoeli',
  }
}

export async function saveAppState(state: AppState): Promise<void> {
  if (!supabase) return

  const profileIds = state.profiles.map((p) => p.id)

  const profileRows = state.profiles.map((p) => ({
    id: p.id,
    name: p.name,
    initial_weight: p.initialWeight,
    goal_weight: p.goalWeight,
    color: p.color,
  }))

  const entryRows = state.profiles.flatMap((p) =>
    p.entries.map((e) => ({
      id: e.id,
      profile_id: p.id,
      date: e.date,
      weight: e.weight,
      change: e.change,
    })),
  )

  const localEntryIds = new Set(entryRows.map((e) => e.id))

  const { error: profilesError } = await supabase.from('profiles').upsert(profileRows)
  if (profilesError) throw profilesError

  if (entryRows.length > 0) {
    const { error: entriesError } = await supabase.from('weight_entries').upsert(entryRows)
    if (entriesError) throw entriesError
  }

  const { data: existingEntries, error: fetchError } = await supabase
    .from('weight_entries')
    .select('id')
    .in('profile_id', profileIds)

  if (fetchError) throw fetchError

  const orphanIds = (existingEntries ?? [])
    .map((row) => row.id)
    .filter((id) => !localEntryIds.has(id))

  if (orphanIds.length > 0) {
    const { error: deleteError } = await supabase
      .from('weight_entries')
      .delete()
      .in('id', orphanIds)
    if (deleteError) throw deleteError
  }
}
