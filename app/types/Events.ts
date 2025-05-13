import type { Player } from './Data'

export interface GameEvent {
  timestamp: Date
  player: Player
  type: string
}

export interface PurchaseEvent extends GameEvent {
  type: 'purchase'
  item: string
  price: number
}

export interface ThrowEvent extends GameEvent {
  type: 'throw'
  item: string
}

export interface AttackEvent extends GameEvent {
  type: 'attack'
  item: string
  target: Player
  damage: number
  damageArmor: number
  hitgroup: string
}

export interface KillEvent extends GameEvent {
  type: 'kill'
  item: string
  target: Player
  isHeadShot: boolean
}
export interface AssistsEvent extends GameEvent {
  type: 'assist'
  target: Player
}

export interface LeftBuyzoneEvent extends GameEvent {
  type: 'leftBuyzone'
  loadout: string[]
}

export interface BombPlantedEvent extends GameEvent {
  type: 'bombPlanted'
  bombsite: 'A' | 'B'
}

export interface BombDefusedEvent extends GameEvent {
  type: 'bombDefused'
}

export type EventDefinition =
  | PurchaseEvent
  | ThrowEvent
  | AttackEvent
  | KillEvent
  | AssistsEvent
  | LeftBuyzoneEvent
  | BombPlantedEvent
  | BombDefusedEvent
