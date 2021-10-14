
import React, { useMemo } from 'react'
import styled from 'styled-components'

import useHttpLocations from '../../hooks/useHttpLocations'
import Logo from '../Logo'
import { INFOTYPE } from '../../hooks/describeInfoType'


const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function InfoTypeLOGO({
  currency,
  size = '24px',
  style
}: {
  currency?: INFOTYPE
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
  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.InfoText ?? 'token'} logo`} style={style} />
}
}