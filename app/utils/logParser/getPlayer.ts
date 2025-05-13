import type { Player } from '@/app/types/Data'

export const PLATER_DATA_REGEX = /"(.+)<\d+><(STEAM_1:\d:\d+)><(TERRORIST|CT)>"/

export const getPlayer = (line: string): Player => {
  const playerData = line.match(PLATER_DATA_REGEX)
  if (!playerData) {
    throw new Error('Player data not found')
  }
  return {
    name: playerData[1],
    steamId: playerData[2],
  }
}
