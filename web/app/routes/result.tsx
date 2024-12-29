import { useMemo, useState } from "react";
import { useReadContracts } from "wagmi";
import { config } from "~/config";
import { electionAbi } from "~/generated";
import { useElections } from "~/lib/elections";

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

  if (loading) return <div>Loading vote aggregations...</div>;
  if (error) return <div className="text-red-500">Error: {error.message} </div>;

  return (
    <div className="p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">
          Votes by Polling Station and Voting ID
        </h2>
        {Object.entries(byStation).map(([key, data]) => (
          <div key={key} className="mb-4 p-4 border rounded">
            <h3 className="font-bold">
              Station {key.split("-")[0]} - Voting {key.split("-")[1]}
            </h3>
            <div className="ml-4">
              {data
                .filter((e) => e.number !== 0)
                .map((candidate) => (
                  <div key={candidate.name}>
                    {candidate.name}: {candidate.count} votes
                  </div>
                ))}
            </div>
            <div className="ml-4">Invalid vote: {data[0].count}</div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Votes by Voting ID</h2>
        {Object.entries(byVote).map(([key, data]) => (
          <div key={key} className="mb-4 p-4 border rounded">
            <h3 className="font-bold">Voting {key}</h3>
            <div className="ml-4">
              {data
                .filter((e) => e.number !== 0)
                .map((candidate) => (
                  <div key={candidate.name}>
                    {candidate.name}: {candidate.count} votes
                  </div>
                ))}
            </div>
            <div className="ml-4">Invalid vote: {data[0].count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoteAggregator;
