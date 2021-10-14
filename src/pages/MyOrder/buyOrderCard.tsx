
import React, { ReactNode, useContext, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { darken } from 'polished'
import styled, { ThemeContext } from 'styled-components'
import { ButtonSecondary } from '../../components/Button'
import Card from '../../components/Card'
import { TYPE } from '../../theme'
import { AutoColumn } from '../../components/Column'
import Row, { RowBetween, RowFixed } from '../../components/Row'
import { MyTokenlist } from '../../state/conditionOfOrders/hooks'
import QuestionHelper from '../../components/QuestionHelper'
import Copy from '../../components/AccountDetails/Copy'
import ListLogo from '../../components/ListLogo'
import { getFait } from '../../hooks/fait'
import { useWrapDisputeCallback } from '../../hooks/useWrapCallback1'
import { ethers } from 'ethers'
import { useBlockNumber } from '../../state/application/hooks'
import { useGetDisputeFeeCallBack } from '../../hooks/useApproveCallback'
import { useTranslation } from 'react-i18next'
import { getInfoType, INFOTYPE } from '../../hooks/describeInfoType'
import InfoTypeLOGO from '../../components/InfoTypeLogo'

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
export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`
export const HoverCard = styled(Card)`
  
  border: 1px solid ${({ theme }) => theme.bg2};
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`

export default function BuyOrderCard(props: any, border: any) {
    const theme = useContext(ThemeContext)
    const [showMore, setShowMore] = useState(false)
    let BlockNumber = useBlockNumber()
    const mtoken = MyTokenlist(props.pair.erc20address);
    let disputeFee = useGetDisputeFeeCallBack(props.pair.arbitration.toString(), props.pair.id)
    const generateTotalAmount = (() => {
        return (<TYPE.black fontSize={14} color={theme.text1}>{ethers.utils.formatUnits(props.pair.price.mul(props.pair.salenumber).toString(), (mtoken ? mtoken.decimals : 0) + 6) + " " + props.pair.Currency}</TYPE.black >)

    })
    function infoDescribe(infotype: string, info: string, i: number, infodescribe: string, tempINFOTYPE?: INFOTYPE): ReactNode | undefined {
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
                    {infotype === "Telegram" ? (
                        <TYPE.black fontSize={14} color={theme.text1}>
                            {info && (
                                <a href={"https://t.me/" + info} target="_blank">{info}</a>
                            )} </TYPE.black>) : infotype === "QQ" ? (
                                <TYPE.black fontSize={14} color={theme.text1}>
                                    {info && (
                                        <a href={"http://wpa.qq.com/msgrd?v=3&uin=" + info + "&site=qq&menu=yes"} target="_blank">{info}</a>
                                    )} </TYPE.black>)
                        : (<TYPE.black fontSize={14} color={theme.text1}>
                            {info && (
                                <Copy toCopy={info}>
                                    <span style={{ marginLeft: '4px' }}> {ellipsis(info)}</span>
                                </Copy>
                            )} </TYPE.black>)}

                </RowBetween>
            </FixedHeightRow>
        )
    }
    function HandleDescribe() {
        let aa;
        aa = Object.values(JSON.parse(props.pair.describe));
        return (
            aa?.map((item, i) => {
                let item1: string = typeof (item) == "string" ? item : ""
                let infotype: string = item1?.split(':')[0];
                const tempINFOTYPE = getInfoType(infotype);
                let infodescribe: string | undefined = getInfoType(infotype)?.Describe;
                let info: string = item1?.split(':')[1];
                return (
                    infoDescribe(infotype, info, i, infodescribe ? infodescribe : "", tempINFOTYPE)
                )

            })
        )
    }
    function HandleDisputeButton() {
        if ((props.pair.lockedblocknumber.add(props.BuyerDisputableBlockNumber)).gte(BlockNumber)) {
            return (<ButtonSecondary width="100%" onClick={dispute} disabled={true}>Waitting seller confirm <QuestionHelper text={"You can dispute this order after " + props.pair.lockedblocknumber.add(props.BuyerDisputableBlockNumber).sub(BlockNumber).toString() + " blocks"} /></ButtonSecondary>)
        } else {
            return (<ButtonSecondary width="100%" onClick={dispute} >Dispute</ButtonSecondary>)
        }
    }
    const { wrapType1, execute: onWrap, inputError: wrapInputError } = useWrapDisputeCallback(props.pair.id, "0", "0", disputeFee)
    function dispute() {
        console.log("fffffffff", wrapType1, "fffffffffff", wrapInputError, "fffffffff", onWrap)
        if (onWrap) { onWrap() }
    }

    const { t } = useTranslation()
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
                            <TYPE.main id="num">{ethers.utils.formatUnits(props.pair.salenumber.toString(), mtoken?.decimals)}</TYPE.main>
                        </Row>
                    </RowFixed>
                    <RowFixed>
                        <Row>
                            <TYPE.main id="price">{ethers.utils.formatUnits(props.pair.price.toString(), 6)}{getFait(props.pair.Currency)?.sign}</TYPE.main>
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
                                    {ethers.utils.formatUnits(props.pair.price, 6) + " " + props.pair.Currency}
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
                                    {ethers.utils.formatUnits(props.pair.salenumber, mtoken ? mtoken.decimals : 0) + " " + mtoken?.name}
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
                                        {t('Buyer Address')}
                                    </TYPE.black>

                                </RowFixed>
                                <TYPE.black fontSize={14} color={theme.text1}>
                                    {props.pair.buyer.toString() && (
                                        <Copy toCopy={props.pair.buyer.toString()}>
                                            <span style={{ marginLeft: '4px' }}> {props.pair.buyer.toString().substring(0, 6) + "..." + props.pair.seller.toString().substring(38)}</span>
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
                                    <QuestionHelper text="Seller Security Deposit" />
                                </RowFixed>
                                <TYPE.black fontSize={14} color={theme.text1}>
                                    {ethers.utils.formatEther(props.pair.sellerLiquidataedDamages.toString())} HYK
                                </TYPE.black>
                            </RowBetween>
                        </FixedHeightRow>
                        <FixedHeightRow>
                            <RowBetween>
                                <RowFixed>
                                    <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                                        {t('Buyer SEC DEP')}
                                    </TYPE.black>
                                    <QuestionHelper text="Buyer Security Deposit" />
                                </RowFixed>
                                <TYPE.black fontSize={14} color={theme.text1}>
                                    {ethers.utils.formatEther(props.pair.buyerLiquidataedDamages.toString())} HYK
                                </TYPE.black>
                            </RowBetween>
                        </FixedHeightRow>
                        <FixedHeightRow>
                            <RowBetween>
                                <RowFixed>
                                    <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                                        {t('Locked Block Number')}
                                    </TYPE.black>
                                    <QuestionHelper text="The Block Number of Buyer locked this order" />
                                </RowFixed>
                                <TYPE.black fontSize={14} color={theme.text1}>
                                    {props.pair.lockedblocknumber.toString()}
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
                        {HandleDisputeButton()}


                    </AutoColumn>
                )}
            </AutoColumn>
        </HoverCard>
    )
}

