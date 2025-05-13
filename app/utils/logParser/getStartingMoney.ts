import { PLATER_DATA_REGEX } from './getPlayer'

const MONEY_REGEX = /money change .+ = \$(\d+)/
const STARTING_MONEY_REGEX = new RegExp(`${PLATER_DATA_REGEX.source} ${MONEY_REGEX.source}`, 'gm')
export const getStartingMoney = (text: string) => {
  const startingMoneyEntries = [...text.matchAll(STARTING_MONEY_REGEX)]

  return startingMoneyEntries.reduce((result, entry) => {
    return {
      ...result,
      [entry[2]]: parseInt(entry[4]),
    }
  }, {})
}
