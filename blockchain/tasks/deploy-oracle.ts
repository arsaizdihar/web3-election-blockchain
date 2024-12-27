import { task } from "hardhat/config"
import { Oracle } from "../typechain-types/contracts/Oracle"

//--------------------Argument Processing--------------------
export interface DeployOracleContractArgs {
    owner: string
    oracles: Array<string>
    minquorum: number
}
export interface DeployOracleContractArgs_Raw {
    owner: string
    oracles: string
    minquorum: number
}

//--------------------Functions--------------------
task<DeployOracleContractArgs>("deploy-oracle", "Deploy a voting contract", async (args, { ethers }) => {
    console.log("Deploying oracle smart contract with the following configuration:")
    console.log("Owner Address:", args.owner)
    console.log("Oracle Addresses:", args.oracles)
    console.log("Quorum:", args.minquorum)

    const OracleFactory = await ethers.getContractFactory("Oracle")
    const oracleContract = await OracleFactory.deploy(args.owner, args.oracles, args.minquorum)

    await oracleContract.waitForDeployment()
    console.log(`Oracle contract deployed at ${await oracleContract.getAddress()}`)

    return oracleContract
})

//--------------------Main--------------------
task<DeployOracleContractArgs_Raw>("deployOracle", "Deploy an oracle contract", async (args, { run }) => {
    const oracleAddresses = args.oracles.split(",")
    await run("deploy-oracle", {
        owner: args.owner,
        oracles: oracleAddresses,
        minquorum: args.minquorum
    })
})
    .addParam("owner", "The owner of the oracle contract")
    .addParam("oracles", "The list of oracle addresses")
    .addParam("minquorum", "The number of quorum required to make a decision")
