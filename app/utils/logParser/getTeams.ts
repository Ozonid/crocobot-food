import type { Side } from '@/app/types/Data'
import { PLATER_DATA_REGEX } from './getPlayer'

const CT_TEAM_REGEX = /Team playing "CT": (.+)/
const TERRORIST_TEAM_REGEX = /Team playing "TERRORIST": (.+)/
const INITIAL_PLAYER_REGEX = new RegExp(`${PLATER_DATA_REGEX.source} left buyzone`, 'gm')
export const extractTeamData = (text: string) => {
  const players = [...text.matchAll(INITIAL_PLAYER_REGEX)]

  const ctTeam = text.match(CT_TEAM_REGEX)?.[1] ?? ''
  const terroristTeam = text.match(TERRORIST_TEAM_REGEX)?.[1] ?? ''

  return {
    [ctTeam]: getTeamPlayers(players, 'CT'),
    [terroristTeam]: getTeamPlayers(players, 'TERRORIST'),
  }
}

const getTeamPlayers = (data: RegExpExecArray[], side: Side) => {
  const players = data
    .filter((player) => player[3] === side)
    .map((player) => ({
      name: player[1],
      steamId: player[2],
    }))

  players.sort((a, b) => a.name.localeCompare(b.name))
  return players
}
