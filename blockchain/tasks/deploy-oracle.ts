import { task } from "hardhat/config"
import { Oracle } from "../typechain-types/contracts/Oracle"

//--------------------Argument Processing--------------------
export interface DeployOracleContractArgs {
    owner: string
    oracles: Array<string>
}
export interface DeployOracleContractArgs_Raw {
    owner: string
    oracles: string
}

//--------------------Functions--------------------
task<DeployOracleContractArgs>("deploy-oracle", "Deploy a voting contract", async (args, { ethers }) => {
    console.log("Deploying oracle smart contract with the following configuration:")
    console.log("Owner Address:", args.owner)
    console.log("Oracle Addresses:", args.oracles)

    const OracleFactory = await ethers.getContractFactory("Oracle")
    const oracleContract = await OracleFactory.deploy(args.owner, args.oracles)

    await oracleContract.waitForDeployment()
    console.log(`Oracle contract deployed at ${await oracleContract.getAddress()}`)

    return oracleContract
})

//--------------------Main--------------------
task<DeployOracleContractArgs_Raw>("deployOracle", "Deploy an oracle contract", async (args, { run }) => {
    const oracleAddresses = args.oracles.split(",")
    await run("deploy-oracle", {
        owner: args.owner,
        oracles: oracleAddresses
    })
})
    .addParam("owner", "The owner of the oracle contract")
    .addParam("oracles", "The list of oracle addresses")
