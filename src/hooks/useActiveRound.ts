'use client'

import { useParams } from 'next/navigation'

export default function useActiveRound() {
  const { roundNumber } = useParams<{ roundNumber: string }>()
  const activeRound = Number(roundNumber) - 1

  return { activeRound }
}
