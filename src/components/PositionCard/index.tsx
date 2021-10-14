import { JSBI, Pair } from 'uniswap-hayek-sdk'
import { darken } from 'polished'
import React, { ReactNode, useContext, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { useTotalSupply } from '../../data/TotalSupply'
import { ButtonSecondary } from '../Button'
import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { TYPE } from '../../theme'
import Card, { GreyCard } from '../Card'
import { AutoColumn } from '../Column'
import DoubleCurrencyLogo from '../DoubleLogo'
import Row, { RowBetween, RowFixed } from '../Row'
import { MyTokenlist } from '../../state/conditionOfOrders/hooks'
import QuestionHelper from '../QuestionHelper'
import Copy from '../AccountDetails/Copy'
import ListLogo from '../ListLogo'
import { getFait } from '../../hooks/fait'
import useWrapCallback1 from '../../hooks/useWrapCallback1'
import { ethers } from "ethers";
import { useTranslation } from 'react-i18next'
import { getInfoType, INFOTYPE } from '../../hooks/describeInfoType'
import InfoTypeLOGO from '../InfoTypeLogo'
export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`
export const CryptoInput = styled.textarea`
position: relative;
display: flex;
padding: 16px;
align-items: center;
width: 100%;
white-space: nowrap;
background: none;
border: 1px solid;
outline: none;
border-radius: 12px;
text-align: left
-webkit-appearance: none;
font-size: 14px;

`
export const HoverCard = styled(Card)`
  
  border: 1px solid ${({ theme }) => theme.bg2};
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`


interface PositionCardProps {
  pair: Pair
  showUnwrapped?: boolean
  border?: string
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const [token0Deposited, token1Deposited] =
    !!pair &&
      !!totalPoolTokens &&
      !!userPoolBalance &&
      // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
      JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
        pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
        pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
      ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && (
        <GreyCard border={border}>
          <AutoColumn gap="12px">
            <FixedHeightRow>
              <RowFixed>
                <Text fontWeight={500} fontSize={16}>
                  Your position
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
                <Text fontWeight={500} fontSize={20}>
                  {currency0.symbol}/{currency1.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontWeight={500} fontSize={20}>
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text color="#888D9B" fontSize={16} fontWeight={500}>
                  {currency0.symbol}:
                </Text>
                {token0Deposited ? (
                  <RowFixed>
                    <Text color="#888D9B" fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text color="#888D9B" fontSize={16} fontWeight={500}>
                  {currency1.symbol}:
                </Text>
                {token1Deposited ? (
                  <RowFixed>
                    <Text color="#888D9B" fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </GreyCard>
      )}
    </>
  )
}

function Crypto(props: { info: React.Key | undefined, handleHashComfirm: any }) {
  const theme = useContext(ThemeContext)
  const [cryptoInfo, setcryptoInfo] = useState("")
  const handleInputCryproInfo = (event: any) => {
    setcryptoInfo(event.target.value)
    if (props.info == ethers.utils.id(event.target.value)) {
      props.handleHashComfirm(3)
    } else {
      props.handleHashComfirm(2)
    }
  }
  const {t}=useTranslation()
  return (
    <div>
      <FixedHeightRow key={props.info}>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              {t('Please Input Crypto Contract Item')}
            </TYPE.black>
            <QuestionHelper text="This order include a crypto contract item.please contact this seller to get this crypto contract item" />
          </RowFixed>
        </RowBetween>
      </FixedHeightRow>
      <CryptoInput value={cryptoInfo} onClick={async () => {
        navigator?.clipboard?.readText()?.then(text => {
          setcryptoInfo(text);
        })
      }}
        onChange={handleInputCryproInfo}
      />
    </div>
  )
}

export default function FullPositionCard(props: any, border: any) {
  const theme = useContext(ThemeContext)
  const [showMore, setShowMore] = useState(false)
  const [contactInfo, setcontactInfo] = useState("")
  const mtoken = MyTokenlist(props.pair.erc20address);
  const generateTotalAmount = (() => {
    return (<TYPE.black fontSize={14} color={theme.text1}>{ethers.utils.formatUnits(props.pair.price.mul(props.pair.salenumber).toString(), (mtoken ? mtoken.decimals : 0) + 6) + " " + props.pair.Currency}</TYPE.black >)

  })
  function infoDescribe(infotype: string, info: string, i: number,infodescribe:string,tempINFOTYPE?:INFOTYPE): ReactNode | undefined {
    const ellipsis = (a: string) => {
      if (a.length > 20) {
        return a.substring(0, 20) + "..."
      }
      return a
    }

      return (
        
        <FixedHeightRow key={i}>
          <RowBetween>
            <RowFixed>
              
            <InfoTypeLOGO currency={tempINFOTYPE} size={'24px'} />
              <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                {t(infotype)}:
              </TYPE.black>
              <QuestionHelper text={t(infodescribe)} />
            </RowFixed>
            {infotype==="Telegram"? (
                <TYPE.black fontSize={14} color={theme.text1}>
              {info && (
              <a href={"https://t.me/"+info} target="_blank">{info}</a>
              )} </TYPE.black>):infotype==="QQ"? (
                <TYPE.black fontSize={14} color={theme.text1}>
              {info && (
              <a href={"http://wpa.qq.com/msgrd?v=3&uin="+info+"&site=qq&menu=yes"} target="_blank">{info}</a>
              )} </TYPE.black>) 
              :(  <TYPE.black fontSize={14} color={theme.text1}>
                {info && (
                  <Copy toCopy={info}>
                    <span style={{ marginLeft: '4px' }}> {ellipsis(info)}</span>
                  </Copy>
                )} </TYPE.black>)}
           
          </RowBetween>
        </FixedHeightRow>
      )
  }

  const [hashComfirm, sethashComfirm] = useState(0)
  function handleHashComfirm(a: number) {
    sethashComfirm(a);
  }

  function HandleDescribe() {

    let aa;

      aa = Object.values(JSON.parse(props.pair.describe));

    let num=0
    return (
      aa?.map((item, i) => {
        let item1: string = typeof (item) == "string" ? item : ""
        let infotype: string = item1?.split(':')[0];
        const tempINFOTYPE=getInfoType(infotype);
        let infodescribe:string|undefined=getInfoType(infotype)?.Describe;
        let info: string = item1?.split(':')[1];
        if(num<1&&(infotype == "CryptoContract")){
          num=num+1
          if (hashComfirm == 0) {
            sethashComfirm(1)
          }
          return <Crypto info={info} key={info} handleHashComfirm={handleHashComfirm}></Crypto>
        }
        return (
          infoDescribe(infotype, info, i,infodescribe? infodescribe:"",tempINFOTYPE)
        )
      })
    )
  }
  function handleLockButton() {
    if (hashComfirm == 1) {
      return (
        <ButtonSecondary width="100%"  disabled={true}>
         {t('Please input Crypto contract')}
        </ButtonSecondary>)
        }if(hashComfirm == 2){
          return (
            <ButtonSecondary width="100%"  disabled={true}>
             {t('Please input correct crypto contract')}
            </ButtonSecondary>)
        }else{
          return (
            <ButtonSecondary width="100%" onClick={lock}>
             {t('Lock')}
            </ButtonSecondary>)
        }
  }


  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback1(props.pair.id, contactInfo, props.pair.buyerLiquidataedDamages)
  function lock() {
    if (hashComfirm==0||hashComfirm==3) {
      console.log("fffffffff", wrapType, "fffffffffff", wrapInputError, "fffffffff", onWrap)
      if (onWrap) { onWrap() }
    }
  }
  const ellipsisPriceAndNumber = (a: string) => {
    if (a.length > 10) {
      return a.substring(0, 10) + "..."
    }
    return a
  }
  const {t}=useTranslation()
  return (
    <HoverCard border={border}>
      <AutoColumn gap="12px">
        <FixedHeightRow onClick={() => setShowMore(!showMore)} style={{ cursor: 'pointer' }}>
          <RowFixed>
            <Row>
              {mtoken ? (
                <ListLogo
                  style={{ marginRight: 12 }}
                  logoURI={mtoken.logoURI ? mtoken.logoURI : ""}
                  alt={`${mtoken.name} list logo`}
                />
              ) : null
              }
              <TYPE.main id="ERC20">{mtoken?.name}</TYPE.main>
            </Row>
          </RowFixed>
          <RowFixed>
            <Row>
              <TYPE.main id="num">{ellipsisPriceAndNumber(ethers.utils.formatUnits(props.pair.salenumber, mtoken?.decimals))}</TYPE.main>
            </Row>
          </RowFixed>
          <RowFixed>
            <Row>
              <TYPE.main id="price">{ellipsisPriceAndNumber(ethers.utils.formatUnits(props.pair.price, 6))}{getFait(props.pair.Currency)?.sign}</TYPE.main>
            </Row>
          </RowFixed>
          <RowFixed>
            {showMore ? (
              <ChevronUp size="20" style={{ marginLeft: '10px' }} />
            ) : (
              <ChevronDown size="20" style={{ marginLeft: '10px' }} />
            )}
          </RowFixed>
        </FixedHeightRow>
        {showMore && (
          <AutoColumn gap="8px">

            <FixedHeightRow>
              <RowBetween>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    {t('Order ID')}
                  </TYPE.black>
                  <QuestionHelper text="Each order has a unique ID." />
                </RowFixed>
                <TYPE.black fontSize={14} color={theme.text1}>
                  {props.pair.id.toString()}
                </TYPE.black>
              </RowBetween>
            </FixedHeightRow>

            <FixedHeightRow>
              <RowBetween>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    {t('Price')}
                  </TYPE.black>
                </RowFixed>
                <TYPE.black fontSize={14} color={theme.text1}>
                {ethers.utils.formatUnits(props.pair.price,6)+" "+props.pair.Currency}
                </TYPE.black>
              </RowBetween>
            </FixedHeightRow>

            <FixedHeightRow>
              <RowBetween>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                   {t('Sale Number')}
                  </TYPE.black>
                </RowFixed>
                <TYPE.black fontSize={14} color={theme.text1}>
                {ethers.utils.formatUnits(props.pair.salenumber,mtoken?mtoken.decimals : 0)+" "+mtoken?.name}
                </TYPE.black>
              </RowBetween>
            </FixedHeightRow>

            <FixedHeightRow>
              <RowBetween>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    {t('Total Amount')}
                  </TYPE.black>
                  <QuestionHelper text="Total Amount = Price * saleNumber" />
                </RowFixed>
                {generateTotalAmount()}
              </RowBetween>
            </FixedHeightRow>

            <FixedHeightRow>
              <RowBetween>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    {t('Seller Address')}
                  </TYPE.black>

                </RowFixed>
                <TYPE.black fontSize={14} color={theme.text1}>
                  {props.pair.seller.toString() && (
                    <Copy toCopy={props.pair.seller.toString()}>
                      <span style={{ marginLeft: '4px' }}> {props.pair.seller.toString().substring(0, 6) + "..." + props.pair.seller.toString().substring(38)}</span>
                    </Copy>
                  )} </TYPE.black>

              </RowBetween>
            </FixedHeightRow>

            <FixedHeightRow>
              <RowBetween>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    {t('Seller SEC DEP')}
                  </TYPE.black>
                  <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
                </RowFixed>
                <TYPE.black fontSize={14} color={theme.text1}>
                  {ethers.utils.formatEther(props.pair.sellerLiquidataedDamages)} HYK
                </TYPE.black>
              </RowBetween>
            </FixedHeightRow>
            <FixedHeightRow>
              <RowBetween>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    {t('Buyer SEC DEP')}
                  </TYPE.black>
                  <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
                </RowFixed>
                <TYPE.black fontSize={14} color={theme.text1}>
                  {ethers.utils.formatEther(props.pair.buyerLiquidataedDamages)} HYK
                </TYPE.black>
              </RowBetween>
            </FixedHeightRow>
            <FixedHeightRow>
              <RowBetween>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    {t('Describe')}:
                  </TYPE.black>
                </RowFixed>
              </RowBetween>
            </FixedHeightRow>
            <HoverCard border={border}>
            {HandleDescribe() ? HandleDescribe() : <></>}
            </HoverCard>
            <FixedHeightRow>
              <RowBetween>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    {t('Buyer contact info')}
                  </TYPE.black>
                  <QuestionHelper text="Your contact info" />
                </RowFixed>
                <input onChange={(e) => { setcontactInfo(e.target.value) }}>
                </input>
              </RowBetween>
            </FixedHeightRow>

           {handleLockButton()}

          </AutoColumn>
        )}
      </AutoColumn>
    </HoverCard>
  )
}
