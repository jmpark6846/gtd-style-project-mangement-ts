import React from 'react'
import { Documents } from '../types/Documents'

export interface ContextProps {
  dispatch(props: { type: string; payload: any }): void
}

const DocumentContext = React.createContext<ContextProps>({
  dispatch: () => {},
})

export default DocumentContext
