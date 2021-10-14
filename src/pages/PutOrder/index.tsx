import React, { useCallback, useContext, useState } from 'react'
import { ButtonLight } from '../../components/Button'
import { AddRemoveTabs } from '../../components/NavigationTabs'
import AppBody from '../AppBody'
import styled, { ThemeContext } from 'styled-components'
import { ethers } from 'ethers'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import DepositInputPanel from '../../components/DepositInputPanel'
import { useWrapPutCallback } from '../../hooks/useWrapCallback1'
import { WrapType } from '../../hooks/useWrapCallback'
import { Field } from '../../state/swap/actions'
import { mytryParseAmount, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from '../../state/swap/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { CurrencyAmount, TokenAmount } from 'uniswap-hayek-sdk'
import { AllFait, getFait } from '../../hooks/fait'
import FIATInputPanel from '../../components/FaitInputPanel'
import { ApprovalState, useMyApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import Loader from '../../components/Loader'
import DescribeInputPanel from '../../components/DescribeInputPanel'
import { TYPE } from '../../theme'
import { useTranslation } from 'react-i18next'

export const Input = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  heigth:30%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: pink;
  border-radius: 1px;
  text-align: right
  -webkit-appearance: none;
  font-size: 14px;
`

export default function PutOrder() {
    const { account } = useActiveWeb3React()
    const toggleWalletModal = useWalletModalToggle()
    const { currencies, currencyBalances, parsedAmount } = useDerivedSwapInfo()
    const theme = useContext(ThemeContext);
    const [totalprice, settotalprice] = useState("");
    const [price, setPrice] = useState("");
    const [saleNumber, setSaleNumber] = useState("");

    const ss: TokenAmount | undefined = mytryParseAmount("0.0", currencies[Field.INPUT])

    const [ERC20, setERC20] = useState(ss ? ss.token.address : "");
    const [ERC20Decimal, setERC20Decimal] = useState(ss ? (ss.token.decimals ? ss.token.decimals : 8) : 8)
    const [Currency, setcurrency] = useState("");
    const [SellerDeposit, setSellerDeposit] = useState("");
    const [BuyerDeposit, setBuyerDeposit] = useState("");
    const [descInfo, setdescInfo] = useState<string[]>([]);

    const SellerD = useCallback(() => {
        if (SellerDeposit == "") {
            return "0";
        } else {
            return ethers.utils.parseEther(SellerDeposit).toString()
        }
    }, [SellerDeposit])
    const BuyerD = useCallback(() => {
        if (BuyerDeposit == "") {
            return "0";
        } else {
            return ethers.utils.parseEther(BuyerDeposit).toString()
        }
    }, [BuyerDeposit])

    const priceToWrap = useCallback(() => {
        if (price != "") {
            return ethers.utils.parseUnits(price, 6).toString()
        } else {
            return "0"
        }
    }, [price])


    const { wrapType, execute: onWrap } = useWrapPutCallback(ethers.utils.parseUnits(saleNumber ? saleNumber : "0", currencies[Field.INPUT]?.decimals).toString(), priceToWrap(), JSON.stringify(descInfo), "卖家联系方式", Currency, "0x2aCdAC1d723F307D22684bC69721822f875809AF", ERC20, BuyerD(), SellerD())
    function putOrder() {
        if (onWrap) { onWrap() }
        console.log("ddds",descInfo)
    }


    const { onUserInput, onCurrencySelection } = useSwapActionHandlers()
    const [approval, approveCallback] = useMyApproveCallbackFromTrade(currencyBalances[Field.INPUT])
    const { independentField } = useSwapState()

    const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE

    const parsedAmounts = showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount
        }
        : {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : parsedAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : parsedAmount
        }
    const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
    const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
    console.log("approvalSubmitted", approvalSubmitted);

    const handleMaxInput = useCallback(() => {
        setSaleNumber(maxAmountInput ? maxAmountInput.toExact() : saleNumber)
        if (price != "") {
            settotalprice(ethers.utils.formatUnits(ethers.utils.parseUnits(maxAmountInput ? maxAmountInput.toExact() : saleNumber, 80).mul(ethers.utils.parseUnits(price, 6)), 86))
         
        }
        maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
    }, [maxAmountInput, onUserInput])

    const handleTypeInput = useCallback(
        (value: string) => {

            if (value.indexOf('.') != -1) {
                if (value.length - value.indexOf('.') - 1 <= ERC20Decimal) {
                    setSaleNumber(value)
                    if (price != "") {
                        settotalprice(ethers.utils.formatUnits(value == "" ? "0" : ethers.utils.parseUnits(value, 80).mul(ethers.utils.parseUnits(price, 6)), 86))
                    }
                }
            } else {
                if (value.length <= 78) {
                    setSaleNumber(value)
                    if (price != "") {
                        settotalprice(ethers.utils.formatUnits(value == "" ? "0" : ethers.utils.parseUnits(value, 80).mul(ethers.utils.parseUnits(price, 6)), 86))
                    }
                }
            }
        },
        [price, ERC20Decimal]
    )
    const handleInputSelect = useCallback(
        inputCurrency => {
            setERC20(inputCurrency.address)
            setERC20Decimal(inputCurrency.decimals)
            setApprovalSubmitted(false) // reset 2 step UI for approvals
            onCurrencySelection(Field.INPUT, inputCurrency)
        },
        [onCurrencySelection]
    )
    const handleFaitInput = useCallback(
        (value: string) => {
            if (value.indexOf('.') != -1) {
                if (value.length - value.indexOf('.') - 1 <= 6) {
                    setPrice(value)
                    if (saleNumber != "") {
                        settotalprice(ethers.utils.formatUnits(value == "" ? "0" : ethers.utils.parseUnits(value, 6).mul(ethers.utils.parseUnits(saleNumber, 80)), 86))
                    }
                }
            } else {
                if (value.length <= 60) {
                    setPrice(value)
                    if (saleNumber != "") {
                        settotalprice(ethers.utils.formatUnits(value == "" ? "0" : ethers.utils.parseUnits(value, 6).mul(ethers.utils.parseUnits(saleNumber, 80)), 86))
                    }
                }
            }
            onUserInput(Field.OUTPUT, value)
        },
        [onUserInput, saleNumber]
    )
    const handleFaitInputSelect = useCallback(
        inputCurrency => {
            setcurrency(inputCurrency.symbol)
            setApprovalSubmitted(false) // reset 2 step UI for approvals
            onCurrencySelection(Field.OUTPUT, inputCurrency)
        },
        [onCurrencySelection]
    )
    const handleSellerDepositInput = useCallback(
        (value: string) => {
            if (value.indexOf('.') != -1) {
                if (value.length - value.indexOf('.') - 1 <= 18) {
                    setSellerDeposit(value)
                }
            } else {
                if (value.length <= 78) {
                    setSellerDeposit(value)
                }
            }
        }, []
    )
    const handleBuyerDepositInput = useCallback(
        (value: string) => {
            if (value.indexOf('.') != -1) {
                if (value.length - value.indexOf('.') - 1 <= 18) {
                    setBuyerDeposit(value)
                }
            } else {
                if (value.length <= 78) {
                    setBuyerDeposit(value)
                }
            }
        },
        []
    )

    const handlesetdescInfo = useCallback(
        (value: string[]) => {
            setdescInfo(value)
        },
        []
    )
    
  const { t } = useTranslation()
    return (
        <AppBody>
            <AddRemoveTabs adding={true} />

            <CurrencyInputPanel
                label={t('Token')}
                value={saleNumber}
                showMaxButton={!atMaxAmountInput}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                id="swap-currency-input"
            />

            <div style={{ height: "24px" }} />


            <FIATInputPanel

                price={price}
                onUserInput={handleFaitInput}
                label={t('Unit Price')}
                showMaxButton={false}
                currency={getFait(Currency)}
                onCurrencySelect={handleFaitInputSelect}
                otherCurrency={AllFait()[1]}
                id="swap-currency-output"
            />


            {price != "" && Currency != "" && saleNumber != "" ?
                <><div style={{ height: "24px", width: "100%" }} >
                    <TYPE.body
                        color={theme.text2}
                        fontWeight={500}
                        fontSize={14}
                        style={{ float: "left", marginTop: '5px', marginLeft: '16px' }}
                    >{t('Total Amount')}
                    </TYPE.body>
                    <TYPE.body
                        color={theme.text2}
                        fontWeight={500}
                        fontSize={14}
                        style={{ float: "right", marginTop: '5px', marginRight: '16px' }}
                    >{totalprice}   {Currency}
                    </TYPE.body>  </div>
                </>

                : <></>
            }
            <div style={{ height: "24px", width: "100%" }} />


            <DepositInputPanel
                value={SellerDeposit}
                value2={BuyerDeposit}
                onUserInput={handleSellerDepositInput}
                onUserInput2={handleBuyerDepositInput}
                label={t('Seller Deposit')}
                id="swap-currency-output"

            />
            <div style={{ height: "24px" }} />
            <DescribeInputPanel
                descInfo={descInfo}
                handlesetdescInfo={handlesetdescInfo}
                label={t('Describe')}
                id="swap-currency-output"
            />

            <div style={{ height: "24px" }} />

            {!account ? (
                <ButtonLight onClick={toggleWalletModal}>{t('Connect Wallet')}</ButtonLight>)
                : approval == ApprovalState.UNKNOWN ?
                    <ButtonLight width="100%" disabled={true}>
                        {t('Select Token')}
                    </ButtonLight>
                    : approval == ApprovalState.NOT_APPROVED ?
                        (<ButtonLight onClick={approveCallback} width="100%">
                            {t('Approve')}
                        </ButtonLight>) :
                        approval == ApprovalState.PENDING ?
                            <ButtonLight width="100%" disabled={true}>
                                {t('Approve Pending')}{" "} <Loader></Loader>
                            </ButtonLight>
                            : price != "" && Currency != "" && saleNumber != "" && SellerDeposit != "" && BuyerDeposit != "" ?
                                <ButtonLight onClick={putOrder} width="100%">
                                    {t('Comfirm')}
                                </ButtonLight> :
                                <ButtonLight disabled={true} width="100%">
                                    {t('Complete Order Infos')}
                                </ButtonLight>
            }
        </AppBody>
    )
}



