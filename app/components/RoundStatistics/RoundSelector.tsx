import type { RoundData } from '@/app/types/Data'

const CS_GO_MAX_ROUNDS = 30

export default function RoundSelector({
  rounds,
  activeRound,
  onSelect,
}: {
  rounds: RoundData[]
  activeRound: number
  onSelect: (round: number) => void
}) {
  return (
    <div className="flex w-full max-w-[1200px] flex-col items-center gap-2">
      <div className="grid w-full grid-cols-15 gap-1">
        {Array.from({ length: CS_GO_MAX_ROUNDS }).map((_, idx) => {
          const isDisabled = idx >= rounds.length
          const roundData = rounds[idx]
          return (
            <button
              className={`rounded-md border-2 py-0.5 transition-colors hover:cursor-pointer ${idx === activeRound ? 'border-amber-700' : 'border-slate-900 hover:border-amber-700/50'} ${isDisabled ? 'pointer-events-none opacity-25' : roundData.winner === 'CT' ? 'color-ct' : 'color-terrorist'} font-bold`}
              key={idx}
              onClick={() => onSelect(idx)}
              disabled={isDisabled}
            >
              {idx + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}
