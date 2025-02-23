import { task } from "hardhat/config"
import fs from "fs"
import { ISemaphore } from "../typechain-types"
import votings from "../../data/votings.json"

// --------------------Argument Processing--------------------
export interface DeployVotingContractArgs_Raw {
    oracle: string
    semaphore: string
    pollingStationId: number
    votingId: number
    candidateCount: number
    registerStartAt: Date
    registerEndAt: Date
    voteStartAt: Date
    voteEndAt: Date
}
export interface DeployVotingContractArgs {
    oracle: string
}

// --------------------Functions--------------------
task<DeployVotingContractArgs_Raw>("deploy-voting", "Deploy a voting contract", async (args, { ethers }) => {
    const ElectionFactory = await ethers.getContractFactory("Election")

    const electionContract = await ElectionFactory.deploy(
        args.oracle,
        args.semaphore,
        args.pollingStationId,
        args.votingId,
        args.candidateCount,
        Math.floor(args.registerStartAt.getTime() / 1000),
        Math.floor(args.registerEndAt.getTime() / 1000),
        Math.floor(args.voteStartAt.getTime() / 1000),
        Math.floor(args.voteEndAt.getTime() / 1000)
    )

    console.log(
        `Election contract for TPS ${args.pollingStationId} Voting ID ${args.votingId} deployed at ${await electionContract.getAddress()} with ${args.candidateCount} candidate. Registration ${args.registerStartAt}-${args.registerEndAt}. Voting ${args.voteStartAt}-${args.voteEndAt}`
    )

    return electionContract
})

// --------------------Main--------------------
task<DeployVotingContractArgs>("deployVoting", "Deploy a voting contract", async (args, { run }) => {
    const { semaphore } = await run("deploy:semaphore", {
        logs: false
    })

    const semaphoreContract: ISemaphore = semaphore

    const electionAddresses: Record<string, string> = {}

    for (const voting of votings.votings) {
        for (const tps of voting.tpsIds) {
            const contract = await run("deploy-voting", {
                oracle: args.oracle,
                semaphore: await semaphoreContract.getAddress(),
                pollingStationId: tps,
                votingId: voting.votingId,
                candidateCount: voting.candidates.length,
                registerStartAt: new Date(votings.registerStartAt),
                registerEndAt: new Date(votings.registerEndAt),
                voteStartAt: new Date(votings.voteStartAt),
                voteEndAt: new Date(votings.voteEndAt)
            })

            electionAddresses[`${tps}-${voting.votingId}`] = await contract.getAddress()
        }
    }

    fs.writeFileSync("../web/public/contract-addresses.json", JSON.stringify(electionAddresses, null, 2))
}).addParam("oracle", "address to the oracle contract")
