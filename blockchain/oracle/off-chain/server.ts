// _TODO: This is 100% chatgpt lmfao, check the code and see if it's correct

import axios from "axios"
import { ethers } from "ethers"

const ORACLE_ADDRESS = "0xYourOracleContractAddress"
const ORACLE_ABI = [
    "function updateRequest(uint256 requestId, string memory value) public",
    "function getQuorum() public view returns (uint256)",
    "event OnNewRequest(uint256 indexed id, string url, string attr)"
]
const PRIVATE_KEY = "some_private_key"
const API_ADDR = "http://localhost:3000"

const provider = new ethers.JsonRpcProvider("http://localhost:8545")
const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
const oracleContract = new ethers.Contract(ORACLE_ADDRESS, ORACLE_ABI, wallet)

async function checkQuorumAndUpdate(requestId: any, value: any) {
    const quorum = await oracleContract.getQuorum()
    console.log(`Current Quorum: ${quorum}`)

    // Ensure quorum is met before proceeding with the update
    if (quorum > 0) {
        console.log(`Updating request ${requestId} with value: ${value}`)
        const tx = await oracleContract.updateRequest(requestId, value)
        await tx.wait()
        console.log(`Request ${requestId} updated successfully`)
    } else {
        console.log("Quorum not met, skipping update")
    }
}

async function fetchDataAndUpdate() {
    try {
        // Make a request to the API
        const response = await axios.get(`${API_ADDR}/data`)
        const { value } = response.data // Assuming the response contains 'value'

        // Call the contract to update the request with the fetched data
        const requestId = 0 // Assuming you're updating the request with ID 0 for simplicity
        await checkQuorumAndUpdate(requestId, value)
    } catch (error) {
        console.error("Error fetching data or updating contract:", error)
    }
}

// Periodically fetch data and update the contract
setInterval(fetchDataAndUpdate, 60000) // Every minute
