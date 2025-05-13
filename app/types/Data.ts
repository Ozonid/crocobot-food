import type { EventDefinition } from './Events'

export type Side = 'CT' | 'TERRORIST'
type TeamName = string

export interface Teams {
  [key: TeamName]: Player[]
}

export interface GameData {
  rounds: RoundData[]
  teams: Teams
}

export type SteamId = string
export interface Player {
  name: string
  steamId: SteamId
}

type RoundSides = {
  [key in Side]: TeamName
}

export type RoundScores = {
  [key in Side]: number
}

export interface RoundData {
  sides: RoundSides
  scores: RoundScores
  roundStartTimestamp: Date
  roundEndTimestamp: Date
  events: EventDefinition[]
  winner: Side
  players: {
    [key: SteamId]: RoundPlayerData
  }
  rawText: string
  targetBombed: boolean
}

export interface Damage {
  health: number
  armor: number
}

export interface RoundPlayerData extends Player {
  loadout: string[]
  startingMoney: number
  kills: number
  headshots: number
  assists: number
  survived: boolean
  bombPlanted: boolean
  bombDefused: boolean
  damage: Damage
}
