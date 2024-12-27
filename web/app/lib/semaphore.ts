import { Identity } from "@semaphore-protocol/core";
import { useSignMessage } from "wagmi";
import { create } from "zustand";

const useIdentities = create<{
  identities: Record<string, Identity>;
  setIdentity: (tpsId: string, identity: Identity) => void;
}>((set) => ({
  identities: {},
  setIdentity: (tpsId, identity) =>
    set((state) => ({
      identities: {
        ...state.identities,
        [tpsId]: identity,
      },
    })),
}));

export function useIdentity(tpsId: number) {
  const { signMessageAsync } = useSignMessage();
  const identity = useIdentities((state) => state.identities[tpsId]);
  const setIdentity = useIdentities((state) => state.setIdentity);

  async function getIdentity() {
    if (identity) {
      return identity;
    }
    const message = "PILKADA 2024 TPS" + tpsId.toString();
    const signature = await signMessageAsync({
      message,
    });
    const newIdentity = new Identity(signature);
    setIdentity(tpsId.toString(), newIdentity);
    return newIdentity;
  }

  return {
    identity,
    getIdentity,
  };
}
