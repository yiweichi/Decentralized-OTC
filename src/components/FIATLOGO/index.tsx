
import React, { useMemo } from 'react'
import styled from 'styled-components'

import useHttpLocations from '../../hooks/useHttpLocations'
import Logo from '../Logo'
import { FIAT } from '../../hooks/fait'


const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function FIATLOGO({
  currency,
  size = '24px',
  style
}: {
  currency?: FIAT
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency?.logoURI )

  const srcs: string[] = useMemo(() => {
        return [...uriLocations, currency? currency.logoURI:""]
    

  }, [currency, uriLocations])
  
if(currency==undefined){
  return <></>
}else{
  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
}
