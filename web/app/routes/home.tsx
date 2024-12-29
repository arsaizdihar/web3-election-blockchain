import { useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useAccount } from "wagmi";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  useReadElectionGetVoterCommitments,
  useWriteElectionRegisterAsVoter,
} from "~/generated";
import { useMyElections, type Election } from "~/lib/elections";
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
              onClick={() =>
                // TODO: Oracle call & listen event
                register.writeContract({
                  address: election.contractAddress,
                  args: [identity.commitment],
                })
              }
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
