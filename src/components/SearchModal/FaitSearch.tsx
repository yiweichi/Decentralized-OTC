
import React, {  RefObject, useCallback, useEffect, useRef, useState } from 'react'
import ReactGA from 'react-ga'
import { useTranslation } from 'react-i18next'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { CloseIcon } from '../../theme'
import { isAddress } from '../../utils'
import Column from '../Column'
import QuestionHelper from '../QuestionHelper'
import  { RowBetween } from '../Row'
import FaitList from './FaitList'
import SortButton from './SortButton'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FIAT } from '../../hooks/fait'

interface FIATSearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: FIAT | null
  onCurrencySelect: (currency: FIAT) => void
  otherSelectedCurrency?: FIAT | null
  showCommonBases?: boolean
  onChangeList: () => void
}
export function FaitSearch({
  selectedCurrency,
  onCurrencySelect,
  onDismiss,
  isOpen,
  onChangeList
}: FIATSearchProps) {
  const { t } = useTranslation()

  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(false)
 

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery)


  useEffect(() => {
    if (isAddressSearch) {
      ReactGA.event({
        category: 'Currency Select',
        action: 'Search by address',
        label: isAddressSearch
      })
    }
  }, [isAddressSearch])



  const handleCurrencySelect = useCallback(
    (currency: FIAT) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback(event => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])



  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn gap="14px">
        <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            Select a token
            <QuestionHelper text="Find a token by searching for its name or symbol or by pasting its address below." />
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <SearchInput
          type="text"
          id="token-search-input"
          placeholder={t('tokenSearchPlaceholder')}
          value={searchQuery}
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
        />
    
        <RowBetween>
          <Text fontSize={14} fontWeight={500}>
            Token Name 
          </Text>
          <SortButton ascending={invertSearchOrder} toggleSortOrder={() => setInvertSearchOrder(iso => !iso)} />
        </RowBetween>
      </PaddedColumn>

      <Separator />

      <div style={{ flex: '1' }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <FaitList
              height={height}
              onCurrencySelect={handleCurrencySelect}
              selectedCurrency={selectedCurrency}
              fixedListRef={fixedList}
            />
          )}
        </AutoSizer>
      </div>
      
    </Column>
  )
}
