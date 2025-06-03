import { getEventTimestamp } from '@/utils/time'

export default function TimeStamp({
  timestamp,
  roundStartTimestamp,
}: {
  timestamp: Date | null
  roundStartTimestamp: Date | null
}) {
  return <span className="w-[60px]">{getEventTimestamp(roundStartTimestamp, timestamp)}</span>
}
