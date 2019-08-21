import { useState } from 'react'
import { useInputState } from './useInputState'
import { ContentEditableEvent } from 'react-contenteditable'

interface Props {
  text: string
  description: string
}

interface State {
  textEdit: string
  setTextEdit: React.Dispatch<React.SetStateAction<string>>
  handleTextEditChange: (
    e: React.ChangeEvent<HTMLInputElement> | ContentEditableEvent
  ) => void
  descriptionEdit: string
  setDescriptionEdit: React.Dispatch<React.SetStateAction<string>>
  handleDescriptionEditChange: (
    e: React.ChangeEvent<HTMLInputElement> | ContentEditableEvent
  ) => void
  isEditOpen: boolean
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleCancel(): void
}

export const useQuickEdit = (props: Props): State => {
  const [textEdit, setTextEdit, handleTextEditChange] = useInputState(
    props.text || ''
  )
  const [
    descriptionEdit,
    setDescriptionEdit,
    handleDescriptionEditChange,
  ] = useInputState(props.description || '')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const handleCancel = (): void => {
    setIsEditOpen(false)
    setTextEdit('')
    setDescriptionEdit('')
  }
  return {
    textEdit,
    setTextEdit,
    handleTextEditChange,
    descriptionEdit,
    setDescriptionEdit,
    handleDescriptionEditChange,
    isEditOpen,
    setIsEditOpen,
    handleCancel,
  }
}
