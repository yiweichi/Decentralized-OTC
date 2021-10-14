//import { INITIAL_ALLOWED_SLIPPAGE, DEFAULT_DEADLINE_FROM_NOW } from '../../constants'
import { createReducer } from '@reduxjs/toolkit'
import { TokenInfo } from '@uniswap/token-lists'
import { ethers } from 'ethers'
import { ChainId } from 'uniswap-hayek-sdk'
import { TagInfo, WrappedTokenInfo } from '../lists/hooks'
import {
  updateStartPrice
} from './actions'

export interface conditionOfOrdersState {
  // the timestamp of the last updateVersion actionS
  conditionOfOrders: any
}

function getDefaultWrapToken(): WrappedTokenInfo {
  const taginfo: TagInfo[] = [];
  const tokenInfo: TokenInfo = {
    chainId: ChainId.HAYEK,
    address: "0xb7C8d76587DbE244d25a76555aEBcB2dd77ae4F0",
    name: "USDT",
    decimals: 8,
    symbol: "USDT",
    logoURI: "https://hayek.link/0xb7C8d76587DbE244d25a76555aEBcB2dd77ae4F0.png"
  }
  return new WrappedTokenInfo(tokenInfo, taginfo)
}
export const initialState: conditionOfOrdersState = {
  conditionOfOrders: {
    quantity_min: ethers.utils.parseUnits("0", getDefaultWrapToken().decimals),
    quanity_max: ethers.utils.parseUnits("99999999999999999999999999999999999999999999", getDefaultWrapToken().decimals),
    price_min: ethers.utils.parseUnits("0", 6),
    price_max: ethers.utils.parseUnits("99999999999999999999999999999999", 6),
    currency: {
      symbol: "CNY",
      logoURI: "https://hayek.link/0xC1b231Fdfc5227de9c1555BE657EF00b2b9886BC.png",
      describe: "Chinese currency,人民币",
      sign: "￥"
    }, linenumber: 100, erc20: getDefaultWrapToken(),  sellerDeposit:ethers.utils.parseUnits("0", 18),buyerDeposit:ethers.utils.parseUnits("99999999999999999999", 18),
     myBuyOrderLineNumber: 50, mySellOrderLineNumber: 50
  }
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateStartPrice, (state, { payload: ss }) => {

      state.conditionOfOrders = ss
    })

)
