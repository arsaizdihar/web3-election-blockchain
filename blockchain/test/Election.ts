import { run } from "hardhat"
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { Group, Identity, generateProof } from "@semaphore-protocol/core"
import { Election, ISemaphore } from "../typechain-types"
import { DeployVotingContractArgs } from "../tasks/deploy-voting"

describe("Election", () => {
    async function deployElectionFixture() {
        const { semaphore } = await run("deploy:semaphore", {
            logs: false
        })

        const semaphoreContract: ISemaphore = semaphore

        const deployArgs: DeployVotingContractArgs = {
            semaphore: await semaphoreContract.getAddress(),
            pollingStationId: 1,
            votingId: 1,
            candidateCount: 2,
            registerStartAt: new Date("2024-12-24"),
            registerEndAt: new Date("2025-12-24"),
            voteStartAt: new Date("2024-12-24"),
            voteEndAt: new Date("2025-12-24")
        }

        const electionContract: Election = await run("deployVoting", deployArgs)

        const groupId = await electionContract.groupId()

        return { semaphoreContract, electionContract, groupId }
    }

    describe("# SendVote", () => {
        it("Should allow users to send vote anonymously", async () => {
            const { electionContract, groupId } = await loadFixture(deployElectionFixture)

            const users = [new Identity()]
            const group = new Group()

            for (const user of users) {
                await electionContract.registerAsVoter(user.commitment)
                group.addMember(user.commitment)
            }

            const feedback = 1

            const proof = await generateProof(users[0], group, feedback, groupId)

            const transaction = await electionContract.sendVote(
                proof.merkleTreeDepth,
                proof.merkleTreeRoot,
                proof.nullifier,
                feedback,
                proof.points
            )

            console.log(transaction.toJSON())
        })
    })
})
