
import React, { useState, useContext, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import FaitSearchModal from '../SearchModal/FaitSearchModal'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { FIAT } from '../../hooks/fait'
import { useTranslation } from 'react-i18next'
import FIATLOGO from '../FIATLOGO'

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};

`
const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`


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




interface FIATInputPanelProps {
  price: string
  onUserInput: (value: string) => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: FIAT) => void
  currency?: FIAT | null
  disableCurrencySelect?: boolean
  hideInput?: boolean
  otherCurrency?: FIAT | null
  id: string
  showCommonBases?: boolean
}

export default function FIATInputPanel({
  price,
  onUserInput,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideInput = false,
  otherCurrency,
  id
}: FIATInputPanelProps) {

  const { t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(false)
  const theme = useContext(ThemeContext)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])
  console.log("currency ", currency)
  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                {label}
              </TYPE.body>
            </RowBetween>
     

           
          </LabelRow>
        )}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={false}>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={price}
                onUserInput={val => {
                  onUserInput(val)
                }}
              />

            </>
          )}
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
              <FIATLOGO currency={currency ? currency : undefined} size={'24px'} />
              {

                <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                  {(currency?.symbol) || t('selectToken')}
                </StyledTokenName>
              }
              {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <FaitSearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
        />
      )}
    </InputPanel>
  )
}
