import { Button, Box, Text, Flex } from '@chakra-ui/react'
import { Rinkeby, useEthers, useEtherBalance } from '@usedapp/core'
import { ethers } from 'ethers'
import { toast } from 'react-hot-toast'

import formatAddress from '../utils/formatAddress'
import Identicon from './Identicon'

type Props = {
  handleOpenModal: () => void
}

export default function ConnectButton({ handleOpenModal }: Props) {
  const { activateBrowserWallet, account, chainId } = useEthers()
  const etherBalance = useEtherBalance(account)

  function connect() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore:next-line
    if (typeof window.ethereum === 'undefined') {
      toast.error('Please install metamask!')
      return
    }
    activateBrowserWallet()
  }

  return account ? (
    chainId === Rinkeby.chainId ? (
      <Flex alignItems="center" background="gray.700" borderRadius="xl">
        <Box px="2">
          <Text color="white" fontSize="md">
            {etherBalance && parseFloat(ethers.utils.formatEther(etherBalance)).toFixed(3)} ETH
          </Text>
        </Box>
        <Button
          onClick={handleOpenModal}
          bg="gray.800"
          border="1px solid transparent"
          _hover={{
            border: '1px',
            borderStyle: 'solid',
            borderColor: 'blue.400',
            backgroundColor: 'gray.700',
          }}
          borderRadius="xl"
          m="1px"
          px={3}
          height="38px"
        >
          <Text color="white" fontSize="md" fontWeight="medium" mr="3">
            {account && formatAddress(account)}
          </Text>
          <Identicon />
        </Button>
      </Flex>
    ) : (
      // account && chainId !== Rinkeby.chainId
      <Button
        onClick={() => {
          toast.error('Please change to Rinkeby Testnet!')
        }}
        bg="gray.800"
        border="1px solid transparent"
        _hover={{
          border: '1px',
          borderStyle: 'solid',
          borderColor: 'blue.400',
          backgroundColor: 'gray.700',
        }}
        borderRadius="xl"
        m="1px"
        px={3}
        height="38px"
      >
        <Text color="white" fontSize="md" fontWeight="medium" mr="3">
          Wrong Network
        </Text>
        <Identicon />
      </Button>
    )
  ) : (
    // !acount
    <Button
      _hover={{
        bg: 'gray.600',
      }}
      background="gray.700"
      onClick={connect}
    >
      <Text color="white">Connect to a wallet</Text>
    </Button>
  )
}
