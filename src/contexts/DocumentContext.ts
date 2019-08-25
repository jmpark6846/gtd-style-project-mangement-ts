import React from 'react'

export interface ContextProps {
  dispatch(props: { type: string; payload: any }): void
}

const DocumentContext = React.createContext<ContextProps>({
  dispatch: () => {},
})

export default DocumentContext
