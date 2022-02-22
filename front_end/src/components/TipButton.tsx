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
  const { send: sendTip } = useContractFunction(getContract(), 'tip')

  const { register, handleSubmit } = useForm<FormInput>()
  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const amount = ethers.utils.parseEther(`${data.value}`)
    const txn = sendTip(index, { value: amount })
    toast.promise(txn, {
      loading: 'Tipping',
      success: 'Done',
      error: 'Error when tipping',
    })
  }

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
