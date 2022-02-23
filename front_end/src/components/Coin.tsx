import { useEffect, useState } from 'react'

import { Box, Heading, Table, Tbody, Tr, Td, Thead, Stat, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import axios from 'axios'

import formatAddress from '../utils/formatAddress'
import TipButton from './TipButton'

type Props = {
  index: number
  name: string
  submitter: string
}

type CoinInfo = {
  name: string
  symbol: string
  price: number
  priceChangePercentage24h: number
  volume: number
  marketCap: number
}

export default function Coin({ index, name, submitter }: Props) {
  const [coinInfo, setCoinInfo] = useState<CoinInfo>(undefined)
  useEffect(() => {
    axios
      .get(`https://api.coingecko.com/api/v3/coins/${name}`)
      .then(async (res) => {
        setCoinInfo({
          name: res.data.name,
          symbol: res.data.symbol,
          price: res.data.market_data.current_price.usd,
          priceChangePercentage24h: res.data.market_data.price_change_percentage_24h,
          volume: res.data.market_data.total_volume.usd,
          marketCap: res.data.market_data.market_cap.usd,
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }, [name])

  const { account } = useEthers()

  return (
    <Box height={500} width={380} shadow="md" borderWidth="1px" bg="blue.800" borderRadius="md">
      <Table variant="simple" color="white">
        <Thead>
          <Tr height={160}>
            <Td>
              <Heading>{coinInfo?.name || name}</Heading>
            </Td>
            <Td>{account && account.toUpperCase() !== submitter.toUpperCase() && <TipButton index={index} />}</Td>
          </Tr>
        </Thead>
        <Tbody>
          {coinInfo && (
            <>
              <Tr>
                <Td>Symbol</Td>
                <Td>{coinInfo.symbol}</Td>
              </Tr>
              <Tr>
                <Td>Current price</Td>
                <Td pt={8}>
                  <Stat fontSize={18}>
                    <StatNumber>
                      {coinInfo.price.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'usd',
                      })}
                    </StatNumber>
                    <StatHelpText fontSize={14}>
                      24h
                      {'    '}
                      {Math.abs(coinInfo.priceChangePercentage24h).toFixed(2)}
                      {'%'}
                      {coinInfo.priceChangePercentage24h >= 0 ? (
                        <StatArrow type="increase" />
                      ) : (
                        <StatArrow type="decrease" />
                      )}
                    </StatHelpText>
                  </Stat>
                </Td>
              </Tr>
              <Tr>
                <Td>Volume</Td>
                <Td>
                  {coinInfo.volume.toLocaleString('en-Us', {
                    notation: 'compact',
                    maximumFractionDigits: 2,
                  })}
                </Td>
              </Tr>
              <Tr>
                <Td>Market cap</Td>
                <Td>
                  {coinInfo.marketCap.toLocaleString('en-Us', {
                    style: 'currency',
                    currency: 'usd',
                    notation: 'compact',
                    maximumFractionDigits: 2,
                  })}
                </Td>
              </Tr>
            </>
          )}
          <Tr>
            <Td>Submitted by</Td>
            <Td>{formatAddress(submitter)}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  )
}
