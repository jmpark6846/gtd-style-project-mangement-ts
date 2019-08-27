import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Dropdown, { DropdownItem } from './Dropdown'

describe('Dropdown', () => {
  test('지정된 텍스트를 클릭하면 드롭다운을 보여주고 메뉴를 표시한다.', () => {
    const { getByText } = render(
      <Dropdown select="dropdown">
        <DropdownItem>menu1</DropdownItem>
        <DropdownItem>menu2</DropdownItem>
      </Dropdown>
    )
    fireEvent.click(getByText('dropdown'))
    getByText('menu1')
    getByText('menu2')
  })
})
