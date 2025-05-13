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
          const isDisabled = idx >= rounds.length - 1
          const roundData = rounds[idx]
          return (
            <button
              className={`rounded-md border-2 py-1 hover:cursor-pointer ${idx === activeRound ? 'border-yellow-600' : 'border-slate-900 hover:border-yellow-900'} ${isDisabled ? 'pointer-events-none opacity-25' : roundData.winner === 'CT' ? 'color-ct' : 'color-terrorist'} font-bold`}
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
