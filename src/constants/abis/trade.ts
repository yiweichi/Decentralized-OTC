import { Interface } from '@ethersproject/abi'
import TRADE_ABI from './trade.json'

const TRADE_INTERFACE = new Interface(TRADE_ABI)


const TRADE_ADDRESS = '0x1C5448A33eB289EFca71a9215f680981A062133d'

export default TRADE_INTERFACE
export { TRADE_ABI, TRADE_ADDRESS }
