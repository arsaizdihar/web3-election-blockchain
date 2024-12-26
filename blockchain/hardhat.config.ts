import "@semaphore-protocol/hardhat"
import { HardhatUserConfig } from "hardhat/config"
import "./tasks/deploy-voting"
import "./tasks/deploy-oracle"

const config: HardhatUserConfig = {
    solidity: "0.8.23",
    networks: {
        hardhat: {
            chainId: 1337
        }
    }
}

export default config
