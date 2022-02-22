import { ethers } from 'hardhat'
import * as fs from 'fs'

async function main() {
  const coinspaceFactory = await ethers.getContractFactory('Coinspace')
  const coinspaceContract = await coinspaceFactory.deploy()
  await coinspaceContract.deployed()

  console.log('Contract deployed to: ', coinspaceContract.address)

  const deployment = {
    address: coinspaceContract.address,
  }

  fs.writeFile('./data/deployment.json', JSON.stringify(deployment), (err) => {
    if (err) {
      console.log('Error writing file', err)
    }
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
