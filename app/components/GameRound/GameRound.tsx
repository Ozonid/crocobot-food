import type { EventDefinition } from '@/app/types/Events'
import type { RoundData, Teams } from '@/app/types/Data'
import ScoreBoard from './ScoreBoard'
import StatsTable from './StatsTable'
import GameEventDisplay from '@/app/components/GameEvent/GameEvent'

export default function GameRound({ data, teams }: { data: RoundData; teams: Teams }) {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <ScoreBoard data={data} />

      <StatsTable data={data} teams={teams} />

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
