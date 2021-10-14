
import { TokenInfo } from '@uniswap/token-lists'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '../index'
import { updateStartPrice} from './actions'


export function MyTokenlist(address:String):TokenInfo|undefined {
  let re:TokenInfo|undefined
  const tokenlist = useSelector<AppState, AppState['lists']>(state => {

  //['https://hayek.link/hayekcoinlist.json']['current']>(state => {
  return state.lists
  })
  
  tokenlist.byUrl["https://hayek.link/hayekcoinlist.json"].current?.tokens.map((token)=>{
   
   if(token.address.toString()===address){
    console.log("GGGGGGGGGGGG",token)
     re= token
   }
  } )
  return re
}

export function useConditionOfOrders():[any, (ss:any) => void]  {
  const dispatch = useDispatch<AppDispatch>()
  const ConditionOfOrders1 = useSelector<AppState, AppState['conditionOfOrders']>(state => {
    return state.conditionOfOrders
  })

  const setconditionOfOrders = useCallback(
    (a:any) => {
     
     dispatch(updateStartPrice(a))
    },
    [dispatch]
  )
  return [ConditionOfOrders1.conditionOfOrders,setconditionOfOrders]
}
