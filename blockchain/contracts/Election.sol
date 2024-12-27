//SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract Election {
    ISemaphore public semaphore;

    /**
     *
     * @param pollingStationId ID TPS
     * @param votingId Voting process ID
     * @param votedCandidateNumber Candidate number that was voted. Value from 1 to candidate count. Value 0 mean the vote is invalid
     */
    event Voted(uint256 indexed pollingStationId, uint256 indexed votingId, uint32 votedCandidateNumber);

    mapping(address => bool) private hasJoined;

    uint256 public pollingStationId; // ID TPS
    uint256 public votingId; // ID for voting process (example: Pilgub DKI Jakarta)
    uint32 public candidateCount; // Candidate count;

    uint256 public groupId; // for Semaphore usage

    uint256 public registerStartAt;
    uint256 public registerEndAt;
    uint256 public voteStartAt;
    uint256 public voteEndAt;

    uint256[] public voterCommitments;

    mapping(uint32 => uint256) public voteCounts;

    mapping(uint256 => bool) public usedNullifiers;

    constructor(
        address semaphoreAddress,
        uint256 ipollingStationId,
        uint256 ivotingId,
        uint32 icandidateCount,
        uint256 iregisterStartAt,
        uint256 iregisterEndAt,
        uint256 ivoteStartAt,
        uint256 ivoteEndAt
    ) {
        semaphore = ISemaphore(semaphoreAddress);

        groupId = semaphore.createGroup();
        pollingStationId = ipollingStationId;
        votingId = ivotingId;
        candidateCount = icandidateCount;
        registerStartAt = iregisterStartAt;
        registerEndAt = iregisterEndAt;
        voteStartAt = ivoteStartAt;
        voteEndAt = ivoteEndAt;
    }

    function getVoterCommitments() external view returns (uint256[] memory) {
        return voterCommitments;
    }

    function registerAsVoter(uint256 identityCommitment) external {
        require(block.timestamp >= registerStartAt, "Registration phase not yet started");
        require(block.timestamp <= registerEndAt, "Registration phase has ended");

        require(!hasJoined[msg.sender], "You can only join once");

        // todo awe panggil oracle di sini

        semaphore.addMember(groupId, identityCommitment);

        hasJoined[msg.sender] = true;
        voterCommitments.push(identityCommitment);
    }

    function validateAndConvert(uint256 voteMessage) private view returns (uint32) {
        if (voteMessage >= 1 && voteMessage <= candidateCount) {
            return uint32(voteMessage);
        } else {
            return 0; // Return 0 if value is out of range
        }
    }

    function sendVote(
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifier,
        uint256 voteMessage,
        uint256[8] calldata points
    ) external {
        require(block.timestamp >= voteStartAt, "Voting phase not yet started");
        require(block.timestamp <= voteEndAt, "Voting phase has ended");

        require(!usedNullifiers[nullifier], "Vote already cast");

        ISemaphore.SemaphoreProof memory proof = ISemaphore.SemaphoreProof(
            merkleTreeDepth,
            merkleTreeRoot,
            nullifier,
            voteMessage,
            groupId,
            points
        );

        require(semaphore.verifyProof(groupId, proof), "Invalid proof");

        usedNullifiers[nullifier] = true;

        uint32 votedCandidate = validateAndConvert(voteMessage);

        voteCounts[votedCandidate]++;

        semaphore.validateProof(groupId, proof);
        emit Voted(pollingStationId, votingId, votedCandidate);
    }

    function getAllVoteCounts() external view returns (uint256[] memory) {
        uint256[] memory results = new uint256[](candidateCount + 1);
        for (uint32 i = 0; i <= candidateCount; i++) {
            results[i] = voteCounts[i];
        }
        return results;
    }

    function hasVoted(uint256 nullifier) external view returns (bool) {
        return usedNullifiers[nullifier];
    }
}
