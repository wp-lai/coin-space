import { InputGroup, Button, InputRightElement, Container, Input } from '@chakra-ui/react'
import { useContractFunction } from '@usedapp/core'
import axios from 'axios'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import coingeckolist from '../utils/coingeckolist.json'
import getContract from '../utils/getContract'

type FormInput = {
  name: string
}

type Props = {
  coins: string[]
}

export default function SubmitForm({ coins }: Props) {
  const { send: sendSubmit } = useContractFunction(getContract(), 'submit')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>()

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    let coin = data.name.trim().toLowerCase()

    // if it's a symbol, convert it to id
    coin = coingeckolist.find((o) => o.symbol === coin)?.id || coin.replace(/[\s.]/g, '-')

    if (coins.includes(coin)) {
      toast.error(`${coin} already submitted by others`)
      return
    }

    axios
      .get(`https://api.coingecko.com/api/v3/coins/${coin}`)
      .then(async (res) => {
        const name = res.data.id
        const symbol = res.data.symbol

        const txn = sendSubmit(name, symbol)

        toast.promise(txn, {
          loading: `Submitting coin ${name}`,
          success: 'Done',
          error: `Error when submitting ${name}`,
        })
      })
      .catch((err) => {
        console.error(err)
        toast.error(`Can't find coin ${coin} in CoinGecko!\nPlease try another coin.`)
        return
      })
  }

  return (
    <>
      <Container width="350px">
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Input
              color="white"
              pr="3.5rem"
              placeholder="Submit your favorite coin here"
              {...register('name', { required: true })}
            />
            <p>{errors.name?.message}</p>
            <InputRightElement width="4.5rem">
              <Button type="submit">Submit</Button>
            </InputRightElement>
          </InputGroup>
        </form>
      </Container>
    </>
  )
}
