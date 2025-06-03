import { describe, it, expect } from 'vitest'
import { parseTimestamp, getEventTimestamp } from './time'

describe('time', () => {
  describe('parseTimestamp', () => {
    it('parses timestamp correctly', () => {
      const date = parseTimestamp('01/15/2024 - 14:30:45')
      expect(date.getFullYear()).toBe(2024)
      expect(date.getMonth()).toBe(0) // January is 0
      expect(date.getDate()).toBe(15)
      expect(date.getHours()).toBe(14)
      expect(date.getMinutes()).toBe(30)
      expect(date.getSeconds()).toBe(45)
    })
  })

  describe('getEventTimestamp', () => {
    it('returns null when timestamps are missing', () => {
      expect(getEventTimestamp(null, null)).toBeNull()
      expect(getEventTimestamp(new Date(), null)).toBeNull()
      expect(getEventTimestamp(null, new Date())).toBeNull()
    })

    it('calculates time difference correctly', () => {
      const roundStart = new Date('2024-01-15T14:30:00')
      const eventTime = new Date('2024-01-15T14:30:45')
      expect(getEventTimestamp(roundStart, eventTime)).toBe('00:45')
    })

    it('handles minutes correctly', () => {
      const roundStart = new Date('2024-01-15T14:30:00')
      const eventTime = new Date('2024-01-15T14:31:45')
      expect(getEventTimestamp(roundStart, eventTime)).toBe('01:45')
    })
  })
})
