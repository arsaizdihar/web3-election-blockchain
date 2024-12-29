import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAccount } from "wagmi";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  useReadElectionGetVoterCommitments,
  useReadOracleGetRequestResult,
  useWatchOracleOnQuorumReachedEvent,
  useWriteElectionRegisterAsVoter,
  useWriteOracleCreateRequest,
} from "~/generated";
import {
  useMyElections,
  useOracleAddress,
  type Election,
} from "~/lib/elections";
import { useIdentity } from "~/lib/semaphore";

export default function Home() {
  const elections = useMyElections();

  return (
    <div className="h-full-screen flex flex-col justify-center items-center max-w-screen-lg mx-auto">
      <h1 className="text-4xl font-bold text-center">Pilkada 2024</h1>
      <div className="flex flex-wrap justify-center">
        {elections.map((election, index) => (
          <div className="w-1/2 p-4 min-w-80" key={index}>
            <ElectionCard election={election} />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center">
        <Button asChild className="mt-4 w-full" variant={"secondary"}>
          <Link to="/result">Lihat Hasil</Link>
        </Button>
      </div>
    </div>
  );
}

function ElectionCard({ election }: { election: Election }) {
  const navigate = useNavigate();
  const oracleAddress = useOracleAddress();
  useWatchOracleOnQuorumReachedEvent({
    address: oracleAddress,
    onLogs: (logs) => {
      const isSuccess = logs.some((log) => {
        const { voter_id, tps_id, voting_id, result } = log.args;

        return (
          voter_id === address &&
          tps_id === BigInt(election.tpsId) &&
          voting_id === BigInt(election.votingId)
        );
      });

      if (isSuccess) {
        register.writeContract({
          address: election.contractAddress,
          args: [identity.commitment],
        });
      }
    },
  });

  const { address } = useAccount();
  const { data: commitments, refetch: refetchCommitments } =
    useReadElectionGetVoterCommitments({
      address: election.contractAddress,
      account: address,
    });
  const register = useWriteElectionRegisterAsVoter({
    mutation: {
      onSuccess: () => {
        refetchCommitments();
        localStorage.setItem(
          `isRegistered-${election.tpsId}-${election.votingId}`,
          "true"
        );
      },
    },
  });

  const { identity, getIdentity } = useIdentity(election.tpsId);

  const hasVoted = useMemo(() => {
    return localStorage.getItem(
      `hasVoted-${election.tpsId}-${election.votingId}`
    );
  }, [election.tpsId, election.votingId]);

  const isRegistered = useMemo(() => {
    const cache = localStorage.getItem(
      `isRegistered-${election.tpsId}-${election.votingId}`
    );
    if (cache === "true") {
      return true;
    }
    if (!commitments || !identity) return false;
    const isRegistered = commitments.includes(identity.commitment);
    if (isRegistered) {
      localStorage.setItem(
        `isRegistered-${election.tpsId}-${election.votingId}`,
        "true"
      );
    }
    return isRegistered;
  }, [commitments, identity]);

  console.log({ isRegistered });

  const requestOracle = useWriteOracleCreateRequest({
    mutation: {
      onError(error) {
        console.error(error);
      },
    },
  });
  const {
    data: isSuccessOracle,
    error: errorOracle,
    isLoading: isLoadingOracle,
    refetch: refetchOracle,
  } = useReadOracleGetRequestResult({
    address: oracleAddress,
    args: [
      address!.toLowerCase(),
      BigInt(election.tpsId),
      BigInt(election.votingId),
    ],
    query: {
      enabled: !isRegistered && !!identity,
      retry(_, error) {
        if (error.message.includes("Request is not resolved yet")) {
          return true;
        }
        return false;
      },
      retryDelay: 5000,
    },
  });

  console.log({
    isSuccessOracle,
    votingId: election.votingId,
    errorOracle: errorOracle?.message,
  });
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
      <CardHeader>
        <Badge variant="secondary" className="text-lg">
          TPS {election.tpsId}
        </Badge>
        <CardTitle className="text-xl text-center">{election.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        {iife(() => {
          if (isLoadingOracle) {
            return (
              <div className="flex justify-center h-9 items-center">
                <svg
                  className="text-gray-300 animate-spin"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                >
                  <path
                    d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-900"
                  ></path>
                </svg>
              </div>
            );
          }

          if (hasVoted) {
            return (
              <div className="w-full text-center bg-green-900 text-white p-2 rounded-md">
                Anda sudah memilih
              </div>
            );
          }
          if (!identity && !isRegistered) {
            return (
              <Button className="mt-4 w-full" onClick={getIdentity}>
                Cek status
              </Button>
            );
          }

          if (isRegistered) {
            return (
              <Button
                className="mt-4 w-full"
                onClick={() =>
                  navigate(`/vote/${election.votingId}/${election.tpsId}`)
                }
              >
                Mulai Vote
              </Button>
            );
          }

          return (
            <Button
              className="mt-4 w-full"
              onClick={async () => {
                if (
                  errorOracle?.message?.includes(
                    "Request has not been created yet"
                  )
                ) {
                  console.log({
                    address,
                    tpsId: election.tpsId,
                    votingId: election.votingId,
                  });
                  await requestOracle.writeContractAsync({
                    address: oracleAddress,
                    args: [
                      address!.toLowerCase(),
                      BigInt(election.tpsId),
                      BigInt(election.votingId),
                    ],
                  });

                  await refetchOracle();

                  return;
                }
                if (
                  errorOracle?.message?.includes("Request is not resolved yet")
                ) {
                  return;
                }

                register.writeContract({
                  address: election.contractAddress,
                  args: [identity.commitment],
                });
              }}
            >
              Daftar Vote
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

function iife<T>(fn: () => T): T {
  return fn();
}

// a29udG9s
