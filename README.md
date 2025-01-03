# Election with Blockchain

A blockchain-based election system for PILKADA Indonesia that has the following properties:

- Votes cannot be altered or falsified due to the inherent nature of blockchain where transaction data is append-only, transparent, and can be verified by various parties.
- The use of zero-knowledge proof ensures voter validity while maintaining vote anonymity.
- All transactions are recorded on the blockchain and can be audited by all parties.
- The distributed blockchain system where values are agreed upon through consensus.

## Prerequisites and System Requirements

- NodeJS 20 with yarn installed.
- Run `yarn install` both in `blockchain` and `web` folder.

## Setup Blockchain

1. Run the local private blockchain node.

```sh
cd blockchain
yarn node:local
```

2. Deploy the smart contracts and start offchain API. Oracle will be integrated automatically.

```sh
cd blockchain
sh ./_oracle.sh
```

## Running the Web

1. Run the react web application.

```sh
cd web
yarn dev
```

## Demo Youtube Link

You can watch the demo video [here](https://youtu.be/8NV2hxjggNY).
