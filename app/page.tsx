import Tabs from '@/app/components/widgets/Tabs'
import { processGameLog } from '@/app/utils/logParser/logParser'
import MatchStatistics from '@/app/components/MatchStatistics/MatchStatistics'
import RoundStatistics from '@/app/components/RoundStatistics/RoundStatistics'
import { Suspense } from 'react'

export default async function Home() {
  const response = await fetch(
    'https://blast-recruiting.s3.eu-central-1.amazonaws.com/NAVIvsVitaGF-Nuke.txt'
  )
  const text = await response.text()
  const gameData = processGameLog(text)

  const tabs = [
    {
      id: 'match',
      label: 'Match Statistics',
      content: <MatchStatistics gameData={gameData} />,
    },
    {
      id: 'round',
      label: 'Round Statistics',
      content: <RoundStatistics gameData={gameData} />,
    },
  ]

  return (
    <div className="flex h-screen w-screen flex-col gap-4 overflow-y-hidden bg-slate-900 p-4 text-white">
      <Suspense>
        <Tabs tabs={tabs} queryKey="statistics" />
      </Suspense>
    </div>
  )
}
