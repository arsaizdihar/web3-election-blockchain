import { ethers, parseEther } from "ethers"

// Hardcoded. These should be on the frontend so we won't get overboard preparing it
const oracle_addr: string = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const private_key: string = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
const chain_addr: string = "http://localhost:8545"

const pollingDelay = 2000
const voter_id = "123123123"
const tps_id = 1
const voting_id = 2

console.log("Running off-chain oracle with the following configuration:")
console.log("Oracle Address:", oracle_addr)
console.log("Private Key:", private_key)
console.log("Chain Address:", chain_addr)

//--------------------Smart Contract ABI--------------------
const ORACLE_ABI = [
    "function createRequest(string memory voter_id, uint64 tps_id, uint64 voting_id) public",
    "function getRequestResult(string memory voter_id, uint64 tps_id, uint64 voting_id) public view returns (bool)"
]

//--------------------Variables--------------------
const provider = new ethers.JsonRpcProvider(chain_addr)
const wallet = new ethers.Wallet(private_key, provider)
const oracleContract = new ethers.Contract(oracle_addr, ORACLE_ABI, wallet)
const iface = new ethers.Interface(ORACLE_ABI)

//--------------------Functions--------------------
function log(message: string) {
    console.log(`[${new Date().toISOString()}] ${message}`)
}
async function request() {
    log("Requesting data from oracle")
    log(`voter_id: ${voter_id}`)
    log(`tps_id: ${tps_id}`)
    log(`voting_id: ${voting_id}`)

    try {
        await oracleContract.createRequest(voter_id, tps_id, voting_id)
        log(`Request created`)
    } catch (error: any) {
        log(`Error: ${error.message}`)
    }

    log(`Request created`)
}
async function pollResult() {
    while (true) {
        try {
            await new Promise((resolve) => setTimeout(resolve, pollingDelay))
            const result = await oracleContract.getRequestResult(voter_id, tps_id, voting_id)

            log(`Request result: ${result}`)
            break
        } catch (error: any) {
            log(`Error: ${error.message}`)
        }
    }
}
async function main() {
    log("Starting client")
    const id = await request()
    await pollResult()
    log("Client request finished")
}

//--------------------Main--------------------
main()
