import { expect, use } from 'chai'
import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
import { solidity } from 'ethereum-waffle'

use(solidity)

describe('Coinspace', function () {
  let owner: Signer
  let addr1: Signer
  let contract: Contract

  beforeEach(async function () {
    ;[owner, addr1] = await ethers.getSigners()
    const factory = await ethers.getContractFactory('Coinspace')
    contract = await factory.deploy()
    await contract.deployed()
  })

  it('Initial coins to be empty', async function () {
    const coins = await contract.getCoins()
    expect(coins.length).to.equal(0)
  })

  it('Can submit', async function () {
    await contract.submit('bitcoin', 'btc')
    const coins = await contract.getCoins()
    expect(coins.length).to.equal(1)
    expect(coins[0].name).to.equal('bitcoin')
    expect(coins[0].symbol).to.equal('btc')
    expect(coins[0].submitter).to.equal(await owner.getAddress())
  })

  it('Can submit by other people', async function () {
    await contract.connect(addr1).submit('bitcoin', 'btc')
    const coins = await contract.getCoins()
    expect(coins.length).to.equal(1)
    expect(coins[0].name).to.equal('bitcoin')
    expect(coins[0].symbol).to.equal('btc')
    expect(coins[0].submitter).to.equal(await addr1.getAddress())
  })

  it('Submit emits event', async function () {
    await expect(contract.submit('bitcoin', 'btc'))
      .to.emit(contract, 'CoinSubmitted')
      .withArgs('bitcoin', 'btc', await owner.getAddress())
  })

  it('Can tip', async function () {
    await contract.submit('bitcoin', 'btc')

    const tipAmount = ethers.utils.parseEther('0.1')

    await expect(await contract.connect(addr1).tip(0, { value: tipAmount })).to.changeEtherBalance(
      addr1,
      tipAmount.mul(-1),
    )
  })

  it('Tip emits event', async function () {
    await contract.submit('bitcoin', 'btc')
    const tipAmount = ethers.utils.parseEther('0.1')

    await expect(contract.connect(addr1).tip(0, { value: tipAmount }))
      .to.emit(contract, 'TipSend')
      .withArgs(await addr1.getAddress(), await owner.getAddress(), tipAmount, 'bitcoin')
  })
})
