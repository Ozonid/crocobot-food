'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

const NAV_ITEMS = [
  {
    url: 'match-statistics',
    label: 'Match Statistics',
  },
  {
    url: 'round-statistics',
    label: 'Round Statistics',
  },
]

export default function NavBar() {
  const segment = useSelectedLayoutSegment()

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex gap-2 rounded-lg bg-gray-700 p-1">
        {NAV_ITEMS.map(({ url, label }) => (
          <Link
            key={url}
            className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-all ${
              segment === url
                ? 'bg-amber-700 text-white'
                : 'bg-gray-700 text-white hover:bg-amber-700/50'
            } `}
            href={`/${url}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
