import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Election
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const electionAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'semaphoreAddress', internalType: 'address', type: 'address' },
      { name: 'ipollingStationId', internalType: 'uint256', type: 'uint256' },
      { name: 'ivotingId', internalType: 'uint256', type: 'uint256' },
      { name: 'icandidateCount', internalType: 'uint32', type: 'uint32' },
      { name: 'iregisterStartAt', internalType: 'uint256', type: 'uint256' },
      { name: 'iregisterEndAt', internalType: 'uint256', type: 'uint256' },
      { name: 'ivoteStartAt', internalType: 'uint256', type: 'uint256' },
      { name: 'ivoteEndAt', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pollingStationId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'votingId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'votedCandidateNumber',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'Voted',
  },
  {
    type: 'function',
    inputs: [],
    name: 'candidateCount',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'groupId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pollingStationId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'identityCommitment', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'registerAsVoter',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'registerEndAt',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'registerStartAt',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'semaphore',
    outputs: [
      { name: '', internalType: 'contract ISemaphore', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'merkleTreeDepth', internalType: 'uint256', type: 'uint256' },
      { name: 'merkleTreeRoot', internalType: 'uint256', type: 'uint256' },
      { name: 'nullifier', internalType: 'uint256', type: 'uint256' },
      { name: 'voteMessage', internalType: 'uint256', type: 'uint256' },
      { name: 'points', internalType: 'uint256[8]', type: 'uint256[8]' },
    ],
    name: 'sendVote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'voteEndAt',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'voteStartAt',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'voterCommitments',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__
 */
export const useReadElection = /*#__PURE__*/ createUseReadContract({
  abi: electionAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"candidateCount"`
 */
export const useReadElectionCandidateCount =
  /*#__PURE__*/ createUseReadContract({
    abi: electionAbi,
    functionName: 'candidateCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"groupId"`
 */
export const useReadElectionGroupId = /*#__PURE__*/ createUseReadContract({
  abi: electionAbi,
  functionName: 'groupId',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"pollingStationId"`
 */
export const useReadElectionPollingStationId =
  /*#__PURE__*/ createUseReadContract({
    abi: electionAbi,
    functionName: 'pollingStationId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"registerEndAt"`
 */
export const useReadElectionRegisterEndAt = /*#__PURE__*/ createUseReadContract(
  { abi: electionAbi, functionName: 'registerEndAt' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"registerStartAt"`
 */
export const useReadElectionRegisterStartAt =
  /*#__PURE__*/ createUseReadContract({
    abi: electionAbi,
    functionName: 'registerStartAt',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"semaphore"`
 */
export const useReadElectionSemaphore = /*#__PURE__*/ createUseReadContract({
  abi: electionAbi,
  functionName: 'semaphore',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"voteEndAt"`
 */
export const useReadElectionVoteEndAt = /*#__PURE__*/ createUseReadContract({
  abi: electionAbi,
  functionName: 'voteEndAt',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"voteStartAt"`
 */
export const useReadElectionVoteStartAt = /*#__PURE__*/ createUseReadContract({
  abi: electionAbi,
  functionName: 'voteStartAt',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"voterCommitments"`
 */
export const useReadElectionVoterCommitments =
  /*#__PURE__*/ createUseReadContract({
    abi: electionAbi,
    functionName: 'voterCommitments',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"votingId"`
 */
export const useReadElectionVotingId = /*#__PURE__*/ createUseReadContract({
  abi: electionAbi,
  functionName: 'votingId',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link electionAbi}__
 */
export const useWriteElection = /*#__PURE__*/ createUseWriteContract({
  abi: electionAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"registerAsVoter"`
 */
export const useWriteElectionRegisterAsVoter =
  /*#__PURE__*/ createUseWriteContract({
    abi: electionAbi,
    functionName: 'registerAsVoter',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"sendVote"`
 */
export const useWriteElectionSendVote = /*#__PURE__*/ createUseWriteContract({
  abi: electionAbi,
  functionName: 'sendVote',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link electionAbi}__
 */
export const useSimulateElection = /*#__PURE__*/ createUseSimulateContract({
  abi: electionAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"registerAsVoter"`
 */
export const useSimulateElectionRegisterAsVoter =
  /*#__PURE__*/ createUseSimulateContract({
    abi: electionAbi,
    functionName: 'registerAsVoter',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"sendVote"`
 */
export const useSimulateElectionSendVote =
  /*#__PURE__*/ createUseSimulateContract({
    abi: electionAbi,
    functionName: 'sendVote',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link electionAbi}__
 */
export const useWatchElectionEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: electionAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link electionAbi}__ and `eventName` set to `"Voted"`
 */
export const useWatchElectionVotedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: electionAbi,
    eventName: 'Voted',
  })
