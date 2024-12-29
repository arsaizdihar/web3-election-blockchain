# Election with Blockchain

## Prerequisites

- NodeJS
- Run `yarn install` both in `blockchain` and `web` folder.

## Setup Blockchain

1. Run the local blockchain node.

```sh
yarn node:local
```

2. Deploy the oracle smart contract.

```sh
aa
```

3. Deploy the election smart contract.

```sh
yarn deploy:voting
```

## Running the Web

1. Generate the WAGMI types.

```sh
npx wagmi generate
```

2. Modify file in `web/app/lib/election.ts` and adjust the contract address based on the result shown during election smart contract deployment.