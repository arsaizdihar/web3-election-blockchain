export function getElectionCacheKey(
  key: string,
  address: string | undefined,
  tpsId: number,
  votingId: number
) {
  return `${key}-${address}-${tpsId}-${votingId}`;
}
