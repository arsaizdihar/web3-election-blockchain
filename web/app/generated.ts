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
      { name: 'oracleAddress', internalType: 'address', type: 'address' },
      { name: 'semaphoreAddress', internalType: 'address', type: 'address' },
      { name: 'ipollingStationId', internalType: 'uint64', type: 'uint64' },
      { name: 'ivotingId', internalType: 'uint64', type: 'uint64' },
      { name: 'icandidateCount', internalType: 'uint32', type: 'uint32' },
      { name: 'iregisterStartAt', internalType: 'uint256', type: 'uint256' },
      { name: 'iregisterEndAt', internalType: 'uint256', type: 'uint256' },
      { name: 'ivoteStartAt', internalType: 'uint256', type: 'uint256' },
      { name: 'ivoteEndAt', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'length', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'StringsInsufficientHexLength',
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
    name: 'getAllVoteCounts',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVoterCommitments',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
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
    inputs: [{ name: 'nullifier', internalType: 'uint256', type: 'uint256' }],
    name: 'hasVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'oracle',
    outputs: [{ name: '', internalType: 'contract IOracle', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pollingStationId',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
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
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'usedNullifiers',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    name: 'voteCounts',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IOracle
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iOracleAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'voter_id', internalType: 'string', type: 'string' },
      { name: 'tps_id', internalType: 'uint64', type: 'uint64' },
      { name: 'voting_id', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'createRequest',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'voter_id', internalType: 'string', type: 'string' },
      { name: 'tps_id', internalType: 'uint64', type: 'uint64' },
      { name: 'voting_id', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'getRequestResult',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Oracle
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const oracleAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_oracles', internalType: 'address[]', type: 'address[]' },
      { name: '_minQuorum', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter_id',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'tps_id',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'voting_id',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'OnNewRequest',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter_id',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'tps_id',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'voting_id',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      { name: 'result', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'OnQuorumReached',
  },
  {
    type: 'function',
    inputs: [{ name: 'oracleAddr', internalType: 'address', type: 'address' }],
    name: 'addOracle',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'voter_id', internalType: 'string', type: 'string' },
      { name: 'tps_id', internalType: 'uint64', type: 'uint64' },
      { name: 'voting_id', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'createRequest',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getOracles',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'voter_id', internalType: 'string', type: 'string' },
      { name: 'tps_id', internalType: 'uint64', type: 'uint64' },
      { name: 'voting_id', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'getRequestResult',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'oracles',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'oracleAddr', internalType: 'address', type: 'address' }],
    name: 'removeOracle',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'requests',
    outputs: [
      { name: 'isCreated', internalType: 'bool', type: 'bool' },
      { name: 'isResolved', internalType: 'bool', type: 'bool' },
      { name: 'finalValue', internalType: 'bool', type: 'bool' },
      { name: 'yes', internalType: 'uint64', type: 'uint64' },
      { name: 'no', internalType: 'uint64', type: 'uint64' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_minQuorum', internalType: 'uint256', type: 'uint256' }],
    name: 'setMinQuorum',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'voter_id', internalType: 'string', type: 'string' },
      { name: 'tps_id', internalType: 'uint64', type: 'uint64' },
      { name: 'voting_id', internalType: 'uint64', type: 'uint64' },
      { name: 'value', internalType: 'bool', type: 'bool' },
    ],
    name: 'updateRequest',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Semaphore
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const semaphoreAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_verifier',
        internalType: 'contract ISemaphoreVerifier',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'LeafAlreadyExists' },
  { type: 'error', inputs: [], name: 'LeafCannotBeZero' },
  { type: 'error', inputs: [], name: 'LeafDoesNotExist' },
  { type: 'error', inputs: [], name: 'LeafGreaterThanSnarkScalarField' },
  { type: 'error', inputs: [], name: 'Semaphore__CallerIsNotTheGroupAdmin' },
  {
    type: 'error',
    inputs: [],
    name: 'Semaphore__CallerIsNotThePendingGroupAdmin',
  },
  { type: 'error', inputs: [], name: 'Semaphore__GroupDoesNotExist' },
  { type: 'error', inputs: [], name: 'Semaphore__GroupHasNoMembers' },
  { type: 'error', inputs: [], name: 'Semaphore__InvalidProof' },
  {
    type: 'error',
    inputs: [],
    name: 'Semaphore__MerkleTreeDepthIsNotSupported',
  },
  { type: 'error', inputs: [], name: 'Semaphore__MerkleTreeRootIsExpired' },
  {
    type: 'error',
    inputs: [],
    name: 'Semaphore__MerkleTreeRootIsNotPartOfTheGroup',
  },
  {
    type: 'error',
    inputs: [],
    name: 'Semaphore__YouAreUsingTheSameNullifierTwice',
  },
  { type: 'error', inputs: [], name: 'WrongSiblingNodes' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'groupId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'oldAdmin',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'GroupAdminPending',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'groupId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'oldAdmin',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'GroupAdminUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'groupId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'GroupCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'groupId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'oldMerkleTreeDuration',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newMerkleTreeDuration',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'GroupMerkleTreeDurationUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'groupId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'identityCommitment',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'merkleTreeRoot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MemberAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'groupId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'identityCommitment',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'merkleTreeRoot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MemberRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'groupId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'identityCommitment',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newIdentityCommitment',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'merkleTreeRoot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MemberUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'groupId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'startIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'identityCommitments',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'merkleTreeRoot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MembersAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'groupId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'merkleTreeDepth',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'merkleTreeRoot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'nullifier',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'message',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'scope',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'points',
        internalType: 'uint256[8]',
        type: 'uint256[8]',
        indexed: false,
      },
    ],
    name: 'ProofValidated',
  },
  {
    type: 'function',
    inputs: [{ name: 'groupId', internalType: 'uint256', type: 'uint256' }],
    name: 'acceptGroupAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'groupId', internalType: 'uint256', type: 'uint256' },
      { name: 'identityCommitment', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addMember',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'groupId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'identityCommitments',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
    ],
    name: 'addMembers',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'admin', internalType: 'address', type: 'address' },
      { name: 'merkleTreeDuration', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createGroup',
    outputs: [{ name: 'groupId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'createGroup',
    outputs: [{ name: 'groupId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'admin', internalType: 'address', type: 'address' }],
    name: 'createGroup',
    outputs: [{ name: 'groupId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'groupId', internalType: 'uint256', type: 'uint256' }],
    name: 'getGroupAdmin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'groupId', internalType: 'uint256', type: 'uint256' }],
    name: 'getMerkleTreeDepth',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'groupId', internalType: 'uint256', type: 'uint256' }],
    name: 'getMerkleTreeRoot',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'groupId', internalType: 'uint256', type: 'uint256' }],
    name: 'getMerkleTreeSize',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'groupCounter',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'groups',
    outputs: [
      { name: 'merkleTreeDuration', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'groupId', internalType: 'uint256', type: 'uint256' },
      { name: 'identityCommitment', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasMember',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'groupId', internalType: 'uint256', type: 'uint256' },
      { name: 'identityCommitment', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'indexOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'groupId', internalType: 'uint256', type: 'uint256' },
      { name: 'identityCommitment', internalType: 'uint256', type: 'uint256' },
      {
        name: 'merkleProofSiblings',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
    ],
    name: 'removeMember',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'groupId', internalType: 'uint256', type: 'uint256' },
      { name: 'newAdmin', internalType: 'address', type: 'address' },
    ],
    name: 'updateGroupAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'groupId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'newMerkleTreeDuration',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'updateGroupMerkleTreeDuration',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'groupId', internalType: 'uint256', type: 'uint256' },
      { name: 'identityCommitment', internalType: 'uint256', type: 'uint256' },
      {
        name: 'newIdentityCommitment',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'merkleProofSiblings',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
    ],
    name: 'updateMember',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'groupId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'proof',
        internalType: 'struct ISemaphore.SemaphoreProof',
        type: 'tuple',
        components: [
          { name: 'merkleTreeDepth', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleTreeRoot', internalType: 'uint256', type: 'uint256' },
          { name: 'nullifier', internalType: 'uint256', type: 'uint256' },
          { name: 'message', internalType: 'uint256', type: 'uint256' },
          { name: 'scope', internalType: 'uint256', type: 'uint256' },
          { name: 'points', internalType: 'uint256[8]', type: 'uint256[8]' },
        ],
      },
    ],
    name: 'validateProof',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'verifier',
    outputs: [
      {
        name: '',
        internalType: 'contract ISemaphoreVerifier',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'groupId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'proof',
        internalType: 'struct ISemaphore.SemaphoreProof',
        type: 'tuple',
        components: [
          { name: 'merkleTreeDepth', internalType: 'uint256', type: 'uint256' },
          { name: 'merkleTreeRoot', internalType: 'uint256', type: 'uint256' },
          { name: 'nullifier', internalType: 'uint256', type: 'uint256' },
          { name: 'message', internalType: 'uint256', type: 'uint256' },
          { name: 'scope', internalType: 'uint256', type: 'uint256' },
          { name: 'points', internalType: 'uint256[8]', type: 'uint256[8]' },
        ],
      },
    ],
    name: 'verifyProof',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"getAllVoteCounts"`
 */
export const useReadElectionGetAllVoteCounts =
  /*#__PURE__*/ createUseReadContract({
    abi: electionAbi,
    functionName: 'getAllVoteCounts',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"getVoterCommitments"`
 */
export const useReadElectionGetVoterCommitments =
  /*#__PURE__*/ createUseReadContract({
    abi: electionAbi,
    functionName: 'getVoterCommitments',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"groupId"`
 */
export const useReadElectionGroupId = /*#__PURE__*/ createUseReadContract({
  abi: electionAbi,
  functionName: 'groupId',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"hasVoted"`
 */
export const useReadElectionHasVoted = /*#__PURE__*/ createUseReadContract({
  abi: electionAbi,
  functionName: 'hasVoted',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"oracle"`
 */
export const useReadElectionOracle = /*#__PURE__*/ createUseReadContract({
  abi: electionAbi,
  functionName: 'oracle',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"usedNullifiers"`
 */
export const useReadElectionUsedNullifiers =
  /*#__PURE__*/ createUseReadContract({
    abi: electionAbi,
    functionName: 'usedNullifiers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link electionAbi}__ and `functionName` set to `"voteCounts"`
 */
export const useReadElectionVoteCounts = /*#__PURE__*/ createUseReadContract({
  abi: electionAbi,
  functionName: 'voteCounts',
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

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iOracleAbi}__
 */
export const useReadIOracle = /*#__PURE__*/ createUseReadContract({
  abi: iOracleAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iOracleAbi}__ and `functionName` set to `"getRequestResult"`
 */
export const useReadIOracleGetRequestResult =
  /*#__PURE__*/ createUseReadContract({
    abi: iOracleAbi,
    functionName: 'getRequestResult',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iOracleAbi}__
 */
export const useWriteIOracle = /*#__PURE__*/ createUseWriteContract({
  abi: iOracleAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iOracleAbi}__ and `functionName` set to `"createRequest"`
 */
export const useWriteIOracleCreateRequest =
  /*#__PURE__*/ createUseWriteContract({
    abi: iOracleAbi,
    functionName: 'createRequest',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iOracleAbi}__
 */
export const useSimulateIOracle = /*#__PURE__*/ createUseSimulateContract({
  abi: iOracleAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iOracleAbi}__ and `functionName` set to `"createRequest"`
 */
export const useSimulateIOracleCreateRequest =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iOracleAbi,
    functionName: 'createRequest',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oracleAbi}__
 */
export const useReadOracle = /*#__PURE__*/ createUseReadContract({
  abi: oracleAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oracleAbi}__ and `functionName` set to `"getOracles"`
 */
export const useReadOracleGetOracles = /*#__PURE__*/ createUseReadContract({
  abi: oracleAbi,
  functionName: 'getOracles',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oracleAbi}__ and `functionName` set to `"getRequestResult"`
 */
export const useReadOracleGetRequestResult =
  /*#__PURE__*/ createUseReadContract({
    abi: oracleAbi,
    functionName: 'getRequestResult',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oracleAbi}__ and `functionName` set to `"minQuorum"`
 */
export const useReadOracleMinQuorum = /*#__PURE__*/ createUseReadContract({
  abi: oracleAbi,
  functionName: 'minQuorum',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oracleAbi}__ and `functionName` set to `"oracles"`
 */
export const useReadOracleOracles = /*#__PURE__*/ createUseReadContract({
  abi: oracleAbi,
  functionName: 'oracles',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oracleAbi}__ and `functionName` set to `"owner"`
 */
export const useReadOracleOwner = /*#__PURE__*/ createUseReadContract({
  abi: oracleAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oracleAbi}__ and `functionName` set to `"requests"`
 */
export const useReadOracleRequests = /*#__PURE__*/ createUseReadContract({
  abi: oracleAbi,
  functionName: 'requests',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oracleAbi}__
 */
export const useWriteOracle = /*#__PURE__*/ createUseWriteContract({
  abi: oracleAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oracleAbi}__ and `functionName` set to `"addOracle"`
 */
export const useWriteOracleAddOracle = /*#__PURE__*/ createUseWriteContract({
  abi: oracleAbi,
  functionName: 'addOracle',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oracleAbi}__ and `functionName` set to `"createRequest"`
 */
export const useWriteOracleCreateRequest = /*#__PURE__*/ createUseWriteContract(
  { abi: oracleAbi, functionName: 'createRequest' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oracleAbi}__ and `functionName` set to `"removeOracle"`
 */
export const useWriteOracleRemoveOracle = /*#__PURE__*/ createUseWriteContract({
  abi: oracleAbi,
  functionName: 'removeOracle',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oracleAbi}__ and `functionName` set to `"setMinQuorum"`
 */
export const useWriteOracleSetMinQuorum = /*#__PURE__*/ createUseWriteContract({
  abi: oracleAbi,
  functionName: 'setMinQuorum',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oracleAbi}__ and `functionName` set to `"updateRequest"`
 */
export const useWriteOracleUpdateRequest = /*#__PURE__*/ createUseWriteContract(
  { abi: oracleAbi, functionName: 'updateRequest' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oracleAbi}__
 */
export const useSimulateOracle = /*#__PURE__*/ createUseSimulateContract({
  abi: oracleAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oracleAbi}__ and `functionName` set to `"addOracle"`
 */
export const useSimulateOracleAddOracle =
  /*#__PURE__*/ createUseSimulateContract({
    abi: oracleAbi,
    functionName: 'addOracle',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oracleAbi}__ and `functionName` set to `"createRequest"`
 */
export const useSimulateOracleCreateRequest =
  /*#__PURE__*/ createUseSimulateContract({
    abi: oracleAbi,
    functionName: 'createRequest',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oracleAbi}__ and `functionName` set to `"removeOracle"`
 */
export const useSimulateOracleRemoveOracle =
  /*#__PURE__*/ createUseSimulateContract({
    abi: oracleAbi,
    functionName: 'removeOracle',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oracleAbi}__ and `functionName` set to `"setMinQuorum"`
 */
export const useSimulateOracleSetMinQuorum =
  /*#__PURE__*/ createUseSimulateContract({
    abi: oracleAbi,
    functionName: 'setMinQuorum',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oracleAbi}__ and `functionName` set to `"updateRequest"`
 */
export const useSimulateOracleUpdateRequest =
  /*#__PURE__*/ createUseSimulateContract({
    abi: oracleAbi,
    functionName: 'updateRequest',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link oracleAbi}__
 */
export const useWatchOracleEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: oracleAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link oracleAbi}__ and `eventName` set to `"OnNewRequest"`
 */
export const useWatchOracleOnNewRequestEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: oracleAbi,
    eventName: 'OnNewRequest',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link oracleAbi}__ and `eventName` set to `"OnQuorumReached"`
 */
export const useWatchOracleOnQuorumReachedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: oracleAbi,
    eventName: 'OnQuorumReached',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link semaphoreAbi}__
 */
export const useReadSemaphore = /*#__PURE__*/ createUseReadContract({
  abi: semaphoreAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"getGroupAdmin"`
 */
export const useReadSemaphoreGetGroupAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: semaphoreAbi,
    functionName: 'getGroupAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"getMerkleTreeDepth"`
 */
export const useReadSemaphoreGetMerkleTreeDepth =
  /*#__PURE__*/ createUseReadContract({
    abi: semaphoreAbi,
    functionName: 'getMerkleTreeDepth',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"getMerkleTreeRoot"`
 */
export const useReadSemaphoreGetMerkleTreeRoot =
  /*#__PURE__*/ createUseReadContract({
    abi: semaphoreAbi,
    functionName: 'getMerkleTreeRoot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"getMerkleTreeSize"`
 */
export const useReadSemaphoreGetMerkleTreeSize =
  /*#__PURE__*/ createUseReadContract({
    abi: semaphoreAbi,
    functionName: 'getMerkleTreeSize',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"groupCounter"`
 */
export const useReadSemaphoreGroupCounter = /*#__PURE__*/ createUseReadContract(
  { abi: semaphoreAbi, functionName: 'groupCounter' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"groups"`
 */
export const useReadSemaphoreGroups = /*#__PURE__*/ createUseReadContract({
  abi: semaphoreAbi,
  functionName: 'groups',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"hasMember"`
 */
export const useReadSemaphoreHasMember = /*#__PURE__*/ createUseReadContract({
  abi: semaphoreAbi,
  functionName: 'hasMember',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"indexOf"`
 */
export const useReadSemaphoreIndexOf = /*#__PURE__*/ createUseReadContract({
  abi: semaphoreAbi,
  functionName: 'indexOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"verifier"`
 */
export const useReadSemaphoreVerifier = /*#__PURE__*/ createUseReadContract({
  abi: semaphoreAbi,
  functionName: 'verifier',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"verifyProof"`
 */
export const useReadSemaphoreVerifyProof = /*#__PURE__*/ createUseReadContract({
  abi: semaphoreAbi,
  functionName: 'verifyProof',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link semaphoreAbi}__
 */
export const useWriteSemaphore = /*#__PURE__*/ createUseWriteContract({
  abi: semaphoreAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"acceptGroupAdmin"`
 */
export const useWriteSemaphoreAcceptGroupAdmin =
  /*#__PURE__*/ createUseWriteContract({
    abi: semaphoreAbi,
    functionName: 'acceptGroupAdmin',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"addMember"`
 */
export const useWriteSemaphoreAddMember = /*#__PURE__*/ createUseWriteContract({
  abi: semaphoreAbi,
  functionName: 'addMember',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"addMembers"`
 */
export const useWriteSemaphoreAddMembers = /*#__PURE__*/ createUseWriteContract(
  { abi: semaphoreAbi, functionName: 'addMembers' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"createGroup"`
 */
export const useWriteSemaphoreCreateGroup =
  /*#__PURE__*/ createUseWriteContract({
    abi: semaphoreAbi,
    functionName: 'createGroup',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"removeMember"`
 */
export const useWriteSemaphoreRemoveMember =
  /*#__PURE__*/ createUseWriteContract({
    abi: semaphoreAbi,
    functionName: 'removeMember',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"updateGroupAdmin"`
 */
export const useWriteSemaphoreUpdateGroupAdmin =
  /*#__PURE__*/ createUseWriteContract({
    abi: semaphoreAbi,
    functionName: 'updateGroupAdmin',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"updateGroupMerkleTreeDuration"`
 */
export const useWriteSemaphoreUpdateGroupMerkleTreeDuration =
  /*#__PURE__*/ createUseWriteContract({
    abi: semaphoreAbi,
    functionName: 'updateGroupMerkleTreeDuration',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"updateMember"`
 */
export const useWriteSemaphoreUpdateMember =
  /*#__PURE__*/ createUseWriteContract({
    abi: semaphoreAbi,
    functionName: 'updateMember',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"validateProof"`
 */
export const useWriteSemaphoreValidateProof =
  /*#__PURE__*/ createUseWriteContract({
    abi: semaphoreAbi,
    functionName: 'validateProof',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link semaphoreAbi}__
 */
export const useSimulateSemaphore = /*#__PURE__*/ createUseSimulateContract({
  abi: semaphoreAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"acceptGroupAdmin"`
 */
export const useSimulateSemaphoreAcceptGroupAdmin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: semaphoreAbi,
    functionName: 'acceptGroupAdmin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"addMember"`
 */
export const useSimulateSemaphoreAddMember =
  /*#__PURE__*/ createUseSimulateContract({
    abi: semaphoreAbi,
    functionName: 'addMember',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"addMembers"`
 */
export const useSimulateSemaphoreAddMembers =
  /*#__PURE__*/ createUseSimulateContract({
    abi: semaphoreAbi,
    functionName: 'addMembers',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"createGroup"`
 */
export const useSimulateSemaphoreCreateGroup =
  /*#__PURE__*/ createUseSimulateContract({
    abi: semaphoreAbi,
    functionName: 'createGroup',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"removeMember"`
 */
export const useSimulateSemaphoreRemoveMember =
  /*#__PURE__*/ createUseSimulateContract({
    abi: semaphoreAbi,
    functionName: 'removeMember',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"updateGroupAdmin"`
 */
export const useSimulateSemaphoreUpdateGroupAdmin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: semaphoreAbi,
    functionName: 'updateGroupAdmin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"updateGroupMerkleTreeDuration"`
 */
export const useSimulateSemaphoreUpdateGroupMerkleTreeDuration =
  /*#__PURE__*/ createUseSimulateContract({
    abi: semaphoreAbi,
    functionName: 'updateGroupMerkleTreeDuration',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"updateMember"`
 */
export const useSimulateSemaphoreUpdateMember =
  /*#__PURE__*/ createUseSimulateContract({
    abi: semaphoreAbi,
    functionName: 'updateMember',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link semaphoreAbi}__ and `functionName` set to `"validateProof"`
 */
export const useSimulateSemaphoreValidateProof =
  /*#__PURE__*/ createUseSimulateContract({
    abi: semaphoreAbi,
    functionName: 'validateProof',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link semaphoreAbi}__
 */
export const useWatchSemaphoreEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: semaphoreAbi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link semaphoreAbi}__ and `eventName` set to `"GroupAdminPending"`
 */
export const useWatchSemaphoreGroupAdminPendingEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: semaphoreAbi,
    eventName: 'GroupAdminPending',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link semaphoreAbi}__ and `eventName` set to `"GroupAdminUpdated"`
 */
export const useWatchSemaphoreGroupAdminUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: semaphoreAbi,
    eventName: 'GroupAdminUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link semaphoreAbi}__ and `eventName` set to `"GroupCreated"`
 */
export const useWatchSemaphoreGroupCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: semaphoreAbi,
    eventName: 'GroupCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link semaphoreAbi}__ and `eventName` set to `"GroupMerkleTreeDurationUpdated"`
 */
export const useWatchSemaphoreGroupMerkleTreeDurationUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: semaphoreAbi,
    eventName: 'GroupMerkleTreeDurationUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link semaphoreAbi}__ and `eventName` set to `"MemberAdded"`
 */
export const useWatchSemaphoreMemberAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: semaphoreAbi,
    eventName: 'MemberAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link semaphoreAbi}__ and `eventName` set to `"MemberRemoved"`
 */
export const useWatchSemaphoreMemberRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: semaphoreAbi,
    eventName: 'MemberRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link semaphoreAbi}__ and `eventName` set to `"MemberUpdated"`
 */
export const useWatchSemaphoreMemberUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: semaphoreAbi,
    eventName: 'MemberUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link semaphoreAbi}__ and `eventName` set to `"MembersAdded"`
 */
export const useWatchSemaphoreMembersAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: semaphoreAbi,
    eventName: 'MembersAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link semaphoreAbi}__ and `eventName` set to `"ProofValidated"`
 */
export const useWatchSemaphoreProofValidatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: semaphoreAbi,
    eventName: 'ProofValidated',
  })
