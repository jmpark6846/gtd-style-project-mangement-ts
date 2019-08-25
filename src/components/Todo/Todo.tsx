import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useQuickEdit } from '../../hooks/useQuickEdit'
import { Document } from '../../types/Document'
import QuickEdit from '../QuickEdit/QuickEdit'
import { Pane } from '../Common'

const TodoPane = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid white;
  border-radius: 5px;
  margin-bottom: 7px;

  :hover {
    color: #000;
  }
`

interface TodoProps {
  todo: Document
  onCheckboxClick(e: any): any
  onChangeTodo(title: string, description: string): void
  onCheck(): void
  onDelete(): void
}

export const Todo: React.FC<TodoProps> = ({
  todo,
  onChangeTodo,
  onCheck,
  onCheckboxClick,
  onDelete,
}) => {
  const { title, description, done } = todo
  const [
    textEdit,
    descriptionEdit,
    isEditOpen,
    setEdits,
    handleTextEditChange,
    handleDescriptionEditChange,
  ] = useQuickEdit({ text: title, description })

  const handleSubmit = useCallback(() => {
    onChangeTodo(textEdit, descriptionEdit)
    setEdits({ isOpen: false })
  }, [textEdit, descriptionEdit, onChangeTodo, setEdits])

  const handleCancel = (): void => setEdits({ text: title, description, isOpen: false })

  return isEditOpen ? (
    <Pane marginTop="8px" marginBottom="15px">
      <QuickEdit
        text={textEdit}
        description={descriptionEdit}
        textPlaceholder="새 할 일"
        descPlaceholder="설명(선택)"
        onTextChange={handleTextEditChange}
        onDescChange={handleDescriptionEditChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onDelete={onDelete}
      />
    </Pane>
  ) : (
    <TodoPane onClick={(): void => setEdits({ isOpen: true })}>
      <Pane marginRight="5px">
        <input type="checkbox" checked={done} onClick={onCheckboxClick} onChange={onCheck} />
      </Pane>
      {title}
    </TodoPane>
  )
}
