import { GameData } from '@/app/types/Data'
import { formatMoney } from '@/app/utils/dataFormatters'
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts'

const chartColors = ['oklch(74.6% 0.16 232.661)', 'oklch(63.7% 0.237 25.331)']
export default function MoneyChart({ gameData }: { gameData: GameData }) {
  const data = gameData.rounds.map((round, idx) => {
    const teamStartingMoney = Object.entries(gameData.teams).reduce<{ [key: string]: number }>(
      (result, [team, players]) => {
        return {
          ...result,
          [team]: players.reduce(
            (sum, player) => sum + round.players[player.steamId].startingMoney,
            0
          ),
        }
      },
      {}
    )

    return {
      name: idx + 1,
      ...teamStartingMoney,
    }
  })

  return (
    <div className="flex flex-col items-center">
      <AreaChart
        width={730}
        height={250}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <XAxis
          dataKey="name"
          style={{ textAnchor: 'middle', fontSize: '80%', fill: 'rgba(255,255,255, 0.87)' }}
        />
        <YAxis
          tickFormatter={(value: number) => formatMoney(value)}
          style={{ fontSize: '80%', fill: 'rgba(255,255,255, 0.87)' }}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip formatter={(value: number) => formatMoney(value)} />
        {Object.keys(gameData.teams).map((team, idx) => (
          <Area
            key={team}
            type="monotone"
            dataKey={team}
            stroke={chartColors[idx]}
            fillOpacity={0.75}
            fill={chartColors[idx]}
          />
        ))}
      </AreaChart>
      <p>Team starting money by rounds</p>
    </div>
  )
}
