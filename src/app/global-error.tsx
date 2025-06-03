'use client'

import { useEffect } from 'react'
import { GiDeadHead } from 'react-icons/gi'

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-900 text-white">
          <GiDeadHead size={100} />
          <h2 className="text-2xl font-bold">Failed to process game log</h2>
        </div>
      </body>
    </html>
  )
}
