import { ethers, Contract } from 'ethers'

import abi from './Coinspace.json'
import deployment from './deployment.json'

export default function getContract(): Contract {
  const contractAddress = deployment.address
  const contractABI = abi.abi

  return new ethers.Contract(contractAddress, contractABI)
}
