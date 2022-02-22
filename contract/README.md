# CoinSpace

Smart contract for CoinSpace

## Setup

1. Create a `.env` file with the `RINKEBY_URL` and `PRIVATE_KEYS` (seprated by `,`) variables.
2. Install dependencies `$ yarn`

## Test

`$ yarn hardhat test`

with GAS usage info

`$ REPORT_GAS=true yarn hardhat test`

## Deployment

Deploy to rinkeby testnet

`$ yarn hardhat run scripts/deploy.ts --network rinkeby`
