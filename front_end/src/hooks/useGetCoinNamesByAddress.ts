import { useCall } from '@usedapp/core'

import getContract from '../utils/getContract'

type Coin = {
  name: string
  symbol: string
  submitter: string
}

export default function useGetCoinNamesByAddress(account: string): string[] {
  const { value, error } =
    useCall({
      contract: getContract(),
      method: 'getCoinsByAddress',
      args: [account],
    }) ?? {}
  if (error) {
    console.error(error.message)
    return undefined
  }
  return value?.[0].map((o: Coin) => o.name)
}
