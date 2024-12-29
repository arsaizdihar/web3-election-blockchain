import { Navigate, Outlet } from "react-router";
import { useAccount } from "wagmi";
import { fetchElections } from "~/lib/elections";

export async function clientLoader() {
  await fetchElections();
  return null;
}

export default function AuthedLayout() {
  const { address } = useAccount();

  if (!address) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
