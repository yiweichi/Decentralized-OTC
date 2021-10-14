
import { ethers } from 'ethers'
import { useMemo } from 'react'
import { MyTokenlist } from '../state/conditionOfOrders/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useActiveWeb3React } from './index'
import { useTradeContract } from './useContract'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP
}

const NOT_APPLICABLE1 = { wrapType1: WrapType.NOT_APPLICABLE }
const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback1(
  id: string, info:string,mvalue: string
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  console.log(account)
  const wethContract = useTradeContract()
  const balance = useCurrencyBalance()
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!wethContract || !chainId) return NOT_APPLICABLE

    const sufficientBalance = true

    if (true) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance
            ? async () => {
              try {
               
                const txReceipt = await wethContract.lockSaleOrder(id,info, { value: mvalue })
                console.log("txxx",txReceipt)
                addTransaction(txReceipt, { summary: `LOCK ORDER: ${id} with ${ethers.utils.formatEther(mvalue)} HYK ` })
          
              } catch (error) {
                console.log('Could not deposit', error)
                alert("ERRER:" + error?.data?.message)
              }
            }
            : undefined,
        inputError: sufficientBalance ? undefined : 'Insufficient ETH balance'
      }
    } else {
      return NOT_APPLICABLE
    }
  }, [wethContract, chainId, balance, addTransaction, mvalue, id,info])
}

export  function useWrapConfirmCallback(
  id: string
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  console.log(account)
  const wethContract = useTradeContract()
  const balance = useCurrencyBalance()
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!wethContract || !chainId) return NOT_APPLICABLE

    const sufficientBalance = true

    if (true) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance
            ? async () => {
              try {
               
                const txReceipt = await wethContract.comfirmTransaction(id)
                addTransaction(txReceipt, { summary: `CONFIRM ORDER: ${id}  ` })
          
              } catch (error) {
                console.log('Could not deposit', error)
                alert("ERRER:" + error?.data?.message)
              }
            }
            : undefined,
        inputError: sufficientBalance ? undefined : 'Insufficient ETH balance'
      }
    } else {
      return NOT_APPLICABLE
    }
  }, [wethContract, chainId, balance, addTransaction, id])
}
export  function useWrapCancelCallback(
  id: string
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  console.log(account)
  const wethContract = useTradeContract()
  const balance = useCurrencyBalance()
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!wethContract || !chainId) return NOT_APPLICABLE

    const sufficientBalance = true

    if (true) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance
            ? async () => {
              try {
               
                const txReceipt = await wethContract.cancelSaleOrder(id)
                addTransaction(txReceipt, { summary: `CANCEL ORDER: ${id}  ` })
          
              } catch (error) {
                console.log('Could not deposit', error)
                alert("ERRER:" + error?.data?.message)
              }
            }
            : undefined,
        inputError: sufficientBalance ? undefined : 'Insufficient ETH balance'
      }
    } else {
      return NOT_APPLICABLE
    }
  }, [wethContract, chainId, balance, addTransaction, id])
}
export function useWrapPutCallback(
  salenumber:string,price:string,describe:string,sellerContactInfo:string,currency:string,arbitration:string,erc20address:string,buyerLiquidataedDamages:string,mvalue: string
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const mtoken = MyTokenlist(erc20address);
  console.log(account)
  const wethContract = useTradeContract()
  const balance = useCurrencyBalance()
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!wethContract || !chainId) return NOT_APPLICABLE

    const sufficientBalance = true

    if (true) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance
            ? async () => {
              try {
               
                const txReceipt = await wethContract.putSaleOrder(salenumber,price,describe,sellerContactInfo,currency,arbitration,erc20address,buyerLiquidataedDamages, { value: mvalue })
                addTransaction(txReceipt, { summary: `PUT ORDER:${ethers.utils.formatUnits(salenumber.toString(), mtoken?.decimals)} ${mtoken?.name} for ${ethers.utils.formatUnits(price.toString(), 6)} ${currency} per ${mtoken?.name} ` })
          
              } catch (error) {
                console.log('Could not deposit', error)
                alert("ERRER:" + error?.data?.message)
              }
            }
            : undefined,
        inputError: sufficientBalance ? undefined : 'Insufficient ETH balance'
      }
    } else {
      return NOT_APPLICABLE
    }
  }, [wethContract, chainId, balance, addTransaction, mvalue, salenumber,price,describe,sellerContactInfo,currency,arbitration,erc20address,buyerLiquidataedDamages])
}
export function useWrapDisputeCallback(
  id: string, x:string,y:string,mvalue:string
): { wrapType1: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId } = useActiveWeb3React()
  const wethContract = useTradeContract()
  const balance = useCurrencyBalance()
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!wethContract || !chainId) return NOT_APPLICABLE1

    const sufficientBalance = true

    if (true) {
      return {
        wrapType1: WrapType.WRAP,
        execute:
          sufficientBalance
            ? async () => {
              try {
               
                const txReceipt = await wethContract.dispute(id,x,y,{ value: mvalue })
                addTransaction(txReceipt, { summary: `DISPUTE ORDER: ${id}  ` })
          
              } catch (error) {
                console.log('Could not deposit', error)
                alert("ERRER:" + error?.data?.message)
              }
            }
            : undefined,
        inputError: sufficientBalance ? undefined : 'Insufficient ETH balance'
      }
    } else {
    }
  }, [wethContract, chainId, balance, addTransaction, mvalue, id,x,y])
}

export function useWrapSurrenderCallback(
  id: string
): { wrapType1: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId } = useActiveWeb3React()
  const wethContract = useTradeContract()
  const balance = useCurrencyBalance()
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!wethContract || !chainId) return NOT_APPLICABLE1

    const sufficientBalance = true

    if (true) {
      return {
        wrapType1: WrapType.WRAP,
        execute:
          sufficientBalance
            ? async () => {
              try {
               
                const txReceipt = await wethContract.surrender(id)
                addTransaction(txReceipt, { summary: `SURRENDER ORDER: ${id}  ` })
          
              } catch (error) {
                console.log('Could not deposit', error)
                alert("ERRER:" + error?.data?.message)
              }
            }
            : undefined,
        inputError: sufficientBalance ? undefined : 'Insufficient ETH balance'
      }
    } else {
    }
  }, [wethContract, chainId, balance, addTransaction, id ])
}

export function useWrapExecuteCallback(
  id: string
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  console.log(account)
  const wethContract = useTradeContract()
  const balance = useCurrencyBalance()
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!wethContract || !chainId) return NOT_APPLICABLE

    const sufficientBalance = true

    if (true) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance
            ? async () => {
              try {
               
                const txReceipt = await wethContract.execute(id)
                addTransaction(txReceipt, { summary: `EXECUTE ORDER: ${id}  ` })
          
              } catch (error) {
                console.log('Could not deposit', error)
                alert("ERRER:" + error?.data?.message)
              }
            }
            : undefined,
        inputError: sufficientBalance ? undefined : 'Insufficient ETH balance'
      }
    } else {
      return NOT_APPLICABLE
    }
  }, [wethContract, chainId, balance, addTransaction, id])
}