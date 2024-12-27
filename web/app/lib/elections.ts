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
    contractAddress: "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1",
  },
  {
    tpsId: 10,
    votingId: 5,
    candidates: ["Candidate 1", "Candidate 2"],
    title: "Pilkada Kota Bandung 2024",
    contractAddress: "0x4A679253410272dd5232B3Ff7cF5dbB88f295319",
  },
];
