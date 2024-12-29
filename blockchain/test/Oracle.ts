import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers } from "hardhat"
import { keccak256 } from "ethers"
import { Oracle } from "../typechain-types/contracts/Oracle"

describe("Oracle", () => {
    // --------------------Variables--------------------
    let oracleContract: Oracle
    let signers: HardhatEthersSigner[]
    let owner: HardhatEthersSigner

    // --------------------General Setup--------------------
    beforeEach(async () => {
        signers = await ethers.getSigners()
        owner = signers[0]
        const oracles = [owner.address]

        const oracleContractFactory = await ethers.getContractFactory("Oracle")
        oracleContract = await oracleContractFactory.deploy(owner.address, oracles, oracles.length)
        await oracleContract.waitForDeployment()
    })

    // --------------------Base tests--------------------
    describe("# Base test", () => {
        it("should check the validity of variables", async () => {
            const minQuorum = await oracleContract.minQuorum()
            const oracles = await oracleContract.getOracles()
            const totalOracleCount = oracles.length
            expect(totalOracleCount).to.greaterThanOrEqual(
                Number(minQuorum),
                `Expected totalOracleCount (${totalOracleCount}) to be greater than or equal to minQuorum (${minQuorum})`
            )
        })
    })

    describe("# addOracle", () => {
        it("should add new oracle", async () => {
            const asOwner = oracleContract.connect(owner)
            await asOwner.addOracle(signers[1].address)
            const oracles = await oracleContract.getOracles()
            expect(oracles).to.include(signers[1].address)
            expect(oracles.length).to.equal(2)
        })

        it("should not add same oracle twice", async () => {
            const asOwner = oracleContract.connect(owner)
            try {
                await asOwner.addOracle(owner.address)
            } catch (error) {}
            const oracles = await oracleContract.getOracles()
            expect(oracles).to.include(owner.address)
            expect(oracles.length).to.equal(1)
        })
    })

    describe("# removeOracle", () => {
        it("should remove oracle", async () => {
            const asOwner = oracleContract.connect(owner)
            await asOwner.addOracle(signers[1].address)
            await asOwner.removeOracle(signers[1].address)
            const oracles = await oracleContract.getOracles()
            expect(oracles).to.not.include(signers[1].address)
            expect(oracles.length).to.equal(1)
        })

        it("should not be able to remove oracle with quorum less than number of oracles", async () => {
            const asOwner = oracleContract.connect(owner)
            try {
                await asOwner.removeOracle(owner.address)
            } catch (error) {}
            const oracles = await oracleContract.getOracles()
            expect(oracles).to.include(owner.address)
            expect(oracles.length).to.equal(1)
        })
    })

    describe("# setMinQuorum", () => {
        it("should set min quorum", async () => {
            const minQuorum = 3
            const asOwner = oracleContract.connect(owner)

            for (let i = 0; i < minQuorum; i++) {
                await asOwner.addOracle(signers[i + 1].address)
            }

            await asOwner.setMinQuorum(minQuorum)
            const _minQuorum = await oracleContract.minQuorum()
            expect(Number(_minQuorum)).to.equal(minQuorum)
            await asOwner.setMinQuorum(1)

            for (let i = 0; i < minQuorum; i++) {
                await asOwner.removeOracle(signers[i + 1].address)
            }
        })

        it("should not be able to set more than number of oracles", async () => {
            const asOwner = oracleContract.connect(owner)

            try {
                await asOwner.setMinQuorum(100)
            } catch (error) {}

            const _minQuorum = await oracleContract.minQuorum()
            expect(Number(_minQuorum)).to.equal(1)
        })
    })

    // --------------------Main functionality tests--------------------
    const voter_id = "asdasd"
    const tps_id = 1
    const voting_id = 1
    const requestHash = keccak256(ethers.solidityPacked(["string", "uint64", "uint64"], [voter_id, tps_id, voting_id]))
    const value = true

    describe("# createRequest", () => {
        it("should create a new request", async () => {
            await oracleContract.createRequest(voter_id, tps_id, voting_id)
            const filter = oracleContract.filters.OnNewRequest
            const events = await oracleContract.queryFilter(filter)
            const event = events[events.length - 1]

            expect(event).to.not.be.undefined
            expect(event.fragment.name).to.equal("OnNewRequest")
            expect(event?.args?.voter_id).to.equal(voter_id)
            expect(Number(event?.args?.tps_id)).to.equal(tps_id)
            expect(Number(event?.args?.voting_id)).to.equal(voting_id)
        })

        it("should not be able to reset an ongoing request", async () => {
            await oracleContract.createRequest(voter_id, tps_id, voting_id)
            const asOracle = oracleContract.connect(owner)
            await asOracle.updateRequest(voter_id, tps_id, voting_id, value)

            try {
                await oracleContract.createRequest(voter_id, tps_id, voting_id)
            } catch (error) {}

            const request = await oracleContract.requests(requestHash)
            expect(request).to.not.be.undefined
            expect(request[0]).to.equal(true)
            expect(request[1]).to.equal(true)
            expect(Number(request[2])).to.equal(1)
            expect(Number(request[3])).to.equal(0)
        })
    })

    describe("# updateRequest", () => {
        beforeEach(async () => {
            const reqId = Number(await oracleContract.createRequest(voter_id, tps_id, voting_id))
        })

        it("should update an ongoing request", async () => {
            const request = await oracleContract.requests(requestHash)
            expect(request).to.not.be.undefined
            expect(request[0]).to.equal(false)
            expect(request[1]).to.equal(false)
            expect(Number(request[2])).to.equal(0)
            expect(Number(request[3])).to.equal(0)

            const asOracle = oracleContract.connect(owner)
            await asOracle.updateRequest(voter_id, tps_id, voting_id, value)

            const updatedRequest = await oracleContract.requests(requestHash)
            expect(Number(updatedRequest[2])).to.equal(1)
        })

        it("should be able to reach quorum", async () => {
            const asOracle = oracleContract.connect(owner)
            await asOracle.updateRequest(voter_id, tps_id, voting_id, value)

            const request = await oracleContract.requests(requestHash)
            expect(request[0]).to.equal(true)
            expect(request[1]).to.equal(true)
            expect(Number(request[2])).to.equal(1)
        })

        it("should emit onQuorumReached on quorum", async () => {
            const asOracle = oracleContract.connect(owner)
            await asOracle.updateRequest(voter_id, tps_id, voting_id, true)

            const filter = oracleContract.filters.OnQuorumReached
            const events = await oracleContract.queryFilter(filter)
            const event = events[events.length - 1]

            expect(event).to.not.be.undefined
            expect(event.fragment.name).to.equal("OnQuorumReached")
            expect(event?.args?.[1]).to.equal(true)
        })
    })

    describe("# getRequestResult", () => {
        beforeEach(async () => {
            const reqId = Number(await oracleContract.createRequest(voter_id, tps_id, voting_id))
        })

        it("should return a proper value when quorum is reached", async () => {
            const asOracle = oracleContract.connect(owner)
            await asOracle.updateRequest(voter_id, tps_id, voting_id, value)

            const result = await oracleContract.getRequestResult(voter_id, tps_id, voting_id)
            expect(result).to.equal(value)
        })

        it("should not return a proper value when quorum has not yet been reached", async () => {
            let result
            try {
                result = await oracleContract.getRequestResult(voter_id, tps_id, voting_id)
            } catch (error) {}
            expect(result).to.be.undefined
        })
    })
})
