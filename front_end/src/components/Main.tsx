import { useEffect } from 'react'

import { Stack, Text, SimpleGrid, Box, Heading, Center, Spinner } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { utils } from 'ethers'
import { toast } from 'react-hot-toast'

import useGetCoins from '../hooks/useGetCoins'
import formatAddress from '../utils/formatAddress'
import getContract from '../utils/getContract'
import Coin from './Coin'
import SubmitForm from './SubmitForm'

type CoinType = {
  name: string
  symbol: string
  submitter: string
}

export default function Main() {
  const { account, library } = useEthers()
  const coinlist = useGetCoins()

  const addContractEventHandlers = () => {
    if (library && account) {
      const contract = getContract().connect(library)

      contract.on('CoinSubmitted', async (name, symbol, submitter) => {
        if (account && account !== submitter) {
          toast(`${formatAddress(submitter)} submitted a coin ${name}`, {
            icon: '👏',
            duration: 8000,
          })
        }
      })

      contract.on('TipSent', async (from, to, amount, name) => {
        if (to === account) {
          toast(`You received a tip of ${utils.formatEther(amount)} eth from ${formatAddress(from)} for coin ${name}`, {
            icon: '👏',
            duration: 8000,
          })
        }
      })
    }
  }
  useEffect(addContractEventHandlers, [!!library, !!account])

  return coinlist ? (
    <>
      {account && (
        <Box pt={10} pb={4}>
          <SubmitForm coins={coinlist?.map((c: CoinType) => c?.name)} />
        </Box>
      )}
      <Center>
        <Stack>
          <Box p={4}>
            {coinlist.length > 0 && (
              <>
                <Heading color="white">People recommended following {coinlist.length > 1 ? 'coins' : 'coin'}:</Heading>
                {account && <Text color="white">You can tip one by clicking the tip button</Text>}
              </>
            )}
          </Box>
          <SimpleGrid columns={[1, 2, 3]} p={4} width="80vw" minChildWidth={380} spacing="10">
            {coinlist ? (
              coinlist.map(function (coin: CoinType, index: number) {
                return (
                  <Box key={index}>
                    <Coin name={coin.name} symbol={coin.symbol} submitter={coin.submitter} index={index} />
                  </Box>
                )
              })
            ) : (
              <Heading>CoinSpace</Heading>
            )}
          </SimpleGrid>
        </Stack>
      </Center>
    </>
  ) : (
    <Center height="80vh">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Center>
  )
}
