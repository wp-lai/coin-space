import { useEffect } from 'react'

import { useDisclosure, Flex, Box, Heading, Spacer } from '@chakra-ui/react'
import { Rinkeby, useEthers } from '@usedapp/core'

import AccountModal from '../components/AccountModal'
import ConnectButton from '../components/ConnectButton'

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { account, chainId, library } = useEthers()

  const switchNetwork = () => {
    if (typeof chainId === 'undefined') return
    if (chainId === Rinkeby.chainId) return
    const switchToRinkeby = async () => {
      try {
        // check if the chain to connect to is installed
        await library.send('wallet_switchEthereumChain', [{ chainId: '0x' + Rinkeby.chainId.toString(16) }])
      } catch (error) {
        // This error code indicates that the chain has not been added to MetaMask
        // if it is not, then install it into the user MetaMask
        if (error.code === 4902) {
          try {
            await library.send('wallet_addEthereumChain', [
              {
                chainId: '0x' + Rinkeby.chainId.toString(16), // chainId must be in hexadecimal numbers
                rpcUrl: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
              },
            ])
          } catch (addError) {
            console.error(addError)
          }
        }
        console.error(error)
      }
    }
    switchToRinkeby()
  }
  useEffect(switchNetwork, [chainId, library])

  return (
    <Flex p={5} width="100vw">
      <Box>
        <Heading size="lg" color="white">
          Coin Space
        </Heading>
      </Box>
      <Spacer />
      <Box>
        <ConnectButton handleOpenModal={onOpen} />
      </Box>
      {account && <AccountModal isOpen={isOpen} onClose={onClose} />}
    </Flex>
  )
}
