# How to setup

# --------------------Step 1--------------------
# Execute 'yarn node:local' outside of this script

# --------------------Step 2--------------------
# Modify for each 'yarn node:local'. Take address and private key from the output everytime you set it up
OWNER_ADDR=
OWNER_PKEY=
ORACLES=
ORACLE_CONTRACT_ADDR=

# --------------------Step 3--------------------
# Deploy contract
# yarn deploy:oracle --owner $OWNER_ADDR --oracles $ORACLES

# Build version may also be used
# yarn oracle:build
# yarn oracle-api:start

# --------------------Step 5--------------------
# Setup API for data source on another terminal
# yarn oracle-api:dev

# --------------------Step 6--------------------
# Setup your off-chain oracle nodes with a terminal for each oracle address
ORACLE_NODE_ADDR=
ORACLE_NODE_PKEY=
API_ADDR=http://localhost:3000
CHAIN_ADDR=http://localhost:8545

# yarn oracle-node:dev --o $ORACLE_NODE_ADDR --p $ORACLE_NODE_PKEY --a  $API_ADDR --c $CHAIN_ADDR

# Build version may also be used
# yarn oracle:build
# yarn oracle-node:start