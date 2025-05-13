const SCORE_REGEX = /MatchStatus: Score: (\d{1,2}:\d{1,2})/
export const getScore = (line: string) => {
  const scores = line.match(SCORE_REGEX)?.[1]?.split(':')
  if (!scores) {
    return {
      CT: 0,
      TERRORIST: 0,
    }
  }

  return {
    CT: Number(scores[0] ?? 0),
    TERRORIST: Number(scores[1] ?? 0),
  }
}
