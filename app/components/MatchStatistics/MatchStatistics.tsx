'use client'

import { useCallback, useState } from 'react'
import type { GameData, PlayerStatistics } from '@/app/types/Data'
import Table, { Column, SortCol, ColumnValue } from '@/app/components/widgets/Table'
import { getMatchStatistics } from '@/app/utils/getMatchStatistics'
import { formatMoney } from '@/app/utils/dataFormatters'
import Card from '@/app/components/widgets/Card'
import dynamic from 'next/dynamic'
import { GiBoltCutter, GiTimeDynamite } from 'react-icons/gi'
import SignedNumber from '@/app/components/widgets/SignedNumber'

const MoneyChart = dynamic(() => import('@/app/components/MatchStatistics/MoneyChart'), {
  ssr: false,
})

export default function MatchStatistics({ gameData }: { gameData: GameData }) {
  const [sortCol, setSortCol] = useState<SortCol | null>(null)

  const handleSort = useCallback(
    (col: string) => {
      if (sortCol?.name !== col) {
        setSortCol({ name: col, direction: 'asc' })
        return
      }

      setSortCol(sortCol.direction === 'asc' ? { name: col, direction: 'desc' } : null)
    },
    [sortCol]
  )

  const matchStatistics = getMatchStatistics(gameData)

  return (
    <div className="flex max-h-full flex-col items-center gap-8 overflow-y-auto">
      <div className="mx-auto flex w-[80%] max-w-[1600px] flex-col gap-4">
        {Object.entries(matchStatistics.playerStatistics).map(([team, players], idx) => (
          <Card key={team} className="flex items-center gap-8">
            <div
              className={`${idx === 0 ? 'flex-col' : 'flex-col-reverse'} flex w-[200px] items-center justify-center gap-4 p-4`}
            >
              <p className="text-2xl">{team}</p>
              <p
                className={`text-4xl ${matchStatistics.winningTeam === team ? 'text-green-500' : 'text-red-500'} font-bold`}
              >
                {matchStatistics.finalScore[team]}
              </p>
            </div>
            <Table data={players} columns={columns} sortCol={sortCol} onSort={handleSort} />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <MoneyChart gameData={gameData} />
        </Card>
      </div>
    </div>
  )
}

const columns: Column<PlayerStatistics>[] = [
  { name: 'Name', accessor: (player: PlayerStatistics) => player.name, colWidth: 100 },
  { name: 'K', accessor: (player: PlayerStatistics) => player.kills, colWidth: 40 },
  { name: 'D', accessor: (player: PlayerStatistics) => player.deaths, colWidth: 40 },
  { name: 'A', accessor: (player: PlayerStatistics) => player.assists, colWidth: 40 },
  {
    name: 'K/D',
    accessor: (player: PlayerStatistics) => player.kills / player.deaths,
    formatter: (value: ColumnValue) => (value as number).toFixed(2),
    colWidth: 80,
  },
  {
    name: '+/-',
    accessor: (player: PlayerStatistics) => player.kills - player.deaths,
    formatter: (value: ColumnValue) => <SignedNumber value={value as number} />,
    colWidth: 40,
  },
  { name: 'HS', accessor: (player: PlayerStatistics) => player.headShots, colWidth: 40 },
  {
    name: 'Plants',
    header: <GiTimeDynamite size={20} />,
    accessor: (player: PlayerStatistics) => player.bombPlanted,
    colWidth: 40,
  },
  {
    name: 'Defuses',
    header: <GiBoltCutter size={20} />,
    accessor: (player: PlayerStatistics) => player.bombDefused,
    colWidth: 40,
  },
  {
    name: 'Purchases',
    accessor: (player: PlayerStatistics) => player.purchaseCount,
    colWidth: 100,
  },
  {
    name: 'Money spent',
    accessor: (player: PlayerStatistics) => player.purchaseTotal,
    formatter: (value: ColumnValue) => formatMoney(value as number),
    colWidth: 100,
  },
]
