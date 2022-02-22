import { useCall } from '@usedapp/core'

import getContract from '../utils/getContract'

export default function useGetCoins() {
  const { value, error } =
    useCall({
      contract: getContract(),
      method: 'getCoins',
      args: [],
    }) ?? {}

  if (error) {
    console.error(error.message)
    return undefined
  } else {
    return value?.[0]
  }
}
