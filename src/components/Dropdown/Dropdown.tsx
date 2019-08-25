import React, { useCallback, useEffect, useState } from 'react'
import { FiMoreHorizontal } from 'react-icons/fi'
import styled from 'styled-components'
import { Box, IconButton, Pane } from '../Common'

interface DropdownMenuPaneProps {
  right: boolean
}
const DropdownMenuPane = styled(Box)`
  margin-top: 3px;
  border-radius: 0.5rem;
  background-color: white;
  position: absolute;
  width: 150px;
  padding: 0;
  font-size: 0.9rem;
  /* box-shadow: rgba(67, 90, 111, 0.3) 0px 0px 1px, rgba(67, 90, 111, 0.47) 0px 8px 10px -4px; */
`

export const DropdownItem = styled.div`
  cursor: pointer;
  padding: 0.8em 1em;
  background-color: white;

  :first-child {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
  }
  :last-child {
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
  }
  :hover {
    background-color: #f7f7f7;
  }
`
interface Props {
  select?: string
  alignRight?: boolean
  onClose?(): void
}

const Dropdown: React.FC<Props> = ({ select, onClose, alignRight, children }) => {
  const [open, setOpen] = useState(false)
  const menuRef = React.createRef<HTMLDivElement>()

  const closeMenu = useCallback(
    e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
        document.removeEventListener('click', closeMenu)
        if (onClose) onClose()
      }
    },
    [menuRef, onClose]
  )
  const openMenu = useCallback(
    e => {
      e.preventDefault()
      setOpen(true)
      document.addEventListener('click', closeMenu)
    },
    [setOpen, closeMenu]
  )
  useEffect(() => {
    document.addEventListener('click', closeMenu)
    return (): void => document.removeEventListener('click', closeMenu)
  })

  return (
    <Pane position="relative">
      {select != null ? (
        <div onClick={openMenu}>{select}</div>
      ) : (
        <Pane marginLeft="5px">
          <IconButton onClick={openMenu}>
            <FiMoreHorizontal />
          </IconButton>
        </Pane>
      )}
      {open && <DropdownMenuPane ref={menuRef}>{children}</DropdownMenuPane>}
    </Pane>
  )
}

export default Dropdown
