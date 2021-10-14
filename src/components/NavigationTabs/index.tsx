import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { NavLink, Link as HistoryLink } from 'react-router-dom'

import { ArrowLeft } from 'react-feather'
import { RowBetween } from '../Row'
import QuestionHelper from '../QuestionHelper'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 20px;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`
const StyledNavLink2 = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 16px;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`
const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

export function SwapPoolTabs({ active }: { active: 'myOrders' | 'allOrders' }) {
  const { t } = useTranslation()
  return (
    <Tabs style={{ marginBottom: '20px' }}>
      <StyledNavLink id={`swap-nav-link`} to={'/allOrders'} isActive={() => active === 'allOrders'}>
        {t('Sale Orders')}
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/myBuyOrders'} isActive={() => active === 'myOrders'}>
        {t('My Orders')}
      </StyledNavLink>
    </Tabs>
  )
}
export function MySaleBuyOrdersTabs({ active }: { active: 'myBuyOrders' | 'mySaleOrders' }) {
  const { t } = useTranslation()
  return (
    <Tabs style={{ marginBottom: '10px' }}>
      <StyledNavLink2 id={`pool-nav-link`} to={'/myBuyOrders'} isActive={() => active === 'myBuyOrders'}>
        {t('My Buy Orders')}
      </StyledNavLink2>
      <StyledNavLink2 id={`swap-nav-link`} to={'/mySaleOrders'} isActive={() => active === 'mySaleOrders'}>
        {t('My Sale Orders')}
      </StyledNavLink2>
    </Tabs>
  )
}


export function AddRemoveTabs({ adding }: { adding: boolean }) {
  const {t} =useTranslation()
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to="/mySaleOrders">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{t('Publish sale order')}</ActiveText>
        <QuestionHelper
          text={
            adding
              ? ''
              : ''
          }
        />
      </RowBetween>
    </Tabs>
  )
}
