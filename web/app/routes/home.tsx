import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Route } from "./+types/home";
import { useSyncProviders } from "~/hooks/useSyncProviders";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pilkada 2024" },
    { name: "description", content: "Pilkada 2024" },
  ];
}

export default function Home() {
  const providers = useSyncProviders();

  const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
    try {
      const accounts = (await providerWithInfo.provider.request({
        method: "eth_requestAccounts",
      })) as string[];
    } catch (error) {
      console.error(error);
    }
  };

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
          {providers.map((provider) => (
            <Button
              key={provider.info.uuid}
              onClick={() => handleConnect(provider)}
              size="lg"
              className="w-full"
            >
              <img
                src={provider.info.icon}
                alt={provider.info.name}
                className="w-4 h-4"
              />
              Connect with {provider.info.name}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
