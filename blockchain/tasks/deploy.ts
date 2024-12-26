import { task } from "hardhat/config"
import { ISemaphore } from "../typechain-types"

const testData = {
    votings: [
        {
            id: 1, // 1 for ID pilgub Jawa Barat
            candidateCount: 3
        },
        {
            id: 5, // 5 for ID piwalkot Kota Bandung
            candidateCount: 2
        }
    ],
    tpsIds: [10, 20, 30],
    registerStartAt: new Date("2024-12-24"),
    registerEndAt: new Date("2025-12-25"),
    voteStartAt: new Date("2024-12-24"),
    voteEndAt: new Date("2025-12-25")
}

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

task<DeployVotingContractArgs>("deploy", "Deploy a voting contract", async (args, { ethers }) => {
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

task("deployTest", "Deploy an election scenario", async (args, { run }) => {
    const { semaphore } = await run("deploy:semaphore", {
        logs: false
    })

    const semaphoreContract: ISemaphore = semaphore

    for (const voting of testData.votings) {
        for (const tps of testData.tpsIds) {
            await run("deploy", {
                semaphore: await semaphoreContract.getAddress(),
                pollingStationId: tps,
                votingId: voting.id,
                candidateCount: voting.candidateCount,
                registerStartAt: testData.registerStartAt,
                registerEndAt: testData.registerEndAt,
                voteStartAt: testData.voteStartAt,
                voteEndAt: testData.voteEndAt
            })
        }
    }
})
