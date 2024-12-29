# How to setup

# --------------------Step 1--------------------
# Execute 'yarn node:local' outside of this script

# --------------------Step 2--------------------
# Modify for each 'yarn node:local'. Take address and private key from the output everytime you set it up
OWNER_ADDR=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
OWNER_PKEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
ORACLES=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,0x70997970C51812dc3A010C7d01b50e0d17dc79C8
ORACLE_CONTRACT_ADDR=0x5FbDB2315678afecb367f032d93F642f64180aa3
MIN_QUORUM=2

# --------------------Step 3--------------------
# Deploy contract
yarn deploy:oracle --owner $OWNER_ADDR --oracles $ORACLES --minquorum $MIN_QUORUM

# Build version may also be used
# yarn oracle:build
# yarn oracle-api:start

# --------------------Step 5--------------------
# Setup API for data source on another terminal
yarn oracle-api:dev &

# --------------------Step 6--------------------
# Deploy election contract
yarn deploy:voting --oracle $ORACLE_CONTRACT_ADDR

# --------------------Step 7--------------------
# Setup your off-chain oracle nodes with a terminal for each oracle address
API_ADDR=http://localhost:3000
CHAIN_ADDR=http://localhost:8545

ORACLE_NODE_PKEYS=(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
  "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
)
for ORACLE_NODE_PKEY in "${ORACLE_NODE_PKEYS[@]}"; do
  echo "Starting oracle node with private key: $ORACLE_NODE_PKEY"
  yarn oracle-node:dev --o $ORACLE_CONTRACT_ADDR --p $ORACLE_NODE_PKEY --a $API_ADDR --c $CHAIN_ADDR &
done

wait

# Build version may also be used
# yarn oracle:build
# yarn oracle-node:start
