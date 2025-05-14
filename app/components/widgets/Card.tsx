import { PropsWithChildren } from 'react'

export default function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-md bg-slate-700 px-6 py-4 ${className}`}>{children}</div>
}
