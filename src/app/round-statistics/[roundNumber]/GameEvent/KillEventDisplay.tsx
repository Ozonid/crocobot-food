import { GiHeadshot } from 'react-icons/gi'
import type { KillEvent } from '@/types/Events'
import TimeStamp from './TimeStamp'
import { FaCrosshairs } from 'react-icons/fa'

export default function KillEventDisplay({
  event,
  roundStartTimestamp,
}: {
  event: KillEvent
  roundStartTimestamp: Date | null
}) {
  return (
    <div className="flex items-center gap-1">
      <TimeStamp timestamp={event.timestamp} roundStartTimestamp={roundStartTimestamp} />
      <span>{event.player.name}</span>
      {event.isHeadShot ? <GiHeadshot size={20} /> : <FaCrosshairs size={20} />}
      <span>{event.target.name}</span>
    </div>
  )
}
