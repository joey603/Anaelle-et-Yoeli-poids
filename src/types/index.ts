export interface WeightEntry {
  id: string
  date: string
  weight: number
  change: number | null
}

export interface Profile {
  id: string
  name: string
  initialWeight: number
  goalWeight: number
  entries: WeightEntry[]
  color: 'rose' | 'teal'
}

export interface AppState {
  profiles: Profile[]
  activeProfileId: string
}

export interface EncouragementMessage {
  text: string
  type: 'success' | 'encourage' | 'neutral' | 'celebration'
}
