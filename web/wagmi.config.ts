import { defineConfig } from "@wagmi/cli";
import { hardhat } from "@wagmi/cli/plugins";
import { react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "app/generated.ts",
  contracts: [],
  plugins: [
    hardhat({
      project: "../blockchain",
      include: ["Election.sol/**", "Semaphore.sol/**", "Oracle.sol/**"],
    }),
    react(),
  ],
});
