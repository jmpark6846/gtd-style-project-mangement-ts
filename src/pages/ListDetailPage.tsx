import React, { useEffect, useContext, useState } from 'react'
import styled from 'styled-components'
import { Link, RouteComponentProps } from '@reach/router'
import { Pane } from '../components/Common'
import { TodoList } from '../components/Todo/TodoList'
import { User } from '../types/User'
import DocumentContext from '../contexts/DocumentContext'
import { db } from '../db'
import { Documents } from '../types/Documents'
import { Document } from '../types/Document'

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
  projectId?: string
  listId?: string
  user: User
  isLoggedin: boolean
}

export const ListDetailPage: React.FC<Props> = props => {
  const { dispatch } = useContext(DocumentContext)
  const [isLoading, setIsLoading] = useState(true)
  const listId = props.listId!
  const projectId = props.projectId!
  useEffect(() => {
    if (props.isLoggedin) {
      const fetchDocument = async (): Promise<void> => {
        try {
          const document = await db
            .collection('documents')
            .where('user', '==', props.user.id)
            .where('id', '==', listId)
            .get()
            .then(snapshot => (snapshot.empty ? {} : snapshot.docs[0].data()))

          const subdocsSnapshot = await db
            .collection('documents')
            .where('user', '==', props.user.id)
            .where('projectId', '==', projectId)
            .where('type', '>', 1)
            .get()

          const docs: Documents = {}
          subdocsSnapshot.forEach(doc => {
            const _doc = doc.data() as Document
            docs[_doc.id] = _doc
          })

          docs[listId] = document as Document
          dispatch({ type: 'SET_DOCUMENTS', payload: docs })
          setIsLoading(false)
        } catch (error) {
          console.error('error fetching documents: ' + error)
        }
      }
      fetchDocument()
    }
  }, [props.isLoggedin])
  return (
    <ListDetailPagePane>
      <div className="information-pane">
        {/* <h2 className="title">{props.documents[listId].title}</h2>
        <div className="description">{dummyDocs[listId].description}</div> */}
      </div>
      <div className="list"></div>
    </ListDetailPagePane>
  )
}
