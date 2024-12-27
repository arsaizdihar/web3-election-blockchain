import { useAccount } from "wagmi";

export default function Home() {
  const { address } = useAccount();

  return (
    <div className="h-full-screen flex flex-col justify-center items-center">
      <h1>Hello {address}</h1>
    </div>
  );
}
