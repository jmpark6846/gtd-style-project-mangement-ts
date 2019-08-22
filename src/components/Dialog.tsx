import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Box } from './Common'

const DialogBackground = styled.div`
  display: flex;
  background-color: rgba(67, 90, 111, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`

const DialogBox = styled(Box)`
  margin: 0 auto;
  height: fit-content;
  background-color: white;
  margin-top: 40px;
  box-shadow: rgba(67, 90, 111, 0.3) 0px 0px 1px, rgba(67, 90, 111, 0.47) 0px 16px 24px -8px;
  border-width: 0;
  width: 560px;
  max-width: calc(100% - 70px);
`
interface Props {
  onClose(): void
}

const Dialog: React.FC<Props> = props => {
  const boxRef = React.createRef<HTMLDivElement>()
  const closeMenu = useCallback(
    e => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        document.removeEventListener('click', closeMenu)
        props.onClose()
      }
    },
    [boxRef, props]
  )

  useEffect(() => {
    document.addEventListener('click', closeMenu)
    return (): void => document.removeEventListener('click', closeMenu)
  })

  return (
    <DialogBackground>
      <DialogBox ref={boxRef} position="relative">
        {props.children}
      </DialogBox>
    </DialogBackground>
  )
}

export default Dialog
