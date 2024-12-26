import { task } from "hardhat/config"
import { DeployOracleContractArgs } from "./deploy-oracle"

//--------------------Argument Processing--------------------
export interface DeployElectionArgs {
    owner: string
    oracles: string
}

//--------------------Functions--------------------
task<DeployElectionArgs>("deploy", "Deploy an entire voting system", async (args, { run }) => {
    await run("deployVoting", {
        // _TODO: Pass from arguments
    })
    await run("deployOracle", {
        owner: args.owner,
        oracles: args.oracles
    })
})
    .addParam("owner", "The owner of the oracle contract")
    .addParam("oracles", "The list of oracle addresses")
