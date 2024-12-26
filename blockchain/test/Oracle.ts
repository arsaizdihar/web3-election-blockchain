import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers } from "hardhat"
import { Oracle } from "../typechain-types/contracts/Oracle"

describe("Oracle", () => {
    //--------------------Variables--------------------
    let oracleContract: Oracle
    let signers: HardhatEthersSigner[]
    let owner: HardhatEthersSigner
    const url = "http://localhost:3000"
    const attr = "test"

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
                minQuorum,
                `Expected totalOracleCount (${totalOracleCount}) to be greater than or equal to minQuorum (${minQuorum})`
            )
        })
    })

    describe("# AddOracle", function () {
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

    describe("# RemoveOracle", function () {
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

    describe("# SetMinQuorum", function () {
        it("should set min quorum", async function () {
            const minQuorum = 3
            const asOwner = oracleContract.connect(owner)

            for (let i = 0; i < minQuorum; i++) {
                await asOwner.addOracle(signers[i + 1].address)
            }

            await asOwner.setMinQuorum(minQuorum)
            const _minQuorum = await oracleContract.minQuorum()
            expect(_minQuorum).to.equal(minQuorum)
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
            expect(_minQuorum).to.equal(1)
        })
    })

    //--------------------Main functionality tests--------------------
    describe("# CreateRequest", function () {
        it("should create a new request", async function () {
            await oracleContract.createRequest(url, attr)
            const filter = oracleContract.filters.OnNewRequest
            const events = await oracleContract.queryFilter(filter)
            const event = events[0]

            expect(event).to.not.be.undefined
            expect(event.fragment.name).to.equal("OnNewRequest")
            expect(event?.args?.id).to.equal(0)
            expect(event?.args?.url).to.equal(url)
            expect(event?.args?.attr).to.equal(attr)
        })
    })

    describe("# updateRequest", function () {
        // beforeEach(async function (params) {
        //     await oracleContract.createRequest(url, attr)
        // })
        // it("should update request when quorum is reached", async function () {
        //     const value = "100"
        //     await oracle.connect(addr1).updateRequest(0, oracleValue)
        // })
    })
})
