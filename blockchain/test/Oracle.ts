import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers } from "hardhat"
import { Oracle } from "../typechain-types/contracts/Oracle"

describe("Oracle", () => {
    //--------------------Variables--------------------
    let oracleContract: Oracle
    let signers: HardhatEthersSigner[]
    let owner: HardhatEthersSigner

    //--------------------General Setup--------------------
    beforeEach(async function () {
        signers = await ethers.getSigners()
        owner = signers[0]

        const oracleContractFactory = await ethers.getContractFactory("Oracle")
        oracleContract = await oracleContractFactory.deploy(owner.address, [owner.address])
        await oracleContract.waitForDeployment()
    })

    //--------------------Base tests--------------------
    describe("# Base test", function () {
        it("should check the validity of variables", async function () {
            const minQuorum = await oracleContract.minQuorum()
            const oracles = await oracleContract.getOracles()
            const totalOracleCount = oracles.length
            expect(totalOracleCount).to.greaterThanOrEqual(
                Number(minQuorum),
                `Expected totalOracleCount (${totalOracleCount}) to be greater than or equal to minQuorum (${minQuorum})`
            )
        })
    })

    describe("# addOracle", function () {
        it("should add new oracle", async function () {
            const asOwner = oracleContract.connect(owner)
            await asOwner.addOracle(signers[1].address)
            const oracles = await oracleContract.getOracles()
            expect(oracles).to.include(signers[1].address)
            expect(oracles.length).to.equal(2)
        })

        it("should not add same oracle twice", async function () {
            const asOwner = oracleContract.connect(owner)
            try {
                await asOwner.addOracle(owner.address)
            } catch (error) {}
            const oracles = await oracleContract.getOracles()
            expect(oracles).to.include(owner.address)
            expect(oracles.length).to.equal(1)
        })
    })

    describe("# removeOracle", function () {
        it("should remove oracle", async function () {
            const asOwner = oracleContract.connect(owner)
            await asOwner.addOracle(signers[1].address)
            await asOwner.removeOracle(signers[1].address)
            const oracles = await oracleContract.getOracles()
            expect(oracles).to.not.include(signers[1].address)
            expect(oracles.length).to.equal(1)
        })

        it("should not be able to remove oracle with quorum less than number of oracles", async function () {
            const asOwner = oracleContract.connect(owner)
            try {
                await asOwner.removeOracle(owner.address)
            } catch (error) {}
            const oracles = await oracleContract.getOracles()
            expect(oracles).to.include(owner.address)
            expect(oracles.length).to.equal(1)
        })
    })

    describe("# setMinQuorum", function () {
        it("should set min quorum", async function () {
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

        it("should not be able to set more than number of oracles", async function () {
            const asOwner = oracleContract.connect(owner)

            try {
                await asOwner.setMinQuorum(100)
            } catch (error) {}

            const _minQuorum = await oracleContract.minQuorum()
            expect(Number(_minQuorum)).to.equal(1)
        })
    })

    //--------------------Main functionality tests--------------------
    describe("# createRequest", function () {
        const voter_id = "asdasd"
        const tps_id = 1
        const voting_id = 1

        it("should create a new request", async function () {
            const reqId = await oracleContract.createRequest(voter_id, tps_id, voting_id)
            const filter = oracleContract.filters.OnNewRequest
            const events = await oracleContract.queryFilter(filter)
            const event = events[events.length - 1]

            expect(event).to.not.be.undefined
            expect(event.fragment.name).to.equal("OnNewRequest")
            expect(event?.args?.voter_id).to.equal(voter_id)
            expect(Number(event?.args?.id)).to.equal(0)
            expect(Number(event?.args?.tps_id)).to.equal(tps_id)
            expect(Number(event?.args?.voting_id)).to.equal(voting_id)
        })
    })

    describe("# updateRequest", function () {
        const voter_id = "asdasd"
        const tps_id = 1
        const voting_id = 1
        let reqId = 0

        beforeEach(async function () {
            let reqId = Number(await oracleContract.createRequest(voter_id, tps_id, voting_id))
        })

        it("should update an ongoing request", async function () {
            const request = await oracleContract.requests(reqId)
            expect(request).to.not.be.undefined
            expect(request[4]).to.equal(false)
            expect(request[5]).to.equal(false)

            const requestVal = Number(await oracleContract.getRequestAnswer(reqId, true))
            expect(requestVal).to.equal(0)

            const asOracle = oracleContract.connect(owner)
            await asOracle.updateRequest(reqId, true)

            const updatedRequestVal = Number(await oracleContract.getRequestAnswer(reqId, true))
            expect(updatedRequestVal).to.equal(1)
        })

        it("should be able to reach quorum", async function () {
            const asOracle = oracleContract.connect(owner)
            await asOracle.updateRequest(reqId, true)

            const request = await oracleContract.requests(reqId)
            expect(request[4]).to.equal(true)
            expect(request[5]).to.equal(true)
        })

        it("should emit onQuorumReached on quorum", async function () {
            const asOracle = oracleContract.connect(owner)
            await asOracle.updateRequest(reqId, true)

            const filter = oracleContract.filters.OnQuorumReached
            const events = await oracleContract.queryFilter(filter)
            const event = events[events.length - 1]

            expect(event).to.not.be.undefined
            expect(event.fragment.name).to.equal("OnQuorumReached")
            expect(Number(event?.args?.id)).to.equal(reqId)
            expect(event?.args?.[1]).to.equal(true)
        })
    })

    describe("# getRequestResult", function () {
        const voter_id = "asdasd"
        const tps_id = 1
        const voting_id = 1
        let reqId = 0
        let value = true

        beforeEach(async function () {
            let reqId = Number(await oracleContract.createRequest(voter_id, tps_id, voting_id))
        })

        it("should return a proper value when quorum is reached", async function () {
            const asOracle = oracleContract.connect(owner)
            await asOracle.updateRequest(reqId, value)

            const result = await oracleContract.getRequestResult(reqId)
            expect(result).to.equal(value)
        })

        it("should not return a proper value when quorum has not yet been reached", async function () {
            let result
            try {
                result = await oracleContract.getRequestResult(reqId)
            } catch (error) {}
            expect(result).to.be.undefined
        })
    })
})
