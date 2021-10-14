import { stringify } from 'qs'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import useToggledVersion, { Version } from '../../hooks/useToggledVersion'
import { MouseoverTooltip } from '../Tooltip'

const VersionLabel = styled.span<{ enabled: boolean }>`
  padding: 0.35rem 0.6rem;
  border-radius: 12px;
  background: ${({ theme, enabled }) => (enabled ? theme.primary1 : 'none')};
  color: ${({ theme, enabled }) => (enabled ? theme.white : theme.text1)};
  font-size: 1rem;
  font-weight: ${({ enabled }) => (enabled ? '500' : '400')};
  :hover {
    user-select: ${({ enabled }) => (enabled ? 'none' : 'initial')};
    background: ${({ theme, enabled }) => (enabled ? theme.primary1 : 'none')};
    color: ${({ theme, enabled }) => (enabled ? theme.white : theme.text1)};
  }
`

interface VersionToggleProps extends React.ComponentProps<typeof Link> {
  enabled: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VersionToggle = styled(({ enabled, ...rest }: VersionToggleProps) => <Link {...rest} />)<VersionToggleProps>`
  border-radius: 12px;
  opacity: ${({ enabled }) => (enabled ? 1 : 0.5)};
  cursor: ${({ enabled }) => (enabled ? 'pointer' : 'default')};
  background: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.primary1};
  display: flex;
  width: fit-content;
  margin-left: 0.5rem;
  text-decoration: none;
  :hover {
    text-decoration: none;
  }
`

export default function VersionSwitch() {
  const version = useToggledVersion()
  const location = useLocation()
  const query = useParsedQueryString()
 // const versionSwitchAvailable = location.pathname === '/swap' || location.pathname === '/send'
 const versionSwitchAvailable = false

  const toggleDest = useMemo(() => {
    return versionSwitchAvailable
      ? {
          ...location,
          search: `?${stringify({ ...query, use: version === Version.v1 ? undefined : Version.v1 })}`
        }
      : location
  }, [location, query, version, versionSwitchAvailable])

  const handleClick = useCallback(
    e => {
      window.location.href="https://hayek.link/trade";
      if (!versionSwitchAvailable) e.preventDefault()
    },
    [versionSwitchAvailable]
  )

  const { t } = useTranslation()
  const toggle = (
    <VersionToggle enabled={versionSwitchAvailable} to={toggleDest} onClick={handleClick}>
    
    <VersionLabel enabled={version === Version.v2 || !versionSwitchAvailable}>{t('Uniswap on HAYEK')}</VersionLabel>
   <VersionLabel enabled={version === Version.v1 && versionSwitchAvailable}></VersionLabel>
  
    </VersionToggle>
  )

  return versionSwitchAvailable ? (
    toggle
  ) : (
    <MouseoverTooltip text={t('Token to Token exchange')}>{toggle}</MouseoverTooltip>
  )
}
