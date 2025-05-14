import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'

export type ColumnValue = string | number | boolean
export interface Column<T, K extends ColumnValue = ColumnValue> {
  label: string
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
    <table className="flex-1 table-fixed">
      <thead>
        <tr>
          {columns.map(({ label, colWidth }) => (
            <th
              key={label}
              style={{ width: colWidth }}
              className="cursor-pointer border-b-2 border-slate-600 px-2 py-1 hover:bg-slate-700"
              onClick={() => onSort?.(label)}
            >
              <div className="flex items-center justify-center">
                {label}
                {getSortIcon(label)}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortData(data, columns, sortCol).map((item, index) => (
          <tr key={index} className="hover:bg-slate-800/50">
            {columns.map(({ label, accessor, formatter }) => (
              <td key={label} className="text-center">
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
    const column = columns.find((col) => col.label === sortCol.name)
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
