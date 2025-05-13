import { GiSmokeBomb, GiFlashGrenade, GiGrenade, GiMolotov } from 'react-icons/gi'
import type { ThrowEvent } from '@/app/types/Events'
import TimeStamp from './TimeStamp'

export default function ThrowEventDisplay({
  event,
  roundStartTimestamp,
}: {
  event: ThrowEvent
  roundStartTimestamp: Date | null
}) {
  return (
    <div className="flex items-center gap-1">
      <TimeStamp timestamp={event.timestamp} roundStartTimestamp={roundStartTimestamp} />
      {getThrownIcon(event.item)}
      <span>{event.player.name}</span>
    </div>
  )
}

const getThrownIcon = (item: string) => {
  switch (item) {
    case 'smokegrenade':
      return <GiSmokeBomb size={20} />
    case 'flashbang':
      return <GiFlashGrenade size={20} />
    case 'hegrenade':
      return <GiGrenade size={20} />
    case 'molotov':
      return <GiMolotov size={20} />
    default:
      return null
  }
}
