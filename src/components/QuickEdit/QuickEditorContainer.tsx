import React from 'react'
import QuickEdit from './QuickEdit'
import { ContentEditableEvent } from 'react-contenteditable'

interface Props {
  text: string
  description: string
  textPlaceholder?: string
  descPlaceholder?: string
  onTextChange(e: React.ChangeEvent<HTMLInputElement>): void
  onDescChange(e: ContentEditableEvent): void
  onSubmit(): void
  onCancel(): void
}

const QuickEditorContainer: React.FC<Props> = props => {
  return <QuickEdit {...props} />
}

export default QuickEditorContainer
