import React, { useState } from 'react'
import { Link } from '@reach/router'
import styled from 'styled-components'
import { FiChevronRight } from 'react-icons/fi'
const BreadcumbPane = styled.div`
  line-height: 1.5;
  vertical-align: middle;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  margin-bottom: 3px;

  a {
    color: grey;
    :hover {
      color: inherit;
    }
  }
`

interface Path {
  id: string
  title: string
}

interface Props {
  paths: Path[]
}

export const Breadcumb: React.FC<Props> = ({ paths }) => {
  const pathPrepended = [{ id: 'projects', title: '프로젝트' }, ...paths]
  let url = ''
  return (
    <BreadcumbPane>
      {pathPrepended.map((path, i) => {
        url += `/${path.id}`
        return (
          <React.Fragment key={path.id}>
            {i !== 0 && <FiChevronRight color="#aaa" />}
            <Link to={url}>{path.title}</Link>
          </React.Fragment>
        )
      })}
    </BreadcumbPane>
  )
}
