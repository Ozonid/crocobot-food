'use client'

import { useGameData } from '@/context/GameData'
import useActiveRound from '@/hooks/useActiveRound'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const CS_GO_MAX_ROUNDS = 30

export default function RoundSelector() {
  const router = useRouter()

  const gameData = useGameData()
  const { activeRound } = useActiveRound()

  useEffect(() => {
    if (activeRound < 1 || activeRound > 30) {
      router.push('/round-statistics/1')
    }
  }, [activeRound, router])

  return (
    <div className="mx-auto grid w-full max-w-[1200px] grid-cols-15 gap-1">
      {Array.from({ length: CS_GO_MAX_ROUNDS }).map((_, idx) => {
        const isDisabled = idx >= gameData.rounds.length
        const roundData = gameData.rounds[idx]
        return (
          <button
            className={`rounded-md border-2 py-0.5 transition-colors hover:cursor-pointer ${idx === activeRound ? 'border-amber-700' : 'border-slate-900 hover:border-amber-700/50'} ${isDisabled ? 'pointer-events-none opacity-25' : roundData.winner === 'CT' ? 'color-ct' : 'color-terrorist'} font-bold`}
            key={idx}
            onClick={() => router.push(`/round-statistics/${idx + 1}`)}
            disabled={isDisabled}
          >
            {idx + 1}
          </button>
        )
      })}
    </div>
  )
}
