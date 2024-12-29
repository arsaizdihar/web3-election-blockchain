import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useReadContracts } from "wagmi";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { config } from "~/config";
import { electionAbi } from "~/generated";
import { fetchElections, useElections } from "~/lib/elections";

interface VoteResult {
  name: string;
  number: number;
  count: number;
}

const VoteAggregator = () => {
  const { elections } = useElections();

  const {
    data,
    error,
    isPending: loading,
  } = useReadContracts({
    contracts: elections.map((election) => {
      return {
        address: election.contractAddress,
        abi: electionAbi,
        chainId: config.chains[0].id,
        functionName: "getAllVoteCounts",
        args: [],
      };
    }),
  });

  const byStation = useMemo(() => {
    const result: Record<string, VoteResult[]> = {};

    if (!data) {
      return result;
    }

    for (const [i, election] of elections.entries()) {
      const count: VoteResult[] = [
        {
          name: "Invalid Vote",
          number: 0,
          count: Number((data[i].result as bigint[])[0]),
        },
      ];
      for (const [j, name] of election.candidates.entries()) {
        count.push({
          name,
          number: j + 1,
          count: Number((data[i].result as bigint[])[j + 1]),
        });
      }

      result[`${election.tpsId}-${election.votingId}`] = count;
    }

    return result;
  }, [data, elections]);

  const byVote = useMemo(() => {
    const result: Record<string, VoteResult[]> = {};

    if (!data) {
      return result;
    }

    for (const [i, election] of elections.entries()) {
      const count: VoteResult[] = [
        {
          name: "Invalid Vote",
          number: 0,
          count: Number((data[i].result as bigint[])[0]),
        },
      ];
      for (const [j, name] of election.candidates.entries()) {
        count.push({
          name,
          number: j + 1,
          count: Number((data[i].result as bigint[])[j + 1]),
        });
      }

      if (Object.hasOwn(result, `${election.votingId}`)) {
        result[`${election.votingId}`].forEach((val, i) => {
          result[`${election.votingId}`][i].count += count[i].count;
        });
      } else {
        result[`${election.votingId}`] = count;
      }
    }

    return result;
  }, [data, elections]);

  if (error) return <div className="text-red-500">Error: {error.message} </div>;
  if (loading) return <div>Memuat Rekap Pilkada</div>;

  return (
    <div className="pt-6 flex flex-col justify-center items-center max-w-screen-lg mx-auto">
      <div className="w-full flex">
        <Button asChild className="" variant={"secondary"}>
          <Link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              fill="currentColor"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
            </svg>
            Kembali
          </Link>
        </Button>
      </div>
      <h1 className="text-4xl font-bold text-center">
        Rekapitulasi Hasil Pilkada 2024
      </h1>
      <div className="p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            Rekap Pilkada Berdasarkan TPS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(byStation).map(([key, data]) => (
              <div key={key} className="p-4 border rounded-lg">
                <h3 className="font-bold">
                  {
                    elections.find(
                      (e) => e.votingId === Number(key.split("-")[1])
                    )?.title
                  }{" "}
                  <br />
                  <Badge>TPS {key.split("-")[0]}</Badge>
                </h3>
                <div className="mt-2">
                  {data
                    .filter((e) => e.number !== 0)
                    .map((candidate) => (
                      <div key={candidate.name}>
                        {candidate.name}: {candidate.count} suara
                      </div>
                    ))}
                </div>
                <div className="">Suara tidak sah: {data[0].count} suara</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            Rekap Pilkada Berdasarkan Pemilihan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(byVote).map(([key, data]) => (
              <div key={key} className="mb-4 p-4 border rounded-lg">
                <h3 className="font-bold">
                  {elections.find((e) => e.votingId === Number(key))?.title}
                </h3>
                <div className="mt-2">
                  {data
                    .filter((e) => e.number !== 0)
                    .map((candidate) => (
                      <div key={candidate.name}>
                        {candidate.name}: {candidate.count} suara
                      </div>
                    ))}
                </div>
                <div className="">Suara tidak sah: {data[0].count} suara</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteAggregator;
