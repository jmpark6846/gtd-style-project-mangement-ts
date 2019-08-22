import React from 'react'
import styled from 'styled-components'
import { Link, RouteComponentProps } from '@reach/router'
import { Pane } from '../components/Common'
import { TodoList } from '../components/Todo/TodoList'

const ListDetailPagePane = styled(Pane)`
  h2.title {
    font-weight: 700;
    font-size: 1.7rem;
  }
  .description {
    color: grey;
  }
`

interface Props extends RouteComponentProps {
  listId?: string
}

export const ListDetailPage: React.FC<Props> = props => {
  const listId = props.listId!

  return (
    <ListDetailPagePane>
      <div className="information-pane">
        {/* <h2 className="title">{dummyDocs[listId].title}</h2>
        <div className="description">{dummyDocs[listId].description}</div> */}
      </div>
      <div className="list"></div>
    </ListDetailPagePane>
  )
}
