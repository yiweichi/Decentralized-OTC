import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
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


interface CurrencyInputPanelProps {
    value: string
    value2: string
    onUserInput1: (value: string) => void
    onUserInput2: (value: string) => void
    label1?: string
    label2?: string
    label3?: string
    id: string
}

export default function CurrencyInputPanel({
    value,
    value2,
    onUserInput1,
    onUserInput2,
    label1,
    label2,
    label3,
    id,
}: CurrencyInputPanelProps) {

    const theme = useContext(ThemeContext)

    return (
        <InputPanel id={id}>
            <Container hideInput={false}>
           
                    <LabelRow>
                        <RowBetween>
                            <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                                {label3}
                            </TYPE.body>
                            <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                                {label1}
                            </TYPE.body>
                            <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                                {label2}
                            </TYPE.body>
                        </RowBetween>
                    </LabelRow>
           
                <InputRow style={false ? { padding: '0', borderRadius: '8px' } : {}} selected={true}>
                  
                        <>
                            <NumericalInput
                                className="token-amount-input"
                                value={value}
                                onUserInput={val => {
                                    onUserInput1(val)
                                }}
                            /><div style={{paddingRight:"15px",paddingLeft:"15px"}}>  -  </div>
                            <NumericalInput
                                className="token-amount-input"
                                style={{ textAlign: 'right' }}
                                placeholder={"∞"}
                                value={value2}
                                onUserInput={val => {
                                    onUserInput2(val)
                                }}
                            />
                        </>
                  
                </InputRow>
            </Container>
        </InputPanel>
    )
}
