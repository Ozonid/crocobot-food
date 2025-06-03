import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'

export type ColumnValue = string | number | boolean

// FIXME: the K generic type is a hacky solution to avoid type errors but it makes it required to type-cast the value in formatter functions.
export interface Column<T, K extends ColumnValue = ColumnValue> {
  name: string
  header?: React.ReactNode
  accessor: (item: T) => K
  formatter?: (item: K) => string | number | React.ReactNode
  colWidth: number
}

interface TableProps<T> {
  data: T[]
  columns: Column<T, ColumnValue>[]
  sortCol: SortCol | null
  onSort?: (key: string) => void
}

export type SortDirection = 'asc' | 'desc' | null

export interface SortCol {
  name: string
  direction: SortDirection
}

export default function Table<T>({ data, columns, sortCol, onSort }: TableProps<T>) {
  const getSortIcon = (label: string) => {
    if (!sortCol || sortCol.name !== label) {
      return <FaSort className="ml-1 inline-block opacity-50" />
    }
    if (sortCol.direction === 'asc') {
      return <FaSortUp className="ml-1 inline-block" />
    }
    return <FaSortDown className="ml-1 inline-block" />
  }

  return (
    <table className="w-full table-fixed border-collapse">
      <thead>
        <tr>
          {columns.map(({ name, header, colWidth }) => (
            <th
              key={name}
              style={{ width: colWidth }}
              className="cursor-pointer border-b-2 border-slate-600 px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700/50"
              onClick={() => onSort?.(name)}
            >
              <div className="flex items-center justify-center gap-1">
                {header || name}
                {getSortIcon(name)}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortData(data, columns, sortCol).map((item, index) => (
          <tr
            key={index}
            className="border-b border-slate-700/50 transition-colors hover:bg-slate-700/30"
          >
            {columns.map(({ accessor, formatter }, idx) => (
              <td key={idx} className="px-3 py-2 text-center text-sm text-slate-200">
                {formatter ? formatter(accessor(item)) : accessor(item)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const sortData = <T,>(data: T[], columns: Column<T, ColumnValue>[], sortCol: SortCol | null) => {
  if (!sortCol) {
    return data
  }

  return [...data].sort((a, b) => {
    const column = columns.find((col) => col.name === sortCol.name)
    if (!column) return 0

    const aValue = column.accessor(a)
    const bValue = column.accessor(b)

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortCol.direction === 'asc' ? aValue - bValue : bValue - aValue
    }

    const aString = String(aValue)
    const bString = String(bValue)
    return sortCol.direction === 'asc'
      ? aString.localeCompare(bString)
      : bString.localeCompare(aString)
  })
}
