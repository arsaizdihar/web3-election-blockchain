export function getElectionCacheKey(
  key: string,
  address: string | undefined,
  tpsId: number,
  votingId: number
) {
  return `${key}-${address}-${tpsId}-${votingId}`;
}

export function setIsVoted(
  address: string | undefined,
  tpsId: number,
  votingId: number
) {
  localStorage.setItem(
    getElectionCacheKey("hasVoted", address, tpsId, votingId),
    "true"
  );
}
