import React, { useCallback } from 'react'
import { Box, Button, Input, Pane } from '../Common'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import styled from 'styled-components'

const ControlPane = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`

interface Props {
  text: string
  description?: string
  textPlaceholder?: string
  descPlaceholder?: string
  onTextChange(e: React.ChangeEvent<HTMLInputElement>): void
  onDescChange(e: ContentEditableEvent): void
  onSubmit(): void
  onCancel(): void
  onDelete?(): void
}

let compositionend = true

const QuickEdit: React.FC<Props> = ({
  text,
  description,
  textPlaceholder,
  descPlaceholder,
  onTextChange,
  onDescChange,
  onSubmit,
  onCancel,
  onDelete,
}) => {
  const handleKeyDown = useCallback(
    e => {
      if (e.key === 'Enter') {
        if (!compositionend || text === '') {
          return
        }

        onSubmit()
      } else if (e.key === 'Escape') {
        onCancel()
      }
    },
    [text, onSubmit, onCancel]
  )

  const handleComposition = (event: React.CompositionEvent<HTMLInputElement>): void => {
    compositionend = event.type === 'compositionend'
  }

  return (
    <Box>
      <Input
        placeholder={textPlaceholder}
        onChange={onTextChange}
        onCompositionStart={handleComposition}
        onCompositionUpdate={handleComposition}
        onCompositionEnd={handleComposition}
        onKeyDown={handleKeyDown}
        value={text}
        marginBottom="10px"
        minimal
      />
      <ContentEditable
        className="content-div minimal"
        html={description || ''}
        placeholder={descPlaceholder}
        onChange={onDescChange}
        spellCheck={false}
      />
      <ControlPane>
        <div>
          <Button small onClick={onSubmit} marginRight="7px">
            저장하기
          </Button>
          <Button small onClick={onCancel}>
            취소
          </Button>
        </div>
        {onDelete != null && (
          <div>
            <Button small onClick={onDelete}>
              삭제
            </Button>
          </div>
        )}
      </ControlPane>
    </Box>
  )
}

export default QuickEdit
