import type { GameData, PlayerStatistics } from '@/app/types/Data'
import { differenceInSeconds } from 'date-fns'

const columns = [
  { label: 'Name', accessor: (player: PlayerStatistics) => player.name, colWidth: 240 },
  { label: 'K', accessor: (player: PlayerStatistics) => player.kills, colWidth: 40 },
  { label: 'D', accessor: (player: PlayerStatistics) => player.deaths, colWidth: 40 },
  { label: 'A', accessor: (player: PlayerStatistics) => player.assists, colWidth: 40 },
  {
    label: 'K/D',
    accessor: (player: PlayerStatistics) => (player.kills / player.deaths).toFixed(2),
    colWidth: 40,
  },
  {
    label: '+/-',
    accessor: (player: PlayerStatistics) => formatNumberWithSign(player.kills - player.deaths),
    colWidth: 40,
  },
  { label: 'HS', accessor: (player: PlayerStatistics) => player.headShots, colWidth: 40 },
  { label: 'Plants', accessor: (player: PlayerStatistics) => player.bombPlanted, colWidth: 40 },
  { label: 'Defuses', accessor: (player: PlayerStatistics) => player.bombDefused, colWidth: 40 },
  {
    label: 'Purchases',
    accessor: (player: PlayerStatistics) => player.purchaseCount,
    colWidth: 200,
  },
  {
    label: 'Money spent',
    accessor: (player: PlayerStatistics) => formatMoney(player.purchaseTotal),
    colWidth: 200,
  },
]

export default function MatchStatistics({ gameData }: { gameData: GameData }) {
  const matchStatistics = getMatchStatistics(gameData)

  return (
    <div className="mx-auto flex w-[80%] max-w-[1600px] flex-col gap-8">
      {Object.entries(matchStatistics.playerStatistics).map(([team, players], idx) => (
        <div key={team} className="flex items-center gap-16">
          <div
            className={`${idx === 0 ? 'flex-col' : 'flex-col-reverse'} flex w-[200px] items-center justify-center gap-4`}
          >
            <p className="text-2xl">{team}</p>
            <p className="text-4xl">{matchStatistics.finalScore[team]}</p>
          </div>
          <table className="flex-1 table-fixed">
            <thead>
              <tr>
                {columns.map(({ label, colWidth }) => (
                  <th
                    key={label}
                    className={`border-b-2 border-slate-600 px-2 py-1 w-[${colWidth}px]`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.name}>
                  {columns.map(({ label, accessor }) => (
                    <td key={label} className="text-center">
                      {accessor(player)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

const formatMoney = (money: number) => {
  return money.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

const formatNumberWithSign = (number: number) => {
  return number > 0 ? (
    <span className="text-green-500">+{number}</span>
  ) : (
    <span className="text-red-500">{number}</span>
  )
}

const getMatchStatistics = (gameData: GameData) => {
  const finalRound = gameData.rounds[gameData.rounds.length - 1]
  const finalScore = {
    [finalRound.sides.CT]: finalRound.scores.CT,
    [finalRound.sides.TERRORIST]: finalRound.scores.TERRORIST,
  }

  const totalRoundTime = gameData.rounds.reduce((result, round) => {
    const roundTime = differenceInSeconds(round.roundEndTimestamp, round.roundStartTimestamp)
    return result + roundTime
  }, 0)
  const averageRoundTime = totalRoundTime / gameData.rounds.length

  const playerStatistics = Object.entries(gameData.teams).reduce<{
    [k: string]: PlayerStatistics[]
  }>((result, [team, players]) => {
    return {
      ...result,
      [team]: players.map((player) => {
        return gameData.rounds.reduce<PlayerStatistics>(
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
                playerData.purchases.reduce((result, purchase) => result + purchase.price, 0),
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
      }),
    }
  }, {})

  const matchStatistics = {
    finalScore,
    averageRoundTime,
    playerStatistics,
  }
  return matchStatistics
}
