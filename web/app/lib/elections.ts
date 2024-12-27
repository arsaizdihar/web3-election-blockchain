export interface Election {
  tpsId: number;
  votingId: number;
  candidates: string[];
  title: string;
  contractAddress: `0x${string}`;
}

export const elections: Election[] = [
  {
    tpsId: 10,
    votingId: 1,
    candidates: ["Candidate 1", "Candidate 2", "Candidate 3"],
    title: "Pilkada Jawa Barat 2024",
    contractAddress: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  },
  {
    tpsId: 10,
    votingId: 5,
    candidates: ["Candidate 1", "Candidate 2"],
    title: "Pilkada Kota Bandung 2024",
    contractAddress: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
  },
];
