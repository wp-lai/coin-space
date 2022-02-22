import { Box, Divider } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

import Header from '../components/Header'
import Main from '../components/Main'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Coin Space</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <Box height="100vh" overflow="auto" backgroundColor="rgb(33, 36, 41)">
        <Header />
        <Divider />
        <Main />
      </Box>
    </>
  )
}

export default Home
