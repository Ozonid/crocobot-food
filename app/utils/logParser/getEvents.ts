import type {
  PurchaseEvent,
  LeftBuyzoneEvent,
  ThrowEvent,
  AttackEvent,
  KillEvent,
  AssistsEvent,
  BombPlantedEvent,
  BombDefusedEvent,
} from '@/app/types/Events'
import { getTimestamp } from './getTimestamp'
import { getPlayer } from './getPlayer'

const LOADOUT_REGEX = /with \[([A-Za-z0-9_ ()]+)\]/
export const getLeftBuyzoneEvent = (line: string): LeftBuyzoneEvent => {
  return {
    timestamp: getTimestamp(line),
    player: getPlayer(line),
    type: 'leftBuyzone',
    loadout: (line.match(LOADOUT_REGEX)?.[1] ?? '').split(' ').filter(Boolean),
  }
}

const ITEM_REGEX = /([a-zA-Z0-9_]+)/
const PURCHASE_REGEX = new RegExp(`purchase: ${ITEM_REGEX.source}`)
const PRICE_REGEX = /money change \d+-(\d+)/
export const getPurchaseEvent = (line: string): PurchaseEvent => {
  return {
    timestamp: getTimestamp(line),
    player: getPlayer(line),
    item: line.match(PURCHASE_REGEX)?.[1] ?? '',
    type: 'purchase',
    price: Number(line.match(PRICE_REGEX)?.[1] ?? 0),
  }
}

const THROWN_ITEM_REGEX = new RegExp(`threw ${ITEM_REGEX.source}`)
export const getThrowEvent = (line: string): ThrowEvent => {
  return {
    timestamp: getTimestamp(line),
    player: getPlayer(line),
    item: line.match(THROWN_ITEM_REGEX)?.[1] ?? '',
    type: 'throw',
  }
}

const ATTACK_ITEM_REGEX = new RegExp(`with "(${ITEM_REGEX.source})"`)
const DAMAGE_REGEX = /damage "(\d+)"/
const DAMAGE_ARMOR_REGEX = /damage_armor "(\d+)"/
const HITGROUP_REGEX = /hitgroup "([a-zA-Z0-9_ ]+)"/
export const getAttackEvent = (line: string): AttackEvent => {
  const chunks = line.split('attacked')
  return {
    timestamp: getTimestamp(chunks[0]),
    player: getPlayer(chunks[0]),
    item: line.match(ATTACK_ITEM_REGEX)?.[1] ?? '',
    type: 'attack',
    target: getPlayer(chunks[1]),
    damage: Number(line.match(DAMAGE_REGEX)?.[1] ?? 0),
    damageArmor: Number(line.match(DAMAGE_ARMOR_REGEX)?.[1] ?? 0),
    hitgroup: line.match(HITGROUP_REGEX)?.[1] ?? '',
  }
}

export const getKillEvent = (line: string): KillEvent => {
  const chunks = line.split('killed')

  return {
    timestamp: getTimestamp(line),
    player: getPlayer(chunks[0]),
    item: line.match(ATTACK_ITEM_REGEX)?.[1] ?? '',
    type: 'kill',
    target: getPlayer(chunks[1]),
    isHeadShot: line.includes('(headshot)'),
  }
}

export const getAssistsEvent = (line: string): AssistsEvent => {
  const chunks = line.split('assisted killing')
  return {
    timestamp: getTimestamp(line),
    player: getPlayer(chunks[0]),
    type: 'assist',
    target: getPlayer(chunks[1]),
  }
}

export const getBombPlantedEvent = (line: string): BombPlantedEvent => {
  return {
    timestamp: getTimestamp(line),
    player: getPlayer(line),
    type: 'bombPlanted',
    bombsite: line.includes('bombsite A ') ? 'A' : 'B',
  }
}

export const getBombDefusedEvent = (line: string): BombDefusedEvent => {
  return {
    timestamp: getTimestamp(line),
    player: getPlayer(line),
    type: 'bombDefused',
  }
}
