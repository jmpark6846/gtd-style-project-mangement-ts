import React from 'react'
import { ContextProps } from '../types/ContextProps'
import { Documents } from '../types/Documents'

interface DocumentContextProps extends ContextProps {
  documents: Documents
}
const DocumentContext = React.createContext<DocumentContextProps>({
  documents: {},
  dispatch: () => {},
})

export default DocumentContext
