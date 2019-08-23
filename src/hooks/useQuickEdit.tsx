import { useState } from 'react'
import { useInputState } from './useInputState'
import { ContentEditableEvent } from 'react-contenteditable'

interface Props {
  text: string
  description?: string
}

interface State {
  textEdit: string
  descriptionEdit: string
  isEditOpen: boolean
  setEdits(props: { text?: string; description?: string; isOpen?: boolean }): void
  handleTextEditChange: (e: React.ChangeEvent<HTMLInputElement> | ContentEditableEvent) => void
  handleCancel(): void
  handleDescriptionEditChange: (
    e: React.ChangeEvent<HTMLInputElement> | ContentEditableEvent
  ) => void
}

export const useQuickEdit = (props: Props): State => {
  const [textEdit, setTextEdit, handleTextEditChange] = useInputState(props.text)
  const [descriptionEdit, setDescriptionEdit, handleDescriptionEditChange] = useInputState(
    props.description || ''
  )
  const [isEditOpen, setIsEditOpen] = useState(false)
  const setEdits = (props: { text: string; description: string; isOpen: boolean }): void => {
    const { text, description, isOpen } = props
    if (text != null) setTextEdit(text)
    if (description != null) setDescriptionEdit(description)
    if (isOpen != null) setIsEditOpen(isOpen)
  }
  const handleCancel = (): void => {
    setIsEditOpen(false)
    setTextEdit('')
    setDescriptionEdit('')
  }
  return {
    textEdit,
    descriptionEdit,
    isEditOpen,
    setEdits,
    handleTextEditChange,
    handleDescriptionEditChange,
    handleCancel,
  }
}
