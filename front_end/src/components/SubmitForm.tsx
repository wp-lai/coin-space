import { useEffect } from 'react'

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
  const { send: sendSubmit, state } = useContractFunction(getContract(), 'submit')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>()

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    let coin = data.name.trim().toLowerCase()

    // if it's a symbol, convert it to id/name
    coin = coingeckolist.find((o) => o.symbol === coin)?.id || coin.replace(/[\s.]/g, '-')

    if (coins.includes(coin)) {
      toast.error(`${coin} already submitted by others`)
      return
    }

    axios
      .get(`https://api.coingecko.com/api/v3/coins/${coin}`)
      .then(async (res) => {
        const name = res.data.id

        await sendSubmit(name)
      })
      .catch((err) => {
        console.error(err)
        toast.error(`Can't find coin ${coin} in CoinGecko!\nPlease try another coin.`)
        return
      })
  }

  const displaySubmitState = () => {
    if (state.status === 'Exception') {
      toast.error(state.errorMessage)
    } else if (state.status === 'Mining') {
      toast.loading('Submitting...', { id: 'submit' })
    } else if (state.status === 'Success') {
      toast.success('Successfully submitted', { id: 'submit' })
    } else if (state.status === 'Fail') {
      toast.error('Fail to submit', { id: 'submit' })
    }
  }
  useEffect(displaySubmitState, [state])

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
