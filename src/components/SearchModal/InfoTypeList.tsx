import React, { CSSProperties, MutableRefObject, useCallback } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Column from '../Column'
import { MouseoverTooltip } from '../Tooltip'
import { MenuItem } from './styleds'
import { AllInfoType, INFOTYPE } from '../../hooks/describeInfoType'
import InfoTypeLOGO from '../InfoTypeLogo'



const Tag = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`



const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

function TokenTags({ currency }: { currency: INFOTYPE }) {
    if (!(currency instanceof WrappedTokenInfo)) {
        return <span />
    }

    const tags = currency.tags
    if (!tags || tags.length === 0) return <span />

    const tag = tags[0]

    return (
        <TagContainer>
            <MouseoverTooltip text={tag.description}>
                <Tag key={tag.id}>{tag.name}</Tag>
            </MouseoverTooltip>
            {tags.length > 1 ? (
                <MouseoverTooltip
                    text={tags
                        .slice(1)
                        .map(({ name, description }) => `${name}: ${description}`)
                        .join('; \n')}
                >
                    <Tag>...</Tag>
                </MouseoverTooltip>
            ) : null}
        </TagContainer>
    )
}

function FaitRow({
    currency,
    onSelect,
    isSelected,
    otherSelected,
    style
}: {
    currency: INFOTYPE
    onSelect: () => void
    isSelected: boolean
    otherSelected: boolean
    style: CSSProperties
}) {

    // only show add or remove buttons if not on selected list
    return (
        <MenuItem
            style={style}
            onClick={() => (isSelected ? null : onSelect())}
            disabled={isSelected}
            selected={otherSelected}
        >
            
                    <InfoTypeLOGO currency={currency} size={'24px'} />
               
                <Column>
                    <text key={currency?.InfoText} fontWeight={500}>
                        {currency.InfoText}
                    </text>
                </Column>
                <TokenTags currency={currency} />
            
        </MenuItem>

    )
}
function fiatEquals(A: INFOTYPE, B: INFOTYPE): boolean {
    return (A.InfoText === B.InfoText)
}
export default function InfoTypeList({
    height,
    selectedCurrency,
    onCurrencySelect,
    otherCurrency,
    fixedListRef
}: {
    height: number
    selectedCurrency?: INFOTYPE | null
    onCurrencySelect: (currency: INFOTYPE) => void
    otherCurrency?: INFOTYPE | null
    fixedListRef?: MutableRefObject<FixedSizeList | undefined>

}) {

    const itemDate = AllInfoType()

    const Row = useCallback(
        ({ data, index, style }) => {
            const currency: INFOTYPE = data[index]
            const isSelected = Boolean(selectedCurrency && fiatEquals(selectedCurrency, currency))
            const otherSelected = Boolean(otherCurrency && fiatEquals(otherCurrency, currency))
            const handleSelect = () => onCurrencySelect(currency)
            return (
                <FaitRow
                    style={style}
                    currency={currency}
                    isSelected={isSelected}
                    onSelect={handleSelect}
                    otherSelected={otherSelected}
                />
            )
        },
        [onCurrencySelect, otherCurrency, selectedCurrency]
    )

    const itemKey = useCallback((index: number, data: any) => data[index].toString(), [])

    return (
        <FixedSizeList
            height={height}
            ref={fixedListRef as any}
            width="100%"
            itemData={itemDate}
            itemCount={itemDate.length}
            itemSize={56}
            itemKey={itemKey}
        >

            {Row}
        </FixedSizeList>
    )
}
