import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Route } from "./+types/home";
import { useAccount, useConnect, useEnsName } from "wagmi";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pilkada 2024" },
    { name: "description", content: "Pilkada 2024" },
  ];
}

export default function Home() {
  const { address } = useAccount();
  const { data: candidates } = useEnsName({ address });
  const { connectors, connect } = useConnect();

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
