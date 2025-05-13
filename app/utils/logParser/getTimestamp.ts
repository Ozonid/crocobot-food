import { parseTimestamp } from '@/app/utils/time'

export const TIMESTAMP_REGEX = /(\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}:\d{2})/
export const getTimestamp = (text: string) => {
  const timestamp = text.match(TIMESTAMP_REGEX)
  if (!timestamp) {
    throw new Error(`No timestamp found while processing: ${text}`)
  }
  return parseTimestamp(timestamp[0])
}
