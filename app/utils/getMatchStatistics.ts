import { differenceInSeconds } from 'date-fns'
import type { GameData, PlayerStatistics, RoundData } from '@/app/types/Data'

interface MatchStatistics {
  finalScore: {
    [team: string]: number
  }
  averageRoundTime: number
  playerStatistics: {
    [team: string]: PlayerStatistics[]
  }
}

export const getMatchStatistics = (gameData: GameData): MatchStatistics => {
  const finalRound = gameData.rounds[gameData.rounds.length - 1]
  const finalScore = {
    [finalRound.sides.CT]: finalRound.scores.CT,
    [finalRound.sides.TERRORIST]: finalRound.scores.TERRORIST,
  }

  const playerStatistics = Object.entries(gameData.teams).reduce<{
    [k: string]: PlayerStatistics[]
  }>(
    (result, [team, players]) => ({
      ...result,
      [team]: players.map((player) => getPlayerStats(player, gameData.rounds)),
    }),
    {}
  )

  return {
    finalScore,
    averageRoundTime: getAverageRoundTime(gameData.rounds),
    playerStatistics,
  }
}

const getAverageRoundTime = (rounds: RoundData[]): number => {
  const totalRoundTime = rounds.reduce((result, round) => {
    const roundTime = differenceInSeconds(round.roundEndTimestamp, round.roundStartTimestamp)
    return result + roundTime
  }, 0)
  return totalRoundTime / rounds.length
}

const getPlayerStats = (
  player: { name: string; steamId: string },
  rounds: RoundData[]
): PlayerStatistics => {
  return rounds.reduce<PlayerStatistics>(
    (result, round) => {
      const playerData = round.players[player.steamId]
      return {
        ...result,
        kills: result.kills + playerData.kills,
        headShots: result.headShots + playerData.headShots,
        assists: result.assists + playerData.assists,
        deaths: result.deaths + (playerData.survived ? 0 : 1),
        bombPlanted: result.bombPlanted + (playerData.bombPlanted ? 1 : 0),
        bombDefused: result.bombDefused + (playerData.bombDefused ? 1 : 0),
        purchaseCount: result.purchaseCount + playerData.purchases.length,
        purchaseTotal:
          result.purchaseTotal +
          playerData.purchases.reduce((sum, purchase) => sum + purchase.price, 0),
      }
    },
    {
      name: player.name,
      kills: 0,
      headShots: 0,
      assists: 0,
      deaths: 0,
      bombPlanted: 0,
      bombDefused: 0,
      purchaseCount: 0,
      purchaseTotal: 0,
    }
  )
}
