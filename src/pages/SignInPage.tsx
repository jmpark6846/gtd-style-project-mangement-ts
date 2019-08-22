import React, { useContext } from 'react'
import { RouteComponentProps } from '@reach/router'
import DocumentContext from '../contexts/DocumentContext'

interface Props extends RouteComponentProps {}

export const SignInPage: React.FC<Props> = () => {
  const { dispatch } = useContext(DocumentContext)

  return <div></div>
}
