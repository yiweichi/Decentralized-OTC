import { Currency, Pair } from 'uniswap-hayek-sdk'
import React, { useState, useContext, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { useTranslation } from 'react-i18next'
import FIATLOGO from '../FIATLOGO'
import { FIAT } from '../../hooks/fait'
import FaitSearchModal from '../SearchModal/FaitSearchModal'



const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ selected, theme }) => (selected ? theme.bg1 : theme.primary1)};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 12px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
    background-color: ${({ selected, theme }) => (selected ? theme.bg2 : darken(0.05, theme.primary1))};
  }
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(DropDown) <{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};

`


interface CurrencyInputPanelProps {
    label?: string
    onTokenSelect?: (currency: Currency) => void
    onCurrencySelect: (fiat: FIAT) => void
    currency?: Currency | null
    fiat?: FIAT | null
    disableCurrencySelect?: boolean
    hideBalance?: boolean
    pair?: Pair | null
    hideInput?: boolean
    otherCurrency?: Currency | null
    id: string
    showCommonBases?: boolean
}

export default function CurrencyInputPanel({
    label = 'Input',
    onTokenSelect,
    onCurrencySelect,
    currency,
    fiat,
    disableCurrencySelect = false,
    hideInput = false,
    otherCurrency,
    id,
    showCommonBases
}: CurrencyInputPanelProps) {
    const { t } = useTranslation()
    const [modalOpen, setModalOpen] = useState(false)
    const [currencyModalOpen, setCurrencyModalOpen] = useState(false)
    const theme = useContext(ThemeContext)

    const handleDismissSearch = useCallback(() => {
        setModalOpen(false)
    }, [setModalOpen])
    const handleDismissSearch2 = useCallback(() => {
        setCurrencyModalOpen(false)
    }, [currencyModalOpen])
    return (
        <InputPanel id={id}>
            <Container hideInput={hideInput}>
                {!hideInput && (
                    <LabelRow>
                        <RowBetween>
                            <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                                {label}
                            </TYPE.body>
                            <TYPE.body
                                color={theme.text2}
                                fontWeight={500}
                                fontSize={14}
                                style={{ display: 'inline' }}
                            >
                                Currency
                            </TYPE.body>
                        </RowBetween>
                    </LabelRow>
                )}
               <div style={{height:"40%",width:"100%",alignItems:"center"}}>
                    <CurrencySelect
                        selected={!!currency}
                        className="open-currency-select-button"
                        onClick={() => {
                            if (!disableCurrencySelect) {
                                setModalOpen(true)
                            }
                        }}
                    >
                        <Aligner>
                            {currency ? (
                                <CurrencyLogo currency={currency ? currency : undefined} size={'24px'} />
                            ) : null}

                            <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                                {(currency && currency.symbol && currency.symbol.length > 20
                                    ? currency.symbol.slice(0, 4) +
                                    '...' +
                                    currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                                    : currency?.symbol) || t('selectToken')}
                            </StyledTokenName>

                            {<StyledDropDown selected={!!currency} />}
                        </Aligner>
                    </CurrencySelect>
                
                    <CurrencySelect
                        selected={!!fiat}
                        style={{ float: "right" }}
                        className="open-fiat-select-button"
                        onClick={() => {
                            setCurrencyModalOpen(true)
                        }}
                    >
                        <Aligner>
                            <FIATLOGO currency={fiat ? fiat : undefined} size={'24px'} />
                            {

                                <StyledTokenName className="token-symbol-container" active={Boolean(fiat && fiat.symbol)}>
                                    {fiat ? fiat.symbol : t('selectToken')}
                                </StyledTokenName>
                            }
                            {<StyledDropDown selected={!!fiat} />}
                        </Aligner>
                    </CurrencySelect>
                 </div>
            </Container>
            {onTokenSelect && (
                <CurrencySearchModal
                    isOpen={modalOpen}
                    onDismiss={handleDismissSearch}
                    onCurrencySelect={onTokenSelect}
                    selectedCurrency={currency}
                    otherSelectedCurrency={otherCurrency}
                    showCommonBases={showCommonBases}
                />
            )}
            <FaitSearchModal
                isOpen={currencyModalOpen}
                onDismiss={handleDismissSearch2}
                onCurrencySelect={onCurrencySelect}
                selectedCurrency={fiat}
            />
        </InputPanel>
    )
}
