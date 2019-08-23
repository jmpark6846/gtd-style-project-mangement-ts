import { useState } from 'react'
import { useInputState } from './useInputState'
import { ContentEditableEvent } from 'react-contenteditable'

interface Props {
  text: string
  description?: string
}

export const useQuickEdit = (
  props: Props
): [
  string,
  string,
  boolean,
  (props: { text?: string; description?: string; isOpen?: boolean }) => void,
  (e: React.ChangeEvent<HTMLInputElement> | ContentEditableEvent) => void,
  (e: React.ChangeEvent<HTMLInputElement> | ContentEditableEvent) => void,
  () => void
] => {
  const [textEdit, setTextEdit, handleTextEditChange] = useInputState(props.text)
  const [descriptionEdit, setDescriptionEdit, handleDescriptionEditChange] = useInputState(
    props.description || ''
  )
  const [isEditOpen, setIsEditOpen] = useState(false)
  const setEdits = (props: { text?: string; description?: string; isOpen?: boolean }): void => {
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
  return [
    textEdit,
    descriptionEdit,
    isEditOpen,
    setEdits,
    handleTextEditChange,
    handleDescriptionEditChange,
    handleCancel,
  ]
}
