import { GiBoltCutter } from 'react-icons/gi'
import type { BombDefusedEvent } from '@/app/types/Events'
import TimeStamp from './TimeStamp'

export default function BombDefusedEventDisplay({
  event,
  roundStartTimestamp,
}: {
  event: BombDefusedEvent
  roundStartTimestamp: Date | null
}) {
  return (
    <div className="flex items-center gap-1">
      <TimeStamp timestamp={event.timestamp} roundStartTimestamp={roundStartTimestamp} />
      <GiBoltCutter size={20} />
      <span>{event.player.name}</span>
    </div>
  )
}
