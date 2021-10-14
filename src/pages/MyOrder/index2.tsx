import React from 'react'
import { ButtonLight, ButtonPrimary } from '../../components/Button'
import { MySaleBuyOrdersTabs, SwapPoolTabs } from '../../components/NavigationTabs'
import AppBody from '../AppBody'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import MySaleOrder from './mySaleOrder'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useTranslation } from 'react-i18next'

export const Button = styled.button`
  width: 50%;
  font-size: 16px;
  border: none;
  background: none;
  hover:true;
  cursor:pointer;
`

export default function MySaleOrders() {
    const { account } = useActiveWeb3React()
    const toggleWalletModal = useWalletModalToggle()

    const { t } = useTranslation()
    return (
        <AppBody>
            <SwapPoolTabs active={'myOrders'} />
            <ButtonPrimary id="join-pool-button" as={Link} style={{ padding: 16 }} to="/putOrder">
                <Text fontWeight={500} fontSize={20}>
                    {t('Publish')}
                </Text>
            </ButtonPrimary>
            <MySaleBuyOrdersTabs  active={'mySaleOrders'}/>
            {!account ? <ButtonLight onClick={toggleWalletModal}>{t('Connect Wallet')}</ButtonLight>
                : <MySaleOrder/>
            }

        </AppBody>
    )
}
