import { Navigate } from "react-router";
import { useAccount, useConnect, useEnsName } from "wagmi";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function Login() {
  const { address } = useAccount();
  const { connectors, connect } = useConnect();

  if (address) {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-full-screen flex flex-col justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl text-center font-bold">
            Pilkada 2024
          </CardTitle>
          <CardDescription>
            Pilih kandidat yang tepat untuk masa depan Indonesia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="w-full"
            >
              <img
                src={connector.icon}
                alt={connector.name}
                className="w-4 h-4"
              />
              Connect with {connector.name}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
