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
        oracleContract = await oracleContractFactory.deploy(owner.address)
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
            await asOwner.addOracle(signers[0].address)
            const oracles = await oracleContract.getOracles()
            expect(oracles).to.include(signers[0].address)
        })
    })

    describe("# RemoveOracle", function () {
        it("should remove oracle", async function () {
            const asOwner = oracleContract.connect(owner)
            await asOwner.addOracle(signers[0].address)
            await asOwner.removeOracle(signers[0].address)
            const oracles = await oracleContract.getOracles()
            expect(oracles).to.not.include(signers[0].address)
        })
    })

    describe("# SetMinQuorum", function () {
        it("should set min quorum", async function () {
            const minQuorum = 3
            const asOwner = oracleContract.connect(owner)

            for (let i = 0; i < minQuorum; i++) {
                await asOwner.addOracle(signers[i].address)
            }

            await asOwner.setMinQuorum(minQuorum)
            const _minQuorum = await oracleContract.minQuorum()
            expect(_minQuorum).to.equal(minQuorum)

            for (let i = 0; i < minQuorum; i++) {
                await asOwner.removeOracle(signers[i].address)
            }
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
