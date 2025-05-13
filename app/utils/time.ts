import { formatDuration, intervalToDuration, parse } from 'date-fns'

export const parseTimestamp = (timestamp: string) => {
  return parse(timestamp, 'MM/dd/yyyy - HH:mm:ss', new Date())
}

export const getEventTimestamp = (
  roundStartTimestamp: Date | null,
  eventTimestamp: Date | null
) => {
  if (!roundStartTimestamp || !eventTimestamp) {
    return null
  }
  const interval = intervalToDuration({ start: roundStartTimestamp, end: eventTimestamp })
  return `${interval.minutes?.toString().padStart(2, '0') || '00'}:${interval.seconds?.toString().padStart(2, '0') || '00'}`
}

export const getTimeDifference = (startDate: Date, endDate: Date) => {
  return formatDuration(intervalToDuration({ start: startDate, end: endDate }))
}
