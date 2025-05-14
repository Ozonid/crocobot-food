import { SlClock } from 'react-icons/sl'

import type { RoundData, Side } from '@/app/types/Data'
import { getTimeDifference } from '@/app/utils/time'
import { GiBoltCutter, GiTimeDynamite } from 'react-icons/gi'
import { FaCrosshairs } from 'react-icons/fa'

export default function ScoreBoard({ data }: { data: RoundData }) {
  const bombDefused = data.winner === 'CT' && data.events.find(({ type }) => type === 'bombDefused')

  return (
    <div className="flex justify-center gap-8">
      <TeamName team={data.sides.CT} side="CT" />

      <div className="flex w-[300px] flex-col items-center justify-center">
        <span className="flex items-center gap-2 text-3xl font-semibold">
          <span className="w-5">
            {data.winner === 'CT' &&
              (bombDefused ? <GiBoltCutter size={20} /> : <FaCrosshairs size={20} />)}
          </span>
          {data.scores.CT} : {data.scores.TERRORIST}
          <span className="w-5">
            {data.winner === 'TERRORIST' &&
              (data.targetBombed ? <GiTimeDynamite size={20} /> : <FaCrosshairs size={20} />)}
          </span>
        </span>
        {data.roundStartTimestamp && data.roundEndTimestamp && (
          <div className="flex items-center justify-center gap-1">
            <SlClock size={13} className="" />
            <span className="text-sm">
              {getTimeDifference(data.roundStartTimestamp, data.roundEndTimestamp)}
            </span>
          </div>
        )}
      </div>

      <TeamName team={data.sides.TERRORIST} side="TERRORIST" />
    </div>
  )
}

const TeamName = ({ team, side }: { team: string; side: Side }) => {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-semibold">{team}</span>
      <span className={`px-2 py-0.5 text-xs font-medium color-${side.toLowerCase()} rounded`}>
        {side}
      </span>
    </div>
  )
}
