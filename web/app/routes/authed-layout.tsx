import { Navigate, Outlet } from "react-router";
import { useAccount, useDisconnect } from "wagmi";

export default function AuthedLayout() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  if (!address) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
