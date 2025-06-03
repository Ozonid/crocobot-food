'use client'

import type { EventDefinition } from '@/types/Events'
import ScoreBoard from './ScoreBoard'
import Card from '@/components/Card'
import GameEventDisplay from './GameEvent/GameEvent'
import StatsTable from '@/app/round-statistics/[roundNumber]/StatsTable'
import { useGameData } from '@/context/GameData'
import useActiveRound from '@/hooks/useActiveRound'

export default function GameRoundPage() {
  const { activeRound } = useActiveRound()

  const gameData = useGameData()
  const data = gameData.rounds[activeRound]

  return (
    <div className="mx-auto flex w-[90%] max-w-[1600px] flex-1 flex-col gap-4 overflow-hidden">
      <ScoreBoard data={data} />

      <Card>
        <StatsTable data={data} teams={gameData.teams} />
      </Card>

      <span className="text-center text-lg font-medium">Round Log</span>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto tabular-nums">
        <div className="mx-auto flex flex-col">
          {data.events.map((event: EventDefinition, idx: number) => (
            <GameEventDisplay
              key={idx}
              event={event}
              roundStartTimestamp={data.roundStartTimestamp}
            />
          ))}

          {/* {data.rawText.split('\n').map((line: string, idx: number) => (
            <span key={idx}>{line}</span>
          ))} */}
        </div>
      </div>
    </div>
  )
}
