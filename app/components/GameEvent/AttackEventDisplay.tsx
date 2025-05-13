import { GiAbdominalArmor, GiAk47, GiGunshot, GiHealthDecrease } from 'react-icons/gi'
import { IoBodyOutline } from 'react-icons/io5'
import type { AttackEvent } from '@/app/types/Events'
import TimeStamp from './TimeStamp'

export default function AttackEventDisplay({
  event,
  roundStartTimestamp,
}: {
  event: AttackEvent
  roundStartTimestamp: Date | null
}) {
  return (
    <div className="flex items-center gap-1">
      <TimeStamp timestamp={event.timestamp} roundStartTimestamp={roundStartTimestamp} />
      <span>{event.player.name}</span>
      <GiGunshot size={20} />
      <span>{event.target.name}</span>
      <span className="flex items-center gap-1 text-slate-400">
        (
        <span className="flex items-center gap-1">
          <GiAk47 size={20} />
          <span>{event.item}</span>
          <IoBodyOutline size={20} />
          <span>{event.hitgroup}</span>
          <GiHealthDecrease size={20} />
          <span>{event.damage}</span>
          <GiAbdominalArmor size={20} />
          <span>{event.damageArmor}</span>
        </span>
        )
      </span>
    </div>
  )
}
