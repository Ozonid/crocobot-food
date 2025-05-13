import type { RoundData, Player, GameData, SteamId, RoundPlayerData } from '@/app/types/Data'
import type { EventDefinition } from '@/app/types/Events'
import { getTimestamp } from './getTimestamp'
import { produce } from 'immer'
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

const ROUND_SEPARATOR_REGEX = /.+\[FACEIT\^\] [A-Za-z ]+ \[\d+ - \d+\] [A-Za-z]+/
export const processGameLog = (gameLog: string): GameData => {
  const chunks = gameLog.split(/.+World triggered "Match_Start".+/)
  const relevantLog = chunks[chunks.length - 1]

  const roundLogs = relevantLog.split(ROUND_SEPARATOR_REGEX)
  const teams = extractTeamData(roundLogs[0])

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

const processRoundLog = (roundLogs: string, players: Player[], roundNumber: number): RoundData => {
  const roundData = roundLogs
    .split('\n')
    .reduce<Omit<RoundData, 'players' | 'winner' | 'rawText' | 'targetBombed'>>(
      (result, line) =>
        produce(result, (draft) => {
          // round metadata
          if (line.includes('World triggered "Round_Start"')) {
            draft.roundStartTimestamp = getTimestamp(line)
          }
          if (line.includes('World triggered "Round_End"')) {
            draft.roundEndTimestamp = getTimestamp(line)
          }
          if (line.includes('Team playing "CT"')) {
            draft.sides.CT = line.match(CT_TEAM_REGEX)?.[1] ?? ''
          }
          if (line.includes('Team playing "TERRORIST"')) {
            draft.sides.TERRORIST = line.match(TERRORIST_TEAM_REGEX)?.[1] ?? ''
          }
          if (line.includes('MatchStatus: Score')) {
            draft.scores = getScore(line)
          }
          // events
          if (line.includes('left buyzone')) {
            draft.events.push(getLeftBuyzoneEvent(line))
          }
          if (line.includes('money change') && line.includes('purchase')) {
            draft.events.push(getPurchaseEvent(line))
          }
          if (line.includes('threw')) {
            draft.events.push(getThrowEvent(line))
          }
          if (line.includes('attacked')) {
            draft.events.push(getAttackEvent(line))
          }
          if (line.includes('assisted killing')) {
            draft.events.push(getAssistsEvent(line))
          }
          if (line.includes('killed') && !line.includes('killed other')) {
            draft.events.push(getKillEvent(line))
          }
          if (line.includes('Planted_The_Bomb')) {
            draft.events.push(getBombPlantedEvent(line))
          }
          if (line.includes('Defused_The_Bomb')) {
            draft.events.push(getBombDefusedEvent(line))
          }
        }),
      {
        sides: {
          CT: '',
          TERRORIST: '',
        },
        scores: {
          CT: 0,
          TERRORIST: 0,
        },
        roundStartTimestamp: null,
        roundEndTimestamp: null,
        events: [],
      }
    )

  const winner = roundLogs.includes('Team "CT" triggered') ? 'CT' : 'TERRORIST'

  const isResetRound = roundNumber === 0 || roundNumber === 15
  const startingMoney = isResetRound
    ? {}
    : getStartingMoney(roundLogs.split('Starting Freeze period')[0])

  return {
    ...roundData,
    targetBombed: roundLogs.includes('SFUI_Notice_Target_Bombed'),
    rawText: roundLogs,
    winner,
    players: parsePlayerData(players, roundData.events, startingMoney),
  }
}

const parsePlayerData = (
  players: Player[],
  events: EventDefinition[],
  startingMoney: Record<SteamId, number>
) => {
  return players.reduce<Record<SteamId, RoundPlayerData>>((result, player) => {
    const playerEvents = events.filter((event) => event.player.steamId === player.steamId)

    const kills = playerEvents.filter((event) => event.type === 'kill').length
    const headshots = playerEvents.filter(
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

    return {
      ...result,
      [player.steamId]: {
        ...player,
        loadout,
        startingMoney: startingMoney[player.steamId] || 800,
        kills,
        headshots,
        assists,
        damage,
        survived: !isKilled,
        bombPlanted,
        bombDefused,
      },
    }
  }, {})
}
