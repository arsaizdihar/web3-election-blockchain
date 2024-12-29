import { config, ethers, run } from "hardhat"
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { Group, Identity, generateProof } from "@semaphore-protocol/core"
import { Election, ISemaphore, Oracle } from "../typechain-types"
import { DeployVotingContractArgs_Raw } from "../tasks/deploy-voting"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { HardhatNetworkHDAccountsConfig } from "hardhat/types"

describe("Election", () => {
    let oracleContract: Oracle
    let signers: HardhatEthersSigner[]
    let owner: HardhatEthersSigner
    const votingId = 1
    const pollingStationId = 1
    const pollingDelay = 5000

    async function deployElectionFixture() {
        signers = await ethers.getSigners()
        owner = signers[0]
        const oracles = [owner.address]

        oracleContract = await run("deploy-oracle", {
            owner: owner.address,
            oracles: oracles,
            minquorum: oracles.length
        })

        const { semaphore } = await run("deploy:semaphore", {
            logs: false
        })

        const semaphoreContract: ISemaphore = semaphore

        const deployArgs: DeployVotingContractArgs_Raw = {
            oracle: await oracleContract.getAddress(),
            semaphore: await semaphoreContract.getAddress(),
            pollingStationId: pollingStationId,
            votingId: votingId,
            candidateCount: 2,
            registerStartAt: new Date("2024-12-24"),
            registerEndAt: new Date("2025-12-24"),
            voteStartAt: new Date("2024-12-24"),
            voteEndAt: new Date("2025-12-24")
        }

        const electionContract: Election = await run("deploy-voting", deployArgs)

        const groupId = await electionContract.groupId()

        return { semaphoreContract, electionContract, groupId }
    }

    describe("# SendVote", () => {
        it("Should allow users to send vote anonymously", async () => {
            const { electionContract, groupId } = await loadFixture(deployElectionFixture)

            // Data is the same as signer[0]
            const index = 0
            const accounts = config.networks.hardhat.accounts as HardhatNetworkHDAccountsConfig
            const wallet = ethers.HDNodeWallet.fromPhrase(accounts.mnemonic, undefined, accounts.path + `/${index}`)
            const pkey = wallet.privateKey

            const asUser_oracleContract = oracleContract.connect(signers[index])
            const asUser_electionContract = electionContract.connect(signers[index])

            const users = [new Identity(pkey)]
            const group = new Group()

            for (const user of users) {
                await asUser_oracleContract.createRequest(wallet.address, pollingStationId, votingId)
                await new Promise((resolve) => setTimeout(resolve, pollingDelay))
                await asUser_electionContract.registerAsVoter(user.commitment)

                group.addMember(user.commitment)
            }

            const feedback = 1

            const proof = await generateProof(users[0], group, feedback, groupId)

            const transaction = await asUser_electionContract.sendVote(
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
