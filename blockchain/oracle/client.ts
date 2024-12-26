import yargs from "yargs"
import { ethers } from "ethers"

// Hardcoded. These should be on the frontend so we won't get overboard preparing it
const oracle_addr: string = "0"
const private_key: string = "0"
const chain_addr: string = "http://localhost:8545"

const pollingDelay = 1000
const voter_id = "123123"
const tps_id = 1
const voting_id = 1

console.log("Running off-chain oracle with the following configuration:")
console.log("Oracle Address:", oracle_addr)
console.log("Private Key:", private_key)
console.log("Chain Address:", chain_addr)

//--------------------Smart Contract ABI--------------------
const ORACLE_ABI = [
    "function createRequest( string memory voter_id, uint64 tps_id, uint64 voting_id) public returns (uint256)",
    "function getRequestResult(uint256 _id) public view returns (bool)"
]

//--------------------Variables--------------------
const provider = new ethers.JsonRpcProvider(chain_addr)
const wallet = new ethers.Wallet(private_key, provider)
const oracleContract = new ethers.Contract(oracle_addr, ORACLE_ABI, wallet)

//--------------------Functions--------------------
function log(message: string) {
    console.log(`[${new Date().toISOString()}] ${message}`)
}

//--------------------Main--------------------
log("Starting client")
const id = await oracleContract.createRequest(voter_id, tps_id, voting_id)
log(`Request created with id: ${id}`)

while (true) {
    try {
        await new Promise((resolve) => setTimeout(resolve, pollingDelay))
        const result = await oracleContract.getRequestResult(id)

        log(`Request result: ${result}`)
        break
    } catch (error) {
        log(`Error: ${error.message}`)
    }
}
