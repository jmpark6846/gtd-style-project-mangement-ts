import React from 'react'
import { Box, Button, Input } from '../Common'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'

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
  return (
    <Box>
      <Input placeholder={textPlaceholder} onChange={onTextChange} value={text} />
      <ContentEditable
        html={description || ''}
        placeholder={descPlaceholder}
        onChange={onDescChange}
      />
      <div className="control-pane">
        <div>
          <Button small onClick={onSubmit}>
            추가하기
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
      </div>
    </Box>
  )
}

export default QuickEdit
