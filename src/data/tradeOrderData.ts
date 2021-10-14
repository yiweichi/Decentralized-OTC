//import { Token, TokenAmount } from 'uniswap-hayek-sdk'
//import { isBytesLike } from '@ethersproject/bytes'
import { useMemo } from 'react'
import { useActiveWeb3React } from '../hooks'

import { useJudgeContract, useTradeContract } from '../hooks/useContract'
import { useConditionOfOrders } from '../state/conditionOfOrders/hooks'

import { Result, useSingleContractMultipleData } from '../state/multicall/hooks'



interface CallState {
  readonly valid: boolean
  // the result, or undefined if loading or errored/no data
  readonly result: Result | undefined
  // true if the result has never been fetched
  readonly loading: boolean
  // true if the result is not for the latest block
  readonly syncing: boolean
  // true if the call was made and is synced, but the return data is invalid
  readonly error: boolean
}
export function useTradeOrderData(): CallState[] | undefined {
  const [conditionOfOrders] = useConditionOfOrders()

  const contract = useTradeContract(false)
  const quantity_min = conditionOfOrders.quantity_min
  const quanity_max = conditionOfOrders.quanity_max
  const price_min = conditionOfOrders.price_min
  const price_max = conditionOfOrders.price_max
  const currency = conditionOfOrders.currency.symbol
  const linenumber = conditionOfOrders.linenumber.toString()
  const erc20address = conditionOfOrders.erc20.address
  const sellerDeposit = conditionOfOrders.sellerDeposit
  const buyerDeposit = conditionOfOrders.buyerDeposit
  const inputs = useMemo(() => [quantity_min, quanity_max, price_min, price_max, currency, linenumber, erc20address,sellerDeposit,buyerDeposit],
    [quantity_min, quanity_max, price_min, price_max, currency, linenumber, erc20address,sellerDeposit,buyerDeposit]
  )

  const order = useSingleContractMultipleData(contract, 'queryOrder', [inputs])

  return useMemo(() => (order ? order : undefined), order)
}

export function useMyBuyTradeOrderData(): CallState[] | undefined {
  const [conditionOfOrders] = useConditionOfOrders()
  const { account } = useActiveWeb3React()
  const contract = useTradeContract(true)
  const sender = account?.toString()
  const linenumber = conditionOfOrders.myBuyOrderLineNumber.toString()


  const inputs = useMemo(() => [sender, linenumber],
    [sender, linenumber]
  )

  const order = useSingleContractMultipleData(contract, 'getMyBuyOrder', [inputs])
  return useMemo(() => (order ? order : undefined), order)
}

export function useMySaleTradeOrderData(): CallState[] | undefined {
  const [conditionOfOrders] = useConditionOfOrders()
  const { account } = useActiveWeb3React()
  const contract = useTradeContract(true)
  const sender = account?.toString()
  const linenumber = conditionOfOrders.mySellOrderLineNumber.toString()

  const inputs = useMemo(() => [sender, linenumber],
    [sender, linenumber]
  )

  const order = useSingleContractMultipleData(contract, 'getMySaleOrder', [inputs])
  return useMemo(() => (order ? order : undefined), order)
}


export function useSellerDisputeBlockNumberData(): CallState[] | undefined {
  const contract = useTradeContract(true)
  const inputs = useMemo(() => [],
    []
  )

  const order = useSingleContractMultipleData(contract, 'sellerdisputeblocknum', [inputs])
  return useMemo(() => (order ? order : undefined), order)
}
export function useBuyerDisputeBlockNumberData(): CallState[] | undefined {
  const contract = useTradeContract(true)
  const inputs = useMemo(() => [],
    []
  )

  const order = useSingleContractMultipleData(contract, 'buyerdisputeblocknum', [inputs])
  return useMemo(() => (order ? order : undefined), order)
}

export function useDisputeFeeData(judge_address:string,id:any): CallState[] | undefined {
  const contract = useJudgeContract(judge_address,true)
  const inputs = useMemo(() => [id],
    [id]
  )

  const order = useSingleContractMultipleData(contract, 'getArbitrationFee', [inputs])
  return useMemo(() => (order ? order : undefined), order)
}
export function useDisputeResultData(judge_address:string,id:any): CallState[] | undefined {
  const contract = useJudgeContract(judge_address,true)
  const inputs = useMemo(() => [id],
    [id]
  )

  const order = useSingleContractMultipleData(contract, 'getResult', [inputs])
  return useMemo(() => (order ? order : undefined), order)
}