import type { Damage, Player, RoundData, RoundPlayerData, Teams } from '@/app/types/Data'
import {
  GiAbdominalArmor,
  GiBoltCutter,
  GiDeathSkull,
  GiHealthDecrease,
  GiTimeDynamite,
} from 'react-icons/gi'
import type { PropsWithChildren } from 'react'

export default function StatsTable({ data, teams }: { data: RoundData; teams: Teams }) {
  return (
    <table className="mx-auto w-[90%] max-w-[1600px] table-fixed">
      <thead>
        <tr>
          {teams[data.sides.CT].map((player: Player) => (
            <Heading key={player.name}>
              <PlaterName player={data.players[player.steamId]} />
            </Heading>
          ))}
          <Heading isLabel />
          {teams[data.sides.TERRORIST].map((player: Player) => (
            <Heading key={player.name}>
              <PlaterName player={data.players[player.steamId]} />
            </Heading>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {teams[data.sides.CT].map((player: Player) => (
            <Cell key={player.name}>
              <NumericDisplay value={data.players[player.steamId].kills} />
            </Cell>
          ))}
          <Cell isLabel>kills</Cell>
          {teams[data.sides.TERRORIST].map((player: Player) => (
            <Cell key={player.name}>
              <NumericDisplay value={data.players[player.steamId].kills} />
            </Cell>
          ))}
        </tr>

        <tr>
          {teams[data.sides.CT].map((player: Player) => (
            <Cell key={player.name}>
              <NumericDisplay value={data.players[player.steamId].assists} />
            </Cell>
          ))}
          <Cell isLabel>assists</Cell>
          {teams[data.sides.TERRORIST].map((player: Player) => (
            <Cell key={player.name}>
              <NumericDisplay value={data.players[player.steamId].assists} />
            </Cell>
          ))}
        </tr>
        <tr>
          {teams[data.sides.CT].map((player: Player) => (
            <Cell key={player.name}>
              <DamageDisplay damage={data.players[player.steamId].damage} />
            </Cell>
          ))}
          <Cell isLabel>damage done</Cell>
          {teams[data.sides.TERRORIST].map((player: Player) => (
            <Cell key={player.name}>
              <DamageDisplay damage={data.players[player.steamId].damage} />
            </Cell>
          ))}
        </tr>

        <tr>
          {teams[data.sides.CT].map((player: Player) => (
            <Cell key={player.name}>${data.players[player.steamId].startingMoney}</Cell>
          ))}
          <Cell isLabel>starting money</Cell>
          {teams[data.sides.TERRORIST].map((player: Player) => (
            <Cell key={player.name}>${data.players[player.steamId].startingMoney}</Cell>
          ))}
        </tr>

        <tr>
          {teams[data.sides.CT].map((player: Player) => (
            <Cell key={player.name}>
              <Loadout player={data.players[player.steamId]} />
            </Cell>
          ))}
          <Cell isLabel>loadout</Cell>
          {teams[data.sides.TERRORIST].map((player: Player) => (
            <Cell key={player.name}>
              <Loadout player={data.players[player.steamId]} />
            </Cell>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

const Heading = ({ children, isLabel = false }: PropsWithChildren<{ isLabel?: boolean }>) => {
  return (
    <th className={`px-2 py-1 text-center align-top ${isLabel && 'w-[150px] border-x-1'}`}>
      {children}
    </th>
  )
}
const Cell = ({ children, isLabel = false }: PropsWithChildren<{ isLabel?: boolean }>) => {
  return (
    <td className={`px-2 py-1 text-center ${isLabel ? 'border-x-1' : 'align-top'}`}>{children}</td>
  )
}

const DamageDisplay = ({ damage }: { damage: Damage }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1">
        <GiHealthDecrease size={20} />
        <span>{damage.health}</span>
      </div>
      <div className="flex items-center gap-1">
        <GiAbdominalArmor size={20} />
        <span>{damage.armor}</span>
      </div>
    </div>
  )
}

const PlaterName = ({ player }: { player: RoundPlayerData }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {!player.survived && <GiDeathSkull size={20} />} {player.name}{' '}
      {player.bombPlanted && <GiTimeDynamite size={20} />}
      {player.bombDefused && <GiBoltCutter size={20} />}
    </div>
  )
}

const Loadout = ({ player }: { player: RoundPlayerData }) => {
  return (
    <div className="flex flex-col text-center">
      {player.loadout.map((item: string, idx: number) => (
        <span key={idx} className="text-sm">
          {formatItemName(item)}
        </span>
      ))}
    </div>
  )
}

const formatItemName = (item: string) => {
  return item.replace('item_', '').replace('weapon_', '')
}

const NumericDisplay = ({ value }: { value: number }) => {
  const colors = [
    'bg-slate-800',
    'bg-red-600/20',
    'bg-red-600/40',
    'bg-red-600/60',
    'bg-red-600/80',
    'bg-red-600/100',
  ]
  return <span className={`${colors[value]} rounded px-2 py-0.5`}>{value}</span>
}
