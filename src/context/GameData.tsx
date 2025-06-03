'use client'

import { GameData } from '@/types/Data'
import { createContext, PropsWithChildren, useContext } from 'react'

export const GameDataContext = createContext<GameData>({} as GameData)

export const GameDataProvider = ({
  gameData,
  children,
}: PropsWithChildren<{
  gameData: GameData
}>) => {
  return <GameDataContext.Provider value={gameData}>{children}</GameDataContext.Provider>
}

export const useGameData = () => useContext(GameDataContext)
