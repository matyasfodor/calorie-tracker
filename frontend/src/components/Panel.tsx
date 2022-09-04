import { Card, CardProps } from 'antd'
import isNil from 'lodash.isnil'
import styled from 'styled-components'

const CardWithWidth = ({ maxWidth, ...restProps }: CardProps & { maxWidth?: number }) => {
  return <Card {...restProps} />
}

export const Panel = styled(CardWithWidth)`
  margin: 30px;
  max-width: ${(props) => `${!isNil(props.maxWidth) ? `${props.maxWidth}px` : 'none'}`};
`
