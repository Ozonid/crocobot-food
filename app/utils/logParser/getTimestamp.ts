import { parseTimestamp } from '@/app/utils/time'

const TIMESTAMP_REGEX = /(\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}:\d{2})/
export const getTimestamp = (line: string) => {
  const timestamp = line.match(TIMESTAMP_REGEX)
  if (!timestamp) {
    throw new Error('No timestamp found')
  }
  return parseTimestamp(timestamp[0])
}
