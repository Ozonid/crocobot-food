import RoundSelector from '@/app/round-statistics/RoundSelector'
import { PropsWithChildren } from 'react'

export default function RoundStatisticsLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex max-h-full w-full flex-1 flex-col items-center gap-8 overflow-hidden">
      <RoundSelector />
      {children}
    </div>
  )
}
