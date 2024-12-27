import { useNavigate } from "react-router";
import { useAccount, useConnectorClient, useSignMessage } from "wagmi";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Identity } from "@semaphore-protocol/identity";
import {
  useReadElectionGetVoterCommitments,
  useReadElectionVoterCommitments,
  useWriteElectionRegisterAsVoter,
} from "~/generated";
import { elections, type Election } from "~/lib/elections";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export default function Home() {
  const { address } = useAccount();

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
      },
    },
  });

  const { signMessageAsync } = useSignMessage();
  const [signature, setSignature] = useState<string | null>(null);

  async function getSignature() {
    const message = "PILKADA 2024 TPS" + election.tpsId.toString();
    const signature = await signMessageAsync({
      message,
    });
    return signature;
  }

  const isRegistered = useMemo(() => {
    if (!commitments || !signature) return false;
    const identity = new Identity(signature);
    return commitments.includes(identity.commitment);
  }, [commitments, signature]);

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
      <CardHeader>
        <Badge variant="secondary" className="text-lg">
          TPS {election.tpsId}
        </Badge>
        <CardTitle className="text-xl text-center">{election.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        {signature ? (
          <>
            {!isRegistered ? (
              <Button
                className="mt-4 w-full"
                onClick={() =>
                  register.writeContract({
                    address: election.contractAddress,
                    args: [new Identity(signature).commitment],
                  })
                }
              >
                Daftar Vote
              </Button>
            ) : (
              <Button
                className="mt-4 w-full"
                onClick={() =>
                  navigate(`/vote/${election.votingId}/${election.tpsId}`)
                }
              >
                Mulai Vote
              </Button>
            )}
          </>
        ) : (
          <Button
            className="mt-4 w-full"
            onClick={() => getSignature().then(setSignature)}
          >
            Cek status
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
