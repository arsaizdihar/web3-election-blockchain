import axios from "axios"
import yargs from "yargs"
import { ethers } from "ethers"
import { hideBin } from "yargs/helpers"

//--------------------Argument Processing--------------------
const argv = yargs(hideBin(process.argv))
    .option("oracle_addr", {
        alias: "o",
        description: "The address of the oracle contract",
        type: "string",
        demandOption: true
    })
    .option("private_key", {
        alias: "p",
        description: "The private key of the oracle",
        type: "string",
        demandOption: true
    })
    .option("api_addr", {
        alias: "a",
        description: "The address of the API to fetch data from",
        type: "string",
        demandOption: false,
        default: "http://localhost:3000"
    })
    .option("chain_addr", {
        alias: "c",
        description: "The address to the blockchain network",
        type: "string",
        demandOption: false,
        default: "http://localhost:8545"
    })
    .help()
    .alias("help", "h").argv

const { oracle_addr, private_key, api_addr, chain_addr } = argv as {
    oracle_addr: string
    private_key: string
    api_addr: string
    chain_addr: string
}
console.log("Running off-chain oracle with the following configuration:")
console.log("Oracle Address:", oracle_addr)
console.log("Private Key:", private_key)
console.log("API Address:", api_addr)
console.log("Chain Address:", chain_addr)

//--------------------Smart Contract ABI--------------------
const ORACLE_ABI = [
    "function updateRequest(string voter_id, uint64 tps_id, uint64 voting_id, bool value) public",
    "event OnNewRequest(string voter_id, uint64 tps_id, uint64 voting_id)",
    "event OnQuorumReached(bytes32 requestHash, bool result)"
]

//--------------------Variables--------------------
const provider = new ethers.JsonRpcProvider(chain_addr)
const wallet = new ethers.Wallet(private_key, provider)
const oracleContract = new ethers.Contract(oracle_addr, ORACLE_ABI, wallet)

//--------------------Functions--------------------
function log(message: string) {
    console.log(`[${new Date().toISOString()}] ${message}`)
}

async function subscribe() {
    log("Subscribed to the oracle contract.")
    oracleContract.on("OnNewRequest", async (voter_id: string, tps_id: number, voting_id: number) => {
        log(`Received new request`)
        log(`voter_id: ${voter_id}`)
        log(`tps_id: ${tps_id}`)
        log(`voting_id: ${voting_id}`)

        let attempts = 0
        const maxAttempts = 5
        const retryDelay = 2000
        let success = false
        let value: boolean

        while (attempts < maxAttempts && !success) {
            try {
                log(`Getting voter validity from the API...`)
                const response = await axios.get(
                    `${api_addr}/voters/validity?voter_id=${voter_id}&tps_id=${tps_id}&voting_id=${voting_id}`
                )
                value = response.data.result
                log(`Result from the API: ${value}`)
                success = true
            } catch (error: any) {
                attempts++
                log(`Attempt ${attempts}/${maxAttempts}: ${error.message}`)
                await new Promise((resolve) => setTimeout(resolve, retryDelay))
            }
        }

        if (!success) {
            log("Failed to get voter validity from the API.")
            return
        }

        log("Sending data to the oracle contract...")
        const tx = await oracleContract.updateRequest(voter_id, tps_id, voting_id, value!!)
        log(`Transaction sent ${tx.hash}`)
    })

    oracleContract.on("OnQuorumReached", (requestHash: string, result: boolean) => {
        log(`Quorum reached for request ${requestHash}, result is: ${result}`)
    })
}

//--------------------Main--------------------
subscribe()
