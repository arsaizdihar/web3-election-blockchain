import { useQuery } from "@tanstack/react-query";
import votingsData from "../../../data/votings.json";
import { create } from "zustand";
import { useAccount } from "wagmi";

const REST_API_URL = "http://localhost:3000";

export interface Election {
  tpsId: number;
  votingId: number;
  candidates: string[];
  title: string;
  contractAddress: `0x${string}`;
}

export const useElections = create<{
  elections: Election[];
  oracleAddress: string;
}>((set) => ({
  elections: [],
  oracleAddress: "",
}));

export const fetchElections = async () => {
  const response = await fetch("/contract-addresses.json");
  const data = (await response.json()) as Record<string, `0x${string}`>;
  const oracle = await fetch("/oracle-contract.json");
  const oracleAddress = (await oracle.json()) as `0x${string}`;

  useElections.setState(() => ({
    elections: votingsData.votings.flatMap((voting) =>
      voting.tpsIds.map((tpsId) => ({
        tpsId,
        votingId: voting.votingId,
        candidates: voting.candidates,
        title: voting.title,
        contractAddress: data[`${tpsId}-${voting.votingId}`],
      }))
    ),
    oracleAddress,
  }));
};

export function useMyTpsId() {
  const { address } = useAccount();
  const { data: tpsId } = useQuery<number>({
    queryKey: ["tpsId", address?.toString()],
    queryFn: async () => {
      const response = await fetch(
        `${REST_API_URL}/tps/${address?.toString()}`
      );
      const data = await response.json();
      return data.tps_id;
    },
  });
  return tpsId;
}

export function useMyElections() {
  const tpsId = useMyTpsId();
  const { elections } = useElections();
  return elections.filter((election) => election.tpsId === tpsId);
}

export function useOracleAddress() {
  const { oracleAddress } = useElections();
  return oracleAddress as `0x${string}`;
}
