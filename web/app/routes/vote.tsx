import { generateProof, Group } from "@semaphore-protocol/core";
import { Navigate, useNavigate, useParams } from "react-router";
import { useAccount } from "wagmi";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  useReadElectionGetVoterCommitments,
  useReadElectionGroupId,
  useWriteElectionSendVote,
} from "~/generated";
import { getElectionCacheKey, setIsVoted } from "~/lib/cache";
import { useMyElections } from "~/lib/elections";
import { useIdentity } from "~/lib/semaphore";

export default function Vote() {
  const elections = useMyElections();
  const { address } = useAccount();
  const { tpsId, votingId } = useParams();

  const election = elections.find(
    (election) =>
      election.tpsId === Number(tpsId) && election.votingId === Number(votingId)
  );

  const { data: commitments } = useReadElectionGetVoterCommitments({
    address: election?.contractAddress,
    query: {
      enabled: !!election,
    },
  });

  const { data: groupId } = useReadElectionGroupId({
    address: election?.contractAddress,
    query: {
      enabled: !!election,
    },
  });

  const { identity, getIdentity } = useIdentity(election?.tpsId ?? 0);

  const vote = useWriteElectionSendVote({
    mutation: {
      onSuccess: () => {
        setIsVoted(address, election!.tpsId, election!.votingId);
        navigate("/", { replace: true });
      },
    },
  });
  const navigate = useNavigate();

  if (!election) {
    return <Navigate to="/" replace />;
  }

  if (
    localStorage.getItem(
      getElectionCacheKey(
        "hasVoted",
        address,
        election.tpsId,
        election.votingId
      )
    )
  ) {
    return <Navigate to="/" replace />;
  }

  if (!commitments) {
    return (
      <div className="h-full-screen flex flex-col items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-full-screen flex flex-col items-center justify-center">
      <Card className="group relative overflow-hidden border-slate-800 bg-slate-900/50 backdrop-blur transition-all hover:shadow-lg hover:shadow-indigo-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-white">
              Pilkada Jawa Barat 2024
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[...election.candidates, ""].map((candidate, index) => (
              <li
                key={index}
                className="rounded-lg bg-slate-800/50 p-3 text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30">
                    {index + 1}
                  </span>
                  {candidate === "" ? "Tidak Pilih" : candidate}
                </div>
                <Button
                  className="w-full mt-3"
                  variant="secondary"
                  onClick={async () => {
                    let userIdentity = identity;
                    if (!userIdentity) {
                      userIdentity = await getIdentity();
                    }
                    const isRegistered = commitments?.includes(
                      userIdentity.commitment
                    );
                    if (
                      !isRegistered ||
                      groupId === null ||
                      groupId === undefined
                    ) {
                      return;
                    }
                    const group = new Group();
                    for (const commitment of commitments) {
                      group.addMember(commitment);
                    }

                    const feedback = BigInt(candidate === "" ? 0 : index + 1);

                    const proof = await generateProof(
                      userIdentity,
                      group,
                      feedback,
                      groupId
                    );
                    vote.writeContract({
                      address: election.contractAddress,
                      args: [
                        BigInt(proof.merkleTreeDepth),
                        proof.merkleTreeRoot,
                        proof.nullifier,
                        feedback,
                        proof.points,
                      ],
                    });
                  }}
                >
                  Coblos
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
