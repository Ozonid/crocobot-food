'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

export default function Tabs({ tabs, queryKey }: { tabs: Tab[]; queryKey: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get(queryKey) || 'match'

  const setActiveTab = useCallback(
    (tabName: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(queryKey, tabName)
      router.push(`?${params.toString()}`)
    },
    [router, searchParams, queryKey]
  )

  useEffect(() => {
    if (!searchParams.has(queryKey)) {
      setActiveTab('match')
    }
  }, [searchParams, setActiveTab, queryKey])

  return (
    <div className="flex w-full flex-col items-center overflow-hidden">
      <div className="flex gap-2 rounded-lg bg-gray-700 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-amber-700 text-white'
                : 'bg-gray-700 text-white hover:bg-amber-700/50'
            } `}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4 w-full flex-1 overflow-hidden">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  )
}
