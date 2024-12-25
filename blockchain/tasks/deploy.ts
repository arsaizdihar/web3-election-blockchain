import { task } from "hardhat/config"

export interface DeployVotingContractArgs {
    semaphore: string
    pollingStationId: number
    votingId: number
    candidateCount: number
    registerStartAt: Date
    registerEndAt: Date
    voteStartAt: Date
    voteEndAt: Date
}

task<DeployVotingContractArgs>("deploy", "Deploy a voting contract").setAction(async (args, { ethers }) => {
    const ElectionFactory = await ethers.getContractFactory("Election")

    const electionContract = await ElectionFactory.deploy(
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
