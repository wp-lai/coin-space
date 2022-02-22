/** @format */

import * as dotenv from 'dotenv'

import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

dotenv.config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    const balance = await account.getBalance()
    const eth = hre.ethers.utils.formatEther(balance)
    console.log(`account: ${account.address}\nbalance: ${eth} eth`)
  }
})

task('createAccount', 'Create a random account', async (taskArgs, hre) => {
  const account = await hre.ethers.Wallet.createRandom()
  console.log(`account address: ${account.address}`)
  console.log(`account mnemonic: ${account.mnemonic.phrase}`)
  console.log(`account private key: ${account.privateKey}`)
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL || '',
      accounts:
        // eslint-disable-next-line prettier/prettier
        process.env.PRIVATE_KEYS !== undefined ? process.env.PRIVATE_KEYS.split(",") : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
}

export default config
