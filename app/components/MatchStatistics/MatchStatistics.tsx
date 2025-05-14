'use client'

import { useCallback, useState } from 'react'
import type { GameData, PlayerStatistics } from '@/app/types/Data'
import Table, { Column, SortCol, ColumnValue } from '@/app/components/widgets/Table'
import { getMatchStatistics } from '@/app/utils/getMatchStatistics'
import { formatMoney } from '@/app/utils/dataFormatters'
import Card from '@/app/components/widgets/Card'
import dynamic from 'next/dynamic'

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
    <div className="flex flex-col items-center gap-16">
      <div className="mx-auto flex w-[80%] max-w-[1600px] flex-col gap-16">
        {Object.entries(matchStatistics.playerStatistics).map(([team, players], idx) => (
          <div key={team} className="flex items-center gap-16">
            <div
              className={`${idx === 0 ? 'flex-col' : 'flex-col-reverse'} flex w-[200px] items-center justify-center gap-4 rounded-md bg-slate-600 px-6 py-4`}
            >
              <p className="text-2xl">{team}</p>
              <p className="text-4xl">{matchStatistics.finalScore[team]}</p>
            </div>
            <Table data={players} columns={columns} sortCol={sortCol} onSort={handleSort} />
          </div>
        ))}
      </div>

      <div className="mx-auto h-[1px] w-[40%] rounded-full bg-slate-300" />

      <div className="flex flex-col gap-8">
        <p className="text-center text-2xl">Team statistics</p>
        <div className="grid grid-cols-2 gap-16">
          <Card>
            <MoneyChart gameData={gameData} />
          </Card>
        </div>
      </div>
    </div>
  )
}

const formatNumberWithSign = (value: ColumnValue) => {
  const num = value as number
  return num > 0 ? (
    <span className="text-green-500">+{num}</span>
  ) : (
    <span className="text-red-500">{num}</span>
  )
}

const columns: Column<PlayerStatistics>[] = [
  { label: 'Name', accessor: (player: PlayerStatistics) => player.name, colWidth: 240 },
  { label: 'K', accessor: (player: PlayerStatistics) => player.kills, colWidth: 40 },
  { label: 'D', accessor: (player: PlayerStatistics) => player.deaths, colWidth: 40 },
  { label: 'A', accessor: (player: PlayerStatistics) => player.assists, colWidth: 40 },
  {
    label: 'K/D',
    accessor: (player: PlayerStatistics) => player.kills / player.deaths,
    formatter: (value: ColumnValue) => (value as number).toFixed(2),
    colWidth: 80,
  },
  {
    label: '+/-',
    accessor: (player: PlayerStatistics) => player.kills - player.deaths,
    formatter: formatNumberWithSign,
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
    accessor: (player: PlayerStatistics) => player.purchaseTotal,
    formatter: (value: ColumnValue) => formatMoney(value as number),
    colWidth: 200,
  },
]
