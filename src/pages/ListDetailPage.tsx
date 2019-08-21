import React from 'react'
import styled from 'styled-components'
import { Pane } from '../components/Common'

const ListDetailPagePane = styled(Pane)`
  h2.title {
    font-weight: 700;
    font-size: 1.7rem;
  }
  .description {
    color: grey;
  }
`

interface Props {}

export const ListDetailPage: React.FC<Props> = () => {
  return <ListDetailPagePane></ListDetailPagePane>
}
