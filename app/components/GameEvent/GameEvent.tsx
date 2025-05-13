import AttackEventDisplay from './AttackEventDisplay'
import KillEventDisplay from './KillEventDisplay'
import ThrowEventDisplay from './ThrowEventDisplay'
import type { EventDefinition } from '@/app/types/Events'
import BombPlantedEventDisplay from './BombPlantedEventDisplay'
import BombDefusedEventDisplay from './BombDefusedEventDisplay'

export default function GameEventDisplay({
  event,
  roundStartTimestamp,
}: {
  event: EventDefinition
  roundStartTimestamp: Date | null
}) {
  switch (event.type) {
    case 'throw':
      return <ThrowEventDisplay event={event} roundStartTimestamp={roundStartTimestamp} />
    case 'attack':
      return <AttackEventDisplay event={event} roundStartTimestamp={roundStartTimestamp} />
    case 'kill':
      return <KillEventDisplay event={event} roundStartTimestamp={roundStartTimestamp} />
    case 'bombPlanted':
      return <BombPlantedEventDisplay event={event} roundStartTimestamp={roundStartTimestamp} />
    case 'bombDefused':
      return <BombDefusedEventDisplay event={event} roundStartTimestamp={roundStartTimestamp} />
    default:
      return null
  }
}
