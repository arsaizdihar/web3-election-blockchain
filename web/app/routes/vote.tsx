import { useParams } from "react-router";
import { useAccount } from "wagmi";
import { elections } from "~/lib/elections";

export default function Vote() {
  const { tpsId, votingId } = useParams();
  const { address } = useAccount();

  const election = elections.find(
    (election) =>
      election.tpsId === Number(tpsId) && election.votingId === Number(votingId)
  );

  if (!election) {
    return <div>Election not found</div>;
  }

  return <div className="h-full-screen">Vote</div>;
}
