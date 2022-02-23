import { useEffect } from 'react'

import {
  Button,
  FormControl,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverArrow,
  PopoverHeader,
  InputRightElement,
  InputLeftElement,
  FormHelperText,
} from '@chakra-ui/react'
import { useContractFunction } from '@usedapp/core'
import { ethers } from 'ethers'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import getContract from '../utils/getContract'

type FormInput = {
  value: number
}

type Props = {
  index: number
}

export default function TipButton({ index }: Props) {
  const { register, handleSubmit } = useForm<FormInput>()
  const { send: sendTip, state } = useContractFunction(getContract(), 'tipByIndex')

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const amount = ethers.utils.parseEther(`${data.value}`)
    await sendTip(index, { value: amount })
  }

  const displayTipState = () => {
    if (state.status === 'Exception') {
      toast.error(state.errorMessage)
    } else if (state.status === 'Mining') {
      toast.loading('Tipping...', { id: 'tip' })
    } else if (state.status === 'Success') {
      toast.success('Successfully tipped', { id: 'tip' })
    } else if (state.status === 'Fail') {
      toast.error('Fail to tip', { id: 'tip' })
    }
  }
  useEffect(displayTipState, [state])

  return (
    <Popover>
      <PopoverTrigger>
        <Button bg="gray.400">Tip</Button>
      </PopoverTrigger>
      <PopoverContent bg="blue.800">
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          Amount (in ether)
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <InputLeftElement pt={2} pointerEvents="none" fontSize="1.5rem" color="black">
              $
            </InputLeftElement>
            <Input {...register('value', { required: true })} />
            <InputRightElement>
              <Button type="submit" bg="gray.400">
                Tip
              </Button>
            </InputRightElement>
            <FormHelperText></FormHelperText>
          </FormControl>
        </form>
      </PopoverContent>
    </Popover>
  )
}
