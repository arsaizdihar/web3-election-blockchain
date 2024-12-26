// _TODO: This is 100% chatgpt lmfao, check the code and see if it's correct

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
    "function updateRequest(uint256 requestId, string memory value) public",
    "function getQuorum() public view returns (uint256)",
    "event OnNewRequest(uint256 indexed id, string url, string attr)"
]

//--------------------Variables--------------------
const provider = new ethers.JsonRpcProvider(chain_addr)
const wallet = new ethers.Wallet(private_key, provider)
const oracleContract = new ethers.Contract(oracle_addr, ORACLE_ABI, wallet)

//--------------------Functions--------------------
// async function checkQuorumAndUpdate(requestId: any, value: any) {
//     const quorum = await oracleContract.getQuorum()
//     console.log(`Current Quorum: ${quorum}`)

//     // Ensure quorum is met before proceeding with the update
//     if (quorum > 0) {
//         console.log(`Updating request ${requestId} with value: ${value}`)
//         const tx = await oracleContract.updateRequest(requestId, value)
//         await tx.wait()
//         console.log(`Request ${requestId} updated successfully`)
//     } else {
//         console.log("Quorum not met, skipping update")
//     }
// }

// async function fetchDataAndUpdate() {
//     try {
//         // Make a request to the API
//         const response = await axios.get(`${API_ADDR}/data`)
//         const { value } = response.data // Assuming the response contains 'value'

//         // Call the contract to update the request with the fetched data
//         const requestId = 0 // Assuming you're updating the request with ID 0 for simplicity
//         await checkQuorumAndUpdate(requestId, value)
//     } catch (error) {
//         console.error("Error fetching data or updating contract:", error)
//     }
// }
