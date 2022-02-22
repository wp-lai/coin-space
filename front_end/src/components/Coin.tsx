import { Box, Heading, Table, Tbody, Tr, Td, Thead } from '@chakra-ui/react'
import { useCoingeckoPrice } from '@usedapp/coingecko'
import { useEthers } from '@usedapp/core'

import formatAddress from '../utils/formatAddress'
import TipButton from './TipButton'

type Props = {
  name: string
  symbol: string
  submitter: string
  index: number
}

export default function Coin({ name, symbol, submitter, index }: Props) {
  const price = useCoingeckoPrice(name, 'usd')

  const { account } = useEthers()

  return (
    <Box height={350} width={380} shadow="md" borderWidth="1px" bg="blue.800" borderRadius="md">
      <Table variant="simple" color="white">
        <Thead>
          <Tr height={160}>
            <Td>
              <Heading>{name.replace('-', ' ')}</Heading>
            </Td>
            <Td>{account && account.toUpperCase() !== submitter.toUpperCase() && <TipButton index={index} />}</Td>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>symbol</Td>
            <Td>{symbol}</Td>
          </Tr>
          <Tr>
            <Td>price</Td>
            <Td>
              {Number(price).toLocaleString('en-US', {
                style: 'currency',
                currency: 'usd',
              })}
            </Td>
          </Tr>
          <Tr>
            <Td>submitted by</Td>
            <Td>{formatAddress(submitter)}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  )
}
