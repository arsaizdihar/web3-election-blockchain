import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { expect } from "chai"
import { ethers } from "hardhat"
import { Oracle } from "../typechain-types/contracts/Oracle"

describe("Oracle", () => {
    let oracleContract: Oracle
    let signers: HardhatEthersSigner[]
    const url = "http://localhost:3000"
    const attr = "test"

    beforeEach(async function () {
        signers = await ethers.getSigners()
        const oracleContractFactory = await ethers.getContractFactory("Oracle")
        oracleContract = await oracleContractFactory.deploy()
        await oracleContract.waitForDeployment()
    })

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

    describe("# CreateRequest", function () {
        it("should create a new request", async function () {
            await oracleContract.createRequest(url, attr)
            const filter = oracleContract.filters.OnNewRequest
            const events = await oracleContract.queryFilter(filter)
            const event = events[0]

            console.log(event)

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
