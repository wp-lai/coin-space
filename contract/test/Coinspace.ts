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
    await contract.submit('bitcoin')
    const coins = await contract.getCoins()
    expect(coins.length).to.equal(1)
    expect(coins[0].index).to.equal(0)
    expect(coins[0].name).to.equal('bitcoin')
    expect(coins[0].submitter).to.equal(await owner.getAddress())
  })

  it('Can submit by other people', async function () {
    await contract.connect(addr1).submit('bitcoin')
    const coins = await contract.getCoins()
    expect(coins.length).to.equal(1)
    expect(coins[0].index).to.equal(0)
    expect(coins[0].name).to.equal('bitcoin')
    expect(coins[0].submitter).to.equal(await addr1.getAddress())
  })

  it('Cannot submit duplicate coin name', async function () {
    await contract.submit('bitcoin')

    expect(contract.connect(addr1).submit('bitcoin')).to.be.revertedWith('Coin already submitted')
  })

  it('Submit emits event', async function () {
    await expect(contract.submit('bitcoin'))
      .to.emit(contract, 'CoinSubmitted')
      .withArgs(0, 'bitcoin', await owner.getAddress())
  })

  it('Can tip by index', async function () {
    await contract.submit('bitcoin')

    const tipAmount = ethers.utils.parseEther('0.1')

    await expect(await contract.connect(addr1).tipByIndex(0, { value: tipAmount })).to.changeEtherBalance(
      addr1,
      tipAmount.mul(-1),
    )
  })

  it('Can tip by name', async function () {
    await contract.submit('bitcoin')

    const tipAmount = ethers.utils.parseEther('0.1')

    await expect(await contract.connect(addr1).tipByName('bitcoin', { value: tipAmount })).to.changeEtherBalance(
      addr1,
      tipAmount.mul(-1),
    )
  })

  it('TipByIndex emits event', async function () {
    await contract.submit('bitcoin')
    const tipAmount = ethers.utils.parseEther('0.1')

    await expect(contract.connect(addr1).tipByIndex(0, { value: tipAmount }))
      .to.emit(contract, 'TipSent')
      .withArgs(await addr1.getAddress(), await owner.getAddress(), tipAmount, 'bitcoin')
  })

  it('TipByName emits event', async function () {
    await contract.submit('bitcoin')
    const tipAmount = ethers.utils.parseEther('0.1')

    await expect(contract.connect(addr1).tipByName('bitcoin', { value: tipAmount }))
      .to.emit(contract, 'TipSent')
      .withArgs(await addr1.getAddress(), await owner.getAddress(), tipAmount, 'bitcoin')
  })
})
