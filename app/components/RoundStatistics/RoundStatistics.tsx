'use client'

import GameRound from '@/app/components/GameRound/GameRound'
import RoundSelector from '@/app/components/RoundStatistics/RoundSelector'
import type { GameData } from '@/app/types/Data'
import { useState } from 'react'

export default function RoundStatistics({ gameData }: { gameData: GameData }) {
  const [activeRound, setActiveRound] = useState(0)

  return (
    <div className="flex max-h-full w-full flex-1 flex-col items-center gap-8 overflow-hidden">
      <RoundSelector rounds={gameData.rounds} activeRound={activeRound} onSelect={setActiveRound} />
      <GameRound data={gameData.rounds[activeRound]} teams={gameData.teams} />
    </div>
  )
}
