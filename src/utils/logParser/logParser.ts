import type { RoundData, Player, GameData, SteamId, RoundPlayerData } from '@/types/Data'
import type { EventDefinition } from '@/types/Events'
import {
  getLeftBuyzoneEvent,
  getPurchaseEvent,
  getThrowEvent,
  getAttackEvent,
  getKillEvent,
  getAssistsEvent,
  getBombPlantedEvent,
  getBombDefusedEvent,
} from './getEvents'
import { getScore } from './getScore'
import { extractTeamData } from './getTeams'
import { getStartingMoney } from './getStartingMoney'
import { getTimestamp } from '@/utils/logParser/getTimestamp'
import { TIMESTAMP_REGEX } from '@/utils/logParser/getTimestamp'

const ROUND_SEPARATOR_REGEX = /.+\[FACEIT\^\] [A-Za-z ]+ \[\d+ - \d+\] [A-Za-z]+/
export const processGameLog = (gameLog: string): GameData => {
  const chunks = gameLog.split(/.+World triggered "Match_Start".+/)
  const relevantLog = chunks[chunks.length - 1]

  const roundLogs = relevantLog.split(ROUND_SEPARATOR_REGEX).slice(0, -1)
  const teams = extractTeamData(roundLogs)

  return {
    rounds: roundLogs.reduce<RoundData[]>(
      (result, roundLog, idx) => [
        ...result,
        processRoundLog(roundLog, Object.values(teams).flat(), idx),
      ],
      []
    ),
    teams,
  }
}

const CT_TEAM_REGEX = /Team playing "CT": (.+)/
const TERRORIST_TEAM_REGEX = /Team playing "TERRORIST": (.+)/
const ROUND_START_REGEX = new RegExp(`${TIMESTAMP_REGEX.source}: World triggered "Round_Start"`)
const ROUND_END_REGEX = new RegExp(`${TIMESTAMP_REGEX.source}: World triggered "Round_End"`)

const processRoundLog = (roundLogs: string, players: Player[], roundNumber: number): RoundData => {
  const lines = roundLogs.split('\n')
  const events = lines.slice(0, -7).reduce<EventDefinition[]>((result, line) => {
    const event = lineToEvent(line)
    return event ? [...result, event] : result
  }, [])

  const winner = roundLogs.includes('Team "CT" triggered') ? 'CT' : 'TERRORIST'

  const isResetRound = roundNumber === 0 || roundNumber === 15
  const startingMoney = isResetRound
    ? {}
    : getStartingMoney(roundLogs.split('Starting Freeze period')[0])

  return {
    sides: {
      CT: roundLogs.match(CT_TEAM_REGEX)?.[1] ?? '',
      TERRORIST: roundLogs.match(TERRORIST_TEAM_REGEX)?.[1] ?? '',
    },
    scores: getScore(lines[lines.length - 3]),
    roundStartTimestamp: getTimestamp(roundLogs.match(ROUND_START_REGEX)?.[0] ?? ''),
    roundEndTimestamp: getTimestamp(roundLogs.match(ROUND_END_REGEX)?.[0] ?? ''),
    targetBombed: roundLogs.includes('SFUI_Notice_Target_Bombed'),
    winner,
    players: parsePlayerData(players, events, startingMoney),
    events,
    rawText: roundLogs,
  }
}

const lineToEvent = (line: string): EventDefinition | null => {
  if (line.includes('left buyzone')) {
    return getLeftBuyzoneEvent(line)
  }
  if (line.includes('money change') && line.includes('purchase')) {
    return getPurchaseEvent(line)
  }
  if (line.includes('threw')) {
    return getThrowEvent(line)
  }
  if (line.includes('attacked')) {
    return getAttackEvent(line)
  }
  if (line.includes('assisted killing')) {
    return getAssistsEvent(line)
  }
  if (line.includes('killed') && !line.includes('killed other')) {
    return getKillEvent(line)
  }
  if (line.includes('Planted_The_Bomb')) {
    return getBombPlantedEvent(line)
  }
  if (line.includes('Defused_The_Bomb')) {
    return getBombDefusedEvent(line)
  }

  return null
}

const parsePlayerData = (
  players: Player[],
  events: EventDefinition[],
  startingMoney: Record<SteamId, number>
) => {
  return players.reduce<Record<SteamId, RoundPlayerData>>((result, player) => {
    const playerEvents = events.filter((event) => event.player.steamId === player.steamId)

    const kills = playerEvents.filter((event) => event.type === 'kill').length
    const headShots = playerEvents.filter(
      (event) => event.type === 'kill' && event.isHeadShot
    ).length
    const assists = playerEvents.filter((event) => event.type === 'assist').length
    const loadout = playerEvents.find((event) => event.type === 'leftBuyzone')?.loadout || []
    const isKilled = events.some(
      (event) => event.type === 'kill' && event.target.steamId === player.steamId
    )
    const damage = playerEvents
      .filter((event) => event.type === 'attack')
      .reduce(
        (result, event) => {
          return {
            health: result.health + event.damage,
            armor: result.armor + event.damageArmor,
          }
        },
        { health: 0, armor: 0 }
      )
    const bombPlanted = !!playerEvents.find((event) => event.type === 'bombPlanted')
    const bombDefused = !!playerEvents.find((event) => event.type === 'bombDefused')
    const purchases = playerEvents
      .filter((event) => event.type === 'purchase')
      .map((event) => ({
        item: event.item,
        price: event.price,
      }))

    return {
      ...result,
      [player.steamId]: {
        ...player,
        loadout,
        startingMoney: startingMoney[player.steamId] || 800,
        kills,
        headShots,
        assists,
        damage,
        survived: !isKilled,
        bombPlanted,
        bombDefused,
        purchases,
      },
    }
  }, {})
}
