import { GiTimeDynamite } from 'react-icons/gi'
import type { BombPlantedEvent } from '@/app/types/Events'
import { TbCircleLetterAFilled, TbCircleLetterBFilled } from 'react-icons/tb'
import TimeStamp from './TimeStamp'

export default function BombPlantedEventDisplay({
  event,
  roundStartTimestamp,
}: {
  event: BombPlantedEvent
  roundStartTimestamp: Date | null
}) {
  return (
    <div className="flex items-center gap-1">
      <TimeStamp timestamp={event.timestamp} roundStartTimestamp={roundStartTimestamp} />
      <GiTimeDynamite size={20} />
      {event.bombsite === 'A' ? (
        <TbCircleLetterAFilled size={20} />
      ) : (
        <TbCircleLetterBFilled size={20} />
      )}
      <span>{event.player.name}</span>
    </div>
  )
}
